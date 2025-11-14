import React, { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LibrarianAccounts } from '@/entities';
import { useAuth } from '@/components/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, CheckCircle, User, Database, TestTube, Eye, EyeOff } from 'lucide-react';

interface TestResult {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

export default function LibrarianLoginTester() {
  const { login, logout, user, isAuthenticated } = useAuth();
  const [accounts, setAccounts] = useState<LibrarianAccounts[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<LibrarianAccounts | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const [customCredentials, setCustomCredentials] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const { items } = await BaseCrudService.getAll<LibrarianAccounts>('librarianaccounts');
      setAccounts(items);
      console.log('LibrarianLoginTester - Loaded accounts:', items.length);
    } catch (error) {
      console.error('LibrarianLoginTester - Error loading accounts:', error);
    }
  };

  const runComprehensiveTests = async () => {
    setIsLoading(true);
    const results: TestResult[] = [];

    // Test 1: Database connectivity
    try {
      const { items } = await BaseCrudService.getAll<LibrarianAccounts>('librarianaccounts');
      results.push({
        test: 'Database Connectivity',
        status: 'pass',
        message: `Successfully loaded ${items.length} librarian accounts`,
        details: { accountCount: items.length }
      });
    } catch (error) {
      results.push({
        test: 'Database Connectivity',
        status: 'fail',
        message: `Failed to load accounts: ${error}`,
        details: { error }
      });
    }

    // Test 2: Check for restricted accounts
    const restrictedColleges = [
      'acharya institute of technology',
      'global academy of technology'
    ];
    
    const restrictedAccounts = accounts.filter(acc => 
      restrictedColleges.some(college => 
        acc.collegeName?.toLowerCase().includes(college)
      )
    );

    results.push({
      test: 'Restricted Accounts Detection',
      status: restrictedAccounts.length > 0 ? 'pass' : 'warning',
      message: `Found ${restrictedAccounts.length} restricted accounts`,
      details: {
        restrictedAccounts: restrictedAccounts.map(acc => ({
          username: acc.username,
          collegeName: acc.collegeName
        }))
      }
    });

    // Test 3: Test login with first restricted account (if any)
    if (restrictedAccounts.length > 0) {
      const testAccount = restrictedAccounts[0];
      
      // Test regular login (should fail for restricted accounts)
      try {
        const regularResult = await login(testAccount.username!, testAccount.password!, false);
        results.push({
          test: 'Restricted Account Regular Login',
          status: regularResult ? 'fail' : 'pass',
          message: regularResult ? 'Restricted account allowed regular login (SECURITY ISSUE)' : 'Restricted account correctly denied regular login',
          details: { username: testAccount.username, result: regularResult }
        });
      } catch (error) {
        results.push({
          test: 'Restricted Account Regular Login',
          status: 'fail',
          message: `Login test failed with error: ${error}`,
          details: { error }
        });
      }

      // Test librarian corner login (should succeed)
      try {
        const librarianResult = await login(testAccount.username!, testAccount.password!, true);
        results.push({
          test: 'Restricted Account Librarian Corner Login',
          status: librarianResult ? 'pass' : 'fail',
          message: librarianResult ? 'Restricted account successfully logged in via Librarian Corner' : 'Restricted account failed Librarian Corner login',
          details: { username: testAccount.username, result: librarianResult }
        });
        
        if (librarianResult) {
          logout(); // Clean up
        }
      } catch (error) {
        results.push({
          test: 'Restricted Account Librarian Corner Login',
          status: 'fail',
          message: `Librarian Corner login test failed with error: ${error}`,
          details: { error }
        });
      }
    }

    // Test 4: Test login with non-restricted account
    const nonRestrictedAccounts = accounts.filter(acc => 
      !restrictedColleges.some(college => 
        acc.collegeName?.toLowerCase().includes(college)
      )
    );

    if (nonRestrictedAccounts.length > 0) {
      const testAccount = nonRestrictedAccounts[0];
      
      try {
        const regularResult = await login(testAccount.username!, testAccount.password!, false);
        results.push({
          test: 'Non-Restricted Account Regular Login',
          status: regularResult ? 'pass' : 'fail',
          message: regularResult ? 'Non-restricted account successfully logged in via regular login' : 'Non-restricted account failed regular login',
          details: { username: testAccount.username, result: regularResult }
        });
        
        if (regularResult) {
          logout(); // Clean up
        }
      } catch (error) {
        results.push({
          test: 'Non-Restricted Account Regular Login',
          status: 'fail',
          message: `Regular login test failed with error: ${error}`,
          details: { error }
        });
      }
    }

    // Test 5: Test with invalid credentials
    try {
      const invalidResult = await login('invalid_user', 'invalid_pass', false);
      results.push({
        test: 'Invalid Credentials Test',
        status: invalidResult ? 'fail' : 'pass',
        message: invalidResult ? 'Invalid credentials were accepted (SECURITY ISSUE)' : 'Invalid credentials correctly rejected',
        details: { result: invalidResult }
      });
    } catch (error) {
      results.push({
        test: 'Invalid Credentials Test',
        status: 'warning',
        message: `Invalid credentials test failed with error: ${error}`,
        details: { error }
      });
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const testSpecificAccount = async (account: LibrarianAccounts) => {
    setSelectedAccount(account);
    const results: TestResult[] = [];

    // Test regular login
    try {
      const regularResult = await login(account.username!, account.password!, false);
      results.push({
        test: `${account.username} - Regular Login`,
        status: 'pass',
        message: `Result: ${regularResult}`,
        details: { result: regularResult }
      });
      if (regularResult) logout();
    } catch (error) {
      results.push({
        test: `${account.username} - Regular Login`,
        status: 'fail',
        message: `Error: ${error}`,
        details: { error }
      });
    }

    // Test librarian corner login
    try {
      const librarianResult = await login(account.username!, account.password!, true);
      results.push({
        test: `${account.username} - Librarian Corner Login`,
        status: 'pass',
        message: `Result: ${librarianResult}`,
        details: { result: librarianResult }
      });
      if (librarianResult) logout();
    } catch (error) {
      results.push({
        test: `${account.username} - Librarian Corner Login`,
        status: 'fail',
        message: `Error: ${error}`,
        details: { error }
      });
    }

    setTestResults(results);
  };

  const testCustomCredentials = async () => {
    if (!customCredentials.username || !customCredentials.password) {
      alert('Please enter both username and password');
      return;
    }

    const results: TestResult[] = [];

    // Test regular login
    try {
      const regularResult = await login(customCredentials.username, customCredentials.password, false);
      results.push({
        test: 'Custom Credentials - Regular Login',
        status: 'pass',
        message: `Result: ${regularResult}`,
        details: { result: regularResult, credentials: customCredentials.username }
      });
      if (regularResult) logout();
    } catch (error) {
      results.push({
        test: 'Custom Credentials - Regular Login',
        status: 'fail',
        message: `Error: ${error}`,
        details: { error }
      });
    }

    // Test librarian corner login
    try {
      const librarianResult = await login(customCredentials.username, customCredentials.password, true);
      results.push({
        test: 'Custom Credentials - Librarian Corner Login',
        status: 'pass',
        message: `Result: ${librarianResult}`,
        details: { result: librarianResult, credentials: customCredentials.username }
      });
      if (librarianResult) logout();
    } catch (error) {
      results.push({
        test: 'Custom Credentials - Librarian Corner Login',
        status: 'fail',
        message: `Error: ${error}`,
        details: { error }
      });
    }

    setTestResults(results);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-500 text-white">PASS</Badge>;
      case 'fail':
        return <Badge className="bg-red-500 text-white">FAIL</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500 text-white">WARNING</Badge>;
    }
  };

  const restrictedColleges = [
    'acharya institute of technology',
    'global academy of technology'
  ];

  const isRestrictedAccount = (account: LibrarianAccounts) => {
    return restrictedColleges.some(college => 
      account.collegeName?.toLowerCase().includes(college)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Librarian Login Tester</h1>
          <p className="text-gray-600">Comprehensive testing tool for librarian authentication system</p>
        </div>

        {/* Current Auth State */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Current Authentication State</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Badge className={isAuthenticated ? 'bg-green-500' : 'bg-gray-500'}>
                {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
              </Badge>
              {user && (
                <>
                  <span className="text-sm">Role: {user.role}</span>
                  <span className="text-sm">Username: {user.username}</span>
                  {user.collegeName && <span className="text-sm">College: {user.collegeName}</span>}
                </>
              )}
              {isAuthenticated && (
                <Button onClick={logout} variant="outline" size="sm">
                  Logout
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="h-5 w-5" />
                <span>Automated Tests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={runComprehensiveTests} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Running Tests...' : 'Run Comprehensive Tests'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom Credentials Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom-username">Username</Label>
                <Input
                  id="custom-username"
                  value={customCredentials.username}
                  onChange={(e) => setCustomCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="custom-password">Password</Label>
                <Input
                  id="custom-password"
                  type="password"
                  value={customCredentials.password}
                  onChange={(e) => setCustomCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                />
              </div>
              <Button onClick={testCustomCredentials} className="w-full">
                Test Custom Credentials
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{result.test}</h4>
                        {getStatusBadge(result.status)}
                      </div>
                      <p className="text-sm text-gray-600">{result.message}</p>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer">View Details</summary>
                          <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Librarian Accounts ({accounts.length})</span>
              </div>
              <Button
                onClick={() => setShowPasswords(!showPasswords)}
                variant="outline"
                size="sm"
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPasswords ? 'Hide' : 'Show'} Passwords
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>College Name</TableHead>
                    <TableHead>Librarian Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account._id}>
                      <TableCell className="font-medium">{account.username}</TableCell>
                      <TableCell>{account.collegeName}</TableCell>
                      <TableCell>{account.librarianName}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>
                        {showPasswords ? account.password : '••••••••'}
                      </TableCell>
                      <TableCell>
                        <Badge className={isRestrictedAccount(account) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                          {isRestrictedAccount(account) ? 'Restricted' : 'Normal'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => testSpecificAccount(account)}
                          size="sm"
                          variant="outline"
                        >
                          Test Login
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}