import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { EResources, NewsandNotifications } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { BookOpen, FileText, Newspaper, Users, Search, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [featuredResources, setFeaturedResources] = useState<EResources[]>([]);
  const [latestNews, setLatestNews] = useState<NewsandNotifications[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resourcesResponse, newsResponse] = await Promise.all([
          BaseCrudService.getAll<EResources>('eresources'),
          BaseCrudService.getAll<NewsandNotifications>('newsandnotifications')
        ]);

        setFeaturedResources(resourcesResponse.items.slice(0, 3));
        setLatestNews(newsResponse.items
          .sort((a, b) => new Date(b.publicationDate || 0).getTime() - new Date(a.publicationDate || 0).getTime())
          .slice(0, 3)
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-heading text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <div className="font-heading text-2xl font-bold">
              Academic Library Consortium
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
              <Link to="/resources" className="hover:text-secondary transition-colors">E-Resources</Link>
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

      {/* Hero Section - Inspired by the layout structure */}
      <section className="w-full max-w-[120rem] mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-heading text-6xl lg:text-7xl font-bold text-primary leading-tight">
                KNOWLEDGE
                <br />
                <span className="text-primary italic">DRIVEN</span>
                <br />
                <span className="text-secondary">ACADEMIC</span>
                <br />
                <span className="text-secondary">EXCELLENCE</span>
              </h1>
            </div>
            
            <div className="space-y-6">
              <p className="font-paragraph text-lg text-primary/80 max-w-lg">
                Access thousands of academic resources, research papers, and scholarly journals 
                from leading institutions worldwide. Advance your research with our comprehensive 
                digital library platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-lg px-8">
                  Explore Resources
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden">
              <Image
                src="https://static.wixstatic.com/media/e79745_bf01863a3c5846ec8d5a5f6a6b2f132b~mv2.png?originWidth=576&originHeight=448"
                alt="Students studying in a modern academic library with digital resources"
                className="w-full h-full object-cover"
                width={600}
              />
            </div>
            {/* Overlay element */}
            <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground p-4 rounded-full">
              <Search className="h-8 w-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Three column layout inspired by the image */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-primary mb-4">
              EMPOWERING RESEARCH
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-secondary text-secondary-foreground p-2 rounded">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary">
                  DIGITAL LIBRARY
                  <br />
                  ACCESS
                </h3>
              </div>
              <p className="font-paragraph text-primary/70">
                Comprehensive access to e-books and digital publications from 
                leading academic publishers. Search through millions of titles 
                across all disciplines with advanced filtering capabilities.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-secondary text-secondary-foreground p-2 rounded">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary">
                  RESEARCH PAPERS
                  <br />
                  & JOURNALS
                </h3>
              </div>
              <p className="font-paragraph text-primary/70">
                Access peer-reviewed research papers and scholarly journals from 
                top-tier publications. Stay current with the latest research in 
                your field with real-time updates and notifications.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-secondary text-secondary-foreground p-2 rounded">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-primary">
                  COLLABORATIVE
                  <br />
                  PLATFORM
                </h3>
              </div>
              <p className="font-paragraph text-primary/70">
                Connect with researchers worldwide through our collaborative 
                platform. Share resources, participate in discussions, and 
                build academic networks that advance your research goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-primary">Featured Resources</h2>
            <Link to="/resources">
              <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                View All Resources
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredResources.map((resource) => (
              <Card key={resource._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  {resource.coverImage && (
                    <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={resource.coverImage}
                        alt={resource.resourceTitle || 'Resource cover'}
                        className="w-full h-full object-cover"
                        width={300}
                      />
                    </div>
                  )}
                  <CardTitle className="font-heading text-xl text-primary line-clamp-2">
                    {resource.resourceTitle}
                  </CardTitle>
                  <CardDescription className="font-paragraph">
                    By {resource.author}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                      {resource.category}
                    </Badge>
                    <p className="font-paragraph text-sm text-primary/70 line-clamp-3">
                      {resource.description}
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Access Resource
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-primary">Latest Updates</h2>
            <Link to="/news">
              <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                View All News
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestNews.map((news) => (
              <Card key={news._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <Newspaper className="h-4 w-4 text-secondary" />
                    <span className="font-paragraph text-sm text-primary/60">
                      {news.publicationDate ? new Date(news.publicationDate).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <CardTitle className="font-heading text-xl text-primary line-clamp-2">
                    {news.title}
                  </CardTitle>
                  {news.author && (
                    <CardDescription className="font-paragraph">
                      By {news.author}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="font-paragraph text-sm text-primary/70 line-clamp-3 mb-4">
                    {news.content}
                  </p>
                  <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
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