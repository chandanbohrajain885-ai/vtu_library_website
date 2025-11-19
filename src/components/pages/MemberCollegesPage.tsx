import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { MemberColleges } from '@/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Phone, MapPin, GraduationCap, RefreshCw, AlertCircle, ChevronDown, ExternalLink, ArrowLeft, Search, X } from 'lucide-react';

export default function MemberCollegesPage() {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<MemberColleges[]>([]);
  const [displayedColleges, setDisplayedColleges] = useState<MemberColleges[]>([]);
  const [filteredColleges, setFilteredColleges] = useState<MemberColleges[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [itemsToShow, setItemsToShow] = useState(50);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleBackClick = () => {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // If no history, go to home page
      navigate('/');
    }
  };

  // Search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setIsSearchActive(term.length > 0);
    
    if (term.length === 0) {
      setFilteredColleges(colleges);
      setItemsToShow(50); // Reset to initial load amount
      setDisplayedColleges(colleges.slice(0, 50));
      setTotalItems(colleges.length);
    } else {
      const filtered = colleges.filter(college => 
        college.collegeName?.toLowerCase().includes(term.toLowerCase()) ||
        college.librarianName?.toLowerCase().includes(term.toLowerCase()) ||
        college.communicationAddress?.toLowerCase().includes(term.toLowerCase()) ||
        college.communicationAdress?.toLowerCase().includes(term.toLowerCase()) ||
        college.email?.toLowerCase().includes(term.toLowerCase()) ||
        college.phone?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredColleges(filtered);
      setItemsToShow(50); // Reset to initial load amount for search results
      setDisplayedColleges(filtered.slice(0, 50));
      setTotalItems(filtered.length);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearchActive(false);
    setFilteredColleges(colleges);
    setItemsToShow(50); // Reset to initial load amount
    setDisplayedColleges(colleges.slice(0, 50));
    setTotalItems(colleges.length);
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
      setFilteredColleges(sortedItems);
      setTotalItems(sortedItems.length);
      setDisplayedColleges(sortedItems.slice(0, 50)); // Always start with 50
      setItemsToShow(50); // Reset items to show
      setLastUpdated(new Date());
      
      // Log for debugging
      console.log(`✅ Loaded ${sortedItems.length} colleges, displaying first 50`);
      console.log(`📊 Load More Button should ${sortedItems.length > 50 ? 'be visible' : 'be hidden'} (${sortedItems.length} total items)`);
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
      
      // Use a shorter delay for better responsiveness
      setTimeout(() => {
        const newItemsToShow = itemsToShow + 50;
        setItemsToShow(newItemsToShow);
        const sourceData = isSearchActive ? filteredColleges : colleges;
        setDisplayedColleges(sourceData.slice(0, newItemsToShow));
        setLoadingMore(false);
        
        // Log for debugging
        console.log(`📊 Load More: Showing ${Math.min(newItemsToShow, sourceData.length)} of ${sourceData.length} colleges`);
      }, 200); // Reduced delay for better UX
    } catch (err) {
      console.error('❌ Error loading more colleges:', err);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const sourceData = isSearchActive ? filteredColleges : colleges;
    setDisplayedColleges(sourceData.slice(0, itemsToShow));
    // Ensure totalItems is always in sync with the current data source
    setTotalItems(sourceData.length);
  }, [colleges, filteredColleges, itemsToShow, isSearchActive]);

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
          <p className="font-paragraph text-lg md:text-xl max-w-3xl mx-auto opacity-90 mb-8">
            Discover our network of affiliated member colleges and their dedicated librarians
          </p>
          
          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-white/70" />
              </div>
              <Input
                type="text"
                placeholder="Search colleges by name, librarian, or address..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-4 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20 focus:border-white/40 rounded-xl"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/70 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            {isSearchActive && (
              <p className="text-white/80 text-sm mt-2">
                Found {totalItems} college{totalItems !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            )}
          </div>

          <div className="mt-6">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <GraduationCap className="w-5 h-5 mr-2" />
              {totalItems} {isSearchActive ? 'Found' : 'Member'} Institution{totalItems !== 1 ? 's' : ''}
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
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-1">{isSearchActive ? totalItems : colleges.length}</div>
                    <div className="text-sm text-gray-600 font-medium">{isSearchActive ? 'Search Results' : 'Total Colleges'}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {(isSearchActive ? filteredColleges : colleges).filter(c => c.collegeName && c.email && c.phone).length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Complete Records</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {(isSearchActive ? filteredColleges : colleges).filter(c => c.url).length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">With Websites</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600 mb-1">
                      {(isSearchActive ? filteredColleges : colleges).filter(c => !c.collegeName || !c.email || !c.phone).length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Incomplete Records</div>
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
            <CardContent className="p-6">
              {/* Compact Card Grid Layout */}
              <div className="space-y-4">
                {displayedColleges.map((college, index) => (
                  <Card 
                    key={college._id} 
                    className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <CardContent className="p-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Serial Number - Compact */}
                        <div className="col-span-1">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg border border-primary/20">
                            <span className="font-heading font-bold text-primary text-sm">
                              {college.sl_no || college.sl_nno || college.sl_noo || (index + 1)}
                            </span>
                          </div>
                        </div>
                        
                        {/* College Name & Website - Left aligned */}
                        <div className="col-span-4">
                          <div className="text-left">
                            <h3 className="font-heading font-bold text-primary text-lg mb-1 leading-tight">
                              {college.collegeName || (
                                <span className="text-red-500 italic text-base">Missing college name</span>
                              )}
                            </h3>
                            {college.url && (
                              <a 
                                href={college.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-paragraph underline transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Visit Website
                              </a>
                            )}
                          </div>
                        </div>
                        
                        {/* Communication Address - Compact */}
                        <div className="col-span-3">
                          <div className="text-left">
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <p className="font-paragraph text-sm text-gray-700 leading-relaxed">
                                {(college.communicationAddress || college.communicationAdress) || (
                                  <span className="text-red-500 italic">Missing address</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Librarian Name - Compact */}
                        <div className="col-span-2">
                          <div className="text-left">
                            <p className="font-paragraph font-semibold text-primary text-sm">
                              {college.librarianName || (
                                <span className="text-red-500 italic">Missing librarian</span>
                              )}
                            </p>
                          </div>
                        </div>
                        
                        {/* Contact Information - Compact */}
                        <div className="col-span-2">
                          <div className="text-left space-y-1">
                            {/* Email */}
                            <div>
                              {college.email ? (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3 text-primary flex-shrink-0" />
                                  <a 
                                    href={`mailto:${college.email}`}
                                    className="text-primary hover:text-secondary transition-colors text-xs font-paragraph truncate"
                                    title={college.email}
                                  >
                                    {college.email}
                                  </a>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-3 h-3 text-gray-400" />
                                  <span className="text-red-500 italic text-xs">No email</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Phone */}
                            <div>
                              {college.phone ? (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3 text-primary flex-shrink-0" />
                                  <a 
                                    href={`tel:${college.phone}`}
                                    className="text-primary hover:text-secondary transition-colors text-xs font-paragraph"
                                  >
                                    {college.phone}
                                  </a>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3 h-3 text-gray-400" />
                                  <span className="text-red-500 italic text-xs">No phone</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status Badge - Only show if incomplete */}
                      {(!college.collegeName || !college.email || !college.phone) && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Incomplete Record
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Simple Load More Button - Always visible when more items available */}
          {displayedColleges.length < totalItems && totalItems > 0 && (
            <div className="mt-8 text-center">
              <Button 
                onClick={loadMoreColleges}
                disabled={loadingMore}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:transform-none"
                size="lg"
              >
                {loadingMore ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Load More ({totalItems - displayedColleges.length} remaining)
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Showing {displayedColleges.length} of {totalItems} colleges
              </p>
            </div>
          )}

          {/* Debug: Always show button for testing (remove this in production) */}
          {totalItems > 0 && displayedColleges.length >= totalItems && (
            <div className="mt-8 text-center">
              <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                <p className="text-green-800 font-semibold">✅ All colleges loaded!</p>
                <p className="text-sm text-green-600 mt-1">
                  Displaying all {totalItems} colleges
                </p>
              </div>
            </div>
          )}

          {colleges.length === 0 && !loading && (
            <Card className="mt-8">
              <CardContent className="p-8 text-center">
                <GraduationCap className="w-16 h-16 text-primary/30 mx-auto mb-4" />
                <h3 className="font-heading text-xl text-primary mb-2">
                  {isSearchActive ? 'No colleges found' : 'No Member Colleges Found'}
                </h3>
                <p className="font-paragraph text-gray-600 mb-4">
                  {isSearchActive 
                    ? `No colleges match your search for "${searchTerm}". Try adjusting your search terms.`
                    : 'Member college information will appear here once added to the system.'
                  }
                </p>
                {isSearchActive && (
                  <Button onClick={clearSearch} variant="outline" className="mb-4">
                    Clear Search
                  </Button>
                )}
                <div className="text-sm text-gray-500">
                  <p>For debugging, visit: <a href="/debug-member-colleges" className="text-primary underline">/debug-member-colleges</a></p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>


    </div>
  );
}