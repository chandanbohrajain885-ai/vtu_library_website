import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { EResources } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Image } from '@/components/ui/image';
import { Search, BookOpen, ExternalLink, Calendar, ArrowLeft } from 'lucide-react';

export default function JournalsPage() {
  const [journals, setJournals] = useState<EResources[]>([]);
  const [filteredJournals, setFilteredJournals] = useState<EResources[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await BaseCrudService.getAll<EResources>('eresources');
        // Filter for journal-type resources
        const journalResources = response.items.filter(resource => 
          resource.eJournals ||
          resource.title?.toLowerCase().includes('journal') ||
          resource.title?.toLowerCase().includes('article') ||
          resource.title?.toLowerCase().includes('paper')
        );
        setJournals(journalResources);
        setFilteredJournals(journalResources);
      } catch (error) {
        console.error('Error fetching journals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournals();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = journals.filter(journal =>
        journal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.eJournals?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.resourceList?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJournals(filtered);
    } else {
      setFilteredJournals(journals);
    }
  }, [searchTerm, journals]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-heading text-xl">Loading journals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="font-heading text-2xl font-bold">
              Academic Library Consortium
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
              <Link to="/resources" className="hover:text-secondary transition-colors">E-Resources</Link>
              <Link to="/journals" className="text-secondary font-semibold">Journals</Link>
              <Link to="/news" className="hover:text-secondary transition-colors">News</Link>
              <Link to="/guide" className="hover:text-secondary transition-colors">User Guide</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Sign In
              </Button>
              <Button className="bg-secondary hover:bg-secondary/90">
                Get Access
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-[120rem] mx-auto px-6">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/">
              <Button 
                variant="outline" 
                className="bg-white text-primary hover:bg-gray-100 border-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="text-center space-y-4">
            <h1 className="font-heading text-5xl font-bold text-primary">
              ACADEMIC JOURNALS
            </h1>
            <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
              Access peer-reviewed journals and research publications from leading academic institutions. 
              Stay current with the latest research in your field.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 border-b">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 h-4 w-4" />
                <Input
                  placeholder="Search journals, authors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-paragraph"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between w-full md:w-auto">
              <p className="font-paragraph text-sm text-primary/60">
                Showing {filteredJournals.length} of {journals.length} journals
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="ml-4 text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Journals Grid */}
      <section className="py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          {filteredJournals.length === 0 ? (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-primary/50" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary">No journals found</h3>
                <p className="font-paragraph text-primary/60 max-w-md mx-auto">
                  {searchTerm 
                    ? "Try adjusting your search terms to find what you're looking for."
                    : "No journal resources are currently available in our collection."
                  }
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                    className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    View All Journals
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured Journal */}
              {filteredJournals.length > 0 && (
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                          Featured Journal
                        </Badge>
                        <h2 className="font-heading text-3xl font-bold text-primary">
                          {filteredJournals[0].title || 'Untitled Journal'}
                        </h2>
                        <p className="font-paragraph text-lg text-primary/70">
                          {filteredJournals[0].eJournals && `Category: ${filteredJournals[0].eJournals}`}
                        </p>
                        {filteredJournals[0]._createdDate && (
                          <div className="flex items-center space-x-2 text-primary/60">
                            <Calendar className="h-4 w-4" />
                            <span className="font-paragraph text-sm">
                              Added {new Date(filteredJournals[0]._createdDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <p className="font-paragraph text-primary/80">
                        {filteredJournals[0].resourceList || 'No description available.'}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button 
                          className="bg-secondary hover:bg-secondary/90"
                          onClick={() => {
                            if (filteredJournals[0].resourceList) {
                              window.open(filteredJournals[0].resourceList, '_blank');
                            }
                          }}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Access Journal
                        </Button>
                        <Link to={`/resources/${filteredJournals[0]._id}`}>
                          <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg shadow-lg flex items-center justify-center">
                        <BookOpen className="h-24 w-24 text-primary/40" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* All Journals Grid */}
              <div>
                <h3 className="font-heading text-2xl font-bold text-primary mb-6">
                  All Journals ({filteredJournals.length})
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJournals.map((journal) => (
                    <Card key={journal._id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardHeader className="pb-3">
                        <div className="aspect-[3/4] mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-primary/30" />
                        </div>
                        
                        <div className="space-y-2">
                          <Badge variant="secondary" className="bg-secondary/10 text-secondary w-fit">
                            {journal.eJournals || 'Journal'}
                          </Badge>
                          <CardTitle className="font-heading text-lg text-primary line-clamp-2 leading-tight">
                            {journal.title || 'Untitled Journal'}
                          </CardTitle>
                          <CardDescription className="font-paragraph text-sm">
                            E-Journal Resource
                          </CardDescription>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <p className="font-paragraph text-sm text-primary/70 line-clamp-3">
                            {journal.resourceList || 'No description available.'}
                          </p>
                          
                          {journal._createdDate && (
                            <div className="flex items-center space-x-2 text-primary/50">
                              <Calendar className="h-3 w-3" />
                              <span className="font-paragraph text-xs">
                                {new Date(journal._createdDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex flex-col gap-2">
                            <Button 
                              className="w-full bg-primary hover:bg-primary/90"
                              onClick={() => {
                                if (journal.resourceList) {
                                  window.open(journal.resourceList, '_blank');
                                }
                              }}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Access Journal
                            </Button>
                            <Link to={`/resources/${journal._id}`}>
                              <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-heading text-xl font-bold">Academic Library Consortium</h3>
              <p className="font-paragraph text-primary-foreground/80">
                Advancing research and education through comprehensive digital library services.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-heading text-lg font-semibold">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/resources" className="block font-paragraph text-primary-foreground/80 hover:text-secondary transition-colors">
                  E-Resources
                </Link>
                <Link to="/journals" className="block font-paragraph text-primary-foreground/80 hover:text-secondary transition-colors">
                  Journals
                </Link>
                <Link to="/news" className="block font-paragraph text-primary-foreground/80 hover:text-secondary transition-colors">
                  News & Updates
                </Link>
                <Link to="/guide" className="block font-paragraph text-primary-foreground/80 hover:text-secondary transition-colors">
                  User Guide
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-heading text-lg font-semibold">Support</h4>
              <div className="space-y-2">
                <p className="font-paragraph text-primary-foreground/80">
                  Email: support@academiclibrary.edu
                </p>
                <p className="font-paragraph text-primary-foreground/80">
                  Phone: +1 (555) 123-4567
                </p>
                <p className="font-paragraph text-primary-foreground/80">
                  Hours: Mon-Fri 8AM-6PM EST
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-heading text-lg font-semibold">Connect</h4>
              <p className="font-paragraph text-primary-foreground/80">
                Stay updated with the latest academic resources and research opportunities.
              </p>
              <Button className="bg-secondary hover:bg-secondary/90">
                Subscribe to Updates
              </Button>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
            <p className="font-paragraph text-primary-foreground/60">
              © 2025 VTU Consortium Portal. All Rights Reserved.
            </p>
            <a 
              href="https://www.inerasoftware.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-paragraph text-primary-foreground/60 text-sm hover:text-secondary transition-colors cursor-pointer"
            >
              Powered by INERA SOFTWARE
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}