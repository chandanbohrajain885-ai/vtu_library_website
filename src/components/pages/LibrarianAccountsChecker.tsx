import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { LibrarianAccounts } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Database, CheckCircle, AlertCircle } from 'lucide-react';

export default function LibrarianAccountsChecker() {
  const [accounts, setAccounts] = useState<LibrarianAccounts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const { items } = await BaseCrudService.getAll<LibrarianAccounts>('librarianaccounts');
        setAccounts(items);
        console.log('Current librarian accounts:', items);
      } catch (err) {
        console.error('Error fetching librarian accounts:', err);
        setError('Failed to fetch librarian accounts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gray-800 font-heading text-xl">Loading librarian accounts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-red-600 font-heading text-xl">{error}</div>
      </div>
    );
  }

  const totalAccounts = accounts.length;
  const expectedAccounts = 211;
  const missingAccounts = expectedAccounts - totalAccounts;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[120rem] mx-auto">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">
            Librarian Accounts Status Check
          </h1>
          <p className="font-paragraph text-xl text-primary/70">
            Current status of librarian credentials in the system
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Current Accounts</CardTitle>
                <Database className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalAccounts}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-green-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Expected Total</CardTitle>
                <Users className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{expectedAccounts}</div>
            </CardContent>
          </Card>

          <Card className={`border-l-4 ${missingAccounts === 0 ? 'border-green-500' : 'border-red-500'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Missing Accounts</CardTitle>
                {missingAccounts === 0 ? 
                  <CheckCircle className="h-4 w-4 text-green-500" /> : 
                  <AlertCircle className="h-4 w-4 text-red-500" />
                }
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${missingAccounts === 0 ? 'text-green-600' : 'text-red-600'}`}>
                {missingAccounts}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-purple-500">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((totalAccounts / expectedAccounts) * 100)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Badge */}
        <div className="mb-8">
          <Badge 
            variant={missingAccounts === 0 ? "default" : "destructive"}
            className="text-lg px-4 py-2"
          >
            {missingAccounts === 0 ? 
              "✅ All 211 librarian accounts are properly configured" : 
              `⚠️ ${missingAccounts} librarian accounts are missing`
            }
          </Badge>
        </div>

        {/* Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Current Librarian Accounts ({totalAccounts})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Librarian Name</TableHead>
                    <TableHead>College Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account._id}>
                      <TableCell className="font-medium">{account.username || 'N/A'}</TableCell>
                      <TableCell>{account.librarianName || 'N/A'}</TableCell>
                      <TableCell>{account.collegeName || 'N/A'}</TableCell>
                      <TableCell>{account.email || 'N/A'}</TableCell>
                      <TableCell>
                        {account._createdDate ? 
                          new Date(account._createdDate).toLocaleDateString() : 
                          'N/A'
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4">
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Refresh Data
          </Button>
          
          {missingAccounts > 0 && (
            <Button 
              onClick={() => alert('Please provide the Google Sheet with 211 librarian credentials to proceed with bulk upload')}
              className="bg-green-500 hover:bg-green-600"
            >
              Add Missing Accounts
            </Button>
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="font-heading text-xl font-bold text-gray-800 mb-4">Summary</h3>
          <ul className="space-y-2 text-gray-700">
            <li>• Current librarian accounts in database: <strong>{totalAccounts}</strong></li>
            <li>• Expected total accounts: <strong>{expectedAccounts}</strong></li>
            <li>• Missing accounts: <strong>{missingAccounts}</strong></li>
            <li>• Database collection: <strong>librarianaccounts</strong></li>
            <li>• Login functionality: <strong>{totalAccounts > 0 ? 'Active' : 'Inactive'}</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}