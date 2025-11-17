import React, { useState, useEffect } from 'react';
import { useAuth, User, RegistrationRequest } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Edit, Plus, Users, Settings, Shield, Clock, CheckCircle, XCircle, Eye, FileText, Download, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { LibrarianFileUploads, PasswordChangeRequests } from '@/entities';
import { useLiveData } from '@/hooks/use-live-data';

const availablePermissions = [
  'view_resources',
  'manage_resources',
  'view_news',
  'manage_news',
  'view_journals',
  'manage_journals',
  'view_guides',
  'manage_guides',
  'view_users',
  'manage_users',
  'system_admin'
];

export default function AdminDashboard() {
  const { 
    user, 
    users, 
    createUser, 
    updateUserPermissions, 
    deleteUser, 
    logout,
    registrationRequests,
    approveRegistrationRequest,
    rejectRegistrationRequest,
    approvePasswordChangeRequest,
    rejectPasswordChangeRequest
  } = useAuth();
  
  // Use live data for password change requests
  const { 
    data: passwordChangeRequests, 
    isLoading: passwordRequestsLoading 
  } = useLiveData<PasswordChangeRequests>('passwordchangerequests');
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingRequest, setViewingRequest] = useState<RegistrationRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [pendingUploads, setPendingUploads] = useState<LibrarianFileUploads[]>([]);
  const [viewingUpload, setViewingUpload] = useState<LibrarianFileUploads | null>(null);
  const [approvalComments, setApprovalComments] = useState('');
  const [viewingPasswordRequest, setViewingPasswordRequest] = useState<PasswordChangeRequests | null>(null);
  const [passwordRequestComments, setPasswordRequestComments] = useState('');
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'admin' as 'admin' | 'librarian' | 'publisher',
    permissions: [] as string[]
  });

  // Fetch pending uploads on component mount
  useEffect(() => {
    const fetchPendingUploads = async () => {
      try {
        const { items } = await BaseCrudService.getAll<LibrarianFileUploads>('librarianfileuploads');
        const pending = items.filter(upload => upload.approvalStatus === 'Pending');
        setPendingUploads(pending);
      } catch (error) {
        console.error('Error fetching pending uploads:', error);
      }
    };

    if (user?.role === 'superadmin') {
      fetchPendingUploads();
    }
  }, [user]);

  if (user?.role !== 'superadmin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Shield className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold">Access Denied</h2>
              <p className="text-gray-600">You don't have permission to access this page.</p>
              <Link to="/">
                <Button>Return to Home</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCreateUser = () => {
    if (!newUser.username || !newUser.password) return;

    createUser({
      username: newUser.username,
      role: newUser.role,
      permissions: newUser.permissions,
      createdBy: user.username
    });

    setNewUser({ username: '', password: '', role: 'admin', permissions: [] });
    setIsCreateModalOpen(false);
  };

  const handleUpdatePermissions = (userId: string, permissions: string[]) => {
    updateUserPermissions(userId, permissions);
    setEditingUser(null);
  };

  const handleApproveRequest = (requestId: string) => {
    approveRegistrationRequest(requestId);
    setViewingRequest(null);
  };

  const handleRejectRequest = (requestId: string) => {
    if (!rejectReason.trim()) return;
    rejectRegistrationRequest(requestId, rejectReason);
    setViewingRequest(null);
    setRejectReason('');
  };

  const handleApproveUpload = async (uploadId: string) => {
    try {
      await BaseCrudService.update('librarianfileuploads', {
        _id: uploadId,
        approvalStatus: 'Approved',
        approvalDate: new Date().toISOString(),
        superAdminComments: approvalComments
      });
      
      // Refresh pending uploads
      const { items } = await BaseCrudService.getAll<LibrarianFileUploads>('librarianfileuploads');
      const pending = items.filter(upload => upload.approvalStatus === 'Pending');
      setPendingUploads(pending);
      
      setViewingUpload(null);
      setApprovalComments('');
    } catch (error) {
      console.error('Error approving upload:', error);
    }
  };

  const handleRejectUpload = async (uploadId: string) => {
    if (!approvalComments.trim()) return;
    
    try {
      await BaseCrudService.update('librarianfileuploads', {
        _id: uploadId,
        approvalStatus: 'Rejected',
        approvalDate: new Date().toISOString(),
        superAdminComments: approvalComments
      });
      
      // Refresh pending uploads
      const { items } = await BaseCrudService.getAll<LibrarianFileUploads>('librarianfileuploads');
      const pending = items.filter(upload => upload.approvalStatus === 'Pending');
      setPendingUploads(pending);
      
      setViewingUpload(null);
      setApprovalComments('');
    } catch (error) {
      console.error('Error rejecting upload:', error);
    }
  };

  const handleApprovePasswordRequest = async (requestId: string) => {
    try {
      await approvePasswordChangeRequest(requestId, passwordRequestComments);
      setViewingPasswordRequest(null);
      setPasswordRequestComments('');
    } catch (error) {
      console.error('Error approving password change request:', error);
    }
  };

  const handleRejectPasswordRequest = async (requestId: string) => {
    try {
      await rejectPasswordChangeRequest(requestId, passwordRequestComments);
      setViewingPasswordRequest(null);
      setPasswordRequestComments('');
    } catch (error) {
      console.error('Error rejecting password change request:', error);
    }
  };

  const pendingRequests = registrationRequests.filter(r => r.status === 'pending');
  const pendingPasswordRequests = passwordChangeRequests.filter(r => r.status === 'pending');
  const togglePermission = (permission: string, isEditing: boolean = false) => {
    if (isEditing && editingUser) {
      const updatedPermissions = editingUser.permissions.includes(permission)
        ? editingUser.permissions.filter(p => p !== permission)
        : [...editingUser.permissions, permission];
      setEditingUser({ ...editingUser, permissions: updatedPermissions });
    } else {
      const updatedPermissions = newUser.permissions.includes(permission)
        ? newUser.permissions.filter(p => p !== permission)
        : [...newUser.permissions, permission];
      setNewUser({ ...newUser, permissions: updatedPermissions });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
              <Badge variant="secondary">Logged in as: {user.username}</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="outline">Back to Site</Button>
              </Link>
              <Button onClick={logout} variant="destructive">Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === 'admin').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.role === 'librarian' || u.role === 'publisher').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">File Uploads</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingUploads.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Password Requests</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPasswordRequests.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Password Change Requests Section */}
        {pendingPasswordRequests.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-purple-500" />
                  Password Change Requests
                </CardTitle>
                <Badge variant="secondary">{pendingPasswordRequests.length} pending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingPasswordRequests.map((request) => (
                  <div key={request._id} className="flex items-center justify-between p-4 border rounded-lg bg-purple-50">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium">{request.userIdentity}</h3>
                        <p className="text-sm text-gray-500">User Type: {request.userType}</p>
                        {request.collegeName && (
                          <p className="text-sm text-gray-500">College: {request.collegeName}</p>
                        )}
                        <p className="text-xs text-gray-400">
                          Requested: {new Date(request.requestDate || '').toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-purple-600 border-purple-600">
                        {request.status}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setViewingPasswordRequest(request)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Password Change Request</DialogTitle>
                          </DialogHeader>
                          {viewingPasswordRequest && (
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium">User</Label>
                                <p className="text-sm">{viewingPasswordRequest.userIdentity}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">User Type</Label>
                                <p className="text-sm">{viewingPasswordRequest.userType}</p>
                              </div>
                              {viewingPasswordRequest.collegeName && (
                                <div>
                                  <Label className="text-sm font-medium">College</Label>
                                  <p className="text-sm">{viewingPasswordRequest.collegeName}</p>
                                </div>
                              )}
                              <div>
                                <Label className="text-sm font-medium">Request Date</Label>
                                <p className="text-sm">
                                  {new Date(viewingPasswordRequest.requestDate || '').toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <Badge variant="outline" className="ml-2">
                                  {viewingPasswordRequest.status}
                                </Badge>
                              </div>
                              <div>
                                <Label htmlFor="passwordComments">Admin Comments</Label>
                                <Textarea
                                  id="passwordComments"
                                  value={passwordRequestComments}
                                  onChange={(e) => setPasswordRequestComments(e.target.value)}
                                  placeholder="Add comments about this password change request..."
                                  className="mt-1"
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => handleApprovePasswordRequest(viewingPasswordRequest._id)}
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleRejectPasswordRequest(viewingPasswordRequest._id)}
                                  variant="destructive"
                                  className="flex-1"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pending File Uploads Section */}
        {pendingUploads.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Pending File Upload Approvals
                </CardTitle>
                <Badge variant="secondary">{pendingUploads.length} pending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingUploads.map((upload) => (
                  <div key={upload._id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium">{upload.uploadType}</h3>
                        <p className="text-sm text-gray-500">{upload.collegeName}</p>
                        <p className="text-sm text-gray-500">Librarian: {upload.librarianName}</p>
                        <p className="text-xs text-gray-400">
                          Uploaded: {upload.uploadDate ? new Date(upload.uploadDate).toLocaleDateString() : 'Unknown'}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                        {upload.approvalStatus}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingUpload(upload)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Review File Upload</DialogTitle>
                          </DialogHeader>
                          {viewingUpload && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Upload Type</Label>
                                  <p className="text-sm">{viewingUpload.uploadType}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">College</Label>
                                  <p className="text-sm">{viewingUpload.collegeName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Librarian</Label>
                                  <p className="text-sm">{viewingUpload.librarianName}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Upload Date</Label>
                                  <p className="text-sm">
                                    {viewingUpload.uploadDate ? new Date(viewingUpload.uploadDate).toLocaleDateString() : 'Unknown'}
                                  </p>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium">File</Label>
                                <div className="mt-2 p-3 border rounded-lg bg-gray-50">
                                  <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm text-blue-800">
                                      {viewingUpload.uploadType} Document
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(viewingUpload.fileUrl, '_blank')}
                                    >
                                      <Download className="h-4 w-4 mr-1" />
                                      View File
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="approvalComments">Comments</Label>
                                <Textarea
                                  id="approvalComments"
                                  value={approvalComments}
                                  onChange={(e) => setApprovalComments(e.target.value)}
                                  placeholder="Enter comments for approval/rejection..."
                                  rows={3}
                                />
                              </div>
                              
                              <div className="flex justify-end space-x-2 pt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setViewingUpload(null);
                                    setApprovalComments('');
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleRejectUpload(viewingUpload._id)}
                                  disabled={!approvalComments.trim()}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  onClick={() => handleApproveUpload(viewingUpload._id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Requests Section */}
        {pendingRequests.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Pending Registration Requests
                </CardTitle>
                <Badge variant="secondary">{pendingRequests.length} pending</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg bg-orange-50">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium">{request.username}</h3>
                        <p className="text-sm text-gray-500">{request.email}</p>
                        <p className="text-sm text-gray-500 capitalize">Requested Role: {request.role}</p>
                        <p className="text-xs text-gray-400">
                          Submitted: {new Date(request.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {request.requestedPermissions.slice(0, 3).map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                        {request.requestedPermissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{request.requestedPermissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingRequest(request)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Review Registration Request</DialogTitle>
                          </DialogHeader>
                          {viewingRequest && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium">Username</Label>
                                  <p className="text-sm">{viewingRequest.username}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Email</Label>
                                  <p className="text-sm">{viewingRequest.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Requested Role</Label>
                                  <p className="text-sm capitalize">{viewingRequest.role}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Request Date</Label>
                                  <p className="text-sm">{new Date(viewingRequest.requestDate).toLocaleDateString()}</p>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-sm font-medium">Requested Permissions</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {viewingRequest.requestedPermissions.map((permission) => (
                                    <div key={permission} className="flex items-center space-x-2">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span className="text-sm">
                                        {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="rejectReason">Rejection Reason (optional)</Label>
                                <Input
                                  id="rejectReason"
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  placeholder="Enter reason for rejection..."
                                />
                              </div>
                              
                              <div className="flex justify-end space-x-2 pt-4">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setViewingRequest(null);
                                    setRejectReason('');
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleRejectRequest(viewingRequest.id)}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  onClick={() => handleApproveRequest(viewingRequest.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* User Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>User Management</CardTitle>
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        placeholder="Enter username"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Enter password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={newUser.role} onValueChange={(value: 'admin' | 'librarian' | 'publisher') => setNewUser({ ...newUser, role: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="librarian">Librarian/Nodal-officer</SelectItem>
                          <SelectItem value="publisher">Publisher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Permissions</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {availablePermissions.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission}
                              checked={newUser.permissions.includes(permission)}
                              onCheckedChange={() => togglePermission(permission)}
                            />
                            <Label htmlFor={permission} className="text-sm">
                              {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateUser}>Create User</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.filter(u => u.role !== 'superadmin').map((userItem) => (
                <div key={userItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">{userItem.username}</h3>
                      <p className="text-sm text-gray-500 capitalize">{userItem.role}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {userItem.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUser(userItem)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit User Permissions</DialogTitle>
                        </DialogHeader>
                        {editingUser && (
                          <div className="space-y-4">
                            <div>
                              <Label>User: {editingUser.username}</Label>
                              <p className="text-sm text-gray-500 capitalize">Role: {editingUser.role}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Permissions</Label>
                              <div className="grid grid-cols-2 gap-2">
                                {availablePermissions.map((permission) => (
                                  <div key={permission} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`edit-${permission}`}
                                      checked={editingUser.permissions.includes(permission)}
                                      onCheckedChange={() => togglePermission(permission, true)}
                                    />
                                    <Label htmlFor={`edit-${permission}`} className="text-sm">
                                      {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setEditingUser(null)}>
                                Cancel
                              </Button>
                              <Button onClick={() => handleUpdatePermissions(editingUser.id, editingUser.permissions)}>
                                Update Permissions
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteUser(userItem.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center">
            <p className="font-paragraph text-gray-400 text-sm">© 2025 VTU Consortium Portal. All Rights Reserved.</p>
            <a 
              href="https://www.inerasoftware.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-paragraph text-gray-400 text-sm hover:text-orange-400 transition-colors cursor-pointer"
            >
              Powered by INERA SOFTWARE
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}