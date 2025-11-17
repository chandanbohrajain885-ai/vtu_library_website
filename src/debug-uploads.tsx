import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LibrarianFileUploads } from '@/entities';

export default function DebugUploads() {
  const [uploads, setUploads] = useState<LibrarianFileUploads[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const { items } = await BaseCrudService.getAll<LibrarianFileUploads>('librarianfileuploads');
        setUploads(items);
        console.log('All uploads:', items);
        console.log('Total uploads:', items.length);
        
        // Group by college and upload type
        const grouped = items.reduce((acc, upload) => {
          const key = `${upload.collegeName} - ${upload.uploadType}`;
          if (!acc[key]) acc[key] = [];
          acc[key].push(upload);
          return acc;
        }, {} as Record<string, LibrarianFileUploads[]>);
        
        console.log('Grouped uploads:', grouped);
        
        // Check for approved files
        const approvedFiles = items.filter(item => item.approvalStatus === 'Approved');
        console.log('Approved files:', approvedFiles);
        console.log('Approved files count:', approvedFiles.length);
        
        // Check for specific upload types
        const uploadTypes = [...new Set(items.map(item => item.uploadType))];
        console.log('Upload types found:', uploadTypes);
        
        // Check for specific colleges
        const colleges = [...new Set(items.map(item => item.collegeName))];
        console.log('Colleges found:', colleges);
      } catch (error) {
        console.error('Error fetching uploads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, []);

  if (loading) return <div>Loading debug info...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Debug: Librarian File Uploads</h2>
      <p>Total uploads: {uploads.length}</p>
      
      {uploads.length === 0 ? (
        <p>No uploads found in the database.</p>
      ) : (
        <div>
          {uploads.map((upload, index) => (
            <div key={upload._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
              <h4>Upload #{index + 1}</h4>
              <p><strong>ID:</strong> {upload._id}</p>
              <p><strong>College Name:</strong> {upload.collegeName || 'N/A'}</p>
              <p><strong>Upload Type:</strong> {upload.uploadType || 'N/A'}</p>
              <p><strong>Librarian Name:</strong> {upload.librarianName || 'N/A'}</p>
              <p><strong>Librarian Email:</strong> {upload.librarianEmail || 'N/A'}</p>
              <p><strong>Approval Status:</strong> <span style={{color: upload.approvalStatus === 'Approved' ? 'green' : upload.approvalStatus === 'Rejected' ? 'red' : 'orange'}}>{upload.approvalStatus || 'N/A'}</span></p>
              <p><strong>Upload Date:</strong> {upload.uploadDate ? new Date(upload.uploadDate).toLocaleString() : 'N/A'}</p>
              <p><strong>Approval Date:</strong> {upload.approvalDate ? new Date(upload.approvalDate).toLocaleString() : 'N/A'}</p>
              <p><strong>File URL:</strong> {upload.fileUrl ? <a href={upload.fileUrl} target="_blank" rel="noopener noreferrer">View File</a> : 'N/A'}</p>
              <p><strong>Comments:</strong> {upload.superAdminComments || 'N/A'}</p>
              <p><strong>Created Date:</strong> {upload._createdDate ? new Date(upload._createdDate).toLocaleString() : 'N/A'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}