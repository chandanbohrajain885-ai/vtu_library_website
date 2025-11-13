import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BaseCrudService } from '@/integrations';
import { LibrarianFileUploads } from '@/entities';
import { useAuth } from '@/components/auth/AuthContext';
import { ArrowLeft, Download, Calendar, User, FileText, ExternalLink, CheckCircle, LogOut, Eye } from 'lucide-react';
import { useLiveData } from '@/hooks/use-live-data';

export default function ApprovedFilesPage() {
  const { uploadType } = useParams<{ uploadType: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Use live data for real-time updates
  const { data: allFiles, isLoading: loading } = useLiveData<LibrarianFileUploads>('librarianfileuploads', [], 5000); // Poll every 5 seconds

  // Get college name from URL params or user data
  const urlParams = new URLSearchParams(window.location.search);
  const collegeFromUrl = urlParams.get('college');
  const targetCollege = collegeFromUrl || user?.collegeName;
  const isViewingOtherCollege = user?.role === 'superadmin' && collegeFromUrl;

  // Filter approved files in real-time
  const files = allFiles.filter(
    file => 
      file.uploadType === decodeURIComponent(uploadType || '') && 
      file.collegeName === targetCollege &&
      file.approvalStatus === 'Approved'
  ).sort((a, b) => {
    // Sort by approval date (newest first)
    const dateA = new Date(a.approvalDate || a._createdDate || 0);
    const dateB = new Date(b.approvalDate || b._createdDate || 0);
    return dateB.getTime() - dateA.getTime();
  });

  // Check if user is authorized (librarian or superadmin)
  const isAuthorized = isAuthenticated && (user?.role === 'librarian' || user?.role === 'superadmin');

  useEffect(() => {
    if (!isAuthorized) {
      navigate('/');
      return;
    }

    if (!uploadType || !targetCollege) {
      navigate('/librarian');
      return;
    }
  }, [isAuthorized, uploadType, targetCollege, navigate]);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (fileUrl: string | undefined, fileName?: string) => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isAuthorized) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gray-800 font-heading text-xl">Loading approved files...</div>
      </div>
    );
  }

  const decodedUploadType = uploadType ? decodeURIComponent(uploadType) : '';

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
              <Link to="/librarian" className="hover:text-orange-200 transition-colors">Librarian Corner</Link>
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
          <div className="flex items-center space-x-4 mb-6">
            <Button
              onClick={() => navigate('/librarian')}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Librarian Corner
            </Button>
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="font-heading text-5xl font-bold text-primary">
              Approved Files
            </h1>
            <h2 className="font-heading text-2xl font-semibold text-gray-700">
              {decodedUploadType}
            </h2>
            <p className="font-paragraph text-gray-600 max-w-2xl mx-auto">
              {isViewingOtherCollege 
                ? `View all approved files for ${decodedUploadType} from ${targetCollege} (Read-only)`
                : `View all approved files for ${decodedUploadType} from ${targetCollege}`
              }
            </p>
            {isViewingOtherCollege && (
              <div className="mt-4">
                <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">
                  <Eye className="h-3 w-3 mr-1" />
                  Super Admin View - Read Only
                </Badge>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-[120rem] mx-auto px-6">
          {files.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="font-heading text-2xl font-bold text-gray-900 mb-4">
                No Approved Files
              </h3>
              <p className="font-paragraph text-gray-600 mb-8 max-w-md mx-auto">
                There are no approved files for {decodedUploadType} from {targetCollege} yet. 
                {!isViewingOtherCollege && 
                  " Files need to be uploaded and approved by the Super Admin before they appear here."
                }
              </p>
              <Button
                onClick={() => navigate('/librarian')}
                className="bg-primary hover:bg-primary/90"
              >
                Return to Librarian Corner
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Files Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-gray-900">
                    {files.length} Approved File{files.length !== 1 ? 's' : ''}
                  </h3>
                  <p className="font-paragraph text-gray-600 mt-2">
                    {isViewingOtherCollege 
                      ? `All files from ${targetCollege} have been reviewed and approved by the Super Admin`
                      : "All files have been reviewed and approved by the Super Admin"
                    }
                  </p>
                </div>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Refresh
                </Button>
              </div>

              {/* Files Grid */}
              <div className="grid gap-6">
                {files.map((file, index) => (
                  <Card key={file._id} className="border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="font-heading text-xl flex items-center space-x-3">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                          <span>File #{files.length - index}</span>
                        </CardTitle>
                        <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                          Approved
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* File Information */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <div>
                              <span className="font-paragraph font-medium text-gray-700">Upload Date:</span>
                              <p className="font-paragraph text-gray-600">
                                {formatDate(file.uploadDate || file._createdDate)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <User className="h-5 w-5 text-gray-500" />
                            <div>
                              <span className="font-paragraph font-medium text-gray-700">Uploaded by:</span>
                              <p className="font-paragraph text-gray-600">
                                {file.librarianName || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-gray-500" />
                            <div>
                              <span className="font-paragraph font-medium text-gray-700">Approved Date:</span>
                              <p className="font-paragraph text-gray-600">
                                {formatDate(file.approvalDate)}
                              </p>
                            </div>
                          </div>
                          {file.superAdminComments && (
                            <div className="space-y-2">
                              <span className="font-paragraph font-medium text-gray-700">Admin Comments:</span>
                              <p className="font-paragraph text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {file.superAdminComments}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="font-paragraph text-sm text-gray-500">
                          File ID: {file._id}
                        </div>
                        <div className="flex space-x-3">
                          {file.fileUrl && (
                            <>
                              <Button
                                onClick={() => handleDownload(file.fileUrl, `${decodedUploadType}_${index + 1}`)}
                                variant="outline"
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                              <Button
                                onClick={() => window.open(file.fileUrl, '_blank')}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View File
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
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
    </div>
  );
}