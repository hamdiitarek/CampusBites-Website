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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/(landing)/components/ui/dialog';
import { 
  AppwriteSuperAdminService as SuperAdminService,
  EnrichedOrderData,
  ComplaintData
} from '@/lib/appwriteSuperAdminService';
import { dashboardCache, CacheKeys } from '@/lib/dashboardCache';
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
  
  // Modal states
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [showUserOrdersModal, setShowUserOrdersModal] = useState(false);
  const [showRoleChangeModal, setShowRoleChangeModal] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState<UserData | null>(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState<EnrichedOrderData[]>([]);
  const [newUserRole, setNewUserRole] = useState<string>('');

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
      
      // Check cache for basic data that doesn't change frequently
      const cachedStats = dashboardCache.get<any>(CacheKeys.superAdminStats());
      const cachedUniversities = dashboardCache.get<any[]>(CacheKeys.superAdminUniversities());
      const cachedVendors = dashboardCache.get<VendorData[]>(CacheKeys.superAdminVendors());
      
      // Load from cache if available, otherwise fetch from API
      let stats, universitiesData, vendorsData, ordersData, complaintsData;
      
      if (cachedStats && cachedUniversities && cachedVendors) {
        console.log('🚀 Loading from cache for better performance');
        stats = cachedStats;
        universitiesData = cachedUniversities;
        vendorsData = cachedVendors;
        
        // Always fetch fresh orders and complaints as they change frequently
        [ordersData, complaintsData] = await Promise.all([
          SuperAdminService.getRecentOrders(10),
          SuperAdminService.getAllComplaints()
        ]);
      } else {
        console.log('📡 Loading fresh data from API');
        [
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
        
        // Cache the data for future use
        dashboardCache.set(CacheKeys.superAdminStats(), stats);
        dashboardCache.set(CacheKeys.superAdminUniversities(), universitiesData);
        dashboardCache.set(CacheKeys.superAdminVendors(), vendorsData);
      }

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
      
      // Check cache for user data
      const cacheKey = CacheKeys.superAdminUsers(
        selectedUniversity === 'all' ? undefined : selectedUniversity,
        selectedRole === 'all' ? undefined : selectedRole,
        searchTerm || undefined
      );
      
      const cachedUsers = dashboardCache.get<UserData[]>(cacheKey, 2 * 60 * 1000); // 2 minutes cache for users
      
      if (cachedUsers) {
        console.log('🚀 Loading users from cache');
        setUsers(cachedUsers);
      } else {
        console.log('📡 Loading fresh user data from API');
        const usersData = await SuperAdminService.getAllUsers(
          selectedUniversity,
          selectedRole,
          searchTerm,
          'all' // For now, always load all status in main dashboard
        );
        
        // Cache the user data
        dashboardCache.set(cacheKey, usersData);
        setUsers(usersData);
      }
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
      
      // Clear user cache to force refresh
      dashboardCache.delete(CacheKeys.superAdminUsers(
        selectedUniversity === 'all' ? undefined : selectedUniversity,
        selectedRole === 'all' ? undefined : selectedRole,
        searchTerm || undefined
      ));
      dashboardCache.delete(CacheKeys.superAdminStats()); // Also clear stats cache
      
      loadUsers(); // Refresh users list
      loadInitialData(); // Refresh stats
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
      
      // Clear vendor-related cache to force refresh
      dashboardCache.delete(CacheKeys.superAdminVendors());
      dashboardCache.delete(CacheKeys.superAdminStats()); // Also clear stats cache
      
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
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUserDetails(user);
      setShowUserProfileModal(true);
    } else {
      toast({
        title: 'Error',
        description: 'User not found',
        variant: 'destructive'
      });
    }
  };

  const handleViewUserOrders = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) {
        toast({
          title: 'Error',
          description: 'User not found',
          variant: 'destructive'
        });
        return;
      }

      // Get user orders
      const userOrders = await SuperAdminService.getUserOrders(userId);
      setSelectedUserDetails(user);
      setSelectedUserOrders(userOrders);
      setShowUserOrdersModal(true);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user orders',
        variant: 'destructive'
      });
    }
  };

  const handleChangeUserRole = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUserDetails(user);
      setNewUserRole(user.role);
      setShowRoleChangeModal(true);
    } else {
      toast({
        title: 'Error',
        description: 'User not found',
        variant: 'destructive'
      });
    }
  };

  const handleConfirmRoleChange = async () => {
    if (!selectedUserDetails || !newUserRole) return;

    try {
      await SuperAdminService.updateUserRole(selectedUserDetails.id, newUserRole as any);
      toast({
        title: 'Success',
        description: `User role updated to ${newUserRole} successfully`
      });
      
      // Clear cache and refresh data
      dashboardCache.delete(CacheKeys.superAdminUsers(
        selectedUniversity === 'all' ? undefined : selectedUniversity,
        selectedRole === 'all' ? undefined : selectedRole,
        searchTerm || undefined
      ));
      dashboardCache.delete(CacheKeys.superAdminStats());
      
      // Reset modal state
      setShowRoleChangeModal(false);
      setSelectedUserDetails(null);
      setNewUserRole('');
      
      // Refresh data
      loadUsers();
      loadInitialData();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive'
      });
    }
  };

  const handleResetUserPassword = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) {
        toast({
          title: 'Error',
          description: 'User not found',
          variant: 'destructive'
        });
        return;
      }

      // Send password reset email
      await SuperAdminService.resetUserPassword(user.email);
      toast({
        title: 'Success',
        description: `Password reset email sent to ${user.email}`
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Error',
        description: 'Failed to send password reset email',
        variant: 'destructive'
      });
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) {
        toast({
          title: 'Error',
          description: 'User not found',
          variant: 'destructive'
        });
        return;
      }

      const isSuspended = user.isSuspended || false;
      const action = isSuspended ? 'reactivate' : 'suspend';
      
      await SuperAdminService.updateUserSuspension(userId, !isSuspended);
      toast({
        title: 'Success',
        description: `User ${action}d successfully`
      });
      
      // Clear cache and refresh data
      dashboardCache.delete(CacheKeys.superAdminUsers(
        selectedUniversity === 'all' ? undefined : selectedUniversity,
        selectedRole === 'all' ? undefined : selectedRole,
        searchTerm || undefined
      ));
      dashboardCache.delete(CacheKeys.superAdminStats());
      
      loadUsers();
      loadInitialData();
    } catch (error) {
      console.error('Error updating user suspension:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user status',
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

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <TabsList className="no-scrollbar flex h-auto w-full justify-start overflow-x-auto sm:grid sm:grid-cols-3">
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
                      <div key={university.id} className="flex flex-col gap-3 p-4 border rounded-lg sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold">{university.name}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
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
                      <div key={user.id} className="flex flex-col gap-3 p-4 border rounded-lg hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center space-x-4">
                          <div className="flex-shrink-0">
                            {getRoleIcon(user.role)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{user.fullName}</h3>
                            <p className="text-sm text-gray-600 preserve-ltr break-all">{user.email}</p>
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
                              EGP {user.walletBalance || 0}
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
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <h3 className="text-lg font-semibold">{university.name}</h3>
                            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2 text-sm text-gray-600">
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

      {/* User Profile Modal */}
      <Dialog open={showUserProfileModal} onOpenChange={(open) => {
        setShowUserProfileModal(open);
        if (!open) {
          // Only clear selectedUserDetails if this is the only modal open
          if (!showUserOrdersModal && !showRoleChangeModal) {
            setSelectedUserDetails(null);
          }
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
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
                  <label className="text-sm font-medium">University ID</label>
                  <p className="text-sm text-gray-600">{selectedUserDetails.universityId}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">University</label>
                  <p className="text-sm text-gray-600">{selectedUserDetails.universityName}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <p className="text-sm text-gray-600">{selectedUserDetails.phoneNumber || 'Not provided'}</p>
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
                  <label className="text-sm font-medium">Wallet Balance</label>
                  <p className="text-sm text-gray-600">${(selectedUserDetails.walletBalance || 0).toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Member Since</label>
                  <p className="text-sm text-gray-600">{formatDate(selectedUserDetails.createdAt)}</p>
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
                    <XCircle className={selectedUserDetails.isSuspended ? 'h-4 w-4 text-red-600' : 'h-4 w-4 text-gray-400'} />
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
                <Button variant="outline" onClick={() => {
                  setShowUserProfileModal(false);
                  setSelectedUserDetails(null);
                }}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Orders Modal */}
      <Dialog open={showUserOrdersModal} onOpenChange={(open) => {
        setShowUserOrdersModal(open);
        if (!open) {
          setSelectedUserOrders([]);
          // Only clear selectedUserDetails if this is the only modal open
          if (!showUserProfileModal && !showRoleChangeModal) {
            setSelectedUserDetails(null);
          }
        }
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>User Orders</DialogTitle>
            <DialogDescription>
              Order history for {selectedUserDetails?.fullName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedUserOrders.length > 0 ? (
              selectedUserOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">Order #{order.id.slice(-8)}</h4>
                      <p className="text-sm text-gray-600">
                        {order.vendorDetails?.name || 'Unknown Vendor'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${order.total.toFixed(2)}</p>
                      <Badge className={getOrderStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {order.items && order.items.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-medium mb-2">Items:</p>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No orders found for this user.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setShowUserOrdersModal(false);
              setSelectedUserDetails(null);
              setSelectedUserOrders([]);
            }}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Role Change Modal */}
      <Dialog open={showRoleChangeModal} onOpenChange={(open) => {
        setShowRoleChangeModal(open);
        if (!open) {
          setNewUserRole('');
          // Only clear selectedUserDetails if this is the only modal open
          if (!showUserProfileModal && !showUserOrdersModal) {
            setSelectedUserDetails(null);
          }
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUserDetails?.fullName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Role</label>
              <div className="flex items-center space-x-2">
                {selectedUserDetails && getRoleIcon(selectedUserDetails.role)}
                <Badge className={selectedUserDetails && getRoleBadgeColor(selectedUserDetails.role)}>
                  {selectedUserDetails?.role}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">New Role</label>
              <Select value={newUserRole} onValueChange={setNewUserRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => {
              setShowRoleChangeModal(false);
              setSelectedUserDetails(null);
              setNewUserRole('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmRoleChange}
              disabled={!newUserRole || newUserRole === selectedUserDetails?.role}
            >
              Change Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SuperAdminLayout>
  );
}
