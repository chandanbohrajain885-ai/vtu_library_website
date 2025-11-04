import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { EResources, NewsandNotifications } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Image } from '@/components/ui/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookOpen, Download, Users, Search, Calendar, User, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [featuredResources, setFeaturedResources] = useState<EResources[]>([]);
  const [latestNews, setLatestNews] = useState<NewsandNotifications[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleProtectedAction = (action: () => void) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    action();
  };

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
          .slice(0, 6) // Increased to 6 for better scrolling effect
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-scroll effect for news cards
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || latestNews.length === 0) return;

    const scrollWidth = scrollContainer.scrollWidth;
    const clientWidth = scrollContainer.clientWidth;
    
    if (scrollWidth <= clientWidth) return; // No need to scroll if content fits

    let scrollPosition = 0;
    const scrollSpeed = 1; // pixels per frame
    
    const scroll = () => {
      scrollPosition += scrollSpeed;
      
      if (scrollPosition >= scrollWidth - clientWidth) {
        scrollPosition = 0; // Reset to start
      }
      
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 50); // 50ms interval for smooth scrolling

    return () => clearInterval(intervalId);
  }, [latestNews]);

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
            <a href="https://vtu.ac.in" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
              <Image 
                src="https://static.wixstatic.com/media/e79745_a590d112b3ad43e79706847a20a075d5~mv2.png"
                alt="VTU Consortium Logo"
                width={50}
                className="h-12 w-12 object-contain cursor-pointer hover:opacity-80 transition-opacity"
              />
              <span className="font-bold text-2xl cursor-pointer hover:opacity-80 transition-opacity">{"VTU Consortium"}</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <span>Email: <a href="mailto:vtuconsortium@gmail.com" className="hover:text-orange-400 transition-colors">vtuconsortium@gmail.com</a></span>
            <span>Phone: 08312498191</span>
          </div>
        </div>
      </div>
      {/* Unified Navigation Bar */}
      <header className="bg-orange-500 text-white shadow-lg">
        <div className="max-w-[120rem] mx-auto px-6 py-4 bg-primary">
          <nav className="flex items-center justify-between">
            {/* All Navigation Options in Single Line */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              <Link to="/" className="hover:text-orange-200 transition-colors font-semibold">Home</Link>
              <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal" onClick={() => handleProtectedAction(() => navigate('/resources'))}>
                E-Resources
              </Button>
              <button onClick={() => handleProtectedAction(() => navigate('/news'))} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">Downloads</button>
              <button onClick={() => handleProtectedAction(() => navigate('/guide'))} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">Notifications</button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal" onClick={() => handleProtectedAction(() => {})}>
                    Links <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleProtectedAction(() => {})}>
                    VTU Link's
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => handleProtectedAction(() => {})}>
                    Others link's
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button onClick={() => handleProtectedAction(() => navigate('/journals'))} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">ONOS</button>
              <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal" onClick={() => handleProtectedAction(() => {})}>
                About Us
              </Button>
              <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal" onClick={() => handleProtectedAction(() => {})}>
                Committee
              </Button>
              <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal" onClick={() => handleProtectedAction(() => {})}>
                Training
              </Button>
              <button onClick={() => handleProtectedAction(() => navigate('/guide'))} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">User Guide</button>
              <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal" onClick={() => handleProtectedAction(() => {})}>
                Gallery
              </Button>
            </div>
            
            {/* Login and Register Buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white">Welcome, {user?.username}</span>
                  {user?.role === 'superadmin' && (
                    <Button onClick={() => navigate('/admin')} className="bg-purple-500 hover:bg-purple-600 text-white px-4">
                      Admin Panel
                    </Button>
                  )}
                  <Button onClick={logout} variant="outline" className="text-white border-white hover:bg-white hover:text-orange-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button onClick={() => setIsLoginModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white px-6">
                    Login
                  </Button>
                  <Button onClick={() => setIsLoginModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-6">
                    Register
                  </Button>
                </>
              )}
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
                  className="flex-1 h-12 rounded-r-none text-black bg-primary-foreground border-[4px] border-[#f39c0a] border-solid placeholder:text-gray-500"
                  onClick={() => handleProtectedAction(() => {})}
                />
              <Button 
                className="hover:bg-orange-600 h-12 px-8 rounded-l-none bg-[#e79100] border-[4px] border-[#f39c0a] border-solid"
                onClick={() => handleProtectedAction(() => {})}
              >
              <Search className="h-5 w-5" />
            </Button>
            </div>
          </div>

          {/* Quick Access Buttons - Removed */}
          </div>
        </div>
      </section>
      {/* Library Features Section */}
      {/* Latest Resources Section */}
      {/* How to Use the Library Section */}
      {/* Library News & Events */}
      <section className="py-16 bg-white">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-gray-800 mb-4">{"News & Events"}</h2>
          </div>

          {/* Scrolling News Cards */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-hidden"
            style={{ scrollBehavior: 'smooth' }}
          >
            {latestNews.map((news, index) => (
              <Card key={news._id || index} className="hover:shadow-lg transition-shadow border-l-4 border-orange-500 min-w-[300px] flex-shrink-0">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded flex items-center justify-center font-bold text-sm">
                      {new Date(news.publicationDate || Date.now()).getDate()}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(news.publicationDate || Date.now()).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                  <CardTitle className="font-heading text-lg text-gray-800">
                    {news.title || 'News Title'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-paragraph text-sm text-gray-600 mb-4">
                    {news.content?.substring(0, 100) || 'News content...'}...
                  </p>
                  <Button variant="outline" size="sm" className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
            {/* Duplicate cards for seamless scrolling */}
            {latestNews.map((news, index) => (
              <Card key={`duplicate-${news._id || index}`} className="hover:shadow-lg transition-shadow border-l-4 border-orange-500 min-w-[300px] flex-shrink-0">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded flex items-center justify-center font-bold text-sm">
                      {new Date(news.publicationDate || Date.now()).getDate()}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(news.publicationDate || Date.now()).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                  <CardTitle className="font-heading text-lg text-gray-800">
                    {news.title || 'News Title'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-paragraph text-sm text-gray-600 mb-4">
                    {news.content?.substring(0, 100) || 'News content...'}...
                  </p>
                  <Button variant="outline" size="sm" className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">

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
                  <a href="mailto:vtuconsortium@gmail.com" className="font-paragraph text-gray-300 text-sm hover:text-orange-400 transition-colors">vtuconsortium@gmail.com</a>
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
            <p className="font-paragraph text-gray-400 text-sm">{"© 2025  VTU Consortium Portal. All Rights Reserved."}</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}