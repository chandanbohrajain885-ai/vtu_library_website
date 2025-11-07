import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  role: 'superadmin' | 'admin' | 'librarian' | 'publisher';
  permissions: string[];
  createdBy?: string;
  createdAt?: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
  createUser: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  updateUserPermissions: (userId: string, permissions: string[]) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users
const defaultUsers: User[] = [
  {
    id: '1',
    username: 'superadmin',
    role: 'superadmin',
    permissions: ['all'],
    createdAt: new Date()
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

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('vtu_auth_user');
    const storedUsers = localStorage.getItem('vtu_auth_users');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Check default passwords first
    if (defaultPasswords[username] === password) {
      const foundUser = users.find(u => u.username === username);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('vtu_auth_user', JSON.stringify(foundUser));
        return true;
      }
    }
    
    // Check custom users (they use the same password as their username for simplicity)
    const foundUser = users.find(u => u.username === username);
    if (foundUser && password === username) {
      setUser(foundUser);
      localStorage.setItem('vtu_auth_user', JSON.stringify(foundUser));
      return true;
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

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      users,
      createUser,
      updateUserPermissions,
      deleteUser
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