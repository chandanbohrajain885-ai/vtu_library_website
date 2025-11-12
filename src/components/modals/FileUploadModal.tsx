import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, X } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { LibrarianFileUploads } from '@/entities';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadType: string;
  collegeName: string;
  librarianName: string;
  librarianEmail: string;
  onUploadSuccess: () => void;
}

export default function FileUploadModal({
  isOpen,
  onClose,
  uploadType,
  collegeName,
  librarianName,
  librarianEmail,
  onUploadSuccess
}: FileUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create a mock file URL for demonstration
      // In a real implementation, you would upload to a file storage service
      const mockFileUrl = 'https://static.wixstatic.com/media/e79745_33e7c33521ac4d06b652d715f8bc450a~mv2.png?originWidth=384&originHeight=384';

      // Create the file upload record
      const uploadRecord: LibrarianFileUploads = {
        _id: crypto.randomUUID(),
        fileUrl: mockFileUrl,
        uploadType,
        collegeName,
        librarianName,
        librarianEmail,
        approvalStatus: 'Pending',
        uploadDate: new Date().toISOString(),
        approvalDate: undefined,
        superAdminComments: undefined
      };

      await BaseCrudService.create('librarianfileuploads', uploadRecord);

      // Reset form
      setSelectedFile(null);
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-primary" />
            <span>Upload {uploadType}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* College Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Upload Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>College:</strong> {collegeName}</p>
              <p><strong>Librarian:</strong> {librarianName}</p>
              <p><strong>Category:</strong> {uploadType}</p>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <Label htmlFor="file-upload" className="text-sm font-medium">
              Select File
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="h-8 w-8 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to select a file
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, XLS, or Image files (max 10MB)
                  </p>
                </div>
              </label>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800">{selectedFile.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{uploadError}</p>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Your uploaded file will be reviewed by the Super Admin before being made available on the portal.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1"
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}