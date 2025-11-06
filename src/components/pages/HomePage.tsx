import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { EResources, NewsandEvents } from '@/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Image } from '@/components/ui/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookOpen, Download, Users, Search, Calendar, User, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { SuperExecutiveModal } from '@/components/auth/SuperExecutiveModal';
import { RegistrationModal } from '@/components/auth/RegistrationModal';

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [featuredResources, setFeaturedResources] = useState<EResources[]>([]);
  const [latestNews, setLatestNews] = useState<NewsandEvents[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Demo news data for fallback when CMS has no data
  const demoNewsData: NewsandEvents[] = [
    {
      _id: 'training-1',
      title: 'One Day Training Programs on VTU Consortium e-resources',
      content: 'National Institute Of Engineering (NIE), Mysore',
      publicationDate: new Date('2025-11-10'),
      isFeatured: true,
      author: 'VTU Consortium'
    },
    {
      _id: 'training-2',
      title: 'One Day Training Programs on VTU Consortium e-resources',
      content: 'VTU Reginal Centre, Bangalore',
      publicationDate: new Date('2025-11-11'),
      isFeatured: true,
      author: 'VTU Consortium'
    },
    {
      _id: 'training-3',
      title: 'One Day Training Programs on VTU Consortium e-resources',
      content: 'PDA College of Engineering, Kalaburagi',
      publicationDate: new Date('2025-11-17'),
      isFeatured: true,
      author: 'VTU Consortium'
    },
    {
      _id: 'training-4',
      title: 'One Day Training Programs on VTU Consortium e-resources',
      content: 'VTU Reginal Centre, Belagavi',
      publicationDate: new Date('2025-11-24'),
      isFeatured: true,
      author: 'VTU Consortium'
    }
  ];
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSuperExecutiveModalOpen, setIsSuperExecutiveModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const newsScrollContainerRef = useRef<HTMLDivElement>(null);

  const handleProtectedAction = (action: () => void, requiredRole?: string) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    
    // Check role-based access
    if (requiredRole && user?.role !== 'superadmin') {
      if (requiredRole === 'librarian' && user?.role !== 'librarian') {
        setIsLoginModalOpen(true);
        return;
      }
      if (requiredRole === 'publisher' && user?.role !== 'publisher') {
        setIsLoginModalOpen(true);
        return;
      }
    }
    
    action();
  };

  const handleLibrarianCorner = () => {
    if (!isAuthenticated || (user?.role !== 'superadmin' && user?.role !== 'librarian')) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate('/guide');
  };

  const handlePublisherCorner = () => {
    if (!isAuthenticated || (user?.role !== 'superadmin' && user?.role !== 'publisher')) {
      setIsLoginModalOpen(true);
      return;
    }
    // Navigate to publisher corner page (we'll create this)
    navigate('/publisher');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resourcesResponse, newsResponse] = await Promise.all([
          BaseCrudService.getAll<EResources>('E-Resources'),
          BaseCrudService.getAll<NewsandEvents>('newsandnotifications')
        ]);

        setFeaturedResources(resourcesResponse.items.slice(0, 3));
        
        // Always use demo data to ensure news cards are visible
        setLatestNews(demoNewsData);
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
    const scrollContainer = newsScrollContainerRef.current;
    if (!scrollContainer) return;

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
              <button onClick={() => navigate('/about')} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">
                About Us
              </button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal"
                onClick={() => window.open('https://docs.google.com/spreadsheets/d/16M-0Q4yAtAw_vU_Nxb-3aIQv_UHkdAwJ/edit?usp=sharing&ouid=107772366690337000857&rtpof=true&sd=true', '_blank')}
              >
                Member Colleges
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal">
                    Committee <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => window.open('https://drive.google.com/drive/folders/1XdCgDWRtO_PK9yN-M5Fi5ud4OH25gWfT?usp=sharing', '_blank')}
                  >{"Governing Council"}</DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => window.open('https://drive.google.com/drive/folders/19GgIpBfrtg6zljHwXeiBSgxTO6BxObAD?usp=sharing', '_blank')}
                  >
                    Steering Committee
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => window.open('https://drive.google.com/drive/folders/1iFtaga_Q13SCfjkO-vwrbYcwikSP0s2r?usp=sharing', '_blank')}
                  >
                    Nodal Officer Committee
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal">
                    E-Resources <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/resources/2025-26')}>
                    2025-26
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/resources/2024-25')}>
                    2024-25
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/resources/2023-24')}>
                    2023-24
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/resources/2022-23')}>
                    2022-23
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/resources/2021-22')}>
                    2021-22
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/resources/2020-21')}>
                    2020-21
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/resources/2019-20')}>
                    2019-20
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/resources/2018-19')}>
                    2018-19
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/resources/2017-18')}>
                    2017-18
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/resources/2016-17')}>
                    2016-17
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/resources/2015-16')}>
                    2015-16
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/resources/2014-15')}>
                    2014-15
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal"
                onClick={() => window.open('https://drive.google.com/drive/folders/128yGjX462SkXrmUDWrgEto8Q-9HdAtQ_?usp=sharing', '_blank')}
              >
                Training
              </Button>
              <button onClick={() => navigate('/guide')} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">User Guide</button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal">
                    Links <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem className="cursor-pointer">
                    VTU Link's
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    Others link's
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal">
                    Downloads <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => window.open('https://drive.google.com/drive/folders/1BmvZhX2bk-5KzGhw1hRY_LOGQ3fqdwP4?usp=sharing', '_blank')}
                  >
                    Circulars
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => window.open('https://drive.google.com/drive/folders/1rNz7PVvAC1k7Ch7hZ-DxVB2XGonHY4Kl?usp=sharing', '_blank')}
                  >
                    Blank Format's
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button onClick={() => window.open('https://www.onos.gov.in/', '_blank')} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">ONOS</button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal"
                onClick={() => window.open('https://drive.google.com/drive/folders/13FHHx80oP0MiLChO1ms5E-PoBKl5CKjS?usp=sharing', '_blank')}
              >
                Gallary
              </Button>
              <button onClick={handleLibrarianCorner} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">Librarian Corner</button>
              <button onClick={handlePublisherCorner} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">Publisher's Corner</button>
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
                  <Button onClick={() => setIsRegistrationModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-6">
                    Register
                  </Button>
                  <Button onClick={() => setIsSuperExecutiveModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-6">
                    Super Executive
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
      {/* Hero Section with Library Background */}
      <section className="relative bg-gray-900 text-white py-20" style={{
        backgroundImage: "url('https://static.wixstatic.com/media/e79745_2317321fb2464e569d297d063f30bdef~mv2.png?originWidth=1152&originHeight=576')",
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
                />
              <Button 
                className="hover:bg-orange-600 h-12 px-8 rounded-l-none bg-[#e79100] border-[4px] border-[#f39c0a] border-solid"
              >
              <Search className="h-5 w-5" />
            </Button>
            </div>
          </div>

          {/* Quick Access Buttons - Removed */}
          </div>
        </div>
      </section>
      {/* Library News & Events */}
      <section className="py-16 bg-white">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-gray-800 mb-4">{"News & Events"}</h2>
          </div>

          {/* Single Row of Auto-Scrolling News Cards */}
          <div 
            ref={newsScrollContainerRef}
            className="flex gap-6 overflow-x-hidden"
            style={{ scrollBehavior: 'smooth' }}
          >
            {latestNews.map((news, index) => (
              <Card key={news._id || index} className="hover:shadow-xl transition-all duration-300 border-l-4 border-primary min-w-[350px] flex-shrink-0 bg-white shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold">
                        {new Date(news.publicationDate || Date.now()).getDate()}
                      </div>
                      <div className="text-sm text-gray-500">
                        <div className="font-medium">
                          {new Date(news.publicationDate || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      Coming Soon
                    </Badge>
                  </div>
                  <CardTitle className="font-heading text-xl text-gray-800 leading-tight">
                    {news.title || 'News Title'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-paragraph text-gray-600 mb-4 leading-relaxed">
                    <span className="font-bold text-green-600">Venue: </span>
                    <span className="font-bold text-green-600">{news.content || 'News content...'}</span>
                  </p>
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-primary border-primary hover:bg-primary hover:text-white transition-colors"
                      onClick={() => window.open('https://drive.google.com/file/d/1NFEkvgYhIjVJBWunQJaQfyTXhphOB0tv/view?usp=sharing', '_blank')}
                    >
                      Read More
                    </Button>
                    {news.author && (
                      <span className="text-xs text-gray-500">
                        By {news.author}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {/* Duplicate cards for seamless scrolling */}
            {latestNews.map((news, index) => (
              <Card key={`duplicate-${news._id || index}`} className="hover:shadow-xl transition-all duration-300 border-l-4 border-primary min-w-[350px] flex-shrink-0 bg-white shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold">
                        {new Date(news.publicationDate || Date.now()).getDate()}
                      </div>
                      <div className="text-sm text-gray-500">
                        <div className="font-medium">
                          {new Date(news.publicationDate || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-500 text-white">
                      Coming Soon
                    </Badge>
                  </div>
                  <CardTitle className="font-heading text-xl text-gray-800 leading-tight">
                    {news.title || 'News Title'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-paragraph text-gray-600 mb-4 leading-relaxed">
                    <span className="font-bold text-green-600">Venue: </span>
                    <span className="font-bold text-green-600">{news.content || 'News content...'}</span>
                  </p>
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-primary border-primary hover:bg-primary hover:text-white transition-colors"
                      onClick={() => window.open('https://drive.google.com/file/d/1NFEkvgYhIjVJBWunQJaQfyTXhphOB0tv/view?usp=sharing', '_blank')}
                    >
                      Read More
                    </Button>
                    {news.author && (
                      <span className="text-xs text-gray-500">
                        By {news.author}
                      </span>
                    )}
                  </div>
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
      {/* Registration Modal */}
      <RegistrationModal 
        isOpen={isRegistrationModalOpen} 
        onClose={() => setIsRegistrationModalOpen(false)} 
      />
      {/* Super Executive Modal */}
      <SuperExecutiveModal 
        isOpen={isSuperExecutiveModalOpen} 
        onClose={() => setIsSuperExecutiveModalOpen(false)} 
      />
    </div>
  );
}