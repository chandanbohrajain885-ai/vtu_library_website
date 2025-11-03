import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { EResources, NewsandNotifications } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Image } from '@/components/ui/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookOpen, Download, Users, Search, Calendar, User, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, ChevronDown } from 'lucide-react';

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800 font-heading text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header Bar */}
      <div className="bg-black text-white py-2">
        <div className="max-w-[120rem] mx-auto px-6 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <Image 
              src="https://static.wixstatic.com/media/e79745_a590d112b3ad43e79706847a20a075d5~mv2.png"
              alt="VTU Consortium Logo"
              width={50}
              className="h-12 w-12 object-contain"
            />
            <span className="font-bold text-2xl">{"VTU Consortium"}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Email: library@vtu.ac.in</span>
            <span>Phone: 08312498191</span>
          </div>
        </div>
      </div>
      {/* Main Navigation */}
      <header className="bg-orange-500 text-white shadow-lg">
        <div className="max-w-[120rem] mx-auto px-6 py-4 bg-primary">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">

            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-orange-200 transition-colors font-semibold">Home</Link>
              <Link to="/resources" className="hover:text-orange-200 transition-colors">E-Resources</Link>
              <Link to="/news" className="hover:text-orange-200 transition-colors">{"Downloads"}</Link>
              <Link to="/guide" className="hover:text-orange-200 transition-colors">Notifications</Link>
              <Link to="/guide" className="hover:text-orange-200 transition-colors">Links</Link>
            <Link to="/journals" className="hover:text-orange-200 transition-colors">{"ONOS"}</Link>
              </div>
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600 text-white px-6 flex items-center space-x-2">
                    <span>Login</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="cursor-pointer">
                    Admin Login
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Librarian/Nodal-officer Login
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Publisher's Login
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6">
                Register
              </Button>
            </div>
          </nav>
        </div>
      </header>
      {/* Hero Section with Library Background */}
      <section className="relative bg-gray-900 text-white py-20" style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://static.wixstatic.com/media/e79745_99252604bb974a358c5f83d03aa2dd0e~mv2.png?originWidth=1600&originHeight=768')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="max-w-[120rem] mx-auto px-6 text-center">
          <div className="space-y-6">
            <h1 className="font-heading text-5xl lg:text-6xl font-bold">{"Welcome to VTU Consortium"}</h1>
            <p className="font-paragraph text-xl text-gray-200 max-w-3xl mx-auto">{"Symbolizes the connection between learning resources and learners."}</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8">
            <div className="flex">
              <Input
                  placeholder="Search for books, journals, or specific topics you are interested in..."
                  className="flex-1 h-12 rounded-r-none border-[4px] border-[#ff8301] border-solid text-[#ffffff] opacity-[1] bg-primary-foreground"
                />
              <Button className="bg-orange-500 hover:bg-orange-600 h-12 px-8 rounded-l-none">
              <Search className="h-5 w-5" />
            </Button>
            </div>
          </div>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Download className="mr-2 h-4 w-4" />
                Journals
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <BookOpen className="mr-2 h-4 w-4" />
                E-Books
              </Button>

              <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                <Users className="mr-2 h-4 w-4" />
                Video Lectures
              </Button>
            </div>
          {/* Quick Access Buttons */}
            </div>
        </div>
      </section>
      {/* Library Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-gray-800 mb-4">
              Library Features
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-orange-500" />
                </div>
                <CardTitle className="font-heading text-xl text-gray-800">Digital Reading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-paragraph text-gray-600">
                  Access thousands of e-books and digital resources from anywhere, anytime
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Download className="h-8 w-8 text-orange-500" />
                </div>
                <CardTitle className="font-heading text-xl text-gray-800">Download Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-paragraph text-gray-600">
                  Download research papers, journals and educational materials for offline access
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-white">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-orange-500" />
                </div>
                <CardTitle className="font-heading text-xl text-gray-800">Collaborative Research</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-paragraph text-gray-600">
                  Connect with peers and participate in collaborative research projects
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Latest Resources Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-gray-800">Latest Resources</h2>
            <Link to="/resources">
              <Button variant="outline" className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white">
                View all Resources →
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* University Building Image Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <Image
                    src="https://static.wixstatic.com/media/e79745_1aaeb2c0f1414d29b36e92ef5ce85de5~mv2.png?originWidth=640&originHeight=384"
                    alt="Visvesvaraya Technology University Building"
                    className="w-full h-full object-cover"
                    width={400}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <h3 className="font-heading text-lg font-bold text-gray-800">
                    Visvesvaraya Technology University, Belagavi
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Advanced Computer Networks</span>
                    </div>
                  </div>
                  <p className="font-paragraph text-sm text-gray-600">
                    Explore advanced networking concepts and protocols
                  </p>
                </div>
              </CardContent>
            </Card>

            {featuredResources.slice(0, 2).map((resource) => (
              <Card key={resource._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  {resource.coverImage && (
                    <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={resource.coverImage}
                        alt={resource.resourceTitle || 'Resource cover'}
                        className="w-full h-full object-cover"
                        width={300}
                      />
                    </div>
                  )}
                  <CardTitle className="font-heading text-lg text-gray-800 line-clamp-2">
                    {resource.resourceTitle}
                  </CardTitle>
                  <CardDescription className="font-paragraph">
                    By {resource.author}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-600">
                      {resource.category}
                    </Badge>
                    <p className="font-paragraph text-sm text-gray-600 line-clamp-3">
                      {resource.description}
                    </p>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      Access Resource
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* How to Use the Library Section */}
      {/* Library News & Events */}
      <section className="py-16 bg-white">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-gray-800 mb-4">{"News & Events"}</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-l-4 border-orange-500">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded flex items-center justify-center font-bold text-sm">
                    11
                  </div>
                  <span className="text-sm text-gray-500">Nov</span>
                </div>
                <CardTitle className="font-heading text-lg text-gray-800">
                  New Scientific Journals Added
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-paragraph text-sm text-gray-600 mb-4">
                  Over 500 new scientific journals have been added to our collection
                </p>
                <Button variant="outline" size="sm" className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white">
                  Read More
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-orange-500">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded flex items-center justify-center font-bold text-sm">
                    10
                  </div>
                  <span className="text-sm text-gray-500">Nov</span>
                </div>
                <CardTitle className="font-heading text-lg text-gray-800">
                  Workshop on Research Methodology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-paragraph text-sm text-gray-600 mb-4">
                  Join us for a free day workshop on advanced research methodology
                </p>
                <Button variant="outline" size="sm" className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white">
                  Read More
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-l-4 border-orange-500">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded flex items-center justify-center font-bold text-sm">
                    09
                  </div>
                  <span className="text-sm text-gray-500">Nov</span>
                </div>
                <CardTitle className="font-heading text-lg text-gray-800">
                  Extended Library Hours During Exams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-paragraph text-sm text-gray-600 mb-4">
                  The digital library will be accessible 24/7 during the examination period
                </p>
                <Button variant="outline" size="sm" className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white">
                  Read More
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link to="/news">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8">
                View all News →
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-heading text-xl font-bold">About Us</h3>
              <p className="font-paragraph text-gray-300 text-sm">
                VTU Consortium Digital Library provides comprehensive digital resources for academic, faculty, and research communities.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-heading text-lg font-semibold">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/resources" className="block font-paragraph text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  E-Resources
                </Link>
                <Link to="/journals" className="block font-paragraph text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Journals
                </Link>
                <Link to="/news" className="block font-paragraph text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Consortium
                </Link>
                <Link to="/guide" className="block font-paragraph text-gray-300 hover:text-orange-400 transition-colors text-sm">
                  Notifications
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-heading text-lg font-semibold">Contact Us</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-orange-400" />
                  <p className="font-paragraph text-gray-300 text-sm">VTU Main Campus, Belagavi, Karnataka</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-orange-400" />
                  <p className="font-paragraph text-gray-300 text-sm">08312498191</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-orange-400" />
                  <p className="font-paragraph text-gray-300 text-sm">library@vtu.ac.in</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-heading text-lg font-semibold">Follow Us</h4>
              <div className="flex space-x-4">
                <Facebook className="h-5 w-5 text-gray-300 hover:text-orange-400 cursor-pointer transition-colors" />
                <Twitter className="h-5 w-5 text-gray-300 hover:text-orange-400 cursor-pointer transition-colors" />
                <Linkedin className="h-5 w-5 text-gray-300 hover:text-orange-400 cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 text-gray-300 hover:text-orange-400 cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="font-paragraph text-gray-400 text-sm">
              © 2024 VTU Consortium Digital Library. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}