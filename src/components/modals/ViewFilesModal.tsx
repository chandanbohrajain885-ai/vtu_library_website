import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseCrudService } from '@/integrations';
import { LibrarianFileUploads } from '@/entities';
import { Download, Calendar, User, FileText, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ViewFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadType: string;
  collegeName: string;
}

export default function ViewFilesModal({ isOpen, onClose, uploadType, collegeName }: ViewFilesModalProps) {
  const [files, setFiles] = useState<LibrarianFileUploads[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && uploadType && collegeName) {
      fetchFiles();
    }
  }, [isOpen, uploadType, collegeName]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const { items } = await BaseCrudService.getAll<LibrarianFileUploads>('librarianfileuploads');
      console.log('ViewFilesModal - All items:', items);
      console.log('ViewFilesModal - Filter criteria:', { uploadType, collegeName });
      
      const filteredFiles = items.filter(
        file => file.uploadType === uploadType && file.collegeName === collegeName
      );
      console.log('ViewFilesModal - Filtered files:', filteredFiles);
      
      // Sort by upload date (newest first)
      filteredFiles.sort((a, b) => {
        const dateA = new Date(a.uploadDate || a._createdDate || 0);
        const dateB = new Date(b.uploadDate || b._createdDate || 0);
        return dateB.getTime() - dateA.getTime();
      });
      setFiles(filteredFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Pending':
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    switch (status) {
      case 'Approved':
        return <Badge variant="outline" className="text-green-600 border-green-600">Approved</Badge>;
      case 'Rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600">Rejected</Badge>;
      case 'Pending':
      default:
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pending Review</Badge>;
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Uploaded Files - {uploadType}</span>
          </DialogTitle>
          <DialogDescription>
            View all uploaded files for {uploadType} from {collegeName}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading files...</div>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded</h3>
              <p className="text-gray-500">No files have been uploaded for this category yet.</p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-left">
                <p className="text-sm text-gray-600">
                  <strong>Debug Info:</strong><br />
                  Upload Type: {uploadType}<br />
                  College Name: {collegeName}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {files.length} file{files.length !== 1 ? 's' : ''} found
                </h3>
                <Button
                  onClick={fetchFiles}
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  Refresh
                </Button>
              </div>

              {files.map((file, index) => (
                <Card key={file._id || index} className="border-l-4 border-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center space-x-2">
                        {getStatusIcon(file.approvalStatus)}
                        <span>File #{files.length - index}</span>
                      </CardTitle>
                      {getStatusBadge(file.approvalStatus)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Upload Date:</span>
                          <span>{formatDate(file.uploadDate || file._createdDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">Uploaded by:</span>
                          <span>{file.librarianName || 'N/A'}</span>
                        </div>
                        {file.approvalDate && (
                          <div className="flex items-center space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">Review Date:</span>
                            <span>{formatDate(file.approvalDate)}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="font-medium">Status:</span>
                          <span className="capitalize">{file.approvalStatus || 'Pending'}</span>
                        </div>
                        {file.superAdminComments && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <AlertCircle className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">Admin Comments:</span>
                            </div>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {file.superAdminComments}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="text-sm text-gray-500">
                        File ID: {file._id}
                      </div>
                      <div className="flex space-x-2">
                        {file.fileUrl && (
                          <>
                            <Button
                              onClick={() => handleDownload(file.fileUrl, `${uploadType}_${index + 1}`)}
                              size="sm"
                              variant="outline"
                              className="text-blue-600 border-blue-600 hover:bg-blue-50"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button
                              onClick={() => window.open(file.fileUrl, '_blank')}
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}