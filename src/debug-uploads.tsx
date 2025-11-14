import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LibrarianFileUploads, PasswordChangeRequests } from '@/entities';
import { useLiveData } from '@/hooks/use-live-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DebugUploads() {
  const [uploads, setUploads] = useState<LibrarianFileUploads[]>([]);
  const [passwordRequests, setPasswordRequests] = useState<PasswordChangeRequests[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Use live data hooks with optimized polling intervals
  const { 
    data: liveUploads, 
    isLoading: liveUploadsLoading, 
    error: liveUploadsError,
    lastUpdated: liveUploadsLastUpdated 
  } = useLiveData<LibrarianFileUploads>('librarianfileuploads', [], 30000); // Poll every 30 seconds (reduced from 5s)

  const { 
    data: livePasswordRequests, 
    isLoading: livePasswordLoading, 
    error: livePasswordError 
  } = useLiveData<PasswordChangeRequests>('passwordchangerequests', [], 60000); // Poll every 60 seconds (reduced from 10s)

  const fetchDirectData = async () => {
    try {
      setLoading(true);
      const [uploadsResponse, passwordResponse] = await Promise.all([
        BaseCrudService.getAll<LibrarianFileUploads>('librarianfileuploads'),
        BaseCrudService.getAll<PasswordChangeRequests>('passwordchangerequests')
      ]);
      
      setUploads(uploadsResponse.items);
      setPasswordRequests(passwordResponse.items);
      setLastRefresh(new Date());
      
      console.log('Direct fetch - All uploads:', uploadsResponse.items);
      console.log('Direct fetch - Total uploads:', uploadsResponse.items.length);
      
      // Group by college and upload type
      const grouped = uploadsResponse.items.reduce((acc, upload) => {
        const key = `${upload.collegeName} - ${upload.uploadType}`;
        if (!acc[key]) acc[key] = [];
        acc[key].push(upload);
        return acc;
      }, {} as Record<string, LibrarianFileUploads[]>);
      
      console.log('Direct fetch - Grouped uploads:', grouped);
      
      // Check for approved files
      const approvedFiles = uploadsResponse.items.filter(item => item.approvalStatus === 'Approved');
      const pendingFiles = uploadsResponse.items.filter(item => item.approvalStatus === 'Pending');
      const rejectedFiles = uploadsResponse.items.filter(item => item.approvalStatus === 'Rejected');
      
      console.log('Direct fetch - Approved files:', approvedFiles);
      console.log('Direct fetch - Pending files:', pendingFiles);
      console.log('Direct fetch - Rejected files:', rejectedFiles);
      
      // Check for specific upload types
      const uploadTypes = [...new Set(uploadsResponse.items.map(item => item.uploadType))];
      console.log('Direct fetch - Upload types found:', uploadTypes);
      
      // Check for specific colleges
      const colleges = [...new Set(uploadsResponse.items.map(item => item.collegeName))];
      console.log('Direct fetch - Colleges found:', colleges);

      // Password requests analysis
      const pendingPasswordRequests = passwordResponse.items.filter(r => r.status === 'pending');
      console.log('Direct fetch - Password requests:', passwordResponse.items);
      console.log('Direct fetch - Pending password requests:', pendingPasswordRequests);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectData();
  }, []);

  // Compare live data vs direct fetch
  const dataComparison = {
    directUploads: uploads.length,
    liveUploads: liveUploads.length,
    directPasswordRequests: passwordRequests.length,
    livePasswordRequests: livePasswordRequests.length,
    uploadsDiff: uploads.length - liveUploads.length,
    passwordDiff: passwordRequests.length - livePasswordRequests.length
  };

  if (loading && liveUploadsLoading) return <div className="p-8">Loading debug info...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Debug: System Data Analysis</h1>
          <Button onClick={fetchDirectData} variant="outline">
            Refresh Direct Data
          </Button>
        </div>

        {/* Data Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Data Source Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dataComparison.directUploads}</div>
                <div className="text-sm text-gray-500">Direct Fetch Uploads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dataComparison.liveUploads}</div>
                <div className="text-sm text-gray-500">Live Data Uploads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{dataComparison.directPasswordRequests}</div>
                <div className="text-sm text-gray-500">Direct Password Requests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{dataComparison.livePasswordRequests}</div>
                <div className="text-sm text-gray-500">Live Password Requests</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <div className="text-sm space-y-1">
                <div>Last Direct Refresh: {lastRefresh.toLocaleString()}</div>
                <div>Last Live Update: {liveUploadsLastUpdated.toLocaleString()}</div>
                <div>Live Uploads Loading: {liveUploadsLoading ? 'Yes' : 'No'}</div>
                <div>Live Password Loading: {livePasswordLoading ? 'Yes' : 'No'}</div>
                {liveUploadsError && <div className="text-red-600">Live Uploads Error: {liveUploadsError}</div>}
                {livePasswordError && <div className="text-red-600">Live Password Error: {livePasswordError}</div>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {uploads.filter(u => u.approvalStatus === 'Pending').length}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {uploads.filter(u => u.approvalStatus === 'Approved').length}
                </div>
                <div className="text-sm text-gray-500">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {uploads.filter(u => u.approvalStatus === 'Rejected').length}
                </div>
                <div className="text-sm text-gray-500">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Types and Colleges */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Types Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...new Set(uploads.map(u => u.uploadType))].map(type => (
                  <div key={type} className="flex justify-between items-center">
                    <span>{type}</span>
                    <Badge variant="outline">
                      {uploads.filter(u => u.uploadType === type).length}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Colleges Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...new Set(uploads.map(u => u.collegeName))].map(college => (
                  <div key={college} className="flex justify-between items-center">
                    <span className="text-sm">{college}</span>
                    <Badge variant="outline">
                      {uploads.filter(u => u.collegeName === college).length}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Upload List */}
        <Card>
          <CardHeader>
            <CardTitle>All Uploads (Direct Fetch)</CardTitle>
          </CardHeader>
          <CardContent>
            {uploads.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No uploads found in the database.</p>
            ) : (
              <div className="space-y-4">
                {uploads
                  .sort((a, b) => {
                    const dateA = new Date(a.uploadDate || a._createdDate || 0);
                    const dateB = new Date(b.uploadDate || b._createdDate || 0);
                    return dateB.getTime() - dateA.getTime();
                  })
                  .map((upload, index) => (
                    <div key={upload._id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Upload #{uploads.length - index}</h4>
                        <Badge 
                          variant="outline"
                          className={
                            upload.approvalStatus === 'Approved' ? 'text-green-600 border-green-600' :
                            upload.approvalStatus === 'Rejected' ? 'text-red-600 border-red-600' :
                            upload.approvalStatus === 'Pending' ? 'text-yellow-600 border-yellow-600' :
                            'text-gray-600 border-gray-600'
                          }
                        >
                          {upload.approvalStatus || 'Unknown'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">ID:</span> {upload._id}
                        </div>
                        <div>
                          <span className="font-medium">College:</span> {upload.collegeName || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {upload.uploadType || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Librarian:</span> {upload.librarianName || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {upload.librarianEmail || 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Upload Date:</span> {upload.uploadDate ? new Date(upload.uploadDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Approval Date:</span> {upload.approvalDate ? new Date(upload.approvalDate).toLocaleDateString() : 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {upload._createdDate ? new Date(upload._createdDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      {upload.fileUrl && (
                        <div className="mt-2">
                          <a 
                            href={upload.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            View File
                          </a>
                        </div>
                      )}
                      {upload.superAdminComments && (
                        <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                          <span className="font-medium">Comments:</span> {upload.superAdminComments}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Password Change Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Password Change Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {passwordRequests.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No password change requests found.</p>
            ) : (
              <div className="space-y-4">
                {passwordRequests.map((request, index) => (
                  <div key={request._id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Request #{index + 1}</h4>
                      <Badge variant="outline">
                        {request.status || 'Unknown'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">User:</span> {request.userIdentity || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Type:</span> {request.userType || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">College:</span> {request.collegeName || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Request Date:</span> {request.requestDate ? new Date(request.requestDate).toLocaleDateString() : 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {request.userEmailForOtp || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> {request.status || 'N/A'}
                      </div>
                    </div>
                    {request.adminComments && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                        <span className="font-medium">Admin Comments:</span> {request.adminComments}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}