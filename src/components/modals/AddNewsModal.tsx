import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BaseCrudService } from '@/integrations';
import { NewsandEvents } from '@/entities';
import { Plus, X } from 'lucide-react';

interface AddNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddNewsModal({ isOpen, onClose, onSuccess }: AddNewsModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    venue: '',
    author: '',
    externalLink: '',
    isFeatured: false,
    publicationDate: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newsItem: Omit<NewsandEvents, '_id' | '_createdDate' | '_updatedDate'> = {
        title: formData.title,
        content: formData.content,
        venue: formData.venue || undefined,
        author: formData.author || 'VTU Consortium',
        externalLink: formData.externalLink || undefined,
        isFeatured: formData.isFeatured,
        publicationDate: new Date(formData.publicationDate)
      };

      await BaseCrudService.create('newsandnotifications', {
        ...newsItem,
        _id: crypto.randomUUID()
      });

      // Reset form
      setFormData({
        title: '',
        content: '',
        venue: '',
        author: '',
        externalLink: '',
        isFeatured: false,
        publicationDate: new Date().toISOString().split('T')[0]
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating news item:', error);
      alert('Failed to create news item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-green-600" />
            <span>Add News & Event</span>
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
                placeholder="Enter news content..."
                required
                rows={4}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="venue" className="text-sm font-medium">
                Venue
              </Label>
              <Input
                id="venue"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Enter venue details..."
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

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.content}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create News'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}