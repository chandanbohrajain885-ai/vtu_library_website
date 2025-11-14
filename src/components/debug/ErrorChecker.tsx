import React, { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LibrarianAccounts } from '@/entities';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Database, User, RefreshCw } from 'lucide-react';

interface SystemCheck {
  name: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: any;
}

export default function ErrorChecker() {
  const { user, isAuthenticated, login } = useAuth();
  const [checks, setChecks] = useState<SystemCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    username: '',
    password: ''
  });

  const runSystemChecks = async () => {
    setIsRunning(true);
    const newChecks: SystemCheck[] = [];

    // Check 1: Authentication Context
    newChecks.push({
      name: 'Authentication Context',
      status: 'success',
      message: `Auth context loaded. Authenticated: ${isAuthenticated}`,
      details: {
        isAuthenticated,
        userRole: user?.role,
        username: user?.username,
        collegeName: user?.collegeName
      }
    });

    // Check 2: Database Connection
    try {
      const { items: accounts } = await BaseCrudService.getAll<LibrarianAccounts>('librarianaccounts');
      newChecks.push({
        name: 'Database Connection',
        status: 'success',
        message: `Successfully connected. Found ${accounts.length} librarian accounts`,
        details: {
          totalAccounts: accounts.length,
          sampleAccounts: accounts.slice(0, 3).map(acc => ({
            username: acc.username,
            collegeName: acc.collegeName,
            hasPassword: !!acc.password
          }))
        }
      });

      // Check 3: Restricted Accounts
      const restrictedColleges = [
        'acharya institute of technology',
        'global academy of technology'
      ];
      
      const restrictedAccounts = accounts.filter(acc => 
        restrictedColleges.some(college => 
          acc.collegeName?.toLowerCase().includes(college)
        )
      );

      newChecks.push({
        name: 'Restricted Accounts Check',
        status: restrictedAccounts.length > 0 ? 'success' : 'warning',
        message: `Found ${restrictedAccounts.length} restricted accounts`,
        details: {
          restrictedAccounts: restrictedAccounts.map(acc => ({
            username: acc.username,
            collegeName: acc.collegeName
          }))
        }
      });

    } catch (error) {
      newChecks.push({
        name: 'Database Connection',
        status: 'error',
        message: `Database connection failed: ${error}`,
        details: { error }
      });
    }

    // Check 4: Local Storage
    const storedUser = localStorage.getItem('vtu_auth_user');
    newChecks.push({
      name: 'Local Storage',
      status: storedUser ? 'success' : 'warning',
      message: storedUser ? 'User data found in storage' : 'No user data in storage',
      details: storedUser ? JSON.parse(storedUser) : null
    });

    setChecks(newChecks);
    setIsRunning(false);
  };

  const testLogin = async () => {
    if (!testCredentials.username || !testCredentials.password) {
      alert('Please enter test credentials');
      return;
    }

    console.log('ErrorChecker - Testing login with:', testCredentials.username);
    
    try {
      // Test regular login
      const regularResult = await login(testCredentials.username, testCredentials.password, false);
      console.log('ErrorChecker - Regular login result:', regularResult);

      // Test librarian corner login
      const librarianResult = await login(testCredentials.username, testCredentials.password, true);
      console.log('ErrorChecker - Librarian corner login result:', librarianResult);

      alert(`Login test results:\nRegular login: ${regularResult}\nLibrarian corner login: ${librarianResult}`);
    } catch (error) {
      console.error('ErrorChecker - Login test error:', error);
      alert(`Login test failed: ${error}`);
    }
  };

  useEffect(() => {
    runSystemChecks();
  }, []);

  const getStatusIcon = (status: SystemCheck['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'loading':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusBadge = (status: SystemCheck['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500 text-white">OK</Badge>;
      case 'error':
        return <Badge className="bg-red-500 text-white">ERROR</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 text-white">WARNING</Badge>;
      case 'loading':
        return <Badge className="bg-blue-500 text-white">LOADING</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">System Error Checker</h1>
          <p className="text-gray-600">Comprehensive system diagnostics for the VTU Consortium Portal</p>
        </div>

        {/* Control Panel */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Control Panel</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Button 
                onClick={runSystemChecks} 
                disabled={isRunning}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
                <span>Run System Checks</span>
              </Button>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Test Username"
                  value={testCredentials.username}
                  onChange={(e) => setTestCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="password"
                  placeholder="Test Password"
                  value={testCredentials.password}
                  onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                />
                <Button onClick={testLogin} variant="outline">
                  Test Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Checks */}
        <div className="grid md:grid-cols-2 gap-6">
          {checks.map((check, index) => (
            <Card key={index} className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(check.status)}
                    <span>{check.name}</span>
                  </div>
                  {getStatusBadge(check.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{check.message}</p>
                {check.details && (
                  <div className="bg-gray-100 p-3 rounded-md">
                    <h4 className="font-semibold text-sm mb-2">Details:</h4>
                    <pre className="text-xs text-gray-600 overflow-auto">
                      {JSON.stringify(check.details, null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Auth State */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Current Authentication State</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Authentication Status</h4>
                <p className="text-sm text-gray-600">
                  <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
                </p>
                {user && (
                  <>
                    <p className="text-sm text-gray-600">
                      <strong>Role:</strong> {user.role}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Username:</strong> {user.username}
                    </p>
                    {user.collegeName && (
                      <p className="text-sm text-gray-600">
                        <strong>College:</strong> {user.collegeName}
                      </p>
                    )}
                  </>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Browser Storage</h4>
                <p className="text-sm text-gray-600">
                  <strong>Local Storage User:</strong> {localStorage.getItem('vtu_auth_user') ? 'Present' : 'None'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Session Storage:</strong> {sessionStorage.length} items
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}