import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { EResources } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image } from '@/components/ui/image';
import { Search, Filter, BookOpen, FileText, Video, Newspaper } from 'lucide-react';

export default function ResourcesPage() {
  const [resources, setResources] = useState<EResources[]>([]);
  const [filteredResources, setFilteredResources] = useState<EResources[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await BaseCrudService.getAll<EResources>('eresources');
        setResources(response.items);
        setFilteredResources(response.items);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  useEffect(() => {
    let filtered = resources;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.resourceTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource =>
        resource.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredResources(filtered);
  }, [searchTerm, selectedCategory, resources]);

  const categories = Array.from(new Set(resources.map(r => r.category).filter(Boolean)));

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('book') || cat.includes('ebook')) return BookOpen;
    if (cat.includes('paper') || cat.includes('research')) return FileText;
    if (cat.includes('video') || cat.includes('lecture')) return Video;
    if (cat.includes('journal') || cat.includes('article')) return Newspaper;
    return BookOpen;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-heading text-xl">Loading resources...</div>
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
              <Link to="/resources" className="text-secondary font-semibold">E-Resources</Link>
              <Link to="/journals" className="hover:text-secondary transition-colors">Journals</Link>
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
          <div className="text-center space-y-4">
            <h1 className="font-heading text-5xl font-bold text-primary">
              E-RESOURCES
            </h1>
            <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
              Discover thousands of academic resources including e-books, research papers, 
              journals, and multimedia content from leading institutions worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 border-b">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50 h-4 w-4" />
                <Input
                  placeholder="Search resources, authors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-paragraph"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-primary" />
                <span className="font-paragraph text-sm text-primary">Filter by:</span>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 font-paragraph">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category || ''}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="font-paragraph text-sm text-primary/60">
              Showing {filteredResources.length} of {resources.length} resources
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          {filteredResources.length === 0 ? (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-primary/50" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary">No resources found</h3>
                <p className="font-paragraph text-primary/60 max-w-md mx-auto">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  View All Resources
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResources.map((resource) => {
                const CategoryIcon = getCategoryIcon(resource.category || '');
                return (
                  <Card key={resource._id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      {resource.coverImage ? (
                        <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg">
                          <Image
                            src={resource.coverImage}
                            alt={resource.resourceTitle || 'Resource cover'}
                            className="w-full h-full object-cover"
                            width={250}
                          />
                        </div>
                      ) : (
                        <div className="aspect-[3/4] mb-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                          <CategoryIcon className="h-16 w-16 text-primary/30" />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Badge variant="secondary" className="bg-secondary/10 text-secondary w-fit">
                          {resource.category}
                        </Badge>
                        <CardTitle className="font-heading text-lg text-primary line-clamp-2 leading-tight">
                          {resource.resourceTitle}
                        </CardTitle>
                        <CardDescription className="font-paragraph text-sm">
                          By {resource.author}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <p className="font-paragraph text-sm text-primary/70 line-clamp-3">
                          {resource.description}
                        </p>
                        
                        {resource.publicationDate && (
                          <p className="font-paragraph text-xs text-primary/50">
                            Published: {new Date(resource.publicationDate).toLocaleDateString()}
                          </p>
                        )}
                        
                        <div className="flex flex-col gap-2">
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={() => {
                              if (resource.resourceLink) {
                                window.open(resource.resourceLink, '_blank');
                              }
                            }}
                          >
                            Access Resource
                          </Button>
                          <Link to={`/resources/${resource._id}`}>
                            <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
              © 2024 Academic Library Consortium. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}