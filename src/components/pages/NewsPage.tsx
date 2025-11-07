import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLiveData } from '@/hooks/use-live-data';
import { NewsandEvents } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Newspaper, Calendar, User, Search, ExternalLink, Star } from 'lucide-react';

export default function NewsPage() {
  const { data: news, isLoading } = useLiveData<NewsandEvents>('newsandnotifications');
  const [filteredNews, setFilteredNews] = useState<NewsandEvents[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Sort by publication date (newest first) and set filtered news
    const sortedNews = [...news].sort((a, b) => 
      new Date(b.publicationDate || 0).getTime() - new Date(a.publicationDate || 0).getTime()
    );
    setFilteredNews(sortedNews);
  }, [news]);

  useEffect(() => {
    if (searchTerm) {
      const sortedNews = [...news].sort((a, b) => 
        new Date(b.publicationDate || 0).getTime() - new Date(a.publicationDate || 0).getTime()
      );
      const filtered = sortedNews.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNews(filtered);
    } else {
      const sortedNews = [...news].sort((a, b) => 
        new Date(b.publicationDate || 0).getTime() - new Date(a.publicationDate || 0).getTime()
      );
      setFilteredNews(sortedNews);
    }
  }, [searchTerm, news]);

  const featuredNews = filteredNews.filter(item => item.isFeatured);
  const regularNews = filteredNews.filter(item => !item.isFeatured);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-heading text-xl">Loading news...</div>
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
              <Link to="/news" className="text-secondary font-semibold">News</Link>
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
              NEWS & NOTIFICATIONS
            </h1>
            <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
              Stay informed with the latest updates, announcements, and developments 
              from the academic library consortium and research community.
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
                  placeholder="Search news, announcements, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-paragraph"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between w-full md:w-auto">
              <p className="font-paragraph text-sm text-primary/60">
                Showing {filteredNews.length} of {news.length} articles
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

      {/* News Content */}
      <section className="py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          {filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Newspaper className="h-8 w-8 text-primary/50" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-primary">No news found</h3>
                <p className="font-paragraph text-primary/60 max-w-md mx-auto">
                  {searchTerm 
                    ? "Try adjusting your search terms to find what you're looking for."
                    : "No news articles are currently available."
                  }
                </p>
                {searchTerm && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm('')}
                    className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    View All News
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured News */}
              {featuredNews.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <Star className="h-6 w-6 text-secondary" />
                    <h2 className="font-heading text-3xl font-bold text-primary">Featured News</h2>
                  </div>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    {featuredNews.slice(0, 2).map((item) => (
                      <Card key={item._id} className="hover:shadow-lg transition-shadow border-secondary/20">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-4">
                            <Badge className="bg-secondary text-secondary-foreground">
                              Featured
                            </Badge>
                            {item.publicationDate && (
                              <div className="flex items-center space-x-2 text-primary/60">
                                <Calendar className="h-4 w-4" />
                                <span className="font-paragraph text-sm">
                                  {new Date(item.publicationDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <CardTitle className="font-heading text-2xl text-primary line-clamp-2 leading-tight">
                            {item.title}
                          </CardTitle>
                          
                          {item.author && (
                            <CardDescription className="font-paragraph flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>By {item.author}</span>
                            </CardDescription>
                          )}
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-4">
                            <p className="font-paragraph text-primary/80 line-clamp-4">
                              {item.content}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Button className="bg-secondary hover:bg-secondary/90">
                                Read Full Article
                              </Button>
                              {item.externalLink && (
                                <Button 
                                  variant="outline"
                                  onClick={() => window.open(item.externalLink, '_blank')}
                                  className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  External Link
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {featuredNews.length > 2 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredNews.slice(2).map((item) => (
                        <Card key={item._id} className="hover:shadow-lg transition-shadow border-secondary/20">
                          <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                                Featured
                              </Badge>
                              {item.publicationDate && (
                                <span className="font-paragraph text-xs text-primary/50">
                                  {new Date(item.publicationDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            
                            <CardTitle className="font-heading text-lg text-primary line-clamp-2">
                              {item.title}
                            </CardTitle>
                            
                            {item.author && (
                              <CardDescription className="font-paragraph text-sm">
                                By {item.author}
                              </CardDescription>
                            )}
                          </CardHeader>
                          
                          <CardContent>
                            <div className="space-y-3">
                              <p className="font-paragraph text-sm text-primary/70 line-clamp-3">
                                {item.content}
                              </p>
                              <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                                Read More
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Regular News */}
              {regularNews.length > 0 && (
                <div className="space-y-8">
                  <h2 className="font-heading text-3xl font-bold text-primary">
                    Latest Updates ({regularNews.length})
                  </h2>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularNews.map((item) => (
                      <Card key={item._id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Newspaper className="h-4 w-4 text-secondary" />
                              <span className="font-paragraph text-sm text-primary/60">News</span>
                            </div>
                            {item.publicationDate && (
                              <span className="font-paragraph text-xs text-primary/50">
                                {new Date(item.publicationDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          
                          <CardTitle className="font-heading text-lg text-primary line-clamp-2">
                            {item.title}
                          </CardTitle>
                          
                          {item.author && (
                            <CardDescription className="font-paragraph text-sm">
                              By {item.author}
                            </CardDescription>
                          )}
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-4">
                            <p className="font-paragraph text-sm text-primary/70 line-clamp-4">
                              {item.content}
                            </p>
                            
                            <div className="flex flex-col gap-2">
                              <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                                Read Full Article
                              </Button>
                              {item.externalLink && (
                                <Button 
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(item.externalLink, '_blank')}
                                  className="w-full text-primary hover:bg-primary/10"
                                >
                                  <ExternalLink className="mr-2 h-3 w-3" />
                                  External Source
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center space-y-6">
            <h2 className="font-heading text-3xl font-bold text-primary">Stay Informed</h2>
            <p className="font-paragraph text-lg text-primary/70 max-w-2xl mx-auto">
              Subscribe to our newsletter to receive the latest news, updates, and announcements 
              directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email address"
                className="font-paragraph"
              />
              <Button className="bg-secondary hover:bg-secondary/90 whitespace-nowrap">
                Subscribe Now
              </Button>
            </div>
          </div>
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