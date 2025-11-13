import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Mail, Key, Shield } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { PasswordChangeRequests, LibrarianAccounts } from '@/entities';

interface ForgetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ForgetPasswordModal({ isOpen, onClose }: ForgetPasswordModalProps) {
  const [step, setStep] = useState<'request' | 'otp' | 'success'>('request');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    otpCode: ''
  });
  const [userType, setUserType] = useState<'superadmin' | 'librarian' | 'publisher' | ''>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestId, setRequestId] = useState<string>('');

  const handleClose = () => {
    onClose();
    setStep('request');
    setFormData({
      username: '',
      email: '',
      newPassword: '',
      confirmPassword: '',
      otpCode: ''
    });
    setUserType('');
    setError('');
    setRequestId('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.newPassword) {
      setError('New password is required');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const hashPassword = (password: string) => {
    // Simple hash function - in production, use proper hashing like bcrypt
    return btoa(password + 'vtu_salt_2025');
  };

  const detectUserType = async (username: string): Promise<'superadmin' | 'librarian' | 'publisher' | null> => {
    // Check if it's a default system user
    const systemUsers = ['superadmin', 'admin', 'librarian', 'publisher'];
    if (systemUsers.includes(username.toLowerCase())) {
      return username.toLowerCase() as 'superadmin' | 'librarian' | 'publisher';
    }

    // Check if it's a librarian account from CMS
    try {
      const { items: librarianAccounts } = await BaseCrudService.getAll<LibrarianAccounts>('librarianaccounts');
      const foundLibrarian = librarianAccounts.find(account => account.username === username);
      if (foundLibrarian) {
        return 'librarian';
      }
    } catch (error) {
      console.error('Error checking librarian accounts:', error);
    }

    return null;
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Detect user type
      const detectedUserType = await detectUserType(formData.username);
      if (!detectedUserType) {
        setError('User not found. Please check your username.');
        setIsLoading(false);
        return;
      }

      setUserType(detectedUserType);

      // For super admin, require email and generate OTP
      if (detectedUserType === 'superadmin') {
        if (!formData.email.trim()) {
          setError('Email is required for super admin password reset');
          setIsLoading(false);
          return;
        }

        const otpCode = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Create password change request with OTP
        const passwordRequest: Omit<PasswordChangeRequests, '_id' | '_createdDate' | '_updatedDate'> = {
          userIdentity: formData.username,
          userType: detectedUserType,
          requestDate: new Date().toISOString(),
          status: 'pending_otp',
          newPasswordHash: hashPassword(formData.newPassword),
          otpCode: otpCode,
          otpExpiry: otpExpiry.toISOString(),
          userEmailForOtp: formData.email,
          adminComments: '',
          collegeName: ''
        };

        const result = await BaseCrudService.create('passwordchangerequests', {
          ...passwordRequest,
          _id: crypto.randomUUID()
        });

        setRequestId(result._id);

        // Simulate sending OTP email (in production, use actual email service)
        console.log(`OTP sent to ${formData.email}: ${otpCode}`);
        alert(`OTP sent to ${formData.email}: ${otpCode} (This is for demo purposes)`);

        setStep('otp');
      } else {
        // For other users, create request for admin approval
        let collegeName = '';
        let userEmail = '';

        if (detectedUserType === 'librarian') {
          try {
            const { items: librarianAccounts } = await BaseCrudService.getAll<LibrarianAccounts>('librarianaccounts');
            const foundLibrarian = librarianAccounts.find(account => account.username === formData.username);
            if (foundLibrarian) {
              collegeName = foundLibrarian.collegeName || '';
              userEmail = foundLibrarian.email || '';
            }
          } catch (error) {
            console.error('Error fetching librarian details:', error);
          }
        }

        const passwordRequest: Omit<PasswordChangeRequests, '_id' | '_createdDate' | '_updatedDate'> = {
          userIdentity: formData.username,
          userType: detectedUserType,
          requestDate: new Date().toISOString(),
          status: 'pending',
          newPasswordHash: hashPassword(formData.newPassword),
          otpCode: '',
          otpExpiry: '',
          userEmailForOtp: userEmail,
          adminComments: '',
          collegeName: collegeName
        };

        await BaseCrudService.create('passwordchangerequests', {
          ...passwordRequest,
          _id: crypto.randomUUID()
        });

        setStep('success');
      }
    } catch (error) {
      console.error('Error submitting password change request:', error);
      setError('Failed to submit password change request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Get the password change request
      const request = await BaseCrudService.getById<PasswordChangeRequests>('passwordchangerequests', requestId);
      
      if (!request) {
        setError('Request not found');
        setIsLoading(false);
        return;
      }

      // Check if OTP is valid and not expired
      const now = new Date();
      const otpExpiry = new Date(request.otpExpiry || '');

      if (now > otpExpiry) {
        setError('OTP has expired. Please request a new password reset.');
        setIsLoading(false);
        return;
      }

      if (request.otpCode !== formData.otpCode) {
        setError('Invalid OTP code');
        setIsLoading(false);
        return;
      }

      // Update request status to approved for super admin
      await BaseCrudService.update('passwordchangerequests', {
        _id: requestId,
        status: 'approved',
        adminComments: 'Auto-approved after OTP verification'
      });

      setStep('success');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center space-x-2">
            <Key className="h-5 w-5 text-primary" />
            <span>Reset Password</span>
          </DialogTitle>
        </DialogHeader>

        {step === 'request' && (
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Required for Super Admin)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
                required
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Password Reset Process:</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Super Admin: Requires OTP verification via email</li>
                    <li>• Other Users: Requires approval from Super Admin</li>
                    <li>• New password will be activated after approval</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Submit Password Reset Request'}
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="text-center space-y-2">
              <Mail className="h-12 w-12 text-primary mx-auto" />
              <h3 className="font-medium">OTP Verification</h3>
              <p className="text-sm text-gray-600">
                We've sent a 6-digit code to {formData.email}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otpCode">Enter OTP Code</Label>
              <Input
                id="otpCode"
                type="text"
                value={formData.otpCode}
                onChange={(e) => setFormData(prev => ({ ...prev, otpCode: e.target.value }))}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setStep('request')}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="font-medium text-lg">Request Submitted Successfully!</h3>
            
            {userType === 'superadmin' ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Your password has been updated and is now active.
                </p>
                <p className="text-xs text-green-600 font-medium">
                  You can now login with your new password.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Your password change request has been submitted for approval.
                </p>
                <p className="text-xs text-blue-600 font-medium">
                  You will be notified once the Super Admin approves your request.
                </p>
              </div>
            )}

            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}