'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { formatDate as utilFormatDate } from '@/lib/utils';
import { safeTimestampToDate, formatTimestamp } from '@/lib/models';
import { SuperAdminLayout } from './superAdmin/SuperAdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Button } from '@/(landing)/components/ui/button';
import { Input } from '@/(landing)/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/(landing)/components/ui/select';
import { Badge } from '@/(landing)/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/(landing)/components/ui/tabs';
import { 
  Users, 
  Building2, 
  ShoppingCart, 
  Shield, 
  Search, 
  Filter,
  MoreVertical,
  UserCheck,
  Store,
  GraduationCap,
  Crown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Activity,
  Bell
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/(landing)/components/ui/dropdown-menu';
import { 
  SuperAdminService,
  EnrichedOrderData,
  ComplaintData
} from '@/lib/superAdminService';
import type {
  UserData,
  VendorData,
  UniversityData
} from '@/lib/models';
import { useToast } from '@/hooks/use-toast';

export function SuperAdminDashboard() {
  const { t, isRTL } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  
  // Data states
  const [users, setUsers] = useState<UserData[]>([]);
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [recentOrders, setRecentOrders] = useState<EnrichedOrderData[]>([]);
  const [complaints, setComplaints] = useState<ComplaintData[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>({});
  
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load users when filters change
  useEffect(() => {
    loadUsers();
  }, [selectedUniversity, selectedRole, searchTerm]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [
        stats,
        universitiesData,
        vendorsData,
        ordersData,
        complaintsData
      ] = await Promise.all([
        SuperAdminService.getDashboardStats(),
        SuperAdminService.getUniversitiesWithCounts(),
        SuperAdminService.getAllVendors(),
        SuperAdminService.getRecentOrders(10),
        SuperAdminService.getAllComplaints()
      ]);

      setDashboardStats(stats);
      setUniversities(universitiesData);
      setVendors(vendorsData);
      setRecentOrders(ordersData);
      setComplaints(complaintsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
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
      setUsersLoading(true);
      const usersData = await SuperAdminService.getAllUsers(
        selectedUniversity,
        selectedRole,
        searchTerm
      );
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive'
      });
    } finally {
      setUsersLoading(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await SuperAdminService.updateUserRole(userId, newRole);
      toast({
        title: 'Success',
        description: 'User role updated successfully'
      });
      loadUsers(); // Refresh users list
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateVendorApproval = async (vendorId: string, isApproved: boolean) => {
    try {
      await SuperAdminService.updateVendorApproval(vendorId, isApproved);
      toast({
        title: 'Success',
        description: `Vendor ${isApproved ? 'approved' : 'rejected'} successfully`
      });
      loadInitialData(); // Refresh all data
    } catch (error) {
      console.error('Error updating vendor approval:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vendor status',
        variant: 'destructive'
      });
    }
  };

  const handleViewUserProfile = (userId: string) => {
    // TODO: Implement user profile modal or navigate to user profile page
    toast({
      title: 'Coming Soon',
      description: 'User profile view will be implemented soon'
    });
  };

  const handleViewUserOrders = (userId: string) => {
    // TODO: Implement orders modal or navigate to orders page
    toast({
      title: 'Coming Soon',
      description: 'User orders view will be implemented soon'
    });
  };

  const handleChangeUserRole = (userId: string) => {
    // TODO: Implement role change modal with dropdown
    toast({
      title: 'Coming Soon',
      description: 'Role change dialog will be implemented soon'
    });
  };

  const handleResetUserPassword = async (userId: string) => {
    try {
      // TODO: Implement password reset functionality
      toast({
        title: 'Coming Soon',
        description: 'Password reset functionality will be implemented soon'
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset password',
        variant: 'destructive'
      });
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      // TODO: Implement user suspension functionality
      toast({
        title: 'Coming Soon',
        description: 'User suspension functionality will be implemented soon'
      });
    } catch (error) {
      console.error('Error suspending user:', error);
      toast({
        title: 'Error',
        description: 'Failed to suspend user',
        variant: 'destructive'
      });
    }
  };

  // Use the shared utility function for date formatting
  // Helper function to safely format dates
  const formatDate = (timestamp: any): string => {
    try {
      const date = safeTimestampToDate(timestamp);
      return utilFormatDate(date);
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super-admin': return 'default';
      case 'admin': return 'secondary';
      case 'vendor': return 'outline';
      case 'student': return 'outline';
      default: return 'outline';
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return XCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Users are already filtered by the service based on search and filters
  const filteredUsers = users;

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout
      title="Super Admin Dashboard"
      description="Complete oversight and management of the entire platform"
    >
      <div className="space-y-6">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Store className="h-8 w-8 text-green-600" />
                <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                  <p className="text-sm font-medium text-gray-600">Vendors</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalVendors || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-purple-600" />
                <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                  <p className="text-sm font-medium text-gray-600">Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalOrders || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-orange-600" />
                <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                  <p className="text-sm font-medium text-gray-600">Universities</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUniversities || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest platform activities and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium">New users registered</p>
                      <p className="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                  </div>
                  <Badge variant="outline">+12</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <Store className="h-4 w-4 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium">Vendor approval pending</p>
                      <p className="text-xs text-gray-500">10 minutes ago</p>
                    </div>
                  </div>
                  <Badge variant="outline">3</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium">System alert</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                  </div>
                  <Badge variant="outline">High</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Platform Performance
              </CardTitle>
              <CardDescription>
                Key metrics and performance indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Active Users (24h)</span>
                  <span className="text-sm text-green-600">+5.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Order Success Rate</span>
                  <span className="text-sm text-green-600">98.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">System Uptime</span>
                  <span className="text-sm text-green-600">99.9%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users Management</TabsTrigger>
            <TabsTrigger value="universities">Universities</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Universities Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Universities Overview</CardTitle>
                  <CardDescription>
                    Current universities and their user counts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {universities.map((university) => (
                      <div key={university.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{university.name}</h3>
                          <div className="flex space-x-4 text-sm text-gray-600 mt-1">
                            <span>{university.studentsCount} Students</span>
                            <span>{university.vendorsCount} Vendors</span>
                            <span>{university.adminsCount} Admins</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest user registrations and activities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getRoleIcon(user.role)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.fullName}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email} • {user.universityName}
                          </p>
                        </div>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select University" />
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
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="student">Students</SelectItem>
                      <SelectItem value="vendor">Vendors</SelectItem>
                      <SelectItem value="admin">Admins</SelectItem>
                      <SelectItem value="super-admin">Super Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
                <CardDescription>
                  Manage all platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">Loading users...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
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
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              ${user.walletBalance || 0}
                            </p>
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
                                <UserCheck className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewUserOrders(user.id)}>
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                View Orders
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleChangeUserRole(user.id)}>
                                <Shield className="h-4 w-4 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetUserPassword(user.id)}>
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleSuspendUser(user.id)}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Suspend User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                    
                    {filteredUsers.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No users found matching your criteria.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="universities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Universities Management</CardTitle>
                <CardDescription>
                  Manage universities and their settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {universities.map((university) => (
                    <Card key={university.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{university.name}</h3>
                            <div className="flex space-x-6 mt-2 text-sm text-gray-600">
                              <span className="flex items-center">
                                <GraduationCap className="h-4 w-4 mr-1" />
                                {university.studentsCount || 0} Students
                              </span>
                              <span className="flex items-center">
                                <Store className="h-4 w-4 mr-1" />
                                {university.vendorsCount || 0} Vendors
                              </span>
                              <span className="flex items-center">
                                <Shield className="h-4 w-4 mr-1" />
                                {university.adminsCount || 0} Admins
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              Settings
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Vendor Approvals */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Vendor Approvals</CardTitle>
                <CardDescription>
                  Review and approve vendor applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendors.filter(vendor => !vendor.isApproved).map((vendor) => (
                    <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Store className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{vendor.name}</h3>
                          <p className="text-sm text-gray-600">{vendor.description}</p>
                          <p className="text-sm text-gray-500">{vendor.universityName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-yellow-600">
                          Pending
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleUpdateVendorApproval(vendor.id, true)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleUpdateVendorApproval(vendor.id, false)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {vendors.filter(vendor => !vendor.isApproved).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No pending vendor approvals.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SuperAdminLayout>
  );
}
