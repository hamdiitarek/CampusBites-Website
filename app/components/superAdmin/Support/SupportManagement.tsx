'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/(landing)/components/ui/card';
import { Button } from '@/(landing)/components/ui/button';
import { Input } from '@/(landing)/components/ui/input';
import { Label } from '@/(landing)/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/(landing)/components/ui/select';
import { Badge } from '@/(landing)/components/ui/badge';
import { Textarea } from '@/(landing)/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/(landing)/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/(landing)/components/ui/dialog';
import { 
  MessageSquare, 
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  Filter,
  Search,
  Send,
  Eye,
  Edit,
  Trash2,
  Flag,
  Shield,
  Mail,
  Phone,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  HeadphonesIcon,
  Ticket,
  Users,
  TrendingUp,
  Star,
  ThumbsUp,
  ThumbsDown,
  Archive,
  BookOpen,
  FileText,
  HelpCircle,
  Settings
} from 'lucide-react';
import { SuperAdminService } from '@/lib/superAdminService';
import { useToast } from '@/hooks/use-toast';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'order' | 'vendor' | 'general';
  userId: string;
  userName: string;
  userEmail: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  content: string;
  sender: string;
  senderType: 'user' | 'admin' | 'system';
  timestamp: string;
  attachments?: string[];
}

export function SupportManagement() {
  const { isRTL } = useLanguage();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');
  const [showTicketDialog, setShowTicketDialog] = useState(false);

  // Support Statistics
  const [supportStats, setSupportStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    resolvedToday: 0,
    avgResponseTime: '2.4h',
    satisfactionRate: 4.2,
    activeAgents: 5
  });

  // Mock data for demonstration
  useEffect(() => {
    loadSupportData();
  }, []);

  const loadSupportData = async () => {
    try {
      setLoading(true);
      
      // Generate mock support tickets
      const mockTickets: SupportTicket[] = [
        {
          id: 'TKT-001',
          title: 'Unable to place order',
          description: 'I cannot complete my order on the app. It shows an error when I try to proceed to payment.',
          status: 'open',
          priority: 'high',
          category: 'technical',
          userId: 'usr_123',
          userName: 'Ahmed Hassan',
          userEmail: 'ahmed.hassan@student.auc.edu.eg',
          createdAt: '2024-01-15 10:30:00',
          updatedAt: '2024-01-15 10:30:00',
          messages: [
            {
              id: 'msg_1',
              content: 'I cannot complete my order on the app. It shows an error when I try to proceed to payment.',
              sender: 'Ahmed Hassan',
              senderType: 'user',
              timestamp: '2024-01-15 10:30:00'
            }
          ]
        },
        {
          id: 'TKT-002',
          title: 'Refund request for order #12345',
          description: 'I want to request a refund for my recent order as the food was not delivered.',
          status: 'in-progress',
          priority: 'medium',
          category: 'billing',
          userId: 'usr_456',
          userName: 'Sara Mohamed',
          userEmail: 'sara.mohamed@student.guc.edu.eg',
          assignedTo: 'admin_001',
          createdAt: '2024-01-14 15:20:00',
          updatedAt: '2024-01-15 09:15:00',
          messages: [
            {
              id: 'msg_2',
              content: 'I want to request a refund for my recent order as the food was not delivered.',
              sender: 'Sara Mohamed',
              senderType: 'user',
              timestamp: '2024-01-14 15:20:00'
            },
            {
              id: 'msg_3',
              content: 'We are investigating your order. We will provide an update within 24 hours.',
              sender: 'Support Team',
              senderType: 'admin',
              timestamp: '2024-01-15 09:15:00'
            }
          ]
        },
        {
          id: 'TKT-003',
          title: 'Vendor account verification',
          description: 'My vendor account has been pending verification for 3 days.',
          status: 'resolved',
          priority: 'medium',
          category: 'vendor',
          userId: 'vnd_789',
          userName: 'Cairo Cafe',
          userEmail: 'info@cairocafe.com',
          assignedTo: 'admin_002',
          createdAt: '2024-01-12 11:00:00',
          updatedAt: '2024-01-15 08:30:00',
          messages: [
            {
              id: 'msg_4',
              content: 'My vendor account has been pending verification for 3 days.',
              sender: 'Cairo Cafe',
              senderType: 'user',
              timestamp: '2024-01-12 11:00:00'
            },
            {
              id: 'msg_5',
              content: 'Your account has been verified and activated. Welcome to CampusBites!',
              sender: 'Admin',
              senderType: 'admin',
              timestamp: '2024-01-15 08:30:00'
            }
          ]
        }
      ];

      setTickets(mockTickets);
      setSupportStats({
        totalTickets: mockTickets.length,
        openTickets: mockTickets.filter(t => t.status === 'open').length,
        resolvedToday: 5,
        avgResponseTime: '2.4h',
        satisfactionRate: 4.2,
        activeAgents: 5
      });

    } catch (error) {
      console.error('Error loading support data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load support data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleTicketStatusUpdate = async (ticketId: string, newStatus: string) => {
    try {
      setTickets(prev => prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus as any, updatedAt: new Date().toISOString() }
          : ticket
      ));
      
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, status: newStatus as any } : null);
      }

      toast({
        title: 'Status Updated',
        description: `Ticket ${ticketId} status updated to ${newStatus}`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update ticket status',
        variant: 'destructive'
      });
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const newMsg: TicketMessage = {
        id: `msg_${Date.now()}`,
        content: newMessage,
        sender: 'Support Admin',
        senderType: 'admin',
        timestamp: new Date().toISOString()
      };

      const updatedTicket = {
        ...selectedTicket,
        messages: [...selectedTicket.messages, newMsg],
        updatedAt: new Date().toISOString()
      };

      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id ? updatedTicket : ticket
      ));
      
      setSelectedTicket(updatedTicket);
      setNewMessage('');

      toast({
        title: 'Message Sent',
        description: 'Your response has been sent to the user'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Settings className="h-4 w-4" />;
      case 'billing': return <FileText className="h-4 w-4" />;
      case 'order': return <Ticket className="h-4 w-4" />;
      case 'vendor': return <Users className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading support data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Support Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Ticket className="h-8 w-8 text-blue-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{supportStats.totalTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{supportStats.openTickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-gray-900">{supportStats.resolvedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold text-gray-900">{supportStats.avgResponseTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">{supportStats.satisfactionRate}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <HeadphonesIcon className="h-8 w-8 text-indigo-600" />
              <div className={`${isRTL ? 'mr-4' : 'ml-4'}`}>
                <p className="text-sm font-medium text-gray-600">Active Agents</p>
                <p className="text-2xl font-bold text-gray-900">{supportStats.activeAgents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          <TabsTrigger value="moderation">Content Moderation</TabsTrigger>
          <TabsTrigger value="feedback">User Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="order">Order</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={loadSupportData} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tickets List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
                <CardDescription>Manage customer support requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {filteredTickets.map((ticket) => (
                    <div 
                      key={ticket.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{ticket.id}</span>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                            <Badge className={getStatusColor(ticket.status)}>
                              {ticket.status}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{ticket.title}</h4>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ticket.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(ticket.category)}
                              <span>{ticket.userName}</span>
                            </div>
                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedTicket ? `Ticket ${selectedTicket.id}` : 'Select a Ticket'}
                </CardTitle>
                {selectedTicket && (
                  <div className="flex space-x-2">
                    <Select 
                      value={selectedTicket.status} 
                      onValueChange={(value) => handleTicketStatusUpdate(selectedTicket.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {selectedTicket ? (
                  <div className="space-y-4">
                    {/* Ticket Info */}
                    <div className="border-b pb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">User:</span> {selectedTicket.userName}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {selectedTicket.userEmail}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {selectedTicket.category}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {new Date(selectedTicket.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {selectedTicket.messages.map((message) => (
                        <div 
                          key={message.id}
                          className={`p-3 rounded-lg ${
                            message.senderType === 'admin' 
                              ? 'bg-blue-50 border-l-4 border-blue-500 ml-4'
                              : 'bg-gray-50 border-l-4 border-gray-300 mr-4'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-medium text-sm">{message.sender}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{message.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Reply */}
                    <div className="border-t pt-4">
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Type your response..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-end">
                          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                            <Send className="h-4 w-4 mr-2" />
                            Send Response
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Select a ticket to view details and respond
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Base Management</CardTitle>
              <CardDescription>Manage help articles and FAQ content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Knowledge Base Coming Soon</h3>
                <p className="text-gray-500 mb-4">Comprehensive help articles and FAQ management system</p>
                <Button>Create Article</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Moderation</CardTitle>
              <CardDescription>Review and moderate user-generated content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Content Moderation Tools</h3>
                <p className="text-gray-500 mb-4">Advanced moderation system for reviews, comments, and reports</p>
                <Button>View Reports</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Feedback</CardTitle>
              <CardDescription>Collect and analyze user feedback and suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Feedback Collection</h3>
                <p className="text-gray-500 mb-4">Comprehensive feedback analysis and sentiment tracking</p>
                <Button>View Feedback</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
