import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { EResources } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { ArrowLeft, ExternalLink, Calendar, User, BookOpen, Download } from 'lucide-react';

export default function ResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<EResources | null>(null);
  const [relatedResources, setRelatedResources] = useState<EResources[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResource = async () => {
      if (!id) return;
      
      try {
        const [resourceData, allResources] = await Promise.all([
          BaseCrudService.getById<EResources>('eresources', id),
          BaseCrudService.getAll<EResources>('eresources')
        ]);
        
        setResource(resourceData);
        
        // Find related resources by category
        const related = allResources.items
          .filter(r => r._id !== id && r.category === resourceData.category)
          .slice(0, 3);
        setRelatedResources(related);
      } catch (error) {
        console.error('Error fetching resource:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-heading text-xl">Loading resource...</div>
      </div>
    );
  }

  if (!resource) {
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
                <Link to="/guide" className="hover:text-secondary transition-colors">User Guide</Link>
              </div>
            </nav>
          </div>
        </header>

        <div className="max-w-[120rem] mx-auto px-6 py-16 text-center">
          <h1 className="font-heading text-3xl font-bold text-primary mb-4">Resource Not Found</h1>
          <p className="font-paragraph text-primary/70 mb-8">
            The resource you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/resources">
            <Button className="bg-primary hover:bg-primary/90">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Resources
            </Button>
          </Link>
        </div>
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

      {/* Breadcrumb */}
      <section className="bg-primary/5 py-4">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="font-paragraph text-primary/60 hover:text-primary">Home</Link>
            <span className="text-primary/40">/</span>
            <Link to="/resources" className="font-paragraph text-primary/60 hover:text-primary">E-Resources</Link>
            <span className="text-primary/40">/</span>
            <span className="font-paragraph text-primary">{resource.resourceTitle}</span>
          </div>
        </div>
      </section>

      {/* Resource Detail */}
      <section className="py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="mb-6">
            <Link to="/resources">
              <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Resources
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                    {resource.category}
                  </Badge>
                  <h1 className="font-heading text-4xl font-bold text-primary leading-tight">
                    {resource.resourceTitle}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-primary/70">
                    {resource.author && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span className="font-paragraph">By {resource.author}</span>
                      </div>
                    )}
                    {resource.publicationDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-paragraph">
                          Published {new Date(resource.publicationDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {resource.description && (
                  <div className="space-y-4">
                    <h2 className="font-heading text-2xl font-bold text-primary">Description</h2>
                    <p className="font-paragraph text-lg text-primary/80 leading-relaxed">
                      {resource.description}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  {resource.resourceLink && (
                    <Button 
                      size="lg"
                      className="bg-secondary hover:bg-secondary/90"
                      onClick={() => window.open(resource.resourceLink, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-5 w-5" />
                      Access Resource
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Resource Cover */}
              {resource.coverImage ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="aspect-[3/4] overflow-hidden rounded-lg">
                      <Image
                        src={resource.coverImage}
                        alt={resource.resourceTitle || 'Resource cover'}
                        className="w-full h-full object-cover"
                        width={300}
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-24 w-24 text-primary/30" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Resource Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-primary">Resource Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-paragraph font-semibold text-primary mb-1">Category</h4>
                    <p className="font-paragraph text-primary/70">{resource.category}</p>
                  </div>
                  {resource.author && (
                    <div>
                      <h4 className="font-paragraph font-semibold text-primary mb-1">Author</h4>
                      <p className="font-paragraph text-primary/70">{resource.author}</p>
                    </div>
                  )}
                  {resource.publicationDate && (
                    <div>
                      <h4 className="font-paragraph font-semibold text-primary mb-1">Publication Date</h4>
                      <p className="font-paragraph text-primary/70">
                        {new Date(resource.publicationDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Related Resources */}
      {relatedResources.length > 0 && (
        <section className="bg-primary/5 py-16">
          <div className="max-w-[120rem] mx-auto px-6">
            <h2 className="font-heading text-3xl font-bold text-primary mb-8">Related Resources</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {relatedResources.map((relatedResource) => (
                <Card key={relatedResource._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    {relatedResource.coverImage && (
                      <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg">
                        <Image
                          src={relatedResource.coverImage}
                          alt={relatedResource.resourceTitle || 'Resource cover'}
                          className="w-full h-full object-cover"
                          width={250}
                        />
                      </div>
                    )}
                    <CardTitle className="font-heading text-lg text-primary line-clamp-2">
                      {relatedResource.resourceTitle}
                    </CardTitle>
                    <CardDescription className="font-paragraph">
                      By {relatedResource.author}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                        {relatedResource.category}
                      </Badge>
                      <p className="font-paragraph text-sm text-primary/70 line-clamp-2">
                        {relatedResource.description}
                      </p>
                      <Link to={`/resources/${relatedResource._id}`}>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          View Resource
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

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