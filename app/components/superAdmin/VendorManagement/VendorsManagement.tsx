'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Button } from '@/(landing)/components/ui/button';
import { Input } from '@/(landing)/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/(landing)/components/ui/select';
import { Badge } from '@/(landing)/components/ui/badge';
import { 
  Store, 
  Search, 
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Eye,
  Edit,
  Ban,
  DollarSign,
  MapPin,
  Phone
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/(landing)/components/ui/dropdown-menu';
import { SuperAdminService } from '@/lib/superAdminService';
import type { VendorData } from '@/lib/models';
import { useToast } from '@/hooks/use-toast';

export function VendorsManagement() {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [universities, setUniversities] = useState<any[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // Statistics
  const [vendorStats, setVendorStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    suspended: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadVendors();
  }, [searchTerm, selectedUniversity, selectedStatus, currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, universitiesData, vendorsData] = await Promise.all([
        SuperAdminService.getDashboardStats(),
        SuperAdminService.getUniversitiesWithCounts(),
        SuperAdminService.getAllVendors()
      ]);
      
      setVendorStats({
        total: dashboardStats.totalVendors || 0,
        approved: vendorsData.filter(v => v.isApproved).length,
        pending: vendorsData.filter(v => !v.isApproved).length,
        suspended: vendorsData.filter(v => v.isSuspended).length
      });
      
      setUniversities(universitiesData);
      setVendors(vendorsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load vendor data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadVendors = async () => {
    try {
      const vendorsData = await SuperAdminService.getAllVendors();
      
      // Apply filters
      let filteredVendors = vendorsData;
      
      if (searchTerm) {
        filteredVendors = filteredVendors.filter(vendor =>
          vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (selectedUniversity !== 'all') {
        filteredVendors = filteredVendors.filter(vendor =>
          vendor.universityId === selectedUniversity
        );
      }
      
      if (selectedStatus !== 'all') {
        switch (selectedStatus) {
          case 'approved':
            filteredVendors = filteredVendors.filter(vendor => vendor.isApproved);
            break;
          case 'pending':
            filteredVendors = filteredVendors.filter(vendor => !vendor.isApproved);
            break;
          case 'suspended':
            filteredVendors = filteredVendors.filter(vendor => vendor.isSuspended);
            break;
        }
      }
      
      setVendors(filteredVendors);
    } catch (error) {
      console.error('Error loading vendors:', error);
      toast({
        title: 'Error',
        description: 'Failed to load vendors',
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
      loadData();
    } catch (error) {
      console.error('Error updating vendor approval:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vendor status',
        variant: 'destructive'
      });
    }
  };

  const handleViewVendor = (vendorId: string) => {
    toast({
      title: 'Coming Soon',
      description: 'Vendor profile view will be implemented'
    });
  };

  const handleEditVendor = (vendorId: string) => {
    toast({
      title: 'Coming Soon',
      description: 'Vendor edit functionality will be implemented'
    });
  };

  const handleSuspendVendor = (vendorId: string) => {
    toast({
      title: 'Coming Soon',
      description: 'Vendor suspension functionality will be implemented'
    });
  };

  const getStatusBadge = (vendor: VendorData) => {
    if (vendor.isSuspended) {
      return <Badge variant="destructive">Suspended</Badge>;
    }
    if (!vendor.isApproved) {
      return <Badge variant="outline" className="text-yellow-600">Pending</Badge>;
    }
    return <Badge variant="outline" className="text-green-600">Approved</Badge>;
  };

  const getStatusIcon = (vendor: VendorData) => {
    if (vendor.isSuspended) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
    if (!vendor.isApproved) {
      return <Clock className="h-4 w-4 text-yellow-600" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-600" />;
  };

  // Pagination
  const totalPages = Math.ceil(vendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVendors = vendors.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading vendors...</p>
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
              <Store className="h-8 w-8 text-blue-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900">{vendorStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{vendorStats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{vendorStats.pending}</p>
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
                <p className="text-2xl font-bold text-gray-900">{vendorStats.suspended}</p>
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
              <CardTitle>Vendor Management</CardTitle>
              <CardDescription>
                Monitor and manage all platform vendors
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
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
                  placeholder="Search vendors..."
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
                  <SelectItem key={university.id} value={university.id}>
                    {university.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Vendors Table */}
          <div className="space-y-4">
            {currentVendors.map((vendor) => (
              <div key={vendor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={vendor.imageUrl || '/placeholder.svg'}
                      alt={vendor.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{vendor.name}</h3>
                    <p className="text-sm text-gray-600">{vendor.description}</p>
                    <p className="text-sm text-gray-500">{vendor.universityName}</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-xs text-gray-500">
                        {vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    {getStatusIcon(vendor)}
                    {getStatusBadge(vendor)}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {vendor.categories.join(', ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {vendor.isOpen ? 'Open' : 'Closed'}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewVendor(vendor.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditVendor(vendor.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Vendor
                      </DropdownMenuItem>
                      {!vendor.isApproved && (
                        <DropdownMenuItem onClick={() => handleUpdateVendorApproval(vendor.id, true)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                      )}
                      {vendor.isApproved && (
                        <DropdownMenuItem onClick={() => handleUpdateVendorApproval(vendor.id, false)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleSuspendVendor(vendor.id)}
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Suspend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            
            {currentVendors.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No vendors found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {startIndex + 1} to {Math.min(endIndex, vendors.length)} of {vendors.length} vendors
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
    </div>
  );
}
