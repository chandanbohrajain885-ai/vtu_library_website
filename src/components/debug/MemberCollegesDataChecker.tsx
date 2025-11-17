import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { MemberColleges } from '@/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Database, CheckCircle, AlertCircle } from 'lucide-react';

export default function MemberCollegesDataChecker() {
  const [colleges, setColleges] = useState<MemberColleges[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching Member Colleges data...');
      
      const { items } = await BaseCrudService.getAll<MemberColleges>('membercolleges');
      console.log('✅ Data fetched successfully:', items);
      
      setColleges(items);
      setLastChecked(new Date());
    } catch (err) {
      console.error('❌ Error fetching colleges:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const validateData = () => {
    const issues: string[] = [];
    
    colleges.forEach((college, index) => {
      if (!college.collegeName) issues.push(`College ${index + 1}: Missing college name`);
      if (!college.communicationAddress) issues.push(`College ${index + 1}: Missing communication address`);
      if (!college.librarianName) issues.push(`College ${index + 1}: Missing librarian name`);
      if (!college.email) issues.push(`College ${index + 1}: Missing email`);
      if (!college.phone) issues.push(`College ${index + 1}: Missing phone`);
      
      // Email validation
      if (college.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(college.email)) {
        issues.push(`College ${index + 1}: Invalid email format`);
      }
    });
    
    return issues;
  };

  const dataIssues = validateData();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container mx-auto max-w-6xl">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6" />
              Member Colleges Data Checker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Button 
                onClick={fetchColleges} 
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              
              {lastChecked && (
                <Badge variant="outline">
                  Last checked: {lastChecked.toLocaleTimeString()}
                </Badge>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <strong>Error:</strong> {error}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{colleges.length}</div>
                  <div className="text-sm text-gray-600">Total Colleges</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{colleges.length - dataIssues.length}</div>
                  <div className="text-sm text-gray-600">Valid Records</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{dataIssues.length}</div>
                  <div className="text-sm text-gray-600">Data Issues</div>
                </CardContent>
              </Card>
            </div>

            {dataIssues.length > 0 && (
              <Card className="mb-6 border-red-200">
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Data Validation Issues
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="list-disc list-inside space-y-1">
                    {dataIssues.map((issue, index) => (
                      <li key={index} className="text-red-600">{issue}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {dataIssues.length === 0 && colleges.length > 0 && (
              <Card className="mb-6 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <strong>All data is valid and complete!</strong>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {colleges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Raw Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">ID</th>
                      <th className="border border-gray-300 p-2 text-left">College Name</th>
                      <th className="border border-gray-300 p-2 text-left">Address</th>
                      <th className="border border-gray-300 p-2 text-left">Librarian</th>
                      <th className="border border-gray-300 p-2 text-left">Email</th>
                      <th className="border border-gray-300 p-2 text-left">Phone</th>
                      <th className="border border-gray-300 p-2 text-left">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {colleges.map((college) => (
                      <tr key={college._id}>
                        <td className="border border-gray-300 p-2 text-xs font-mono">{college._id}</td>
                        <td className="border border-gray-300 p-2">{college.collegeName || '❌ Missing'}</td>
                        <td className="border border-gray-300 p-2">{college.communicationAddress || '❌ Missing'}</td>
                        <td className="border border-gray-300 p-2">{college.librarianName || '❌ Missing'}</td>
                        <td className="border border-gray-300 p-2">{college.email || '❌ Missing'}</td>
                        <td className="border border-gray-300 p-2">{college.phone || '❌ Missing'}</td>
                        <td className="border border-gray-300 p-2 text-xs">
                          {college._createdDate ? new Date(college._createdDate).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {colleges.length === 0 && !loading && !error && (
          <Card>
            <CardContent className="p-8 text-center">
              <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Data Found</h3>
              <p className="text-gray-600">The Member Colleges collection appears to be empty.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}