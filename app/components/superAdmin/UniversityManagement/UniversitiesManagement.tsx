'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Button } from '@/(landing)/components/ui/button';
import { Badge } from '@/(landing)/components/ui/badge';
import { Input } from '@/(landing)/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/(landing)/components/ui/select';
import { 
  Search, 
  Users, 
  Store, 
  Shield, 
  MoreHorizontal,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Globe,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw
} from 'lucide-react';
import { SuperAdminService } from '@/lib/superAdminService';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/(landing)/components/ui/dropdown-menu';

interface University {
  id: string;
  name: string;
  nameAr?: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  addressAr?: string;
  city: string;
  cityAr?: string;
  isActive: boolean;
  studentsCount: number;
  vendorsCount: number;
  adminsCount: number;
  totalUsers: number;
  createdAt: string;
  lastActivity?: string;
}

export function UniversitiesManagement() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUniversities();
  }, []);

  useEffect(() => {
    filterUniversities();
  }, [universities, searchTerm, statusFilter]);

  const loadUniversities = async () => {
    try {
      setIsLoading(true);
      const data = await SuperAdminService.getUniversitiesWithCounts();
      
      // Transform the data to match our interface
      const transformedData = data.map((uni: any, index: number) => {
        return {
          id: uni.id || uni.$id || `uni-${index}`,
          name: uni.name || uni.university || 'Egypt University of Informatics',
          nameAr: uni.nameAr || 'جامعة مصر للمعلوماتية',
          email: uni.email || `admin@${(uni.name || 'eui').toLowerCase().replace(/\s+/g, '')}.edu.eg`,
          phone: uni.phone || '+20 2 1234 5678',
          website: uni.website || 'https://www.eui.edu.eg',
          address: uni.address || 'New Administrative Capital, Egypt',
          addressAr: uni.addressAr || 'العاصمة الإدارية الجديدة، مصر',
          city: uni.city || 'Cairo',
          cityAr: uni.cityAr || 'القاهرة',
          isActive: uni.isActive !== false,
          studentsCount: uni.studentsCount || 0,
          vendorsCount: uni.vendorsCount || 0,
          adminsCount: uni.adminsCount || 0,
          totalUsers: (uni.studentsCount || 0) + (uni.vendorsCount || 0) + (uni.adminsCount || 0),
          createdAt: uni.createdAt || uni.$createdAt || new Date().toISOString(),
          lastActivity: uni.lastActivity || uni.$updatedAt
        };
      });

      setUniversities(transformedData);
    } catch (error) {
      console.error('Error loading universities:', error);
      // Set fallback data if service fails
      setUniversities([{
        id: 'eui-001',
        name: 'Egypt University of Informatics',
        nameAr: 'جامعة مصر للمعلوماتية',
        email: 'admin@eui.edu.eg',
        phone: '+20 2 1234 5678',
        website: 'https://www.eui.edu.eg',
        address: 'New Administrative Capital, Egypt',
        addressAr: 'العاصمة الإدارية الجديدة، مصر',
        city: 'Cairo',
        cityAr: 'القاهرة',
        isActive: true,
        studentsCount: 0,
        vendorsCount: 1,
        adminsCount: 0,
        totalUsers: 1,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUniversities = () => {
    let filtered = universities;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(university =>
        university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(university =>
        statusFilter === 'active' ? university.isActive : !university.isActive
      );
    }

    setFilteredUniversities(filtered);
  };

  const getTrendIcon = (count: number) => {
    if (count > 50) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (count > 10) return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    if (count > 0) return <Minus className="h-4 w-4 text-gray-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Universities Overview</h2>
          <p className="text-muted-foreground">
            Current universities and their user counts
          </p>
        </div>
        
        <Button onClick={loadUniversities} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search universities by name, city, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Universities Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading universities...</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredUniversities.map((university) => (
            <Card key={university.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <GraduationCap className="h-6 w-6 text-primary" />
                      <div>
                        <h3 className="text-lg font-semibold">{university.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {university.city}
                          {university.isActive ? (
                            <Badge variant="default" className="ml-2">Active</Badge>
                          ) : (
                            <Badge variant="secondary" className="ml-2">Inactive</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{university.studentsCount} Students</span>
                        {getTrendIcon(university.studentsCount)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{university.vendorsCount} Vendors</span>
                        {getTrendIcon(university.vendorsCount)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">{university.adminsCount} Admins</span>
                        {getTrendIcon(university.adminsCount)}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {university.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {university.email}
                        </div>
                      )}
                      {university.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {university.phone}
                        </div>
                      )}
                      {university.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          <a href={university.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        View Users
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        View Vendors
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredUniversities.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No universities found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'No universities are currently registered in the system'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
