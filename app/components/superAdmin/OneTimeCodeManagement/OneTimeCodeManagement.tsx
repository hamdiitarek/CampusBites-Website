'use client';

import React, { useState, useEffect } from 'react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/(landing)/components/ui/button';
import { Input } from '@/(landing)/components/ui/input';
import { Label } from '@/(landing)/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Alert, AlertDescription } from '@/(landing)/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/(landing)/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/(landing)/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/(landing)/components/ui/table';
import { Badge } from '@/(landing)/components/ui/badge';
import { Textarea } from '@/(landing)/components/ui/textarea';
import { 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  User,
  Crown,
  ExternalLink
} from 'lucide-react';
import { SuperAdminService } from '@/lib/appwriteSuperAdminService';
import { useAuth } from '@/contexts/AppwriteAuthContext';
import { useToast } from '@/hooks/use-toast';
import type { OneTimeCode, UniversityData, CreateOneTimeCodeRequest } from '@/lib/models';

interface OneTimeCodeManagementProps {
  className?: string;
}

export function OneTimeCodeManagement({ className }: OneTimeCodeManagementProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for codes and universities
  const [codes, setCodes] = useState<OneTimeCode[]>([]);
  const [universities, setUniversities] = useState<UniversityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  
  // State for create dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState<CreateOneTimeCodeRequest>({
    type: 'vendor',
    universityId: '',
    expiresInHours: 168, // 7 days default
    maxUses: 1,
    notes: '',
    emailDomain: '',
    specificEmail: ''
  });

  // State for filters
  const [filterType, setFilterType] = useState<'all' | 'vendor' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired' | 'used'>('all');
  const [filterUniversity, setFilterUniversity] = useState<string>('all');

  // State for code visibility
  const [visibleCodes, setVisibleCodes] = useState<Set<string>>(new Set());

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [codesData, universitiesData] = await Promise.all([
        SuperAdminService.getAllOneTimeCodes(),
        SuperAdminService.getUniversitiesWithCounts()
      ]);
      
      setCodes(codesData);
      setUniversities(universitiesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCode = async () => {
    if (!user || !createForm.universityId) {
      toast({
        title: 'Error',
        description: 'Please select a university',
        variant: 'destructive'
      });
      return;
    }

    try {
      setCreating(true);
      const newCode = await SuperAdminService.createOneTimeCode(
        createForm,
        user.uid,
        user.fullName
      );
      
      setCodes(prev => [newCode, ...prev]);
      setShowCreateDialog(false);
      setCreateForm({
        type: 'vendor',
        universityId: '',
        expiresInHours: 168,
        maxUses: 1,
        notes: '',
        emailDomain: '',
        specificEmail: ''
      });
      
      toast({
        title: 'Success',
        description: `One-time code created: ${newCode.code}`,
      });
    } catch (error) {
      console.error('Error creating code:', error);
      toast({
        title: 'Error',
        description: 'Failed to create one-time code',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: 'Copied',
        description: 'Code copied to clipboard',
      });
    } catch (error) {
      console.error('Error copying code:', error);
      toast({
        title: 'Error',
        description: 'Failed to copy code',
        variant: 'destructive'
      });
    }
  };

  const handleDeactivateCode = async (codeId: string) => {
    try {
      await SuperAdminService.deactivateOneTimeCode(codeId);
      setCodes(prev => prev.map(code => 
        code.id === codeId ? { ...code, isActive: false } : code
      ));
      
      toast({
        title: 'Success',
        description: 'Code deactivated successfully',
      });
    } catch (error) {
      console.error('Error deactivating code:', error);
      toast({
        title: 'Error',
        description: 'Failed to deactivate code',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteCode = async (codeId: string) => {
    try {
      await SuperAdminService.deleteOneTimeCode(codeId);
      setCodes(prev => prev.filter(code => code.id !== codeId));
      
      toast({
        title: 'Success',
        description: 'Code deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting code:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete code',
        variant: 'destructive'
      });
    }
  };

  const toggleCodeVisibility = (codeId: string) => {
    setVisibleCodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(codeId)) {
        newSet.delete(codeId);
      } else {
        newSet.add(codeId);
      }
      return newSet;
    });
  };

  const getCodeStatus = (code: OneTimeCode) => {
    if (!code.isActive) return 'deactivated';
    if (new Date(code.expiresAt).getTime() < Date.now()) return 'expired';
    if (code.usageCount >= code.maxUses) return 'used';
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'expired':
        return <Badge variant="secondary">Expired</Badge>;
      case 'used':
        return <Badge className="bg-blue-100 text-blue-800">Used</Badge>;
      case 'deactivated':
        return <Badge variant="destructive">Deactivated</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'vendor':
        return <Badge className="bg-purple-100 text-purple-800">Vendor</Badge>;
      case 'admin':
        return <Badge className="bg-orange-100 text-orange-800">Admin</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  // Filter codes based on selected filters
  const filteredCodes = codes.filter(code => {
    if (filterType !== 'all' && code.type !== filterType) return false;
    if (filterUniversity !== 'all' && code.universityId !== filterUniversity) return false;
    
    const status = getCodeStatus(code);
    if (filterStatus !== 'all' && status !== filterStatus) return false;
    
    return true;
  });

  const exportCodes = () => {
    const csvContent = [
      ['Code', 'Type', 'University', 'Status', 'Created', 'Expires', 'Uses', 'Created By', 'Notes'],
      ...filteredCodes.map(code => [
        code.code,
        code.type,
        code.universityName,
        getCodeStatus(code),
        formatDate(code.createdAt),
        formatDate(code.expiresAt),
        `${code.usageCount}/${code.maxUses}`,
        code.metadata?.createdByName || 'Unknown',
        code.metadata?.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `one-time-codes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p>Loading one-time codes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">One-Time Code Management</h2>
          <p className="text-gray-600">Create and manage one-time signup codes for vendors and admins</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCodes}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create One-Time Code</DialogTitle>
                <DialogDescription>
                  Generate a new one-time signup code for vendors or admins
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type">Account Type</Label>
                  <Select 
                    value={createForm.type} 
                    onValueChange={(value: 'vendor' | 'admin') => 
                      setCreateForm(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="university">University</Label>
                  <Select 
                    value={createForm.universityId} 
                    onValueChange={(value) => 
                      setCreateForm(prev => ({ ...prev, universityId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select university" />
                    </SelectTrigger>
                    <SelectContent>
                      {universities.map(uni => (
                        <SelectItem key={uni.id} value={uni.id}>
                          {uni.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="expires">Expires In (Hours)</Label>
                  <Input
                    type="number"
                    value={createForm.expiresInHours}
                    onChange={(e) => 
                      setCreateForm(prev => ({ ...prev, expiresInHours: parseInt(e.target.value) }))
                    }
                    min="1"
                    max="8760"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Default: 168 hours (7 days)
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="maxUses">Maximum Uses</Label>
                  <Input
                    type="number"
                    value={createForm.maxUses}
                    onChange={(e) => 
                      setCreateForm(prev => ({ ...prev, maxUses: parseInt(e.target.value) }))
                    }
                    min="1"
                    max="10"
                  />
                </div>
                
                <div>
                  <Label htmlFor="emailDomain">Email Domain Restriction (Optional)</Label>
                  <Input
                    placeholder="e.g., university.edu"
                    value={createForm.emailDomain}
                    onChange={(e) => 
                      setCreateForm(prev => ({ ...prev, emailDomain: e.target.value }))
                    }
                  />
                </div>
                
                <div>
                  <Label htmlFor="specificEmail">Specific Email Restriction (Optional)</Label>
                  <Input
                    placeholder="e.g., admin@university.edu"
                    value={createForm.specificEmail}
                    onChange={(e) => 
                      setCreateForm(prev => ({ ...prev, specificEmail: e.target.value }))
                    }
                  />
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    placeholder="Any notes about this code..."
                    value={createForm.notes}
                    onChange={(e) => 
                      setCreateForm(prev => ({ ...prev, notes: e.target.value }))
                    }
                  />
                </div>
                
                <Button 
                  onClick={handleCreateCode} 
                  disabled={creating || !createForm.universityId}
                  className="w-full"
                >
                  {creating ? 'Creating...' : 'Create Code'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Crown className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Codes</p>
                <p className="text-2xl font-bold">{codes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Codes</p>
                <p className="text-2xl font-bold">
                  {codes.filter(code => getCodeStatus(code) === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Vendor Codes</p>
                <p className="text-2xl font-bold">
                  {codes.filter(code => code.type === 'vendor').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Codes</p>
                <p className="text-2xl font-bold">
                  {codes.filter(code => code.type === 'admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Type</Label>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="used">Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>University</Label>
              <Select value={filterUniversity} onValueChange={setFilterUniversity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  {universities.map(uni => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Codes table */}
      <Card>
        <CardHeader>
          <CardTitle>One-Time Codes ({filteredCodes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCodes.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No codes found matching your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Uses</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCodes.map(code => {
                    const status = getCodeStatus(code);
                    const isVisible = visibleCodes.has(code.id);
                    
                    return (
                      <TableRow key={code.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono">
                              {isVisible ? code.code : '••••••••'}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCodeVisibility(code.id)}
                            >
                              {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyCode(code.code)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(code.type)}</TableCell>
                        <TableCell>{code.universityName}</TableCell>
                        <TableCell>{getStatusBadge(status)}</TableCell>
                        <TableCell>{formatDate(code.createdAt)}</TableCell>
                        <TableCell>{formatDate(code.expiresAt)}</TableCell>
                        <TableCell>{code.usageCount}/{code.maxUses}</TableCell>
                        <TableCell>{code.metadata?.createdByName || 'Unknown'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {status === 'active' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeactivateCode(code.id)}
                              >
                                Deactivate
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCode(code.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use One-Time Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                One-time codes allow vendors and admins to sign up for the first time with automatic university assignment.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Signup URLs:</h4>
              <div className="bg-gray-50 p-3 rounded-md space-y-1 text-sm font-mono">
                <p><strong>English:</strong> {window.location.origin}/en/signup-with-code</p>
                <p><strong>Arabic:</strong> {window.location.origin}/ar/signup-with-code</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Instructions for Recipients:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Visit the signup URL above</li>
                <li>Enter the one-time code provided</li>
                <li>Complete the registration form</li>
                <li>Account will be automatically linked to the specified university</li>
                <li>Role will be set based on the code type (vendor/admin)</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
