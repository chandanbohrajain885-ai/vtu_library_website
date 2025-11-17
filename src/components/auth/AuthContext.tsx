import React, { createContext, useContext, useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LibrarianAccounts, PasswordChangeRequests } from '@/entities';

export interface User {
  id: string;
  username: string;
  role: 'superadmin' | 'admin' | 'librarian' | 'publisher';
  permissions: string[];
  createdBy?: string;
  createdAt?: Date;
  collegeName?: string; // Added for librarian accounts
  librarianName?: string; // Added for librarian accounts
  collegeUrl?: string; // Added for college website URL
  email?: string; // Added for librarian accounts
}

export interface RegistrationRequest {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'librarian' | 'publisher';
  requestedPermissions: string[];
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, isLibrarianCornerLogin?: boolean) => Promise<boolean>;
  logout: () => void;
  users: User[];
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUserPermissions: (userId: string, permissions: string[]) => void;
  deleteUser: (userId: string) => void;
  registrationRequests: RegistrationRequest[];
  submitRegistrationRequest: (request: Omit<RegistrationRequest, 'id' | 'requestDate' | 'status'>) => void;
  approveRegistrationRequest: (requestId: string) => void;
  rejectRegistrationRequest: (requestId: string, reason?: string) => void;
  approvePasswordChangeRequest: (requestId: string, adminComments?: string) => Promise<void>;
  rejectPasswordChangeRequest: (requestId: string, adminComments?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users
const defaultUsers: User[] = [
  {
    id: '1',
    username: 'superadmin',
    role: 'superadmin',
    permissions: ['all'],
    createdAt: new Date(),
    email: 'superadmin@vtuconsortium.edu.in' // Default email for super admin
  },
  {
    id: '2',
    username: 'admin',
    role: 'admin',
    permissions: [],
    createdBy: 'superadmin',
    createdAt: new Date()
  },
  {
    id: '3',
    username: 'librarian',
    role: 'librarian',
    permissions: [],
    createdBy: 'superadmin',
    createdAt: new Date()
  },
  {
    id: '4',
    username: 'publisher',
    role: 'publisher',
    permissions: [],
    createdBy: 'superadmin',
    createdAt: new Date()
  }
];

const defaultPasswords: Record<string, string> = {
  'superadmin': 'superadmin',
  'admin': 'admin',
  'librarian': 'librarian',
  'publisher': 'publisher'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
  const [userPasswords, setUserPasswords] = useState<Record<string, string>>(defaultPasswords);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('vtu_auth_user');
    const storedUsers = localStorage.getItem('vtu_auth_users');
    const storedRequests = localStorage.getItem('vtu_registration_requests');
    const storedPasswords = localStorage.getItem('vtu_user_passwords');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    if (storedRequests) {
      setRegistrationRequests(JSON.parse(storedRequests));
    }
    
    if (storedPasswords) {
      setUserPasswords(JSON.parse(storedPasswords));
    }
  }, []);

  const login = async (username: string, password: string, isLibrarianCornerLogin: boolean = false): Promise<boolean> => {
    // Check for approved password change requests first
    try {
      const { items: passwordRequests } = await BaseCrudService.getAll<PasswordChangeRequests>('passwordchangerequests');
      const approvedRequest = passwordRequests.find(
        req => req.userIdentity === username && req.status === 'approved'
      );
      
      if (approvedRequest && approvedRequest.newPasswordHash) {
        // Use the new password for authentication
        const hashedInputPassword = btoa(password + 'vtu_salt_2025');
        if (hashedInputPassword === approvedRequest.newPasswordHash) {
          // Update the stored password and mark request as completed
          const updatedPasswords = { ...userPasswords, [username]: password };
          setUserPasswords(updatedPasswords);
          localStorage.setItem('vtu_user_passwords', JSON.stringify(updatedPasswords));
          
          // Mark the request as completed
          await BaseCrudService.update('passwordchangerequests', {
            _id: approvedRequest._id,
            status: 'completed'
          });
        }
      }
    } catch (error) {
      console.error('Error checking password change requests:', error);
    }

    // First check if it's a default user (superadmin, admin, etc.)
    const foundDefaultUser = users.find(u => u.username === username);
    if (foundDefaultUser && userPasswords[username] === password) {
      setUser(foundDefaultUser);
      localStorage.setItem('vtu_auth_user', JSON.stringify(foundDefaultUser));
      return true;
    }
    
    // Check if it's a librarian account from CMS
    try {
      const { items: librarianAccounts } = await BaseCrudService.getAll<LibrarianAccounts>('librarianaccounts');
      const foundLibrarian = librarianAccounts.find(
        account => account.username === username && account.password === password
      );
      
      if (foundLibrarian) {
        // Restrict specific librarian accounts to only Librarian Corner login
        const restrictedColleges = [
          'acharya institute of technology',
          'global academy of technology'
        ];
        
        const isRestrictedAccount = restrictedColleges.some(college => 
          foundLibrarian.collegeName?.toLowerCase().includes(college)
        );
        
        // If it's a restricted account and not a Librarian Corner login, deny access
        if (isRestrictedAccount && !isLibrarianCornerLogin) {
          return false;
        }
        
        const librarianUser: User = {
          id: foundLibrarian._id,
          username: foundLibrarian.username || username,
          role: 'librarian',
          permissions: [],
          collegeName: foundLibrarian.collegeName,
          librarianName: foundLibrarian.librarianName,
          collegeUrl: foundLibrarian.collegeUrl,
          email: foundLibrarian.email,
          createdAt: foundLibrarian._createdDate
        };
        
        setUser(librarianUser);
        localStorage.setItem('vtu_auth_user', JSON.stringify(librarianUser));
        return true;
      }
    } catch (error) {
      console.error('Error checking librarian accounts:', error);
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vtu_auth_user');
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('vtu_auth_users', JSON.stringify(updatedUsers));
  };

  const updateUserPermissions = (userId: string, permissions: string[]) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, permissions } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('vtu_auth_users', JSON.stringify(updatedUsers));
    
    // Update current user if it's the same user
    if (user?.id === userId) {
      const updatedUser = { ...user, permissions };
      setUser(updatedUser);
      localStorage.setItem('vtu_auth_user', JSON.stringify(updatedUser));
    }
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('vtu_auth_users', JSON.stringify(updatedUsers));
  };

  const submitRegistrationRequest = (request: Omit<RegistrationRequest, 'id' | 'requestDate' | 'status'>) => {
    const newRequest: RegistrationRequest = {
      ...request,
      id: Date.now().toString(),
      requestDate: new Date(),
      status: 'pending'
    };
    
    const updatedRequests = [...registrationRequests, newRequest];
    setRegistrationRequests(updatedRequests);
    localStorage.setItem('vtu_registration_requests', JSON.stringify(updatedRequests));
  };

  const approveRegistrationRequest = (requestId: string) => {
    const request = registrationRequests.find(r => r.id === requestId);
    if (!request) return;

    // Create the user account
    const newUser: User = {
      id: Date.now().toString(),
      username: request.username,
      role: request.role,
      permissions: request.requestedPermissions,
      createdBy: 'superadmin',
      createdAt: new Date()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('vtu_auth_users', JSON.stringify(updatedUsers));

    // Store the password for the new user
    const updatedPasswords = { ...userPasswords, [request.username]: request.password };
    setUserPasswords(updatedPasswords);
    localStorage.setItem('vtu_user_passwords', JSON.stringify(updatedPasswords));

    // Update request status
    const updatedRequests = registrationRequests.map(r => 
      r.id === requestId ? { ...r, status: 'approved' as const } : r
    );
    setRegistrationRequests(updatedRequests);
    localStorage.setItem('vtu_registration_requests', JSON.stringify(updatedRequests));
  };

  const rejectRegistrationRequest = (requestId: string, reason?: string) => {
    const updatedRequests = registrationRequests.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' as const, reason } : r
    );
    setRegistrationRequests(updatedRequests);
    localStorage.setItem('vtu_registration_requests', JSON.stringify(updatedRequests));
  };

  const approvePasswordChangeRequest = async (requestId: string, adminComments?: string) => {
    try {
      await BaseCrudService.update('passwordchangerequests', {
        _id: requestId,
        status: 'approved',
        adminComments: adminComments || 'Password change approved by Super Admin'
      });
    } catch (error) {
      console.error('Error approving password change request:', error);
      throw error;
    }
  };

  const rejectPasswordChangeRequest = async (requestId: string, adminComments?: string) => {
    try {
      await BaseCrudService.update('passwordchangerequests', {
        _id: requestId,
        status: 'rejected',
        adminComments: adminComments || 'Password change rejected by Super Admin'
      });
    } catch (error) {
      console.error('Error rejecting password change request:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      users,
      createUser,
      updateUserPermissions,
      deleteUser,
      registrationRequests,
      submitRegistrationRequest,
      approveRegistrationRequest,
      rejectRegistrationRequest,
      approvePasswordChangeRequest,
      rejectPasswordChangeRequest
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}