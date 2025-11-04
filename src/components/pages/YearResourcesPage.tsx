import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Image } from '@/components/ui/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowLeft, Search, Download, ExternalLink, Calendar, BookOpen, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';

// Mock data for different years - this would typically come from a CMS or API
const yearResourcesData: Record<string, any[]> = {
  '2025-26': [
    {
      id: '1',
      title: 'Advanced Machine Learning Resources 2025',
      category: 'Computer Science',
      description: 'Comprehensive collection of machine learning resources including latest research papers, tutorials, and practical implementations.',
      author: 'Dr. Rajesh Kumar',
      publicationDate: '2025-01-15',
      resourceLink: 'https://example.com/ml-resources-2025',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=ml-2025'
    },
    {
      id: '2',
      title: 'Quantum Computing Fundamentals',
      category: 'Physics',
      description: 'Introduction to quantum computing principles, quantum algorithms, and their applications in modern technology.',
      author: 'Prof. Anita Sharma',
      publicationDate: '2025-02-01',
      resourceLink: 'https://example.com/quantum-computing',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=quantum-2025'
    },
    {
      id: '3',
      title: 'Sustainable Engineering Practices',
      category: 'Engineering',
      description: 'Modern approaches to sustainable engineering, green technologies, and environmental impact assessment.',
      author: 'Dr. Vikram Patel',
      publicationDate: '2025-01-20',
      resourceLink: 'https://example.com/sustainable-engineering',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=sustainable-2025'
    }
  ],
  '2024-25': [
    {
      id: '4',
      title: 'Data Science and Analytics 2024',
      category: 'Computer Science',
      description: 'Complete guide to data science methodologies, statistical analysis, and big data processing techniques.',
      author: 'Dr. Priya Nair',
      publicationDate: '2024-09-15',
      resourceLink: 'https://example.com/data-science-2024',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=data-science-2024'
    },
    {
      id: '5',
      title: 'Renewable Energy Systems',
      category: 'Electrical Engineering',
      description: 'Comprehensive study of solar, wind, and other renewable energy technologies and their integration.',
      author: 'Prof. Suresh Reddy',
      publicationDate: '2024-10-01',
      resourceLink: 'https://example.com/renewable-energy',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=renewable-2024'
    }
  ],
  '2023-24': [
    {
      id: '6',
      title: 'Artificial Intelligence Ethics',
      category: 'Computer Science',
      description: 'Exploring ethical considerations in AI development, bias mitigation, and responsible AI practices.',
      author: 'Dr. Meera Gupta',
      publicationDate: '2023-11-15',
      resourceLink: 'https://example.com/ai-ethics',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=ai-ethics-2023'
    }
  ],
  '2022-23': [
    {
      id: '7',
      title: 'Blockchain Technology Applications',
      category: 'Computer Science',
      description: 'Understanding blockchain fundamentals, cryptocurrency, and decentralized applications.',
      author: 'Prof. Amit Singh',
      publicationDate: '2022-12-01',
      resourceLink: 'https://example.com/blockchain-2022',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=blockchain-2022'
    }
  ],
  '2021-22': [
    {
      id: '8',
      title: 'Internet of Things (IoT) Systems',
      category: 'Electronics',
      description: 'Comprehensive guide to IoT architecture, sensors, connectivity, and smart device development.',
      author: 'Dr. Kavita Joshi',
      publicationDate: '2021-10-15',
      resourceLink: 'https://example.com/iot-systems',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=iot-2021'
    }
  ],
  '2020-21': [
    {
      id: '9',
      title: 'Cloud Computing Fundamentals',
      category: 'Computer Science',
      description: 'Introduction to cloud services, deployment models, and cloud security best practices.',
      author: 'Prof. Ravi Kumar',
      publicationDate: '2020-09-01',
      resourceLink: 'https://example.com/cloud-computing',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=cloud-2020'
    }
  ],
  '2019-20': [
    {
      id: '10',
      title: 'Cybersecurity Essentials',
      category: 'Computer Science',
      description: 'Essential cybersecurity concepts, threat analysis, and security implementation strategies.',
      author: 'Dr. Sanjay Verma',
      publicationDate: '2019-11-20',
      resourceLink: 'https://example.com/cybersecurity',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=cybersecurity-2019'
    }
  ],
  '2018-19': [
    {
      id: '11',
      title: 'Mobile App Development',
      category: 'Computer Science',
      description: 'Complete guide to mobile application development for Android and iOS platforms.',
      author: 'Prof. Neha Agarwal',
      publicationDate: '2018-08-15',
      resourceLink: 'https://example.com/mobile-dev',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=mobile-2018'
    }
  ],
  '2017-18': [
    {
      id: '12',
      title: 'Web Development Technologies',
      category: 'Computer Science',
      description: 'Modern web development frameworks, responsive design, and full-stack development practices.',
      author: 'Dr. Rahul Sharma',
      publicationDate: '2017-09-10',
      resourceLink: 'https://example.com/web-dev',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=web-2017'
    }
  ],
  '2016-17': [
    {
      id: '13',
      title: 'Database Management Systems',
      category: 'Computer Science',
      description: 'Comprehensive study of relational databases, SQL, and database design principles.',
      author: 'Prof. Sunita Rao',
      publicationDate: '2016-10-05',
      resourceLink: 'https://example.com/database-systems',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=database-2016'
    }
  ],
  '2015-16': [
    {
      id: '14',
      title: 'Software Engineering Principles',
      category: 'Computer Science',
      description: 'Software development lifecycle, project management, and quality assurance methodologies.',
      author: 'Dr. Manoj Gupta',
      publicationDate: '2015-11-12',
      resourceLink: 'https://example.com/software-engineering',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=software-2015'
    }
  ],
  '2014-15': [
    {
      id: '15',
      title: 'Computer Networks and Communication',
      category: 'Computer Science',
      description: 'Network protocols, network security, and communication systems fundamentals.',
      author: 'Prof. Deepak Jain',
      publicationDate: '2014-12-08',
      resourceLink: 'https://example.com/computer-networks',
      coverImage: 'https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=networks-2014'
    }
  ]
};

export default function YearResourcesPage() {
  const { year } = useParams<{ year: string }>();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleProtectedAction = (action: () => void) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    action();
  };

  const resources = yearResourcesData[year || '2025-26'] || [];
  const categories = ['All', ...Array.from(new Set(resources.map(r => r.category)))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              <span className="font-bold text-2xl cursor-pointer hover:opacity-80 transition-opacity">VTU Consortium</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <span>Email: <a href="mailto:vtuconsortium@gmail.com" className="hover:text-orange-400 transition-colors">vtuconsortium@gmail.com</a></span>
            <span>Phone: 08312498191</span>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <header className="bg-orange-500 text-white shadow-lg">
        <div className="max-w-[120rem] mx-auto px-6 py-4 bg-primary">
          <nav className="flex items-center justify-between">
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              <Link to="/" className="hover:text-orange-200 transition-colors font-semibold">Home</Link>
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
              <button onClick={() => handleProtectedAction(() => navigate('/news'))} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">Downloads</button>
              <button onClick={() => handleProtectedAction(() => navigate('/guide'))} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">Notifications</button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal">
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

      {/* Main Content */}
      <div className="max-w-[120rem] mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              E-Resources {year}
            </h1>
            <p className="font-paragraph text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive collection of electronic resources for the academic year {year}
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search resources by title, description, or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedCategory}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className="cursor-pointer"
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-gray-600 mb-6">
            Showing {filteredResources.length} of {resources.length} resources
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-orange-500">
                <CardHeader>
                  <div className="aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={resource.coverImage}
                      alt={resource.title}
                      width={400}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      {resource.category}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(resource.publicationDate).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="font-heading text-xl text-gray-800 mb-2">
                    {resource.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mb-2">
                    By {resource.author}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="font-paragraph text-gray-700 mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => window.open(resource.resourceLink, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Resource
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(resource.resourceLink, '_blank')}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-heading text-xl text-gray-600 mb-2">No resources found</h3>
            <p className="font-paragraph text-gray-500">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}