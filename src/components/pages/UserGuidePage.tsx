import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLiveData } from '@/hooks/use-live-data';
import { UserGuideArticles } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Image } from '@/components/ui/image';
import { Search, BookOpen, HelpCircle, User, Calendar, ArrowRight, Edit, Plus } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

export default function UserGuidePage() {
  const { user } = useAuth();
  const { data: articles, isLoading } = useLiveData<UserGuideArticles>('userguidearticles', [], 60000); // Poll every 60 seconds
  const [filteredArticles, setFilteredArticles] = useState<UserGuideArticles[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Check if user is superadmin or librarian for edit buttons
  const canEdit = user?.role === 'superadmin' || user?.role === 'librarian';

  useEffect(() => {
    // Sort by last updated (newest first) and set filtered articles
    const sortedArticles = [...articles].sort((a, b) => 
      new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime()
    );
    setFilteredArticles(sortedArticles);
  }, [articles]);

  useEffect(() => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article =>
        article.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredArticles(filtered);
  }, [searchTerm, selectedCategory, articles]);

  const categories = Array.from(new Set(articles.map(a => a.category).filter(Boolean)));

  // Group articles by category for the FAQ-style display
  const articlesByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredArticles.filter(article => article.category === category);
    return acc;
  }, {} as Record<string, UserGuideArticles[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-heading text-xl">Loading user guide...</div>
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
              <Link to="/journals" className="hover:text-secondary transition-colors">Journals</Link>
              <Link to="/news" className="hover:text-secondary transition-colors">News</Link>
              <Link to="/guide" className="text-secondary font-semibold">User Guide</Link>
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
            <div className="flex items-center justify-center space-x-4">
              <h1 className="font-heading text-5xl font-bold text-primary">
                USER GUIDE - Librarian/Nodal Officer
              </h1>
              {canEdit && (
                <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-white">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
              Comprehensive guides and tutorials to help you navigate and make the most 
              of our digital library platform and academic resources.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="py-12 border-b">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="font-heading text-xl text-primary">Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-paragraph text-primary/70 mb-4">
                  Learn the basics of navigating our platform and accessing resources.
                </p>
                <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                  Quick Start Guide
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="font-heading text-xl text-primary">Search & Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-paragraph text-primary/70 mb-4">
                  Master advanced search techniques and resource access methods.
                </p>
                <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                  Search Tips
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <HelpCircle className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="font-heading text-xl text-primary">Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-paragraph text-primary/70 mb-4">
                  Get help with technical issues and account management.
                </p>
                <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
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
                  placeholder="Search guides and tutorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-paragraph"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="font-paragraph text-sm text-primary">Filter by category:</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                  className={selectedCategory === 'all' ? 'bg-primary' : 'text-primary border-primary hover:bg-primary hover:text-primary-foreground'}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? 'bg-primary' : 'text-primary border-primary hover:bg-primary hover:text-primary-foreground'}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="font-paragraph text-sm text-primary/60">
              Showing {filteredArticles.length} of {articles.length} guides
            </p>
            <div className="flex items-center space-x-2">
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
              {canEdit && (
                <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary hover:text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guide
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Guide Content */}
      <section className="py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-primary/50" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary">No guides found</h3>
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
                  View All Guides
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {selectedCategory === 'all' ? (
                  // Show articles grouped by category
                  <div className="space-y-8">
                    {Object.entries(articlesByCategory).map(([category, categoryArticles]) => (
                      <div key={category} className="space-y-6">
                        <h2 className="font-heading text-3xl font-bold text-primary">{category}</h2>
                        
                        <Accordion type="single" collapsible className="space-y-4">
                          {categoryArticles.map((article) => (
                            <AccordionItem key={article._id} value={article._id} className="border border-primary/20 rounded-lg px-6">
                              <AccordionTrigger className="font-heading text-lg text-primary hover:text-secondary">
                                <div className="flex items-center justify-between w-full pr-4">
                                  <span>{article.title}</span>
                                  {canEdit && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-primary border-primary hover:bg-primary hover:text-white"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="space-y-4">
                                <div className="flex items-center space-x-4 text-sm text-primary/60">
                                  {article.author && (
                                    <div className="flex items-center space-x-1">
                                      <User className="h-3 w-3" />
                                      <span className="font-paragraph">By {article.author}</span>
                                    </div>
                                  )}
                                  {article.lastUpdated && (
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-3 w-3" />
                                      <span className="font-paragraph">
                                        Updated {new Date(article.lastUpdated).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="font-paragraph text-primary/80 prose prose-sm max-w-none">
                                  {article.content?.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-3">{paragraph}</p>
                                  ))}
                                </div>
                                
                                {article.slug && (
                                  <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    View Full Guide
                                  </Button>
                                )}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Show filtered articles as cards
                  <div className="space-y-6">
                    <h2 className="font-heading text-3xl font-bold text-primary">
                      {selectedCategory} ({filteredArticles.length})
                    </h2>
                    
                    <div className="grid gap-6">
                      {filteredArticles.map((article) => (
                        <Card key={article._id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <Badge variant="secondary" className="bg-secondary/10 text-secondary w-fit">
                                  {article.category}
                                </Badge>
                                <CardTitle className="font-heading text-xl text-primary">
                                  {article.title}
                                </CardTitle>
                                <div className="flex items-center space-x-4 text-sm text-primary/60">
                                  {article.author && (
                                    <div className="flex items-center space-x-1">
                                      <User className="h-3 w-3" />
                                      <span className="font-paragraph">By {article.author}</span>
                                    </div>
                                  )}
                                  {article.lastUpdated && (
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-3 w-3" />
                                      <span className="font-paragraph">
                                        Updated {new Date(article.lastUpdated).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {article.featuredImage && (
                                <div className="w-24 h-24 ml-4 overflow-hidden rounded-lg flex-shrink-0">
                                  <Image
                                    src={article.featuredImage}
                                    alt={article.title || 'Guide image'}
                                    className="w-full h-full object-cover"
                                    width={96}
                                  />
                                </div>
                              )}
                            </div>
                          </CardHeader>
                          
                          <CardContent>
                            <div className="space-y-4">
                              <p className="font-paragraph text-primary/80 line-clamp-3">
                                {article.content}
                              </p>
                              <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Read Full Guide
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Quick Links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-xl text-primary">Quick Links</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/resources" className="block font-paragraph text-primary/70 hover:text-secondary transition-colors">
                      → Browse E-Resources
                    </Link>
                    <Link to="/journals" className="block font-paragraph text-primary/70 hover:text-secondary transition-colors">
                      → Access Journals
                    </Link>
                    <Link to="/news" className="block font-paragraph text-primary/70 hover:text-secondary transition-colors">
                      → Latest News
                    </Link>
                    <div className="pt-2">
                      <Button className="w-full bg-secondary hover:bg-secondary/90">
                        Contact Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Popular Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="font-heading text-xl text-primary">Popular Topics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {categories.slice(0, 5).map((category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="w-full justify-start text-primary hover:bg-primary/10"
                      >
                        {category}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                {/* Help Section */}
                <Card className="bg-primary/5">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl text-primary">Need More Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-paragraph text-sm text-primary/70">
                      Can't find what you're looking for? Our support team is here to help.
                    </p>
                    <div className="space-y-2">
                      <p className="font-paragraph text-sm text-primary/60">
                        Email: support@academiclibrary.edu
                      </p>
                      <p className="font-paragraph text-sm text-primary/60">
                        Phone: +1 (555) 123-4567
                      </p>
                    </div>
                    <Button className="w-full bg-secondary hover:bg-secondary/90">
                      Contact Support
                    </Button>
                  </CardContent>
                </Card>
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