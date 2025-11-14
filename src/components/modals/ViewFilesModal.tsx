import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaseCrudService } from '@/integrations';
import { LibrarianFileUploads } from '@/entities';
import { useAuth } from '@/components/auth/AuthContext';
import { Download, Calendar, User, FileText, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { useLiveData, useDataUpdater } from '@/hooks/use-live-data';

interface ViewFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadType: string;
  collegeName: string;
}

export default function ViewFilesModal({ isOpen, onClose, uploadType, collegeName }: ViewFilesModalProps) {
  const { user } = useAuth();
  const { triggerUpdate } = useDataUpdater();
  
  // Use live data with optimized polling interval
  const { data: allFiles } = useLiveData<LibrarianFileUploads>('librarianfileuploads', [], 15000); // Poll every 15 seconds (reduced from 3s)
  
  // Filter files in real-time
  const files = allFiles
    .filter(file => file.uploadType === uploadType && file.collegeName === collegeName)
    .sort((a, b) => {
      // Sort by upload date (newest first)
      const dateA = new Date(a.uploadDate || a._createdDate || 0);
      const dateB = new Date(b.uploadDate || b._createdDate || 0);
      return dateB.getTime() - dateA.getTime();
    });

  // Check if user can edit/remove files (only college librarians, not super admin)
  const canEditFiles = user?.role === 'librarian' && user?.collegeName === collegeName;

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

  const handleRemoveFile = async (fileId: string) => {
    if (!canEditFiles) return;
    
    if (!confirm('Are you sure you want to remove this file? This action cannot be undone.')) {
      return;
    }
    
    try {
      await BaseCrudService.delete('librarianfileuploads', fileId);
      // Trigger live data update
      triggerUpdate('librarianfileuploads');
    } catch (error) {
      console.error('Error removing file:', error);
      alert('Error removing file. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Uploaded Files - {uploadType}</span>
            {!canEditFiles && user?.role === 'superadmin' && (
              <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50 ml-2">
                Read Only
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            View all uploaded files for {uploadType} from {collegeName}
            {!canEditFiles && user?.role === 'superadmin' && " (Super Admin view - no edit/remove access)"}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          {files.length === 0 ? (
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
                  onClick={() => window.location.reload()}
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
                        {canEditFiles && (
                          <Button
                            onClick={() => handleRemoveFile(file._id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
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