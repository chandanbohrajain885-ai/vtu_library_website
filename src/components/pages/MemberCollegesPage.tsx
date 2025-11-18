import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { MemberColleges } from '@/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, GraduationCap, RefreshCw, AlertCircle, ChevronDown, ExternalLink, ArrowLeft } from 'lucide-react';

export default function MemberCollegesPage() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<MemberColleges[]>([]);
  const [displayedColleges, setDisplayedColleges] = useState<MemberColleges[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [itemsToShow, setItemsToShow] = useState(50);
  const [totalItems, setTotalItems] = useState(0);

  const handleBackClick = () => {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // If no history, go to home page
      navigate('/');
    }
  };

  const fetchColleges = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching Member Colleges data from CMS...');
      
      const { items } = await BaseCrudService.getAll<MemberColleges>('membercolleges');
      console.log('✅ Successfully fetched colleges:', items.length, 'items');
      console.log('📊 Data preview:', items.slice(0, 2)); // Log first 2 items for debugging
      
      // Sort colleges by serial number if available, otherwise by college name
      const sortedItems = items.sort((a, b) => {
        const aSerial = a.sl_no || a.sl_nno || a.sl_noo || 0;
        const bSerial = b.sl_no || b.sl_nno || b.sl_noo || 0;
        
        if (aSerial && bSerial) {
          return aSerial - bSerial;
        }
        
        // Fallback to alphabetical sorting by college name
        const aName = a.collegeName || '';
        const bName = b.collegeName || '';
        return aName.localeCompare(bName);
      });
      
      setColleges(sortedItems);
      setTotalItems(sortedItems.length);
      setDisplayedColleges(sortedItems.slice(0, itemsToShow));
      setLastUpdated(new Date());
    } catch (err) {
      console.error('❌ Error fetching colleges:', err);
      setError('Failed to load member colleges. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreColleges = () => {
    try {
      setLoadingMore(true);
      setTimeout(() => {
        const newItemsToShow = itemsToShow + 50;
        setItemsToShow(newItemsToShow);
        setDisplayedColleges(colleges.slice(0, newItemsToShow));
        setLoadingMore(false);
      }, 300); // Small delay for better UX
    } catch (err) {
      console.error('❌ Error loading more colleges:', err);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setDisplayedColleges(colleges.slice(0, itemsToShow));
  }, [colleges, itemsToShow]);

  useEffect(() => {
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
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchColleges} className="flex items-center gap-2 mx-auto">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
              <div className="mt-4 text-sm text-gray-600">
                <p>Debug info available at: <a href="/debug-member-colleges" className="text-primary underline">/debug-member-colleges</a></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 pt-6">
        <Button 
          onClick={handleBackClick}
          variant="outline"
          className="flex items-center gap-2 mb-4 hover:bg-primary/5 border-primary/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

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
              {totalItems} Member Institutions
            </Badge>
            {displayedColleges.length < totalItems && (
              <Badge variant="outline" className="text-sm px-3 py-1 ml-2">
                Showing {displayedColleges.length} of {totalItems}
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Colleges Table Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Data Quality Summary */}
          {colleges.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{totalItems}</div>
                    <div className="text-sm text-gray-600">Total Colleges</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {colleges.filter(c => c.collegeName && c.email && c.phone).length}
                    </div>
                    <div className="text-sm text-gray-600">Complete Records</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {colleges.filter(c => c.url).length}
                    </div>
                    <div className="text-sm text-gray-600">With Websites</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {colleges.filter(c => !c.collegeName || !c.email || !c.phone).length}
                    </div>
                    <div className="text-sm text-gray-600">Incomplete Records</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg">
            <CardHeader className="bg-primary/5 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="font-heading text-2xl text-primary">
                  Member Colleges Directory
                </CardTitle>
                <div className="flex items-center gap-2">
                  {lastUpdated && (
                    <Badge variant="outline" className="text-xs">
                      Updated: {lastUpdated.toLocaleTimeString()}
                    </Badge>
                  )}
                  <Button 
                    onClick={fetchColleges} 
                    size="sm" 
                    variant="outline"
                    disabled={loading}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
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
                        College Name & Website
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
                    {displayedColleges.map((college, index) => (
                      <TableRow 
                        key={college._id} 
                        className={`transition-colors hover:bg-primary/10 ${
                          index % 2 === 0 
                            ? 'bg-white' 
                            : 'bg-gray-50/50'
                        }`}
                      >
                        <TableCell className="font-paragraph font-medium text-center">
                          {college.sl_no || college.sl_nno || college.sl_noo || (index + 1)}
                        </TableCell>
                        <TableCell className="font-paragraph font-semibold text-primary">
                          <div className="flex flex-col">
                            <span>
                              {college.collegeName || (
                                <span className="text-red-500 italic">Missing college name</span>
                              )}
                            </span>
                            {college.url && (
                              <a 
                                href={college.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                              >
                                Visit Website
                              </a>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-paragraph">
                          {(college.communicationAddress || college.communicationAdress) ? (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                              <span className="text-sm leading-relaxed">
                                {college.communicationAddress || college.communicationAdress}
                              </span>
                            </div>
                          ) : (
                            <span className="text-red-500 italic">Missing address</span>
                          )}
                        </TableCell>
                        <TableCell className="font-paragraph font-medium">
                          {college.librarianName || (
                            <span className="text-red-500 italic">Missing librarian name</span>
                          )}
                        </TableCell>
                        <TableCell className="font-paragraph">
                          {college.email ? (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-primary" />
                              <a 
                                href={`mailto:${college.email}`}
                                className="text-primary hover:text-secondary transition-colors text-sm"
                              >
                                {college.email}
                              </a>
                            </div>
                          ) : (
                            <span className="text-red-500 italic">Missing email</span>
                          )}
                        </TableCell>
                        <TableCell className="font-paragraph">
                          {college.phone ? (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-primary" />
                              <a 
                                href={`tel:${college.phone}`}
                                className="text-primary hover:text-secondary transition-colors text-sm"
                              >
                                {college.phone}
                              </a>
                            </div>
                          ) : (
                            <span className="text-red-500 italic">Missing phone</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* New Load More Button - Enhanced Design */}
          {displayedColleges.length < totalItems && (
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 max-w-md mx-auto border border-primary/10">
                <div className="mb-4">
                  <h3 className="font-heading text-xl font-bold text-primary mb-2">
                    More Colleges Available
                  </h3>
                  <p className="font-paragraph text-gray-600 text-sm">
                    Showing {displayedColleges.length} of {totalItems} member colleges
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(displayedColleges.length / totalItems) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((displayedColleges.length / totalItems) * 100)}% loaded
                  </p>
                </div>
                
                <Button 
                  onClick={loadMoreColleges}
                  disabled={loadingMore}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 text-lg font-paragraph font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-70"
                  size="lg"
                >
                  {loadingMore ? (
                    <>
                      <LoadingSpinner className="w-5 h-5 mr-3" />
                      Loading More Colleges...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5 mr-3" />
                      Load More ({totalItems - displayedColleges.length} remaining)
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 mt-3 font-paragraph">
                  Click to load {Math.min(50, totalItems - displayedColleges.length)} more colleges
                </p>
              </div>
            </div>
          )}

          {colleges.length === 0 && !loading && (
            <Card className="mt-8">
              <CardContent className="p-8 text-center">
                <GraduationCap className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                <h3 className="font-heading text-xl text-primary mb-2">
                  No Member Colleges Found
                </h3>
                <p className="font-paragraph text-gray-600 mb-4">
                  Member college information will appear here once added to the system.
                </p>
                <div className="text-sm text-gray-500">
                  <p>For debugging, visit: <a href="/debug-member-colleges" className="text-primary underline">/debug-member-colleges</a></p>
                </div>
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