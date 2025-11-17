import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { MemberColleges } from '@/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react';

export default function MemberCollegesPage() {
  const [colleges, setColleges] = useState<MemberColleges[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        const { items } = await BaseCrudService.getAll<MemberColleges>('membercolleges');
        setColleges(items);
      } catch (err) {
        setError('Failed to load member colleges');
        console.error('Error fetching colleges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Member Colleges
          </h1>
          <p className="font-paragraph text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            Discover our network of affiliated member colleges and their dedicated librarians
          </p>
          <div className="mt-6">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <GraduationCap className="w-5 h-5 mr-2" />
              {colleges.length} Member Institutions
            </Badge>
          </div>
        </div>
      </section>

      {/* Colleges Table Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="shadow-lg">
            <CardHeader className="bg-primary/5 border-b">
              <CardTitle className="font-heading text-2xl text-primary">
                Member Colleges Directory
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/10">
                      <TableHead className="font-heading font-semibold text-primary w-16">
                        Sl.No
                      </TableHead>
                      <TableHead className="font-heading font-semibold text-primary min-w-[200px]">
                        College Name
                      </TableHead>
                      <TableHead className="font-heading font-semibold text-primary min-w-[250px]">
                        Communication Address
                      </TableHead>
                      <TableHead className="font-heading font-semibold text-primary min-w-[150px]">
                        Librarian Name
                      </TableHead>
                      <TableHead className="font-heading font-semibold text-primary min-w-[200px]">
                        Email
                      </TableHead>
                      <TableHead className="font-heading font-semibold text-primary min-w-[150px]">
                        Phone
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {colleges.map((college, index) => (
                      <TableRow 
                        key={college._id} 
                        className="hover:bg-primary/5 transition-colors"
                      >
                        <TableCell className="font-paragraph font-medium text-center">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-paragraph font-semibold text-primary">
                          {college.collegeName}
                        </TableCell>
                        <TableCell className="font-paragraph">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                            <span className="text-sm leading-relaxed">
                              {college.communicationAddress}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-paragraph font-medium">
                          {college.librarianName}
                        </TableCell>
                        <TableCell className="font-paragraph">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            <a 
                              href={`mailto:${college.email}`}
                              className="text-primary hover:text-secondary transition-colors text-sm"
                            >
                              {college.email}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className="font-paragraph">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-primary" />
                            <a 
                              href={`tel:${college.phone}`}
                              className="text-primary hover:text-secondary transition-colors text-sm"
                            >
                              {college.phone}
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {colleges.length === 0 && (
            <Card className="mt-8">
              <CardContent className="p-8 text-center">
                <GraduationCap className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                <h3 className="font-heading text-xl text-primary mb-2">
                  No Member Colleges Found
                </h3>
                <p className="font-paragraph text-gray-600">
                  Member college information will appear here once added to the system.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="bg-primary/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-4">
            Join Our Network
          </h2>
          <p className="font-paragraph text-lg text-gray-700 max-w-2xl mx-auto">
            Interested in becoming a member college? Contact us to learn more about the benefits 
            and requirements of joining our academic consortium.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:info@consortium.edu"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-paragraph"
            >
              <Mail className="w-5 h-5" />
              Contact Us
            </a>
            <a 
              href="/about"
              className="inline-flex items-center gap-2 bg-white text-primary border-2 border-primary px-6 py-3 rounded-lg hover:bg-primary/5 transition-colors font-paragraph"
            >
              <GraduationCap className="w-5 h-5" />
              Learn More
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}