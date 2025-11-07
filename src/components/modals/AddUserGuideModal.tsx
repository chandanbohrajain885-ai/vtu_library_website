import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LiveCrudService } from '@/hooks/use-live-data';
import { UserGuideArticles } from '@/entities';
import { Plus, X } from 'lucide-react';

interface AddUserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddUserGuideModal({ isOpen, onClose }: AddUserGuideModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    author: '',
    slug: '',
    featuredImage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData({ 
      ...formData, 
      title,
      slug: generateSlug(title)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userGuide: Omit<UserGuideArticles, '_id' | '_createdDate' | '_updatedDate'> = {
        title: formData.title,
        content: formData.content,
        category: formData.category || 'General',
        author: formData.author || 'VTU Consortium',
        slug: formData.slug,
        featuredImage: formData.featuredImage || undefined,
        lastUpdated: new Date()
      };

      await LiveCrudService.create('userguidearticles', {
        ...userGuide,
        _id: crypto.randomUUID()
      });

      // Reset form
      setFormData({
        title: '',
        content: '',
        category: '',
        author: '',
        slug: '',
        featuredImage: ''
      });

      onClose();
    } catch (error) {
      console.error('Error creating user guide:', error);
      alert('Failed to create user guide. Please try again.');
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5 text-green-600" />
            <span>Add User Guide</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Guide Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter guide title..."
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="slug" className="text-sm font-medium">
                URL Slug *
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-friendly-slug"
                required
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-generated from title. Used for navigation links.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Getting Started, E-Resources, Access"
                  className="mt-1"
                />
              </div>

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
            </div>

            <div>
              <Label htmlFor="content" className="text-sm font-medium">
                Guide Content *
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter detailed instructions and guide content..."
                required
                rows={8}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="featuredImage" className="text-sm font-medium">
                Featured Image URL (Optional)
              </Label>
              <Input
                id="featuredImage"
                type="url"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="mt-1"
              />
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
              {isSubmitting ? 'Creating...' : 'Create Guide'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}