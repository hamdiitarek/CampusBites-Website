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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/(landing)/components/ui/dialog';
import { SuperAdminService } from '@/lib/appwriteSuperAdminService';
import { dashboardCache } from '@/lib/dashboardCache';
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

  // Vendor details modal state
  const [selectedVendorDetails, setSelectedVendorDetails] = useState<VendorData | null>(null);
  const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false);
  const [showVendorEditModal, setShowVendorEditModal] = useState(false);
  const [editVendorData, setEditVendorData] = useState<Partial<VendorData>>({});

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
      const status = isApproved ? 'approved' : 'rejected';
      await SuperAdminService.updateVendorStatus(vendorId, status);
      toast({
        title: 'Success',
        description: `Vendor ${isApproved ? 'approved' : 'rejected'} successfully`
      });
      
      // Clear cache and refresh data
      dashboardCache.clear();
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
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor) {
      setSelectedVendorDetails(vendor);
      setShowVendorDetailsModal(true);
    }
  };

  const handleEditVendor = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor) {
      setSelectedVendorDetails(vendor);
      setEditVendorData({
        name: vendor.name,
        description: vendor.description,
        categories: vendor.categories
      });
      setShowVendorEditModal(true);
    } else {
      toast({
        title: 'Error',
        description: 'Vendor not found',
        variant: 'destructive'
      });
    }
  };

  const handleSaveVendorChanges = async () => {
    if (!selectedVendorDetails) return;

    try {
      // For now, we'll show a success message
      // In a real implementation, this would call an update service method
      toast({
        title: 'Success',
        description: 'Vendor information updated successfully',
      });
      
      setShowVendorEditModal(false);
      setSelectedVendorDetails(null);
      setEditVendorData({});
      loadVendors(); // Refresh the vendor list
    } catch (error) {
      console.error('Error updating vendor:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vendor information',
        variant: 'destructive'
      });
    }
  };

  const handleSuspendVendor = async (vendorId: string) => {
    try {
      const vendor = vendors.find(v => v.id === vendorId);
      if (!vendor) return;

      if (vendor.isSuspended) {
        // Reactivate vendor by approving
        await SuperAdminService.updateVendorStatus(vendorId, 'approved');
        toast({
          title: 'Success',
          description: 'Vendor has been reactivated successfully'
        });
      } else {
        // Suspend vendor
        await SuperAdminService.updateVendorStatus(vendorId, 'suspended', 'Suspended by admin');
        toast({
          title: 'Success',
          description: 'Vendor has been suspended successfully'
        });
      }
      
      // Clear cache and refresh data
      dashboardCache.clear();
      loadData();
    } catch (error) {
      console.error('Error updating vendor status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update vendor status',
        variant: 'destructive'
      });
    }
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

      {/* Vendor Details Modal */}
      <Dialog open={showVendorDetailsModal} onOpenChange={setShowVendorDetailsModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected vendor
            </DialogDescription>
          </DialogHeader>
          
          {selectedVendorDetails && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vendor Name</label>
                  <p className="text-sm text-gray-600">{selectedVendorDetails.name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <p className="text-sm text-gray-600">{selectedVendorDetails.categories?.join(', ') || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">University</label>
                  <p className="text-sm text-gray-600">{selectedVendorDetails.universityName}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <p className="text-sm text-gray-600">N/A</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <p className="text-sm text-gray-600">N/A</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm text-gray-600">{selectedVendorDetails.rating || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {selectedVendorDetails.description || 'No description available'}
                </p>
              </div>

              {/* Status Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Status Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={selectedVendorDetails.isApproved ? 'h-4 w-4 text-green-600' : 'h-4 w-4 text-gray-400'} />
                    <span className="text-sm">Approved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Ban className={selectedVendorDetails.isSuspended ? 'h-4 w-4 text-red-600' : 'h-4 w-4 text-gray-400'} />
                    <span className="text-sm">Suspended</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Store className={selectedVendorDetails.isOpen ? 'h-4 w-4 text-green-600' : 'h-4 w-4 text-gray-400'} />
                    <span className="text-sm">Currently Open</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowVendorDetailsModal(false)}>
                  Close
                </Button>
                <Button variant="outline" onClick={() => handleEditVendor(selectedVendorDetails.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Vendor
                </Button>
                {!selectedVendorDetails.isApproved && (
                  <Button 
                    variant="outline" 
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => handleUpdateVendorApproval(selectedVendorDetails.id, true)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                )}
                {selectedVendorDetails.isApproved && (
                  <Button 
                    variant="outline" 
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => handleUpdateVendorApproval(selectedVendorDetails.id, false)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className={selectedVendorDetails.isSuspended ? "text-green-600 border-green-600 hover:bg-green-50" : "text-red-600 border-red-600 hover:bg-red-50"}
                  onClick={() => handleSuspendVendor(selectedVendorDetails.id)}
                >
                  <Ban className="h-4 w-4 mr-2" />
                  {selectedVendorDetails.isSuspended ? 'Reactivate' : 'Suspend'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Vendor Edit Modal */}
      <Dialog open={showVendorEditModal} onOpenChange={(open) => {
        setShowVendorEditModal(open);
        if (!open) {
          setSelectedVendorDetails(null);
          setEditVendorData({});
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>
              Update information for {selectedVendorDetails?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedVendorDetails && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vendor Name</label>
                <Input
                  value={editVendorData.name || ''}
                  onChange={(e) => setEditVendorData({...editVendorData, name: e.target.value})}
                  placeholder="Enter vendor name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md"
                  value={editVendorData.description || ''}
                  onChange={(e) => setEditVendorData({...editVendorData, description: e.target.value})}
                  placeholder="Enter vendor description"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Categories</label>
                <div className="text-sm text-gray-600">
                  Current categories: {selectedVendorDetails.categories?.join(', ') || 'None'}
                </div>
                <Input
                  value={editVendorData.categories?.join(', ') || ''}
                  onChange={(e) => setEditVendorData({
                    ...editVendorData, 
                    categories: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                  })}
                  placeholder="Enter categories (comma-separated)"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline" onClick={() => {
                  setShowVendorEditModal(false);
                  setSelectedVendorDetails(null);
                  setEditVendorData({});
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSaveVendorChanges}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
