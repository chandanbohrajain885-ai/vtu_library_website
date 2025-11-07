import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { LiveCrudService } from '@/hooks/use-live-data';
import { EResources } from '@/entities';
import { Plus, X } from 'lucide-react';

interface AddEResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddEResourceModal({ isOpen, onClose }: AddEResourceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    eJournals: '',
    eBooks: '',
    plagiarismDetectionSoftware: '',
    languageLabsAndElearning: '',
    resourceList: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const eResource: Omit<EResources, '_id' | '_createdDate' | '_updatedDate'> = {
        title: formData.title,
        eJournals: formData.eJournals || undefined,
        eBooks: formData.eBooks || undefined,
        plagiarismDetectionSoftware: formData.plagiarismDetectionSoftware || undefined,
        languageLabsAndElearning: formData.languageLabsAndElearning || undefined,
        resourceList: formData.resourceList || undefined
      };

      await LiveCrudService.create('E-Resources', {
        ...eResource,
        _id: crypto.randomUUID()
      });

      // Reset form
      setFormData({
        title: '',
        eJournals: '',
        eBooks: '',
        plagiarismDetectionSoftware: '',
        languageLabsAndElearning: '',
        resourceList: ''
      });

      onClose();
    } catch (error) {
      console.error('Error creating E-Resource:', error);
      alert('Failed to create E-Resource. Please try again.');
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
            <span>Add E-Resource</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-sm font-medium">
                Academic Year / Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., 2025-26"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="eJournals" className="text-sm font-medium">
                E-Journals
              </Label>
              <Textarea
                id="eJournals"
                value={formData.eJournals}
                onChange={(e) => setFormData({ ...formData, eJournals: e.target.value })}
                placeholder="List of e-journals, publishers, and access details..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="eBooks" className="text-sm font-medium">
                E-Books
              </Label>
              <Textarea
                id="eBooks"
                value={formData.eBooks}
                onChange={(e) => setFormData({ ...formData, eBooks: e.target.value })}
                placeholder="List of e-books, publishers, and access details..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="plagiarismDetectionSoftware" className="text-sm font-medium">
                Plagiarism Detection Software
              </Label>
              <Textarea
                id="plagiarismDetectionSoftware"
                value={formData.plagiarismDetectionSoftware}
                onChange={(e) => setFormData({ ...formData, plagiarismDetectionSoftware: e.target.value })}
                placeholder="Turnitin, Drillbit, NetAnalytiks LANQUILL, etc..."
                rows={2}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="languageLabsAndElearning" className="text-sm font-medium">
                Language Labs & E-Learning
              </Label>
              <Textarea
                id="languageLabsAndElearning"
                value={formData.languageLabsAndElearning}
                onChange={(e) => setFormData({ ...formData, languageLabsAndElearning: e.target.value })}
                placeholder="Language learning platforms, communication labs, etc..."
                rows={2}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="resourceList" className="text-sm font-medium">
                Additional Resource List
              </Label>
              <Textarea
                id="resourceList"
                value={formData.resourceList}
                onChange={(e) => setFormData({ ...formData, resourceList: e.target.value })}
                placeholder="Any additional resources, databases, or tools..."
                rows={2}
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
              disabled={isSubmitting || !formData.title}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Create E-Resource'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}