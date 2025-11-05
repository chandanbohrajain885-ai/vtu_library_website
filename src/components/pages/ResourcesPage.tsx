import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Download, ExternalLink, FileText, Globe, Database, Users, ArrowLeft } from 'lucide-react';

export default function ResourcesPage() {
  const { year } = useParams();
  
  // Check if this is the 2025-26 year (under progress)
  const isUnderProgress = year === '2025-26';
  
  // Check if this is the 2024-25 year (detailed content)
  const isDetailedYear = year === '2024-25';
  
  // Check if this is the 2023-24 year (user provided content)
  const is2023_24Year = year === '2023-24';

  // Render under progress page for 2025-26
  if (isUnderProgress) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        <header className="bg-primary text-primary-foreground shadow-lg">
          <div className="max-w-[120rem] mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <Link to="/" className="font-heading text-2xl font-bold">
                VTU Consortium
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="hover:text-orange-200 transition-colors">Home</Link>
                <span className="text-orange-200 font-semibold">E-Resources</span>
                <Link to="/journals" className="hover:text-orange-200 transition-colors">ONOS</Link>
                <Link to="/news" className="hover:text-orange-200 transition-colors">Downloads</Link>
                <Link to="/guide" className="hover:text-orange-200 transition-colors">User Guide</Link>
              </div>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline" 
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </nav>
          </div>
        </header>

        {/* Page Header */}
        <section className="bg-primary/5 py-16">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="text-center space-y-4">
              <h1 className="font-heading text-5xl font-bold text-primary">
                E-RESOURCES - {year}
              </h1>
              <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
                Academic Year {year} Resources
              </p>
            </div>
          </div>
        </section>

        {/* Under Progress Section */}
        <section className="py-20">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="text-center space-y-8">
              <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-orange-500" />
              </div>
              <h2 className="font-heading text-4xl font-bold text-primary">
                This information is under progress.
              </h2>
              <p className="font-paragraph text-lg text-primary/70 max-w-2xl mx-auto">
                We are currently working on compiling and organizing the resources for the {year} academic year. 
                Please check back soon for updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="bg-primary hover:bg-primary/90"
                >
                  Return to Home
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/resources'}
                  className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  View Other Years
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="text-center">
              <p className="font-paragraph text-gray-400">
                © 2025 VTU Consortium Portal. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Render detailed content for 2024-25
  if (isDetailedYear) {
    // ... keep existing code (2024-25 content) ...
  }

  // Render content for 2023-24
  if (is2023_24Year) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        <header className="bg-primary text-primary-foreground shadow-lg">
          <div className="max-w-[120rem] mx-auto px-6 py-4">
            <nav className="flex items-center justify-between">
              <Link to="/" className="font-heading text-2xl font-bold">
                VTU Consortium
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="hover:text-orange-200 transition-colors">Home</Link>
                <span className="text-orange-200 font-semibold">E-Resources</span>
                <Link to="/journals" className="hover:text-orange-200 transition-colors">ONOS</Link>
                <Link to="/news" className="hover:text-orange-200 transition-colors">Downloads</Link>
                <Link to="/guide" className="hover:text-orange-200 transition-colors">User Guide</Link>
              </div>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline" 
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </nav>
          </div>
        </header>

        {/* Page Header */}
        <section className="bg-primary/5 py-16">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="text-center space-y-4">
              <h1 className="font-heading text-5xl font-bold text-primary">
                E-RESOURCES - {year}
              </h1>
              <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
                Academic Year {year} Resources
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="font-paragraph text-gray-800 whitespace-pre-line">
VTU CONSORTIUM SUBSCRIBED E-RESOURCES FOR THE YEAR 2023-24 E-Journals Elsevier (ScienceDirect) Engineering, CS, EE, ME, EC, CV,       AI, and allied branches 298 e-journals IEEE ASPP (All Society      Periodicals Package) Covers Aerospace,       Bioengineering, Communication, Power, Robotics, etc. 198 e-journals Springer Nature Electrical & Electronics,       Mechanical, Civil, CS, Chemistry, Math, Physics 690 e-journals Taylor & Francis Engineering, CSE, ME, Civil,       Architecture, and Allied Sciences 585 e-journals Emerald Management, Finance, Economics,       HR, Marketing, Public Policy 212 e-journals ProQuest Covers Architecture,       Engineering, Aerospace, and Material Science 4900 full-text journals, 7800       indexed journals Cloud-Based & Remote Access Solutions MAPMy Access Universal federated search,       remote access to journals, e-books, e-theses, and educational videos 10,000+ e-books & 5700+       e-journals Plagiarism Detection & Learning Tools Plagiarism Originality Online      Check End-user licenses for instructor       and student profiles NetAnalytiks' LANQUILL Writing and grammar learning       tool
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="text-center">
              <p className="font-paragraph text-gray-400">
                © 2025 VTU Consortium Portal. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
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
                VTU Consortium
              </Link>
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="hover:text-orange-200 transition-colors">Home</Link>
                <span className="text-orange-200 font-semibold">E-Resources</span>
                <Link to="/journals" className="hover:text-orange-200 transition-colors">ONOS</Link>
                <Link to="/news" className="hover:text-orange-200 transition-colors">Downloads</Link>
                <Link to="/guide" className="hover:text-orange-200 transition-colors">User Guide</Link>
              </div>
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline" 
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </nav>
          </div>
        </header>

        {/* Page Header */}
        <section className="bg-primary/5 py-16">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="text-center space-y-4">
              <h1 className="font-heading text-5xl font-bold text-primary">
                E-RESOURCES - {year}
              </h1>
              <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
                Comprehensive digital resources for the {year} academic year
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-[120rem] mx-auto px-6">
            
            {/* VTU Consortium E-Resources Content */}
            <div className="mb-16">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="prose prose-lg max-w-none">
                  <h1 className="font-heading text-4xl font-bold text-primary text-center mb-8">
                    VTU CONSORTIUM SUBSCRIBED E-RESOURCES FOR THE YEAR 2024-25
                  </h1>
                  
                  {/* E-Journals Section */}
                  <div className="mb-12">
                    <h2 className="font-heading text-3xl font-bold text-primary mb-6">E-Journals</h2>
                    
                    <div className="space-y-6">
                      <div className="border-l-4 border-blue-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">Elsevier (ScienceDirect)</h3>
                        <p className="font-paragraph text-gray-700 mb-2">Engineering, CS, EE, ME, EC, CV, AI, and various allied branches</p>
                        <p className="font-paragraph text-blue-600 font-semibold">327 e-journals</p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">Springer Nature</h3>
                        <p className="font-paragraph text-gray-700 mb-2">Electrical & Electronics, Mechanical, Civil, CS, Allied Engineering, Chemistry, Math, Physics</p>
                        <p className="font-paragraph text-green-600 font-semibold">689 e-journals</p>
                      </div>
                      
                      <div className="border-l-4 border-purple-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">IEEE ASPP & POP ALL</h3>
                        <p className="font-paragraph text-gray-700 mb-2">IEEE Society periodicals & Conference proceedings</p>
                        <p className="font-paragraph text-purple-600 font-semibold">201 e-journals + 1800+ IEEE conference proceedings</p>
                      </div>
                      
                      <div className="border-l-4 border-orange-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">Emerald</h3>
                        <p className="font-paragraph text-gray-700 mb-2">Management, Accounting, Finance, HR, Business Strategy, Marketing, and related fields</p>
                        <p className="font-paragraph text-orange-600 font-semibold">212 e-journals</p>
                      </div>
                      
                      <div className="border-l-4 border-teal-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">EBSCO Engineering Suite</h3>
                        <p className="font-paragraph text-gray-700 mb-2">Engineering, Management, Architecture</p>
                        <p className="font-paragraph text-teal-600 font-semibold">6100 e-journals + 24015 e-books</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* E-Books Section */}
                  <div className="mb-12">
                    <h2 className="font-heading text-3xl font-bold text-primary mb-6">E-Books</h2>
                    
                    <div className="space-y-6">
                      <div className="border-l-4 border-red-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">Eduport Global-CBS</h3>
                        <p className="font-paragraph text-gray-700 mb-2">Covers Agriculture, Engineering, Architecture, Biotechnology, Chemical, Civil, Management, Pharmacy, and more</p>
                        <p className="font-paragraph text-red-600 font-semibold">174 e-books</p>
                      </div>
                      
                      <div className="border-l-4 border-indigo-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">BSP E-Books</h3>
                        <p className="font-paragraph text-gray-700 mb-2">Various Engineering disciplines, Management, Nanotechnology</p>
                        <p className="font-paragraph text-indigo-600 font-semibold">141 e-books</p>
                      </div>
                      
                      <div className="border-l-4 border-pink-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">Cengage Learning</h3>
                        <p className="font-paragraph text-gray-700 mb-2">Engineering, Mathematics, MBA</p>
                        <p className="font-paragraph text-pink-600 font-semibold">69 e-books</p>
                      </div>
                      
                      <div className="border-l-4 border-yellow-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">Cambridge University Press</h3>
                        <p className="font-paragraph text-gray-700 mb-2">Chemistry, Computer Science, Earth Sciences, Engineering, Life Sciences, Sociology, etc.</p>
                        <p className="font-paragraph text-yellow-600 font-semibold">58 e-books</p>
                      </div>
                      
                      <div className="border-l-4 border-cyan-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">Mint Books</h3>
                        <p className="font-paragraph text-gray-700 mb-2">Covers various Engineering branches, Competitive & Entrance, MBA</p>
                        <p className="font-paragraph text-cyan-600 font-semibold">1360 e-books</p>
                      </div>
                      
                      <div className="border-l-4 border-lime-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">Quiklrn</h3>
                        <p className="font-paragraph text-gray-700 mb-2">First-year courses, ECE/EEE, CSE, MBA</p>
                        <p className="font-paragraph text-lime-600 font-semibold">91 e-books</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Language Lab & E-Learning Platforms Section */}
                  <div className="mb-12">
                    <h2 className="font-heading text-3xl font-bold text-primary mb-6">Language Lab & E-Learning Platforms</h2>
                    
                    <div className="space-y-6">
                      <div className="border-l-4 border-violet-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">Quiklrn - Language Communication Lab</h3>
                        <p className="font-paragraph text-gray-700">English language learning modules with grammar and vocabulary support</p>
                      </div>
                      
                      <div className="border-l-4 border-emerald-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">IEEE Blended e-Learning Platform</h3>
                        <p className="font-paragraph text-gray-700">60 e-learning courses with video content</p>
                      </div>
                      
                      <div className="border-l-4 border-rose-500 pl-6">
                        <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">KNIMBUS</h3>
                        <p className="font-paragraph text-gray-700 mb-2">Cloud-based digital library with federated search and remote access</p>
                        <p className="font-paragraph text-gray-700">Access to eBooks, journals, videos, and MOOC courses</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Plagiarism Detection Software Section */}
                  <div className="mb-12">
                    <h2 className="font-heading text-3xl font-bold text-primary mb-6">Plagiarism Detection Software</h2>
                    
                    <div className="border-l-4 border-gray-500 pl-6">
                      <h3 className="font-heading text-xl font-semibold text-gray-800 mb-2">Drillbit</h3>
                      <p className="font-paragraph text-gray-700">Plagiarism detection software with instructor and student profiles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="text-center">
              <p className="font-paragraph text-gray-400">
                © 2025 VTU Consortium Portal. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Default coming soon page for other years
  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-[120rem] mx-auto px-6 py-4">
          <nav className="flex items-center justify-between">
            <Link to="/" className="font-heading text-2xl font-bold">
              VTU Consortium
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="hover:text-orange-200 transition-colors">Home</Link>
              <span className="text-orange-200 font-semibold">E-Resources</span>
              <Link to="/journals" className="hover:text-orange-200 transition-colors">ONOS</Link>
              <Link to="/news" className="hover:text-orange-200 transition-colors">Downloads</Link>
              <Link to="/guide" className="hover:text-orange-200 transition-colors">User Guide</Link>
            </div>
            <Button 
              onClick={() => window.location.href = '/'}
              variant="outline" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center space-y-4">
            <h1 className="font-heading text-5xl font-bold text-primary">
              E-RESOURCES {year && `- ${year}`}
            </h1>
            <p className="font-paragraph text-xl text-primary/70 max-w-3xl mx-auto">
              {year 
                ? `Academic resources for the ${year} academic year are currently being prepared.`
                : "E-Resources section is currently being updated. Please check back soon for the latest academic resources."
              }
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center space-y-8">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary/50" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-primary">
              {year ? `${year} Resources Coming Soon` : 'Coming Soon'}
            </h2>
            <p className="font-paragraph text-lg text-primary/70 max-w-2xl mx-auto">
              {year 
                ? `We are working on curating the best academic resources for the ${year} academic year. Our team is preparing comprehensive materials for your research and learning needs.`
                : "We are working on bringing you an enhanced E-Resources experience. Our team is curating the best academic materials for your research and learning needs."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/'}
                className="bg-primary hover:bg-primary/90"
              >
                Return to Home
              </Button>
              {year && (
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/resources'}
                  className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  View All Resources
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center">
            <p className="font-paragraph text-gray-400">
              © 2025 VTU Consortium Portal. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}