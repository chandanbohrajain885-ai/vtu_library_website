import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from './AuthContext';
import { UserPlus, CheckCircle } from 'lucide-react';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const availablePermissions = [
  'view_resources',
  'manage_resources',
  'view_news',
  'manage_news',
  'view_journals',
  'manage_journals',
  'view_guides',
  'manage_guides',
  'view_users',
  'manage_users'
];

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'admin' as 'admin' | 'librarian' | 'publisher',
    requestedPermissions: [] as string[]
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { submitRegistrationRequest, users } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.username || !formData.email) {
      setError('Please fill in all required fields.');
      return;
    }

    // Check if username already exists
    if (users.some(user => user.username === formData.username)) {
      setError('Username already exists. Please choose a different username.');
      return;
    }

    try {
      submitRegistrationRequest(formData);
      setIsSubmitted(true);
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setFormData({
          username: '',
          email: '',
          role: 'admin',
          requestedPermissions: []
        });
        setIsSubmitted(false);
        onClose();
      }, 3000);
    } catch (err) {
      setError('Failed to submit registration request. Please try again.');
    }
  };

  const togglePermission = (permission: string) => {
    const updatedPermissions = formData.requestedPermissions.includes(permission)
      ? formData.requestedPermissions.filter(p => p !== permission)
      : [...formData.requestedPermissions, permission];
    setFormData({ ...formData, requestedPermissions: updatedPermissions });
  };

  const handleClose = () => {
    if (!isSubmitted) {
      setFormData({
        username: '',
        email: '',
        role: 'admin',
        requestedPermissions: []
      });
      setError('');
      onClose();
    }
  };

  if (isSubmitted) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4 py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold text-green-700">Request Submitted!</h2>
            <p className="text-gray-600">
              Your registration request has been submitted successfully. 
              You will be notified once a Super Executive reviews your request.
            </p>
            <div className="text-sm text-gray-500">
              This window will close automatically...
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Registration Request
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter desired username"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Requested Role *</Label>
            <Select value={formData.role} onValueChange={(value: 'admin' | 'librarian' | 'publisher') => setFormData({ ...formData, role: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="librarian">Librarian/Nodal-officer</SelectItem>
                <SelectItem value="publisher">Publisher</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Requested Permissions</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3">
              {availablePermissions.map((permission) => (
                <div key={permission} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission}
                    checked={formData.requestedPermissions.includes(permission)}
                    onCheckedChange={() => togglePermission(permission)}
                  />
                  <Label htmlFor={permission} className="text-sm">
                    {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> Your registration request will be reviewed by a Super Executive. 
              You will be notified of the decision via email.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}