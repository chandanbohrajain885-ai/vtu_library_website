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
  const [resources, setResources] = useState<EResources[]>([]);
  const [userGuides, setUserGuides] = useState<UserGuideArticles[]>([]);
  const [news, setNews] = useState<NewsandEvents[]>([]);
  const [uploads, setUploads] = useState<LibrarianFileUploads[]>([]);
  const [colleges, setColleges] = useState<LibrarianAccounts[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<LibrarianAccounts | null>(null);
  const [collegeFiles, setCollegeFiles] = useState<LibrarianFileUploads[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedUploadType, setSelectedUploadType] = useState<string>('');
  const [viewFilesModalOpen, setViewFilesModalOpen] = useState(false);
  const [selectedViewType, setSelectedViewType] = useState<string>('');

  // Check if user is authorized (librarian or superadmin)
  const isAuthorized = isAuthenticated && (user?.role === 'librarian' || user?.role === 'superadmin');

  useEffect(() => {
    if (!isAuthorized) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch E-Resources
        const { items: eresources } = await BaseCrudService.getAll<EResources>('E-Resources');
        setResources(eresources);

        // Fetch User Guides
        const { items: guides } = await BaseCrudService.getAll<UserGuideArticles>('userguidearticles');
        setUserGuides(guides);

        // Fetch News
        const { items: newsItems } = await BaseCrudService.getAll<NewsandEvents>('newsandnotifications');
        setNews(newsItems);

        // If super admin, fetch all colleges for selection
        if (user?.role === 'superadmin') {
          const { items: allColleges } = await BaseCrudService.getAll<LibrarianAccounts>('librarianaccounts');
          setColleges(allColleges);
        } else if (user?.role === 'librarian' && user?.collegeName) {
          // Fetch user's uploads if librarian
          const { items: userUploads } = await BaseCrudService.getAll<LibrarianFileUploads>('librarianfileuploads');
          console.log('LibrarianCornerPage - All uploads from DB:', userUploads);
          const filteredUploads = userUploads.filter(upload => upload.collegeName === user.collegeName);
          console.log('LibrarianCornerPage - Filtered uploads for college:', user.collegeName, filteredUploads);
          setUploads(filteredUploads);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthorized, navigate, user]);

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
    try {
      const { items: allFiles } = await BaseCrudService.getAll<LibrarianFileUploads>('librarianfileuploads');
      const collegeSpecificFiles = allFiles.filter(file => file.collegeName === college.collegeName);
      setCollegeFiles(collegeSpecificFiles);
    } catch (error) {
      console.error('Error fetching college files:', error);
    }
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
    // Refresh uploads data
    if (user?.role === 'librarian' && user?.collegeName) {
      BaseCrudService.getAll<LibrarianFileUploads>('librarianfileuploads')
        .then(({ items }) => {
          console.log('LibrarianCornerPage - Refresh: All uploads from DB:', items);
          const filteredUploads = items.filter(upload => upload.collegeName === user.collegeName);
          console.log('LibrarianCornerPage - Refresh: Filtered uploads for college:', user.collegeName, filteredUploads);
          setUploads(filteredUploads);
        })
        .catch(console.error);
    }
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
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending Review</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="text-green-600 border-green-600">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600">Rejected</Badge>;
      default:
        return null;
    }
  };

  // If super admin is viewing colleges list
  if (user?.role === 'superadmin' && !selectedCollege) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        <header className="bg-primary text-primary-foreground shadow-lg">
          <div className="max-w-[120rem] mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <Link to="/" className="font-heading text-2xl font-bold">
                VTU Consortium
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="hover:text-orange-200 transition-colors">Home</Link>
                <Link to="/resources" className="hover:text-orange-200 transition-colors">E-Resources</Link>
                <Link to="/journals" className="hover:text-orange-200 transition-colors">ONOS</Link>
                <Link to="/news" className="hover:text-orange-200 transition-colors">Downloads</Link>
                <Link to="/guide" className="hover:text-orange-200 transition-colors">User Guide</Link>
                <span className="text-orange-200 font-semibold">Librarian Corner</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user?.username}</span>
                <Button 
                  onClick={logout}
                  variant="outline" 
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Page Header */}
        <section className="bg-primary/5 py-16">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="text-center space-y-4">
              <h1 className="font-heading text-5xl font-bold text-primary">
                Registered Colleges
              </h1>
              <p className="font-paragraph text-gray-600 max-w-2xl mx-auto">
                Select a college to view their uploaded files and documents
              </p>
            </div>
          </div>
        </section>

        {/* Colleges List */}
        <section className="py-20">
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
                  className="pl-10"
                />
              </div>
            </div>

            {/* Colleges Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college) => (
                <Card 
                  key={college._id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
                  onClick={() => handleCollegeSelect(college)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-blue-500" />
                      <span className="text-lg">{college.collegeName}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
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
                        <Button className="w-full bg-blue-500 hover:bg-blue-600">
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
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="font-paragraph text-gray-400">
                © 2025 VTU Consortium Portal. All Rights Reserved.
              </p>
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

  // If super admin is viewing a specific college's files, show the same interface as college librarian but read-only
  if (user?.role === 'superadmin' && selectedCollege) {
    // Set up temporary user context to mimic the selected college's librarian view
    const tempCollegeUser = {
      ...user,
      collegeName: selectedCollege.collegeName,
      librarianName: selectedCollege.librarianName,
      email: selectedCollege.email,
      collegeUrl: selectedCollege.collegeUrl
    };
    
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
          return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending Review</Badge>;
        case 'Approved':
          return <Badge variant="outline" className="text-green-600 border-green-600">Approved</Badge>;
        case 'Rejected':
          return <Badge variant="outline" className="text-red-600 border-red-600">Rejected</Badge>;
        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        <header className="bg-primary text-primary-foreground shadow-lg">
          <div className="max-w-[120rem] mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <Link to="/" className="font-heading text-2xl font-bold">
                VTU Consortium
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="hover:text-orange-200 transition-colors">Home</Link>
                <Link to="/resources" className="hover:text-orange-200 transition-colors">E-Resources</Link>
                <Link to="/journals" className="hover:text-orange-200 transition-colors">ONOS</Link>
                <Link to="/news" className="hover:text-orange-200 transition-colors">Downloads</Link>
                <Link to="/guide" className="hover:text-orange-200 transition-colors">User Guide</Link>
                <span className="text-orange-200 font-semibold">Librarian Corner</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm">Welcome, {user?.username}</span>
                <Button 
                  onClick={logout}
                  variant="outline" 
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </header>

        {/* Page Header with Custom Welcome Message */}
        <section className="bg-primary/5 py-16">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="flex items-center space-x-4 mb-6">
              <Button
                onClick={handleBackToColleges}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Colleges
              </Button>
            </div>
            
            <div className="text-center space-y-4">
              <h1 className="font-heading text-5xl font-bold text-primary">
                Welcome {selectedCollege.collegeName}
              </h1>
              
              {/* Super Admin Read-Only Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">Super Admin View - Read Only Access</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  You are viewing this college's interface. Upload, edit, and remove functions are disabled.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-8">
                {tempCollegeUser.collegeUrl ? (
                  <a 
                    href={tempCollegeUser.collegeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-heading text-2xl font-bold text-primary mb-2 hover:text-secondary transition-colors cursor-pointer block"
                  >
                    {tempCollegeUser.collegeName}
                  </a>
                ) : (
                  <h2 className="font-heading text-2xl font-bold text-primary mb-2">
                    {tempCollegeUser.collegeName}
                  </h2>
                )}
                {tempCollegeUser.librarianName && (
                  <p className="text-gray-600 font-paragraph">
                    Librarian: {tempCollegeUser.librarianName} / Nodal Officer
                  </p>
                )}
                
                {/* Location Section for Global Academy of Technology */}
                {tempCollegeUser.collegeName?.toLowerCase().includes('global academy of technology') && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-heading text-lg font-semibold text-primary mb-2">Location</h3>
                    <p className="text-gray-700 font-paragraph text-sm">
                      Aditya Layout, Rajarajeshwari Nagar, Bengaluru, Karnataka 560098
                    </p>
                  </div>
                )}
                
                <p className="text-gray-600 font-paragraph mt-2">
                  Access your consortium resources and manage library services
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20">
          <div className="max-w-[120rem] mx-auto px-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <Card className="border-l-4 border-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">E-Resources Available</CardTitle>
                    <Database className="h-4 w-4 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{resources.length}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">User Guides</CardTitle>
                    <FileText className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{userGuides.length}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-yellow-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Latest News</CardTitle>
                    <Calendar className="h-4 w-4 text-yellow-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{news.length}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-purple-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">Quick Access</CardTitle>
                    <Users className="h-4 w-4 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Access Section */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Upload Cards - Show same design but without upload buttons for super admin */}
              
              {/* Membership Status Upload */}
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-blue-500 cursor-pointer relative" onClick={() => handleViewApprovedFiles('Membership Status')}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <span>Membership Status</span>
                    </div>
                    {getSuperAdminStatusBadge(getSuperAdminUploadStatus('Membership Status'))}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Upload your college membership status documents
                  </p>
                  <p className="text-xs text-blue-600 mb-4 italic">
                    💡 Click anywhere on this card to view approved files
                  </p>
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    {/* Upload button hidden for super admin */}
                    {getSuperAdminUploadedFiles('Membership Status').length > 0 && (
                      <Button 
                        onClick={() => handleViewFilesClick('Membership Status')}
                        variant="outline"
                        className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Uploaded Files ({getSuperAdminUploadedFiles('Membership Status').length})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Membership Fees Receipts Upload */}
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-green-500 cursor-pointer relative" onClick={() => handleViewApprovedFiles('Membership Fees Receipts')}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-green-500" />
                      <span>Membership Fees Receipts</span>
                    </div>
                    {getSuperAdminStatusBadge(getSuperAdminUploadStatus('Membership Fees Receipts'))}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Upload membership fee payment receipts and records
                  </p>
                  <p className="text-xs text-green-600 mb-4 italic">
                    💡 Click anywhere on this card to view approved files
                  </p>
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    {/* Upload button hidden for super admin */}
                    {getSuperAdminUploadedFiles('Membership Fees Receipts').length > 0 && (
                      <Button 
                        onClick={() => handleViewFilesClick('Membership Fees Receipts')}
                        variant="outline"
                        className="w-full border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Uploaded Files ({getSuperAdminUploadedFiles('Membership Fees Receipts').length})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Current Year e-Resources Upload */}
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-purple-500 cursor-pointer relative" onClick={() => handleViewApprovedFiles('Current Year e-Resources')}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="h-5 w-5 text-purple-500" />
                      <span>Current Year e-Resources</span>
                    </div>
                    {getSuperAdminStatusBadge(getSuperAdminUploadStatus('Current Year e-Resources'))}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Upload current academic year e-resource access details
                  </p>
                  <p className="text-xs text-purple-600 mb-4 italic">
                    💡 Click anywhere on this card to view approved files
                  </p>
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    {/* Upload button hidden for super admin */}
                    {getSuperAdminUploadedFiles('Current Year e-Resources').length > 0 && (
                      <Button 
                        onClick={() => handleViewFilesClick('Current Year e-Resources')}
                        variant="outline"
                        className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Uploaded Files ({getSuperAdminUploadedFiles('Current Year e-Resources').length})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Access Confirmation Upload */}
              <Card className="hover:shadow-lg transition-shadow border-l-4 border-orange-500 cursor-pointer relative" onClick={() => handleViewApprovedFiles('Access Confirmation')}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-orange-500" />
                      <span>Access Confirmation</span>
                    </div>
                    {getSuperAdminStatusBadge(getSuperAdminUploadStatus('Access Confirmation'))}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Upload access confirmation and verification documents
                  </p>
                  <p className="text-xs text-orange-600 mb-4 italic">
                    💡 Click anywhere on this card to view approved files
                  </p>
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    {/* Upload button hidden for super admin */}
                    {getSuperAdminUploadedFiles('Access Confirmation').length > 0 && (
                      <Button 
                        onClick={() => handleViewFilesClick('Access Confirmation')}
                        variant="outline"
                        className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Uploaded Files ({getSuperAdminUploadedFiles('Access Confirmation').length})
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* E-Resources Access */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    <span>E-Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Access electronic journals, e-books, and digital resources by academic year
                  </p>
                  <Button 
                    onClick={() => navigate('/resources')}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    Browse E-Resources
                  </Button>
                </CardContent>
              </Card>

              {/* User Guides */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    <span>User Guides</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Step-by-step guides for accessing and using consortium resources
                  </p>
                  <Button 
                    onClick={() => navigate('/guide')}
                    className="w-full bg-green-500 hover:bg-green-600"
                  >
                    View Guides
                  </Button>
                </CardContent>
              </Card>

              {/* Downloads */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="h-5 w-5 text-purple-500" />
                    <span>Downloads</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Download circulars, forms, and important documents
                  </p>
                  <Button 
                    onClick={() => window.open('https://drive.google.com/drive/folders/1BmvZhX2bk-5KzGhw1hRY_LOGQ3fqdwP4?usp=sharing', '_blank')}
                    className="w-full bg-purple-500 hover:bg-purple-600"
                  >
                    Access Downloads
                  </Button>
                </CardContent>
              </Card>

              {/* Training Materials */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-orange-500" />
                    <span>Training</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Access training materials and workshop resources
                  </p>
                  <Button 
                    onClick={() => window.open('https://drive.google.com/drive/folders/128yGjX462SkXrmUDWrgEto8Q-9HdAtQ_?usp=sharing', '_blank')}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    View Training
                  </Button>
                </CardContent>
              </Card>

              {/* News & Events */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-red-500" />
                    <span>News & Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Stay updated with latest consortium news and events
                  </p>
                  <Button 
                    onClick={() => navigate('/news')}
                    className="w-full bg-red-500 hover:bg-red-600"
                  >
                    View News
                  </Button>
                </CardContent>
              </Card>

              {/* Member Colleges */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-indigo-500" />
                    <span>Member Colleges</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    View list of consortium member institutions
                  </p>
                  <Button 
                    onClick={() => window.open('https://docs.google.com/spreadsheets/d/16M-0Q4yAtAw_vU_Nxb-3aIQv_UHkdAwJ/edit?usp=sharing&ouid=107772366690337000857&rtpof=true&sd=true', '_blank')}
                    className="w-full bg-indigo-500 hover:bg-indigo-600"
                  >
                    View Colleges
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Resources */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading text-3xl font-bold text-primary">
                  Recent E-Resources
                </h2>
                <Button 
                  onClick={() => navigate('/resources')}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  View All Resources
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.slice(0, 6).map((resource) => (
                  <Card key={resource._id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="font-heading text-lg text-gray-800">
                        E-Resources {resource.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-600">
                        {resource.eJournals && (
                          <p><strong>E-Journals:</strong> {resource.eJournals}</p>
                        )}
                        {resource.eBooks && (
                          <p><strong>E-Books:</strong> {resource.eBooks}</p>
                        )}
                        {resource.plagiarismDetectionSoftware && (
                          <p><strong>Plagiarism Tools:</strong> {resource.plagiarismDetectionSoftware}</p>
                        )}
                      </div>
                      <Button 
                        onClick={() => navigate(`/resources/${resource.title}`)}
                        className="w-full mt-4 bg-primary hover:bg-primary/90"
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
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-[120rem] mx-auto px-6">
            {/* Hide contact information for Global Academy of Technology and Acharya Institute of Technology librarians */}
            {!(tempCollegeUser?.collegeName?.toLowerCase().includes('global academy of technology') || 
               tempCollegeUser?.collegeName?.toLowerCase().includes('acharya institute of technology')) && (
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Contact Information */}
                <div>
                  <h4 className="font-heading text-lg font-semibold mb-4">Contact Us</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="font-paragraph text-gray-300 text-sm font-medium">Address:</p>
                      <p className="font-paragraph text-gray-300 text-sm">
                        Acharya, Acharya Dr. S. Radhakrishnan Road, Acharya P.O Soladevanahalli, Bangalore - 560107, Karnataka, India
                      </p>
                    </div>
                    <div>
                      <p className="font-paragraph text-gray-300 text-sm font-medium">Other Enquiries:</p>
                      <p className="font-paragraph text-gray-300 text-sm">+91 80225-55555</p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Contact */}
                <div>
                  <h4 className="font-heading text-lg font-semibold mb-4">VTU Consortium</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="font-paragraph text-gray-300 text-sm font-medium">Email:</p>
                      <a href="mailto:vtuconsortium@gmail.com" className="font-paragraph text-gray-300 text-sm hover:text-orange-400 transition-colors">
                        vtuconsortium@gmail.com
                      </a>
                    </div>
                    <div>
                      <p className="font-paragraph text-gray-300 text-sm font-medium">Phone:</p>
                      <p className="font-paragraph text-gray-300 text-sm">08312498191</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="border-t border-gray-700 pt-8 text-center">
              <p className="font-paragraph text-gray-400">
                © 2025 VTU Consortium Portal. All Rights Reserved.
              </p>
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

        {/* View Files Modal - No upload modal for super admin */}
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
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="font-heading text-2xl font-bold">
              VTU Consortium
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-orange-200 transition-colors">Home</Link>
              <Link to="/resources" className="hover:text-orange-200 transition-colors">E-Resources</Link>
              <Link to="/journals" className="hover:text-orange-200 transition-colors">ONOS</Link>
              <Link to="/news" className="hover:text-orange-200 transition-colors">Downloads</Link>
              <Link to="/guide" className="hover:text-orange-200 transition-colors">User Guide</Link>
              <span className="text-orange-200 font-semibold">Librarian Corner</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user?.username}</span>
              <Button 
                onClick={logout}
                variant="outline" 
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Page Header with Custom Welcome Message */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center space-y-4">
            <h1 className="font-heading text-5xl font-bold text-primary">
              {getWelcomeMessage()}
            </h1>

            {user?.role === 'librarian' && user?.collegeName && (
              <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-8">
                {user.collegeUrl ? (
                  <a 
                    href={user.collegeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-heading text-2xl font-bold text-primary mb-2 hover:text-secondary transition-colors cursor-pointer block"
                  >
                    {user.collegeName}
                  </a>
                ) : (
                  <h2 className="font-heading text-2xl font-bold text-primary mb-2">
                    {user.collegeName}
                  </h2>
                )}
                {user.librarianName && (
                  <p className="text-gray-600 font-paragraph">
                    Librarian: {user.librarianName} / Nodal Officer
                  </p>
                )}
                
                {/* Location Section for Global Academy of Technology */}
                {user.collegeName?.toLowerCase().includes('global academy of technology') && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-heading text-lg font-semibold text-primary mb-2">Location</h3>
                    <p className="text-gray-700 font-paragraph text-sm">
                      Aditya Layout, Rajarajeshwari Nagar, Bengaluru, Karnataka 560098
                    </p>
                  </div>
                )}
                
                <p className="text-gray-600 font-paragraph mt-2">
                  Access your consortium resources and manage library services
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-[120rem] mx-auto px-6">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="border-l-4 border-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">E-Resources Available</CardTitle>
                  <Database className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{resources.length}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">User Guides</CardTitle>
                  <FileText className="h-4 w-4 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{userGuides.length}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-yellow-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Latest News</CardTitle>
                  <Calendar className="h-4 w-4 text-yellow-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{news.length}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Quick Access</CardTitle>
                  <Users className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">24/7</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Show upload buttons for librarians only */}
            {user?.role === 'librarian' && (
              <>
                {/* Membership Status Upload */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-blue-500 cursor-pointer relative" onClick={() => handleViewApprovedFiles('Membership Status')}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        <span>Membership Status</span>
                      </div>
                      {getStatusBadge(getUploadStatus('Membership Status'))}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Upload your college membership status documents
                    </p>
                    <p className="text-xs text-blue-600 mb-4 italic">
                      💡 Click anywhere on this card to view approved files
                    </p>
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        onClick={() => handleUploadClick('Membership Status')}
                        className="w-full bg-blue-500 hover:bg-blue-600"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                      {getUploadedFiles('Membership Status').length > 0 && (
                        <Button 
                          onClick={() => handleViewFilesClick('Membership Status')}
                          variant="outline"
                          className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Uploaded Files ({getUploadedFiles('Membership Status').length})
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Membership Fees Receipts Upload */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-green-500 cursor-pointer relative" onClick={() => handleViewApprovedFiles('Membership Fees Receipts')}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5 text-green-500" />
                        <span>Membership Fees Receipts</span>
                      </div>
                      {getStatusBadge(getUploadStatus('Membership Fees Receipts'))}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Upload membership fee payment receipts and records
                    </p>
                    <p className="text-xs text-green-600 mb-4 italic">
                      💡 Click anywhere on this card to view approved files
                    </p>
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        onClick={() => handleUploadClick('Membership Fees Receipts')}
                        className="w-full bg-green-500 hover:bg-green-600"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Receipt
                      </Button>
                      {getUploadedFiles('Membership Fees Receipts').length > 0 && (
                        <Button 
                          onClick={() => handleViewFilesClick('Membership Fees Receipts')}
                          variant="outline"
                          className="w-full border-green-500 text-green-600 hover:bg-green-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Uploaded Files ({getUploadedFiles('Membership Fees Receipts').length})
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Current Year e-Resources Upload */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-purple-500 cursor-pointer relative" onClick={() => handleViewApprovedFiles('Current Year e-Resources')}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="h-5 w-5 text-purple-500" />
                        <span>Current Year e-Resources</span>
                      </div>
                      {getStatusBadge(getUploadStatus('Current Year e-Resources'))}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Upload current academic year e-resource access details
                    </p>
                    <p className="text-xs text-purple-600 mb-4 italic">
                      💡 Click anywhere on this card to view approved files
                    </p>
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        onClick={() => handleUploadClick('Current Year e-Resources')}
                        className="w-full bg-purple-500 hover:bg-purple-600"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Resources
                      </Button>
                      {getUploadedFiles('Current Year e-Resources').length > 0 && (
                        <Button 
                          onClick={() => handleViewFilesClick('Current Year e-Resources')}
                          variant="outline"
                          className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Uploaded Files ({getUploadedFiles('Current Year e-Resources').length})
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Access Confirmation Upload */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-orange-500 cursor-pointer relative" onClick={() => handleViewApprovedFiles('Access Confirmation')}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-orange-500" />
                        <span>Access Confirmation</span>
                      </div>
                      {getStatusBadge(getUploadStatus('Access Confirmation'))}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Upload access confirmation and verification documents
                    </p>
                    <p className="text-xs text-orange-600 mb-4 italic">
                      💡 Click anywhere on this card to view approved files
                    </p>
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        onClick={() => handleUploadClick('Access Confirmation')}
                        className="w-full bg-orange-500 hover:bg-orange-600"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Confirmation
                      </Button>
                      {getUploadedFiles('Access Confirmation').length > 0 && (
                        <Button 
                          onClick={() => handleViewFilesClick('Access Confirmation')}
                          variant="outline"
                          className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Uploaded Files ({getUploadedFiles('Access Confirmation').length})
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* E-Resources Access */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  <span>E-Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Access electronic journals, e-books, and digital resources by academic year
                </p>
                <Button 
                  onClick={() => navigate('/resources')}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Browse E-Resources
                </Button>
              </CardContent>
            </Card>

            {/* User Guides */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-500" />
                  <span>User Guides</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Step-by-step guides for accessing and using consortium resources
                </p>
                <Button 
                  onClick={() => navigate('/guide')}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  View Guides
                </Button>
              </CardContent>
            </Card>

            {/* Downloads */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-purple-500" />
                  <span>Downloads</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Download circulars, forms, and important documents
                </p>
                <Button 
                  onClick={() => window.open('https://drive.google.com/drive/folders/1BmvZhX2bk-5KzGhw1hRY_LOGQ3fqdwP4?usp=sharing', '_blank')}
                  className="w-full bg-purple-500 hover:bg-purple-600"
                >
                  Access Downloads
                </Button>
              </CardContent>
            </Card>

            {/* Training Materials */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-orange-500" />
                  <span>Training</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Access training materials and workshop resources
                </p>
                <Button 
                  onClick={() => window.open('https://drive.google.com/drive/folders/128yGjX462SkXrmUDWrgEto8Q-9HdAtQ_?usp=sharing', '_blank')}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  View Training
                </Button>
              </CardContent>
            </Card>

            {/* News & Events */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-red-500" />
                  <span>News & Events</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Stay updated with latest consortium news and events
                </p>
                <Button 
                  onClick={() => navigate('/news')}
                  className="w-full bg-red-500 hover:bg-red-600"
                >
                  View News
                </Button>
              </CardContent>
            </Card>

            {/* Member Colleges */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-indigo-500" />
                  <span>Member Colleges</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  View list of consortium member institutions
                </p>
                <Button 
                  onClick={() => window.open('https://docs.google.com/spreadsheets/d/16M-0Q4yAtAw_vU_Nxb-3aIQv_UHkdAwJ/edit?usp=sharing&ouid=107772366690337000857&rtpof=true&sd=true', '_blank')}
                  className="w-full bg-indigo-500 hover:bg-indigo-600"
                >
                  View Colleges
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Resources */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-3xl font-bold text-primary">
                Recent E-Resources
              </h2>
              <Button 
                onClick={() => navigate('/resources')}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                View All Resources
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.slice(0, 6).map((resource) => (
                <Card key={resource._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-heading text-lg text-gray-800">
                      E-Resources {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-gray-600">
                      {resource.eJournals && (
                        <p><strong>E-Journals:</strong> {resource.eJournals}</p>
                      )}
                      {resource.eBooks && (
                        <p><strong>E-Books:</strong> {resource.eBooks}</p>
                      )}
                      {resource.plagiarismDetectionSoftware && (
                        <p><strong>Plagiarism Tools:</strong> {resource.plagiarismDetectionSoftware}</p>
                      )}
                    </div>
                    <Button 
                      onClick={() => navigate(`/resources/${resource.title}`)}
                      className="w-full mt-4 bg-primary hover:bg-primary/90"
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
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          {/* Hide contact information for Global Academy of Technology and Acharya Institute of Technology librarians */}
          {!(isAuthenticated && user?.role === 'librarian' && 
            (user?.collegeName?.toLowerCase().includes('global academy of technology') || 
             user?.collegeName?.toLowerCase().includes('acharya institute of technology'))) && (
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Contact Information */}
              <div>
                <h4 className="font-heading text-lg font-semibold mb-4">Contact Us</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-paragraph text-gray-300 text-sm font-medium">Address:</p>
                    <p className="font-paragraph text-gray-300 text-sm">
                      Acharya, Acharya Dr. S. Radhakrishnan Road, Acharya P.O Soladevanahalli, Bangalore - 560107, Karnataka, India
                    </p>
                  </div>
                  <div>
                    <p className="font-paragraph text-gray-300 text-sm font-medium">Other Enquiries:</p>
                    <p className="font-paragraph text-gray-300 text-sm">+91 80225-55555</p>
                  </div>
                </div>
              </div>
              
              {/* Additional Contact */}
              <div>
                <h4 className="font-heading text-lg font-semibold mb-4">VTU Consortium</h4>
                <div className="space-y-3">
                  <div>
                    <p className="font-paragraph text-gray-300 text-sm font-medium">Email:</p>
                    <a href="mailto:vtuconsortium@gmail.com" className="font-paragraph text-gray-300 text-sm hover:text-orange-400 transition-colors">
                      vtuconsortium@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="font-paragraph text-gray-300 text-sm font-medium">Phone:</p>
                    <p className="font-paragraph text-gray-300 text-sm">08312498191</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="font-paragraph text-gray-400">
              © 2025 VTU Consortium Portal. All Rights Reserved.
            </p>
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