import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { LiveCrudService } from '@/hooks/use-live-data';
import { BaseCrudService } from '@/integrations';
import { NewsandEvents } from '@/entities';
import { Edit, X, Trash2 } from 'lucide-react';

interface EditNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsId: string | null;
}

export function EditNewsModal({ isOpen, onClose, newsId }: EditNewsModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    externalLink: '',
    isFeatured: false,
    publicationDate: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && newsId) {
      loadNewsItem();
    }
  }, [isOpen, newsId]);

  const loadNewsItem = async () => {
    if (!newsId) return;
    
    setIsLoading(true);
    try {
      const newsItem = await BaseCrudService.getById<NewsandEvents>('newsandnotifications', newsId);
      if (newsItem) {
        setFormData({
          title: newsItem.title || '',
          content: newsItem.content || '',
          author: newsItem.author || '',
          externalLink: newsItem.externalLink || '',
          isFeatured: newsItem.isFeatured || false,
          publicationDate: newsItem.publicationDate 
            ? new Date(newsItem.publicationDate).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      console.error('Error loading news item:', error);
      alert('Failed to load news item.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsId) return;

    setIsSubmitting(true);
    try {
      await LiveCrudService.update('newsandnotifications', {
        _id: newsId,
        title: formData.title,
        content: formData.content,
        author: formData.author || 'VTU Consortium',
        externalLink: formData.externalLink || undefined,
        isFeatured: formData.isFeatured,
        publicationDate: new Date(formData.publicationDate)
      });

      onClose();
    } catch (error) {
      console.error('Error updating news item:', error);
      alert('Failed to update news item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!newsId) return;
    
    if (!confirm('Are you sure you want to delete this news item? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await LiveCrudService.delete('newsandnotifications', newsId);
      onClose();
    } catch (error) {
      console.error('Error deleting news item:', error);
      alert('Failed to delete news item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && !isDeleting) {
      onClose();
    }
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-600">Loading news item...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5 text-blue-600" />
            <span>Edit News & Event</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter news title..."
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="content" className="text-sm font-medium">
                Content *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter news content or venue details..."
                required
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author" className="text-sm font-medium">
                  Author
                </Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="VTU Consortium"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="publicationDate" className="text-sm font-medium">
                  Publication Date *
                </Label>
                <Input
                  id="publicationDate"
                  type="date"
                  value={formData.publicationDate}
                  onChange={(e) => setFormData({ ...formData, publicationDate: e.target.value })}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="externalLink" className="text-sm font-medium">
                External Link (Optional)
              </Label>
              <Input
                id="externalLink"
                type="url"
                value={formData.externalLink}
                onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
              />
              <Label htmlFor="isFeatured" className="text-sm font-medium">
                Featured News
              </Label>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting || isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting || isDeleting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isDeleting || !formData.title || !formData.content}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Updating...' : 'Update News'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}