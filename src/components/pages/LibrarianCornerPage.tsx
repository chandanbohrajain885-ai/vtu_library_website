import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Edit, Trash2, BookOpen, FileText, Users, Calendar, Download, Database, User, LogOut, Upload, CreditCard, Shield, CheckCircle, Eye, Building, Search } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { BaseCrudService } from '@/integrations';
import { EResources, UserGuideArticles, NewsandEvents, LibrarianFileUploads, LibrarianAccounts } from '@/entities';
import FileUploadModal from '@/components/modals/FileUploadModal';
import ViewFilesModal from '@/components/modals/ViewFilesModal';
import { useLiveData, useDataUpdater } from '@/hooks/use-live-data';

interface LibrarianResource {
  id: string;
  title: string;
  description: string;
  category: string;
  url?: string;
  dateAdded: Date;
}

export default function LibrarianCornerPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { triggerUpdate } = useDataUpdater();
  
  // Use live data for real-time updates
  const { data: resources } = useLiveData<EResources>('E-Resources');
  const { data: userGuides } = useLiveData<UserGuideArticles>('userguidearticles');
  const { data: news } = useLiveData<NewsandEvents>('newsandnotifications');
  const { data: allUploads, refresh: refreshUploads } = useLiveData<LibrarianFileUploads>('librarianfileuploads', [], 5000); // Poll every 5 seconds
  const { data: colleges } = useLiveData<LibrarianAccounts>('librarianaccounts');
  
  const [selectedCollege, setSelectedCollege] = useState<LibrarianAccounts | null>(null);
  const [collegeFiles, setCollegeFiles] = useState<LibrarianFileUploads[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedUploadType, setSelectedUploadType] = useState<string>('');
  const [viewFilesModalOpen, setViewFilesModalOpen] = useState(false);
  const [selectedViewType, setSelectedViewType] = useState<string>('');

  // Filter uploads for current user's college
  const uploads = allUploads.filter(upload => upload.collegeName === user?.collegeName);

  // Check if user is authorized (librarian or superadmin)
  const isAuthorized = isAuthenticated && (user?.role === 'librarian' || user?.role === 'superadmin');

  useEffect(() => {
    if (!isAuthorized) {
      navigate('/');
      return;
    }

    // Set loading to false once data is available
    if (resources.length > 0 || userGuides.length > 0 || news.length > 0) {
      setIsLoading(false);
    }
  }, [isAuthorized, navigate, resources, userGuides, news]);

  if (!isAuthorized) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gray-800 font-heading text-xl">Loading...</div>
      </div>
    );
  }

  // Get welcome message based on user type
  const getWelcomeMessage = () => {
    if (user?.role === 'superadmin') {
      return selectedCollege ? `${selectedCollege.collegeName} - Files` : 'Registered Colleges';
    } else if (user?.role === 'librarian' && user?.collegeName) {
      return `Welcome ${user.collegeName}`;
    } else if (user?.role === 'librarian' && user?.librarianName) {
      return `Welcome ${user.librarianName}`;
    } else {
      return `Welcome ${user?.username}`;
    }
  };

  const handleCollegeSelect = async (college: LibrarianAccounts) => {
    setSelectedCollege(college);
    // Filter college files from live data
    const collegeSpecificFiles = allUploads.filter(file => file.collegeName === college.collegeName);
    setCollegeFiles(collegeSpecificFiles);
  };

  const handleBackToColleges = () => {
    setSelectedCollege(null);
    setCollegeFiles([]);
    setSearchTerm('');
  };

  const filteredColleges = colleges.filter(college =>
    college.collegeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.librarianName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFilesByType = (uploadType: string) => {
    return collegeFiles.filter(file => file.uploadType === uploadType);
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



  const handleUploadClick = (uploadType: string) => {
    setSelectedUploadType(uploadType);
    setUploadModalOpen(true);
  };

  const handleViewFilesClick = (uploadType: string) => {
    console.log('LibrarianCornerPage - handleViewFilesClick called with:', uploadType);
    console.log('LibrarianCornerPage - User college name:', user?.collegeName);
    setSelectedViewType(uploadType);
    setViewFilesModalOpen(true);
  };

  const handleViewApprovedFiles = (uploadType: string) => {
    if (user?.role === 'superadmin' && selectedCollege) {
      // For super admin viewing a specific college's files
      console.log('LibrarianCornerPage - Super admin viewing approved files:', {
        uploadType,
        collegeName: selectedCollege.collegeName,
        userRole: user?.role
      });
      navigate(`/approved-files/${encodeURIComponent(uploadType)}?college=${encodeURIComponent(selectedCollege.collegeName || '')}`);
    } else {
      // For regular librarian or super admin viewing their own files
      console.log('LibrarianCornerPage - handleViewApprovedFiles called with:', {
        uploadType,
        userCollegeName: user?.collegeName,
        userRole: user?.role
      });
      navigate(`/approved-files/${encodeURIComponent(uploadType)}`);
    }
  };

  const handleUploadSuccess = () => {
    // Trigger live data refresh
    triggerUpdate('librarianfileuploads');
    refreshUploads();
  };

  const getUploadStatus = (uploadType: string) => {
    if (user?.role === 'superadmin' && selectedCollege) {
      const upload = collegeFiles.find(u => u.uploadType === uploadType);
      return upload ? upload.approvalStatus : null;
    } else {
      const upload = uploads.find(u => u.uploadType === uploadType);
      return upload ? upload.approvalStatus : null;
    }
  };

  const getUploadedFiles = (uploadType: string) => {
    if (user?.role === 'superadmin' && selectedCollege) {
      const filtered = collegeFiles.filter(u => u.uploadType === uploadType);
      return filtered;
    } else {
      const filtered = uploads.filter(u => u.uploadType === uploadType);
      console.log(`LibrarianCornerPage - getUploadedFiles for ${uploadType}:`, filtered);
      console.log(`LibrarianCornerPage - All uploads:`, uploads);
      console.log(`LibrarianCornerPage - User college:`, user?.collegeName);
      return filtered;
    }
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return null;
    
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50 text-xs">Pending Review</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-xs">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50 text-xs">Rejected</Badge>;
      default:
        return null;
    }
  };

  // If super admin is viewing colleges list
  if (user?.role === 'superadmin' && !selectedCollege) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Navigation */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-[120rem] mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <Link to="/" className="font-heading text-2xl font-bold text-primary">
                VTU Consortium
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
                <Link to="/resources" className="text-gray-600 hover:text-primary transition-colors">E-Resources</Link>
                <Link to="/journals" className="text-gray-600 hover:text-primary transition-colors">ONOS</Link>
                <Link to="/news" className="text-gray-600 hover:text-primary transition-colors">Downloads</Link>
                <Link to="/guide" className="text-gray-600 hover:text-primary transition-colors">User Guide</Link>
                <span className="text-primary font-semibold">Librarian Corner</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
                <Button 
                  onClick={logout}
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Page Header */}
        <section className="bg-white py-12 border-b">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="text-center space-y-4">
              <h1 className="font-heading text-4xl font-bold text-gray-900">
                Registered Colleges
              </h1>
              <p className="font-paragraph text-gray-600 max-w-2xl mx-auto">
                Select a college to view their uploaded files and documents
              </p>
            </div>
          </div>
        </section>

        {/* Colleges List */}
        <section className="py-12">
          <div className="max-w-[120rem] mx-auto px-6">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search colleges or librarians..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
            </div>

            {/* Colleges Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college) => (
                <Card 
                  key={college._id} 
                  className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  onClick={() => handleCollegeSelect(college)}
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-lg font-semibold text-gray-900">{college.collegeName}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {college.librarianName || 'N/A'}
                        </span>
                      </div>
                      {college.email && (
                        <div className="text-sm text-gray-500">
                          {college.email}
                        </div>
                      )}
                      <div className="pt-2">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          View Files
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredColleges.length === 0 && (
              <div className="text-center py-16">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                  No Colleges Found
                </h3>
                <p className="font-paragraph text-gray-600">
                  {searchTerm ? 'No colleges match your search criteria.' : 'No colleges are registered yet.'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-12">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="border-t border-gray-200 pt-8 text-center">
              <p className="font-paragraph text-gray-500">
                © 2025 VTU Consortium Portal. All Rights Reserved.
              </p>
              <a 
                href="https://www.inerasoftware.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-paragraph text-gray-500 text-sm hover:text-primary transition-colors cursor-pointer"
              >
                Powered by INERA SOFTWARE
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // If super admin is viewing a specific college's files, show simplified college view
  if (user?.role === 'superadmin' && selectedCollege) {
    // Use the college files as uploads for this view
    const tempUploads = collegeFiles;
    
    // Override functions to use college data
    const getSuperAdminUploadStatus = (uploadType: string) => {
      const upload = tempUploads.find(u => u.uploadType === uploadType);
      return upload ? upload.approvalStatus : null;
    };

    const getSuperAdminUploadedFiles = (uploadType: string) => {
      return tempUploads.filter(u => u.uploadType === uploadType);
    };

    const getSuperAdminStatusBadge = (status: string | null) => {
      if (!status) return null;
      
      switch (status) {
        case 'Pending':
          return <Badge variant="outline" className="text-yellow-700 border-yellow-300 bg-yellow-50 text-xs">Pending Review</Badge>;
        case 'Approved':
          return <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 text-xs">Approved</Badge>;
        case 'Rejected':
          return <Badge variant="outline" className="text-red-700 border-red-300 bg-red-50 text-xs">Rejected</Badge>;
        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header Navigation */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-[120rem] mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <Link to="/" className="font-heading text-2xl font-bold text-primary">
                VTU Consortium
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
                <Link to="/resources" className="text-gray-600 hover:text-primary transition-colors">E-Resources</Link>
                <Link to="/journals" className="text-gray-600 hover:text-primary transition-colors">ONOS</Link>
                <Link to="/news" className="text-gray-600 hover:text-primary transition-colors">Downloads</Link>
                <Link to="/guide" className="text-gray-600 hover:text-primary transition-colors">User Guide</Link>
                <span className="text-primary font-semibold">Librarian Corner</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
                <Button 
                  onClick={logout}
                  variant="outline" 
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-[120rem] mx-auto px-6 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              onClick={handleBackToColleges}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Colleges
            </Button>
          </div>

          {/* College Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-8 mb-8 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                {selectedCollege.collegeUrl ? (
                  <a 
                    href={selectedCollege.collegeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-heading text-3xl font-bold text-primary hover:text-secondary transition-colors"
                  >
                    {selectedCollege.collegeName}
                  </a>
                ) : (
                  <h1 className="font-heading text-3xl font-bold text-primary">
                    {selectedCollege.collegeName}
                  </h1>
                )}
                <div className="flex flex-col md:flex-row gap-4 mt-4 text-gray-600">
                  {selectedCollege.librarianName && (
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-blue-500" />
                      <span className="font-medium">Librarian: {selectedCollege.librarianName}</span>
                    </div>
                  )}
                  {selectedCollege.email && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">•</span>
                      <span>Email: {selectedCollege.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-800 font-medium text-sm">Super Admin View</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Status Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Membership Status */}
            <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>Membership Status</span>
                  </div>
                  {getSuperAdminStatusBadge(getSuperAdminUploadStatus('Membership Status'))}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Files uploaded: {getSuperAdminUploadedFiles('Membership Status').length}
                  </p>
                  {getSuperAdminUploadedFiles('Membership Status').length > 0 && (
                    <Button 
                      onClick={() => handleViewFilesClick('Membership Status')}
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Files
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Membership Fees Receipts */}
            <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <span>Membership Fees</span>
                  </div>
                  {getSuperAdminStatusBadge(getSuperAdminUploadStatus('Membership Fees Receipts'))}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Files uploaded: {getSuperAdminUploadedFiles('Membership Fees Receipts').length}
                  </p>
                  {getSuperAdminUploadedFiles('Membership Fees Receipts').length > 0 && (
                    <Button 
                      onClick={() => handleViewFilesClick('Membership Fees Receipts')}
                      variant="outline"
                      size="sm"
                      className="w-full border-green-200 text-green-600 hover:bg-green-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Files
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Year e-Resources */}
            <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Database className="h-5 w-5 text-purple-600" />
                    </div>
                    <span>e-Resources</span>
                  </div>
                  {getSuperAdminStatusBadge(getSuperAdminUploadStatus('Current Year e-Resources'))}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Files uploaded: {getSuperAdminUploadedFiles('Current Year e-Resources').length}
                  </p>
                  {getSuperAdminUploadedFiles('Current Year e-Resources').length > 0 && (
                    <Button 
                      onClick={() => handleViewFilesClick('Current Year e-Resources')}
                      variant="outline"
                      size="sm"
                      className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Files
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Access Confirmation */}
            <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                    </div>
                    <span>Access Confirmation</span>
                  </div>
                  {getSuperAdminStatusBadge(getSuperAdminUploadStatus('Access Confirmation'))}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Files uploaded: {getSuperAdminUploadedFiles('Access Confirmation').length}
                  </p>
                  {getSuperAdminUploadedFiles('Access Confirmation').length > 0 && (
                    <Button 
                      onClick={() => handleViewFilesClick('Access Confirmation')}
                      variant="outline"
                      size="sm"
                      className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Files
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-heading text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Button 
                onClick={() => handleViewApprovedFiles('Membership Status')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                View All Approved Files
              </Button>
              <Button 
                onClick={() => navigate('/admin')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/librarian-accounts-check')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Accounts
              </Button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ViewFilesModal 
          isOpen={viewFilesModalOpen}
          onClose={() => setViewFilesModalOpen(false)}
          uploadType={selectedViewType}
          collegeName={selectedCollege.collegeName || ''}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="font-heading text-2xl font-bold text-primary">
              VTU Consortium
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
              <Link to="/resources" className="text-gray-600 hover:text-primary transition-colors">E-Resources</Link>
              <Link to="/journals" className="text-gray-600 hover:text-primary transition-colors">ONOS</Link>
              <Link to="/news" className="text-gray-600 hover:text-primary transition-colors">Downloads</Link>
              <Link to="/guide" className="text-gray-600 hover:text-primary transition-colors">User Guide</Link>
              <span className="text-primary font-semibold">Librarian Corner</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
              <Button 
                onClick={logout}
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Page Header with Custom Welcome Message */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center space-y-6">
            <h1 className="font-heading text-4xl font-bold text-gray-900">
              {getWelcomeMessage()}
            </h1>

            {user?.role === 'librarian' && user?.collegeName && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-8 max-w-4xl mx-auto border border-blue-100">
                <div className="text-center space-y-4">
                  {user.collegeUrl ? (
                    <a 
                      href={user.collegeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-heading text-3xl font-bold text-primary hover:text-secondary transition-colors cursor-pointer block"
                    >
                      {user.collegeName}
                    </a>
                  ) : (
                    <h2 className="font-heading text-3xl font-bold text-primary">
                      {user.collegeName}
                    </h2>
                  )}
                  
                  <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-gray-600">
                    {user.librarianName && (
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">{user.librarianName} / Nodal Officer</span>
                      </div>
                    )}
                    {user.email && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">•</span>
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Location Section for Global Academy of Technology */}
                  {user.collegeName?.toLowerCase().includes('global academy of technology') && (
                    <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
                      <h3 className="font-heading text-lg font-semibold text-primary mb-2 flex items-center justify-center space-x-2">
                        <Building className="h-5 w-5" />
                        <span>Location</span>
                      </h3>
                      <p className="text-gray-700 font-paragraph text-sm">
                        Aditya Layout, Rajarajeshwari Nagar, Bengaluru, Karnataka 560098
                      </p>
                    </div>
                  )}
                  
                  <p className="text-gray-600 font-paragraph text-lg">
                    Access your consortium resources and manage library services
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">E-Resources Available</CardTitle>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Database className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{resources.length}</div>
                <p className="text-xs text-gray-500 mt-1">Active resources</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">User Guides</CardTitle>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{userGuides.length}</div>
                <p className="text-xs text-gray-500 mt-1">Help articles</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Latest News</CardTitle>
                  <div className="p-2 bg-yellow-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{news.length}</div>
                <p className="text-xs text-gray-500 mt-1">News items</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Quick Access</CardTitle>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <p className="text-xs text-gray-500 mt-1">Available</p>
              </CardContent>
            </Card>
          </div>

          {/* Upload Section for Librarians */}
          {user?.role === 'librarian' && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold text-gray-900">File Management</h2>
                <div className="text-sm text-gray-500">
                  Upload files and view approved files for each category
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Membership Status Upload */}
                <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <span className="text-lg font-semibold text-gray-900">Membership Status</span>
                          {getStatusBadge(getUploadStatus('Membership Status'))}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">
                      Upload your college membership status documents
                    </p>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => handleUploadClick('Membership Status')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                      {getUploadedFiles('Membership Status').length > 0 && (
                        <Button 
                          onClick={() => handleViewFilesClick('Membership Status')}
                          variant="outline"
                          className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Files ({getUploadedFiles('Membership Status').length})
                        </Button>
                      )}
                      <Button 
                        onClick={() => handleViewApprovedFiles('Membership Status')}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        View Approved Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Membership Fees Receipts Upload */}
                <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <CreditCard className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <span className="text-lg font-semibold text-gray-900">Membership Fees</span>
                          {getStatusBadge(getUploadStatus('Membership Fees Receipts'))}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">
                      Upload membership fee payment receipts and records
                    </p>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => handleUploadClick('Membership Fees Receipts')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Receipt
                      </Button>
                      {getUploadedFiles('Membership Fees Receipts').length > 0 && (
                        <Button 
                          onClick={() => handleViewFilesClick('Membership Fees Receipts')}
                          variant="outline"
                          className="w-full border-green-200 text-green-600 hover:bg-green-50"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Files ({getUploadedFiles('Membership Fees Receipts').length})
                        </Button>
                      )}
                      <Button 
                        onClick={() => handleViewApprovedFiles('Membership Fees Receipts')}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        View Approved Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Year e-Resources Upload */}
                <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Database className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <span className="text-lg font-semibold text-gray-900">e-Resources</span>
                          {getStatusBadge(getUploadStatus('Current Year e-Resources'))}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">
                      Upload current academic year e-resource access details
                    </p>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => handleUploadClick('Current Year e-Resources')}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        size="sm"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Resources
                      </Button>
                      {getUploadedFiles('Current Year e-Resources').length > 0 && (
                        <Button 
                          onClick={() => handleViewFilesClick('Current Year e-Resources')}
                          variant="outline"
                          className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Files ({getUploadedFiles('Current Year e-Resources').length})
                        </Button>
                      )}
                      <Button 
                        onClick={() => handleViewApprovedFiles('Current Year e-Resources')}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        View Approved Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Access Confirmation Upload */}
                <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <span className="text-lg font-semibold text-gray-900">Access Confirmation</span>
                          {getStatusBadge(getUploadStatus('Access Confirmation'))}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">
                      Upload access confirmation and verification documents
                    </p>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => handleUploadClick('Access Confirmation')}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                        size="sm"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Confirmation
                      </Button>
                      {getUploadedFiles('Access Confirmation').length > 0 && (
                        <Button 
                          onClick={() => handleViewFilesClick('Access Confirmation')}
                          variant="outline"
                          className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                          size="sm"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Files ({getUploadedFiles('Access Confirmation').length})
                        </Button>
                      )}
                      <Button 
                        onClick={() => handleViewApprovedFiles('Access Confirmation')}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        View Approved Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Quick Access Section */}
          <div className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">Quick Access</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* E-Resources Access */}
              <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 group">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Database className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">E-Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">
                    Access electronic journals, e-books, and digital resources by academic year
                  </p>
                  <Button 
                    onClick={() => navigate('/resources')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Browse E-Resources
                  </Button>
                </CardContent>
              </Card>

              {/* User Guides */}
              <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 group">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">User Guides</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">
                    Step-by-step guides for accessing and using consortium resources
                  </p>
                  <Button 
                    onClick={() => navigate('/guide')}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    View Guides
                  </Button>
                </CardContent>
              </Card>

              {/* Downloads */}
              <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 group">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                      <Download className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Downloads</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">
                    Download circulars, forms, and important documents
                  </p>
                  <Button 
                    onClick={() => window.open('https://drive.google.com/drive/folders/1BmvZhX2bk-5KzGhw1hRY_LOGQ3fqdwP4?usp=sharing', '_blank')}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Access Downloads
                  </Button>
                </CardContent>
              </Card>

              {/* Training Materials */}
              <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 group">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
                      <BookOpen className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Training</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">
                    Access training materials and workshop resources
                  </p>
                  <Button 
                    onClick={() => window.open('https://drive.google.com/drive/folders/128yGjX462SkXrmUDWrgEto8Q-9HdAtQ_?usp=sharing', '_blank')}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    View Training
                  </Button>
                </CardContent>
              </Card>

              {/* News & Events */}
              <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 group">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                      <Calendar className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">News & Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">
                    Stay updated with latest consortium news and events
                  </p>
                  <Button 
                    onClick={() => navigate('/news')}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    View News
                  </Button>
                </CardContent>
              </Card>

              {/* Member Colleges */}
              <Card className="bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 group">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Member Colleges</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 text-sm">
                    View list of consortium member institutions
                  </p>
                  <Button 
                    onClick={() => window.open('https://docs.google.com/spreadsheets/d/16M-0Q4yAtAw_vU_Nxb-3aIQv_UHkdAwJ/edit?usp=sharing&ouid=107772366690337000857&rtpof=true&sd=true', '_blank')}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    View Colleges
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Resources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-2xl font-bold text-gray-900">
                Recent E-Resources
              </h2>
              <Button 
                onClick={() => navigate('/resources')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                View All Resources
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.slice(0, 6).map((resource) => (
                <Card key={resource._id} className="bg-gray-50 border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-heading text-lg text-gray-900">
                      E-Resources {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm text-gray-600">
                      {resource.eJournals && (
                        <div className="flex items-start space-x-2">
                          <span className="font-medium text-gray-900 min-w-fit">E-Journals:</span>
                          <span className="text-gray-600">{resource.eJournals}</span>
                        </div>
                      )}
                      {resource.eBooks && (
                        <div className="flex items-start space-x-2">
                          <span className="font-medium text-gray-900 min-w-fit">E-Books:</span>
                          <span className="text-gray-600">{resource.eBooks}</span>
                        </div>
                      )}
                      {resource.plagiarismDetectionSoftware && (
                        <div className="flex items-start space-x-2">
                          <span className="font-medium text-gray-900 min-w-fit">Plagiarism Tools:</span>
                          <span className="text-gray-600">{resource.plagiarismDetectionSoftware}</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={() => navigate(`/resources/${resource.title}`)}
                      className="w-full mt-6 bg-primary hover:bg-primary/90 text-white"
                      size="sm"
                    >
                      Access Resources
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          {/* Hide contact information for Global Academy of Technology and Acharya Institute of Technology librarians */}
          {!(isAuthenticated && user?.role === 'librarian' && 
            (user?.collegeName?.toLowerCase().includes('global academy of technology') || 
             user?.collegeName?.toLowerCase().includes('acharya institute of technology'))) && (
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Contact Information */}
              <div>
                <h4 className="font-heading text-lg font-semibold mb-4 text-gray-900">Contact Us</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-paragraph text-gray-600 text-sm font-medium">Address:</p>
                    <p className="font-paragraph text-gray-600 text-sm">
                      Acharya, Acharya Dr. S. Radhakrishnan Road, Acharya P.O Soladevanahalli, Bangalore - 560107, Karnataka, India
                    </p>
                  </div>
                  <div>
                    <p className="font-paragraph text-gray-600 text-sm font-medium">Other Enquiries:</p>
                    <p className="font-paragraph text-gray-600 text-sm">+91 80225-55555</p>
                  </div>
                </div>
              </div>
              
              {/* Additional Contact */}
              <div>
                <h4 className="font-heading text-lg font-semibold mb-4 text-gray-900">VTU Consortium</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-paragraph text-gray-600 text-sm font-medium">Email:</p>
                    <a href="mailto:vtuconsortium@gmail.com" className="font-paragraph text-gray-600 text-sm hover:text-primary transition-colors">
                      vtuconsortium@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="font-paragraph text-gray-600 text-sm font-medium">Phone:</p>
                    <p className="font-paragraph text-gray-600 text-sm">08312498191</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="font-paragraph text-gray-500">
              © 2025 VTU Consortium Portal. All Rights Reserved.
            </p>
            <a 
              href="https://www.inerasoftware.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-paragraph text-gray-500 text-sm hover:text-primary transition-colors cursor-pointer"
            >
              Powered by INERA SOFTWARE
            </a>
          </div>
        </div>
      </footer>

      {/* File Upload Modal */}
      <FileUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        uploadType={selectedUploadType}
        collegeName={user?.collegeName || ''}
        librarianName={user?.librarianName || user?.username || ''}
        librarianEmail={user?.email || ''}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* View Files Modal */}
      <ViewFilesModal
        isOpen={viewFilesModalOpen}
        onClose={() => setViewFilesModalOpen(false)}
        uploadType={selectedViewType}
        collegeName={user?.collegeName || ''}
      />
    </div>
  );
}