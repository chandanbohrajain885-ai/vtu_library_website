import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import { EResources, NewsandEvents, UserGuideArticles } from '@/entities';
import { useLiveData } from '@/hooks/use-live-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Image } from '@/components/ui/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BookOpen, Download, Users, Search, Calendar, User, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, ChevronDown, LogOut, ExternalLink, FileText, Globe, Database, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { LoginModal } from '@/components/auth/LoginModal';
import { SuperExecutiveModal } from '@/components/auth/SuperExecutiveModal';
import { RegistrationModal } from '@/components/auth/RegistrationModal';
import { AddNewsModal } from '@/components/modals/AddNewsModal';
import { EditNewsModal } from '@/components/modals/EditNewsModal';
import { AddEResourceModal } from '@/components/modals/AddEResourceModal';
import { AddUserGuideModal } from '@/components/modals/AddUserGuideModal';
import { useLanguage } from '@/contexts/LanguageContext';

// Search result interface
interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'E-Resources' | 'News & Events' | 'User Guide' | 'Committee' | 'Downloads' | 'Training' | 'Gallery' | 'ONOS' | 'Member Colleges' | 'Publisher' | 'Site Content';
  url?: string;
  year?: string;
  provider?: string;
  subject?: string;
  category?: string;
}

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  
  // Use live data hooks for real-time updates
  const { 
    data: featuredResources, 
    isLoading: resourcesLoading 
  } = useLiveData<EResources>('E-Resources');
  
  const { 
    data: latestNews, 
    isLoading: newsLoading 
  } = useLiveData<NewsandEvents>('newsandnotifications');
  
  const { 
    data: userGuides, 
    isLoading: guidesLoading 
  } = useLiveData<UserGuideArticles>('userguidearticles');
  
  const isLoading = resourcesLoading || newsLoading || guidesLoading;
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Comprehensive search data
  const searchData: SearchResult[] = [
    // E-Resources by year (Enhanced with more details)
    { id: 'eresources-2025-26', title: 'E-Resources 2025-26', content: 'Academic year 2025-26 electronic resources - Under Progress', type: 'E-Resources', url: '/resources/2025-26', year: '2025-26' },
    { id: 'eresources-2024-25', title: 'E-Resources 2024-25', content: 'Elsevier ScienceDirect (327 journals), Springer Nature (689 journals), IEEE ASPP (201 journals), Emerald (212 journals), EBSCO Engineering Suite (6100 journals + 24015 e-books)', type: 'E-Resources', url: '/resources/2024-25', year: '2024-25', provider: 'Elsevier, Springer, IEEE, Emerald, EBSCO' },
    { id: 'eresources-2023-24', title: 'E-Resources 2023-24', content: 'Engineering journals, e-books, plagiarism detection tools, MAPMy Access (10,000+ e-books & 5700+ e-journals)', type: 'E-Resources', url: '/resources/2023-24', year: '2023-24', provider: 'Elsevier, IEEE, Springer, Taylor & Francis' },
    { id: 'eresources-2022-23', title: 'E-Resources 2022-23', content: 'McGraw Hill Education (450+ e-books), Cengage Learning (320+ e-books), Wiley Online Library (275+ e-books), MAPMy Access (8,500+ e-books)', type: 'E-Resources', url: '/resources/2022-23', year: '2022-23', provider: 'McGraw Hill, Cengage, Wiley' },
    { id: 'eresources-2021-22', title: 'E-Resources 2021-22', content: 'IEEE & IET, ProQuest, Indian Journals, Web of Science, SCOPUS, Indian Citation Index, Turnitin, NetAnalytiks LANQUILL', type: 'E-Resources', url: '/resources/2021-22', year: '2021-22', provider: 'IEEE, ProQuest, Web of Science, SCOPUS' },
    { id: 'eresources-2020-21', title: 'E-Resources 2020-21', content: 'Digital library access, Knimbus platform, Turnitin plagiarism detection, NetAnalytiks Sententia', type: 'E-Resources', url: '/resources/2020-21', year: '2020-21', provider: 'Turnitin, NetAnalytiks' },
    { id: 'eresources-2019-20', title: 'E-Resources 2019-20', content: 'Elsevier, Springer Nature, Taylor & Francis, ICE (Institution of Civil Engineers), Emerald, McGraw Hill Education, New Age International, Packt Publishing', type: 'E-Resources', url: '/resources/2019-20', year: '2019-20', provider: 'Elsevier, Springer, Taylor & Francis, ICE, Emerald' },
    { id: 'eresources-2018-19', title: 'E-Resources 2018-19', content: 'Academic resources for engineering and technology disciplines', type: 'E-Resources', url: '/resources/2018-19', year: '2018-19' },
    { id: 'eresources-2017-18', title: 'E-Resources 2017-18', content: 'IEEE IEL Online (190 journals, 1400+ conference proceedings), Elsevier Science (288 journals), Springer (680 journals), ASCE (35 journals), Taylor & Francis (535 journals), ProQuest Engineering & Technology Collections', type: 'E-Resources', url: '/resources/2017-18', year: '2017-18', provider: 'IEEE, Elsevier, Springer, ASCE, Taylor & Francis, ProQuest' },
    { id: 'eresources-2016-17', title: 'E-Resources 2016-17', content: 'K-Nimbus digital library platform (12K+ open access resources), IEEE IEL Online, Elsevier Science, Springer e-Journals, ASCE, Taylor & Francis, ProQuest Engineering Collections', type: 'E-Resources', url: '/resources/2016-17', year: '2016-17', provider: 'K-Nimbus, IEEE, Elsevier, Springer' },
    { id: 'eresources-2015-16', title: 'E-Resources 2015-16', content: 'Academic year 2015-16 electronic resources', type: 'E-Resources', url: '/resources/2015-16', year: '2015-16' },
    { id: 'eresources-2014-15', title: 'E-Resources 2014-15', content: 'Academic year 2014-15 electronic resources', type: 'E-Resources', url: '/resources/2014-15', year: '2014-15' },
    
    // E-Resources by subject (Enhanced)
    { id: 'engineering-journals', title: 'Engineering Journals', content: 'Electrical Engineering, Mechanical Engineering, Civil Engineering, Computer Science, Electronics & Communication, Aerospace, Biomedical, Chemical Engineering journals', type: 'E-Resources', subject: 'Engineering', provider: 'IEEE, Elsevier, Springer' },
    { id: 'computer-science', title: 'Computer Science Resources', content: 'CS journals, programming e-books, AI resources, machine learning, data science, software engineering', type: 'E-Resources', subject: 'Computer Science', provider: 'IEEE, Elsevier, Springer' },
    { id: 'management-resources', title: 'Management Resources', content: 'MBA, Finance, HR, Marketing, Business Strategy, Economics, Accounting, Public Policy', type: 'E-Resources', subject: 'Management', provider: 'Emerald, ProQuest' },
    { id: 'plagiarism-tools', title: 'Plagiarism Detection Tools', content: 'Turnitin, Drillbit, NetAnalytiks LANQUILL, academic integrity tools, originality checking software', type: 'E-Resources', subject: 'Academic Tools', provider: 'Turnitin, NetAnalytiks' },
    { id: 'language-labs', title: 'Language Labs & E-Learning', content: 'English communication, grammar, vocabulary support, Quiklrn Language Communication Lab, IEEE Blended e-Learning Platform', type: 'E-Resources', subject: 'Language Learning', provider: 'Quiklrn, IEEE' },
    { id: 'ebooks-collection', title: 'E-Books Collection', content: 'Engineering e-books, McGraw Hill Education, Cengage Learning, Cambridge University Press, Mint Books, BSP E-Books, Eduport Global-CBS', type: 'E-Resources', subject: 'E-Books', provider: 'McGraw Hill, Cengage, Cambridge' },
    { id: 'digital-library', title: 'Digital Library Platforms', content: 'KNIMBUS cloud-based digital library, MAPMy Access federated search, K-Nimbus remote access solution', type: 'E-Resources', subject: 'Digital Library', provider: 'KNIMBUS, MAPMy' },
    
    // Committee information (Enhanced)
    { id: 'governing-council', title: 'Governing Council Committee', content: 'VTU Consortium governing body, policy making, strategic decisions, institutional governance', type: 'Committee', url: 'https://drive.google.com/drive/folders/1XdCgDWRtO_PK9yN-M5Fi5ud4OH25gWfT?usp=sharing' },
    { id: 'steering-committee', title: 'Steering Committee', content: 'Strategic planning and oversight committee, resource allocation, consortium direction', type: 'Committee', url: 'https://drive.google.com/drive/folders/19GgIpBfrtg6zljHwXeiBSgxTO6BxObAD?usp=sharing' },
    { id: 'nodal-officer', title: 'Nodal Officer Committee', content: 'Institutional coordination and liaison, member college communication, implementation oversight', type: 'Committee', url: 'https://drive.google.com/drive/folders/1iFtaga_Q13SCfjkO-vwrbYcwikSP0s2r?usp=sharing' },
    
    // Downloads and Circulars (Enhanced)
    { id: 'circulars', title: 'Circulars & Announcements', content: 'Official circulars, announcements, notifications, policy updates, consortium communications', type: 'Downloads', url: 'https://drive.google.com/drive/folders/1BmvZhX2bk-5KzGhw1hRY_LOGQ3fqdwP4?usp=sharing' },
    { id: 'blank-formats', title: 'Blank Formats & Templates', content: 'Downloadable forms, templates, application formats, official documents, consortium forms', type: 'Downloads', url: 'https://drive.google.com/drive/folders/1rNz7PVvAC1k7Ch7hZ-DxVB2XGonHY4Kl?usp=sharing' },
    
    // Training and Gallery (Enhanced)
    { id: 'training-programs', title: 'Training Programs', content: 'VTU Consortium e-resources training sessions, workshops, capacity building, librarian training, faculty development', type: 'Training', url: 'https://drive.google.com/drive/folders/128yGjX462SkXrmUDWrgEto8Q-9HdAtQ_?usp=sharing' },
    { id: 'gallery', title: 'Gallery & Events', content: 'Photos and media from consortium events, training sessions, workshops, conferences, meetings', type: 'Gallery', url: 'https://drive.google.com/drive/folders/13FHHx80oP0MiLChO1ms5E-PoBKl5CKjS?usp=sharing' },
    
    // ONOS and Member Colleges (Enhanced)
    { id: 'onos', title: 'ONOS - Online National Open Source', content: 'Online National Open Source platform, government initiative, open source resources, digital India', type: 'ONOS', url: 'https://www.onos.gov.in/' },
    { id: 'member-colleges', title: 'Member Colleges & Institutions', content: 'List of VTU Consortium member institutions, affiliated colleges, participating universities, consortium members', type: 'Member Colleges', url: 'https://docs.google.com/spreadsheets/d/16M-0Q4yAtAw_vU_Nxb-3aIQv_UHkdAwJ/edit?usp=sharing&ouid=107772366690337000857&rtpof=true&sd=true' },
    
    // User Guide and Site Content (Enhanced)
    { id: 'user-guide', title: 'User Guide & Help', content: 'How to access and use consortium resources, step-by-step guides, tutorials, help documentation', type: 'User Guide', url: '/guide' },
    { id: 'about-us', title: 'About VTU Consortium', content: 'VTU Consortium information, mission, vision, objectives, history, achievements', type: 'Site Content', url: '/about' },
    { id: 'publisher-corner', title: 'Publisher Corner', content: 'Information for publishers and content providers, partnership opportunities, content submission', type: 'Publisher', url: '/publisher' },
    { id: 'librarian-corner', title: 'Librarian Corner', content: 'Resources and tools for librarians, access management, user training, technical support', type: 'Site Content', url: '/guide' },
    
    // Additional News & Events
    { id: 'news-events', title: 'News & Events', content: 'Latest news, upcoming events, training announcements, consortium updates, notifications', type: 'News & Events', url: '/news' },
    { id: 'contact-info', title: 'Contact Information', content: 'VTU Consortium contact details, support email, phone numbers, office address', type: 'Site Content', url: '/about' },
    
    // Quick Access Items
    { id: 'quick-access-resources', title: 'Quick Access to E-Resources', content: 'Direct access to all electronic resources by year, subject, and provider', type: 'E-Resources', url: '/resources' },
    { id: 'search-help', title: 'Search Help', content: 'How to search for resources, advanced search tips, search filters, finding specific content', type: 'Site Content', category: 'Help' },
  ];

  // Search function
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      const results = searchData.filter(item => {
        const searchTerm = query.toLowerCase();
        return (
          item.title.toLowerCase().includes(searchTerm) ||
          item.content.toLowerCase().includes(searchTerm) ||
          item.type.toLowerCase().includes(searchTerm) ||
          item.year?.toLowerCase().includes(searchTerm) ||
          item.provider?.toLowerCase().includes(searchTerm) ||
          item.subject?.toLowerCase().includes(searchTerm) ||
          item.category?.toLowerCase().includes(searchTerm)
        );
      });

      // Add dynamic results from CMS data
      const dynamicResults: SearchResult[] = [];
      
      // Search in E-Resources
      featuredResources.forEach(resource => {
        if (resource.title?.toLowerCase().includes(query.toLowerCase()) ||
            resource.eJournals?.toLowerCase().includes(query.toLowerCase()) ||
            resource.eBooks?.toLowerCase().includes(query.toLowerCase()) ||
            resource.plagiarismDetectionSoftware?.toLowerCase().includes(query.toLowerCase())) {
          dynamicResults.push({
            id: `dynamic-resource-${resource._id}`,
            title: `E-Resources ${resource.title}`,
            content: resource.eJournals || resource.eBooks || 'E-Resource content',
            type: 'E-Resources',
            url: `/resources/${resource.title}`,
            year: resource.title
          });
        }
      });

      // Search in News & Events
      latestNews.forEach(news => {
        if (news.title?.toLowerCase().includes(query.toLowerCase()) ||
            news.content?.toLowerCase().includes(query.toLowerCase()) ||
            news.author?.toLowerCase().includes(query.toLowerCase())) {
          dynamicResults.push({
            id: `dynamic-news-${news._id}`,
            title: news.title || 'News Item',
            content: news.content || 'News content',
            type: 'News & Events',
            url: news.externalLink || '/news'
          });
        }
      });

      // Search in User Guides
      userGuides.forEach(guide => {
        if (guide.title?.toLowerCase().includes(query.toLowerCase()) ||
            guide.content?.toLowerCase().includes(query.toLowerCase()) ||
            guide.category?.toLowerCase().includes(query.toLowerCase())) {
          dynamicResults.push({
            id: `dynamic-guide-${guide._id}`,
            title: guide.title || 'User Guide',
            content: guide.content || 'Guide content',
            type: 'User Guide',
            url: `/guide#${guide.slug}`,
            category: guide.category
          });
        }
      });

      const allResults = [...results, ...dynamicResults];
      setSearchResults(allResults.slice(0, 10)); // Limit to 10 results
      setShowSearchResults(true);
      setIsSearching(false);
    }, 300);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
  };

  // Handle search result click
  const handleSearchResultClick = (result: SearchResult) => {
    if (result.url) {
      if (result.url.startsWith('http')) {
        window.open(result.url, '_blank');
      } else {
        navigate(result.url);
      }
    }
    setShowSearchResults(false);
    setSearchQuery('');
  };

  // Handle search submit
  const handleSearchSubmit = () => {
    if (searchResults.length > 0) {
      handleSearchResultClick(searchResults[0]);
    }
  };
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSuperExecutiveModalOpen, setIsSuperExecutiveModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isAddNewsModalOpen, setIsAddNewsModalOpen] = useState(false);
  const [isEditNewsModalOpen, setIsEditNewsModalOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [isAddEResourceModalOpen, setIsAddEResourceModalOpen] = useState(false);
  const [isAddUserGuideModalOpen, setIsAddUserGuideModalOpen] = useState(false);
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

  // Continuous infinite scroll effect for news cards - seamless endless loop
  useEffect(() => {
    const scrollContainer = newsScrollContainerRef.current;
    if (!scrollContainer || latestNews.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 1; // Consistent scrolling speed
    let animationId: number;
    let isPaused = false;
    
    const scroll = () => {
      if (!isPaused) {
        scrollPosition += scrollSpeed;
        
        // Get current measurements
        const scrollWidth = scrollContainer.scrollWidth;
        const clientWidth = scrollContainer.clientWidth;
        
        // Calculate the width of one set of content (original, not duplicated)
        const singleSetWidth = scrollWidth / 2;
        
        // When we've scrolled past one complete set, seamlessly reset to beginning
        // This creates the illusion of infinite scrolling
        if (scrollPosition >= singleSetWidth) {
          scrollPosition = scrollPosition - singleSetWidth;
        }
        
        scrollContainer.scrollLeft = scrollPosition;
      }
      
      animationId = requestAnimationFrame(scroll);
    };

    // Start the continuous animation
    animationId = requestAnimationFrame(scroll);

    // Pause scrolling on hover for better user experience
    const handleMouseEnter = () => {
      isPaused = true;
    };
    
    const handleMouseLeave = () => {
      isPaused = false;
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
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
              <span className="font-bold text-2xl cursor-pointer hover:opacity-80 transition-opacity">{t('header.vtuconsortium')}</span>
            </a>
            {/* Language Switcher */}
            <div className="flex items-center space-x-2 ml-6">
              <Button
                onClick={() => setLanguage('en')}
                variant={language === 'en' ? 'default' : 'outline'}
                size="sm"
                className={`text-xs px-3 py-1 ${
                  language === 'en' 
                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                    : 'bg-transparent border-white text-white hover:bg-white hover:text-black'
                }`}
              >
                {t('language.english')}
              </Button>
              <Button
                onClick={() => setLanguage('kn')}
                variant={language === 'kn' ? 'default' : 'outline'}
                size="sm"
                className={`text-xs px-3 py-1 ${
                  language === 'kn' 
                    ? 'bg-orange-500 text-white hover:bg-orange-600' 
                    : 'bg-transparent border-white text-white hover:bg-white hover:text-black'
                }`}
              >
                {t('language.kannada')}
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span>{t('header.email')}: <a href="mailto:vtuconsortium@gmail.com" className="hover:text-orange-400 transition-colors">vtuconsortium@gmail.com</a></span>
            <span>{t('header.phone')}: 08312498191</span>
          </div>
        </div>
      </div>
      {/* Unified Navigation Bar */}
      <header className="bg-orange-500 text-white shadow-lg">
        <div className="max-w-[120rem] mx-auto px-6 py-4 bg-primary">
          <nav className="flex items-center justify-between">
            {/* All Navigation Options in Single Line */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              <Link to="/" className="hover:text-orange-200 transition-colors font-semibold">{t('nav.home')}</Link>
              <button onClick={() => navigate('/about')} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">
                {t('nav.about')}
              </button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal"
                onClick={() => window.open('https://docs.google.com/spreadsheets/d/16M-0Q4yAtAw_vU_Nxb-3aIQv_UHkdAwJ/edit?usp=sharing&ouid=107772366690337000857&rtpof=true&sd=true', '_blank')}
              >
                {t('nav.membercolleges')}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal">
                    {t('nav.committee')} <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {/* Admin Controls for Committee */}
                  {isAuthenticated && (user?.role === 'superadmin') && (
                    <>
                      <DropdownMenuItem className="cursor-pointer bg-green-50 text-green-700 font-medium">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('admin.addcommittee')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer bg-blue-50 text-blue-700 font-medium"
                        onClick={() => navigate('/admin')}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t('admin.managecommittees')}
                      </DropdownMenuItem>
                      <div className="border-t my-1"></div>
                    </>
                  )}
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => window.open('https://docs.google.com/document/d/1VZwrLtfwp031ua2a_h0ShK0YyZGyYMHM/edit?usp=sharing&ouid=107772366690337000857&rtpof=true&sd=true', '_blank')}
                  >{t('committee.governing')}</DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => window.open('https://docs.google.com/document/d/1EwTGjZy69q6dzS7gm-o0pBm_JqMHczzm/edit?usp=sharing&ouid=107772366690337000857&rtpof=true&sd=true', '_blank')}
                  >
                    {t('committee.steering')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => window.open('https://docs.google.com/spreadsheets/d/1tt8o4Gff8nQy69034R2nlNF7OEDd1QXj/edit?usp=sharing&ouid=107772366690337000857&rtpof=true&sd=true', '_blank')}
                  >
                    {t('committee.nodal')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal">
                    {t('nav.eresources')} <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {/* Admin Controls for E-Resources */}
                  {isAuthenticated && (user?.role === 'superadmin') && (
                    <>
                      <DropdownMenuItem 
                        className="cursor-pointer bg-green-50 text-green-700 font-medium"
                        onClick={() => setIsAddEResourceModalOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('admin.adderesource')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer bg-blue-50 text-blue-700 font-medium"
                        onClick={() => navigate('/admin')}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t('admin.manageeresources')}
                      </DropdownMenuItem>
                      <div className="border-t my-1"></div>
                    </>
                  )}
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
                className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal relative group"
                onClick={() => window.open('https://drive.google.com/drive/folders/128yGjX462SkXrmUDWrgEto8Q-9HdAtQ_?usp=sharing', '_blank')}
              >
                {t('nav.training')}
                {/* Admin Controls for Training - Only visible to superadmin */}
                {isAuthenticated && (user?.role === 'superadmin') && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border p-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 min-w-[150px]">
                    <div className="flex flex-col space-y-1">
                      <button className="flex items-center text-green-700 hover:bg-green-50 p-2 rounded text-sm">
                        <Plus className="h-3 w-3 mr-2" />
                        {t('admin.addtraining')}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/admin');
                        }}
                        className="flex items-center text-blue-700 hover:bg-blue-50 p-2 rounded text-sm"
                      >
                        <Edit className="h-3 w-3 mr-2" />
                        {t('admin.managetraining')}
                      </button>
                    </div>
                  </div>
                )}
              </Button>
              <button onClick={() => navigate('/guide')} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer relative group">
                {t('nav.userguide')}
                {/* Admin Controls for User Guide - Only visible to superadmin */}
                {isAuthenticated && (user?.role === 'superadmin') && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border p-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 min-w-[150px]">
                    <div className="flex flex-col space-y-1">
                      <button 
                        onClick={() => setIsAddUserGuideModalOpen(true)}
                        className="flex items-center text-green-700 hover:bg-green-50 p-2 rounded text-sm"
                      >
                        <Plus className="h-3 w-3 mr-2" />
                        {t('admin.addguide')}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/admin');
                        }}
                        className="flex items-center text-blue-700 hover:bg-blue-50 p-2 rounded text-sm"
                      >
                        <Edit className="h-3 w-3 mr-2" />
                        {t('admin.manageguides')}
                      </button>
                    </div>
                  </div>
                )}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal">
                    {t('nav.links')} <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem className="cursor-pointer">
                    {t('links.vtulinks')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    {t('links.otherlinks')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal">
                    {t('nav.downloads')} <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {/* Admin Controls for Downloads */}
                  {isAuthenticated && (user?.role === 'superadmin') && (
                    <>
                      <DropdownMenuItem className="cursor-pointer bg-green-50 text-green-700 font-medium">
                        <Plus className="h-4 w-4 mr-2" />
                        {t('admin.adddownload')}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer bg-blue-50 text-blue-700 font-medium"
                        onClick={() => navigate('/admin')}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {t('admin.managedownloads')}
                      </DropdownMenuItem>
                      <div className="border-t my-1"></div>
                    </>
                  )}
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => window.open('https://drive.google.com/drive/folders/1BmvZhX2bk-5KzGhw1hRY_LOGQ3fqdwP4?usp=sharing', '_blank')}
                  >
                    {t('downloads.circulars')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => window.open('https://drive.google.com/drive/folders/1rNz7PVvAC1k7Ch7hZ-DxVB2XGonHY4Kl?usp=sharing', '_blank')}
                  >
                    {t('downloads.blankformats')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button onClick={() => window.open('https://www.onos.gov.in/', '_blank')} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">{t('nav.onos')}</button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-orange-200 transition-colors p-0 h-auto font-normal relative group"
                onClick={() => window.open('https://drive.google.com/drive/folders/13FHHx80oP0MiLChO1ms5E-PoBKl5CKjS?usp=sharing', '_blank')}
              >
                {t('nav.gallery')}
                {/* Admin Controls for Gallery - Only visible to superadmin */}
                {isAuthenticated && (user?.role === 'superadmin') && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border p-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 min-w-[150px]">
                    <div className="flex flex-col space-y-1">
                      <button className="flex items-center text-green-700 hover:bg-green-50 p-2 rounded text-sm">
                        <Plus className="h-3 w-3 mr-2" />
                        {t('admin.addgalleryitem')}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/admin');
                        }}
                        className="flex items-center text-blue-700 hover:bg-blue-50 p-2 rounded text-sm"
                      >
                        <Edit className="h-3 w-3 mr-2" />
                        {t('admin.managegallery')}
                      </button>
                    </div>
                  </div>
                )}
              </Button>
              <button onClick={handleLibrarianCorner} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">{t('nav.librariancorner')}</button>
              <button onClick={handlePublisherCorner} className="hover:text-orange-200 transition-colors bg-transparent border-none text-white cursor-pointer">{t('nav.publishercorner')}</button>
            </div>
            
            {/* Login and Register Buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white">{t('nav.welcome')}, {user?.username}</span>
                  {user?.role === 'superadmin' && (
                    <Button onClick={() => navigate('/admin')} className="bg-purple-500 hover:bg-purple-600 text-white px-4">
                      {t('nav.adminpanel')}
                    </Button>
                  )}
                  <Button onClick={logout} variant="outline" className="text-white border-white hover:bg-white hover:text-orange-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('nav.logout')}
                  </Button>
                </div>
              ) : (
                <>
                  <Button onClick={() => setIsLoginModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white px-6">
                    {t('nav.login')}
                  </Button>
                  <Button onClick={() => setIsRegistrationModalOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white px-6">
                    {t('nav.register')}
                  </Button>
                  <Button onClick={() => setIsSuperExecutiveModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-6">
                    {t('nav.superexecutive')}
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
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-[120rem] mx-auto px-6 text-center">
          <div className="space-y-6">
            <h1 className="font-heading text-5xl lg:text-6xl font-bold">{t('hero.title')}</h1>
            <p className="font-paragraph text-xl text-gray-200 max-w-3xl mx-auto">{t('hero.subtitle')}</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-8 relative">
              <div className="flex">
                <Input
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={t('hero.searchplaceholder')}
                  className="flex-1 h-12 rounded-r-none text-black bg-primary-foreground border-[4px] border-[#f39c0a] border-solid placeholder:text-gray-500"
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
                />
                <Button 
                  onClick={handleSearchSubmit}
                  className="hover:bg-orange-600 h-12 px-8 rounded-l-none bg-[#e79100] border-[4px] border-[#f39c0a] border-solid"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && (searchResults.length > 0 || isSearching) && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto mt-1">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <Search className="h-5 w-5 animate-spin mx-auto mb-2" />
                      {t('search.searching')}
                    </div>
                  ) : (
                    <>
                      {searchResults.map((result) => (
                        <div
                          key={result.id}
                          onClick={() => handleSearchResultClick(result)}
                          className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm">{result.title}</h4>
                                <Badge variant="secondary" className="text-xs">
                                  {result.type}
                                </Badge>
                                {result.year && (
                                  <Badge variant="outline" className="text-xs">
                                    {result.year}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-600 text-xs line-clamp-2">{result.content}</p>
                              {(result.provider || result.subject || result.category) && (
                                <div className="flex items-center space-x-2 mt-1">
                                  {result.provider && (
                                    <span className="text-xs text-blue-600">Provider: {result.provider}</span>
                                  )}
                                  {result.subject && (
                                    <span className="text-xs text-green-600">Subject: {result.subject}</span>
                                  )}
                                  {result.category && (
                                    <span className="text-xs text-purple-600">Category: {result.category}</span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="ml-2">
                              {result.url?.startsWith('http') ? (
                                <ExternalLink className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      {searchResults.length === 0 && searchQuery && (
                        <div className="p-4 text-center text-gray-500">
                          <FileText className="h-5 w-5 mx-auto mb-2 text-gray-400" />
                          {t('search.noresults')} "{searchQuery}"
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Click outside to close search results */}
            {showSearchResults && (
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowSearchResults(false)}
              />
            )}

          {/* Quick Access Buttons - Removed */}
          </div>
        </div>
      </section>
      {/* Library News & Events */}
      <section className="py-16 bg-white">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1"></div>
              <h2 className="font-heading text-4xl font-bold text-gray-800">{t('news.title')}</h2>
              <div className="flex-1 flex justify-end">
                {/* Admin Controls - Only visible to superadmin and super executive */}
                {isAuthenticated && (user?.role === 'superadmin') && (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setIsAddNewsModalOpen(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('news.addnews')}
                    </Button>
                    <Button
                      onClick={() => navigate('/admin')}
                      variant="outline"
                      size="sm"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {t('news.manageall')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Continuous Infinite Scrolling News Cards - Right to Left */}
          <div 
            ref={newsScrollContainerRef}
            className="flex gap-6 overflow-x-hidden relative"
            style={{ 
              scrollBehavior: 'auto',
              maskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)'
            }}
          >
            {/* Original news cards */}
            {latestNews.map((news, index) => (
              <Card key={news._id || index} className="hover:shadow-xl transition-all duration-300 border-l-4 border-primary min-w-[380px] max-w-[380px] flex-shrink-0 bg-white shadow-md">
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
                  <CardTitle className="font-heading text-xl text-gray-800 leading-tight line-clamp-2">
                    {news.title || 'News Title'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-paragraph text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    <span className="font-bold text-green-600">Venue: </span>
                    <span className="font-bold text-green-600">{news.venue || news.content || 'News content...'}</span>
                  </p>
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-primary border-primary hover:bg-primary hover:text-white transition-colors"
                      onClick={() => {
                        if (news.externalLink) {
                          window.open(news.externalLink, '_blank');
                        } else {
                          window.open('https://drive.google.com/file/d/1NFEkvgYhIjVJBWunQJaQfyTXhphOB0tv/view?usp=sharing', '_blank');
                        }
                      }}
                    >
                      Read More
                    </Button>
                    <div className="flex items-center space-x-2">
                      {/* Edit Button - Only visible to superadmin */}
                      {isAuthenticated && (user?.role === 'superadmin') && (
                        <Button
                          onClick={() => {
                            setEditingNewsId(news._id);
                            setIsEditNewsModalOpen(true);
                          }}
                          size="sm"
                          variant="outline"
                          className="border-orange-500 text-orange-600 hover:bg-orange-50"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}
                      {news.author && (
                        <span className="text-xs text-gray-500">
                          By {news.author}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Duplicate cards for seamless infinite scrolling */}
            {latestNews.map((news, index) => (
              <Card key={`duplicate-${news._id || index}`} className="hover:shadow-xl transition-all duration-300 border-l-4 border-primary min-w-[380px] max-w-[380px] flex-shrink-0 bg-white shadow-md">
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
                  <CardTitle className="font-heading text-xl text-gray-800 leading-tight line-clamp-2">
                    {news.title || 'News Title'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-paragraph text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    <span className="font-bold text-green-600">Venue: </span>
                    <span className="font-bold text-green-600">{news.venue || news.content || 'News content...'}</span>
                  </p>
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-primary border-primary hover:bg-primary hover:text-white transition-colors"
                      onClick={() => {
                        if (news.externalLink) {
                          window.open(news.externalLink, '_blank');
                        } else {
                          window.open('https://drive.google.com/file/d/1NFEkvgYhIjVJBWunQJaQfyTXhphOB0tv/view?usp=sharing', '_blank');
                        }
                      }}
                    >
                      Read More
                    </Button>
                    <div className="flex items-center space-x-2">
                      {/* Edit Button - Only visible to superadmin */}
                      {isAuthenticated && (user?.role === 'superadmin') && (
                        <Button
                          onClick={() => {
                            setEditingNewsId(news._id);
                            setIsEditNewsModalOpen(true);
                          }}
                          size="sm"
                          variant="outline"
                          className="border-orange-500 text-orange-600 hover:bg-orange-50"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}
                      {news.author && (
                        <span className="text-xs text-gray-500">
                          By {news.author}
                        </span>
                      )}
                    </div>
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
            <a 
              href="https://www.inerasoftware.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-paragraph text-gray-400 text-sm hover:text-orange-400 transition-colors cursor-pointer"
            >
              Powered by Inera Software
            </a>
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

      {/* Add News Modal */}
      <AddNewsModal 
        isOpen={isAddNewsModalOpen} 
        onClose={() => setIsAddNewsModalOpen(false)} 
      />

      {/* Edit News Modal */}
      <EditNewsModal 
        isOpen={isEditNewsModalOpen} 
        onClose={() => setIsEditNewsModalOpen(false)} 
        newsId={editingNewsId}
      />

      {/* Add E-Resource Modal */}
      <AddEResourceModal 
        isOpen={isAddEResourceModalOpen} 
        onClose={() => setIsAddEResourceModalOpen(false)} 
      />

      {/* Add User Guide Modal */}
      <AddUserGuideModal 
        isOpen={isAddUserGuideModalOpen} 
        onClose={() => setIsAddUserGuideModalOpen(false)} 
      />
    </div>
  );
}