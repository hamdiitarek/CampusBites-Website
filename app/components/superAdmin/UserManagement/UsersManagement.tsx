'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Button } from '@/(landing)/components/ui/button';
import { Input } from '@/(landing)/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/(landing)/components/ui/select';
import { Badge } from '@/(landing)/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/(landing)/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter,
  Download,
  UserPlus,
  MoreVertical,
  UserCheck,
  Shield,
  Store,
  GraduationCap,
  Crown,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Ban
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/(landing)/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/(landing)/components/ui/dialog';
import { SuperAdminService } from '@/lib/appwriteSuperAdminService';
import { dashboardCache } from '@/lib/dashboardCache';
import type { UserData } from '@/lib/models';
import { useToast } from '@/hooks/use-toast';

export function UsersManagement() {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [universities, setUniversities] = useState<any[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // Statistics
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    unverified: 0,
    students: 0,
    vendors: 0,
    admins: 0
  });

  // User details modal state
  const [selectedUserDetails, setSelectedUserDetails] = useState<UserData | null>(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [searchTerm, selectedUniversity, selectedRole, selectedStatus, currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, universitiesData] = await Promise.all([
        SuperAdminService.getDashboardStats(),
        SuperAdminService.getUniversitiesWithCounts()
      ]);
      
      setUserStats({
        total: dashboardStats.totalUsers || 0,
        active: dashboardStats.totalUsers || 0, // For now, assume all are active
        suspended: 0, // Not available in current stats
        unverified: 0, // Not available in current stats
        students: dashboardStats.totalStudents || 0,
        vendors: dashboardStats.totalVendors || 0,
        admins: dashboardStats.totalAdmins || 0
      });
      
      setUniversities(universitiesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const usersData = await SuperAdminService.getAllUsers(
        selectedUniversity,
        selectedRole,
        searchTerm,
        selectedStatus
      );
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await SuperAdminService.updateUserRole(userId, newRole);
      toast({
        title: 'Success',
        description: 'User role updated successfully'
      });
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive'
      });
    }
  };

  const handleViewUserProfile = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUserDetails(user);
      setShowUserDetailsModal(true);
    }
  };

  const handleEditUser = (userId: string) => {
    // TODO: Open user edit modal
    toast({
      title: 'Coming Soon',
      description: 'User edit functionality will be implemented'
    });
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      if (user.isSuspended) {
        // Unsuspend user
        await SuperAdminService.unsuspendUser(userId);
        toast({
          title: 'Success',
          description: 'User has been unsuspended successfully'
        });
      } else {
        // Suspend user
        await SuperAdminService.suspendUser(userId, 'Suspended by admin');
        toast({
          title: 'Success',
          description: 'User has been suspended successfully'
        });
      }
      
      // Clear cache and refresh data
      dashboardCache.clear(); // Clear all cache to ensure fresh data
      loadUsers();
    } catch (error) {
      console.error('Error updating user suspension status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive'
      });
    }
  };

  const handleExportUsers = () => {
    // TODO: Implement user export
    toast({
      title: 'Coming Soon',
      description: 'User export functionality will be implemented'
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return <GraduationCap className="h-4 w-4" />;
      case 'vendor': return <Store className="h-4 w-4" />;
      case 'admin': return <Shield className="h-4 w-4" />;
      case 'super-admin': return <Crown className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'vendor': return 'bg-green-100 text-green-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'super-admin': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isEmailVerified: boolean) => {
    return isEmailVerified ? 'text-green-600' : 'text-red-600';
  };

  // Pagination
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.suspended}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Unverified</p>
                <p className="text-2xl font-bold text-gray-900">{userStats.unverified}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage and monitor all platform users
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleExportUsers}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="University" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Universities</SelectItem>
                {universities.map((university) => (
                  <SelectItem key={university.id} value={university.name}>
                    {university.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="vendor">Vendors</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="super-admin">Super Admins</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="space-y-4">
            {currentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.fullName}</h3>
                    <p className="text-sm text-gray-600 preserve-ltr">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.universityName}</p>
                    {user.phoneNumber && (
                      <p className="text-sm text-gray-500 preserve-ltr">{user.phoneNumber}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                  
                  <div className={`text-center ${getStatusColor(user.isEmailVerified)}`}>
                    {user.isEmailVerified ? (
                      <CheckCircle className="h-4 w-4 mx-auto" />
                    ) : (
                      <XCircle className="h-4 w-4 mx-auto" />
                    )}
                    <p className="text-xs">
                      {user.isEmailVerified ? 'Verified' : 'Unverified'}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">${user.walletBalance || 0}</p>
                    <p className="text-xs text-gray-500">
                      Joined: {formatDate(user.createdAt)}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleViewUserProfile(user.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditUser(user.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'admin')}>
                        <Shield className="mr-2 h-4 w-4" />
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleSuspendUser(user.id)}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            
            {currentUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, users.length)} of {users.length} users
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={showUserDetailsModal} onOpenChange={setShowUserDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUserDetails && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <p className="text-sm text-gray-600">{selectedUserDetails.fullName}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-gray-600">{selectedUserDetails.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(selectedUserDetails.role)}
                    <Badge className={getRoleBadgeColor(selectedUserDetails.role)}>
                      {selectedUserDetails.role}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">University</label>
                  <p className="text-sm text-gray-600">{selectedUserDetails.universityName || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <p className="text-sm text-gray-600">{selectedUserDetails.phoneNumber || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Wallet Balance</label>
                  <p className="text-sm text-gray-600">${(selectedUserDetails.walletBalance || 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Status Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Status Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={selectedUserDetails.isEmailVerified ? 'h-4 w-4 text-green-600' : 'h-4 w-4 text-gray-400'} />
                    <span className="text-sm">Email Verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Ban className={selectedUserDetails.isSuspended ? 'h-4 w-4 text-red-600' : 'h-4 w-4 text-gray-400'} />
                    <span className="text-sm">Suspended</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Active Account</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowUserDetailsModal(false)}>
                  Close
                </Button>
                <Button variant="outline" onClick={() => handleEditUser(selectedUserDetails.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit User
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => handleSuspendUser(selectedUserDetails.id)}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
