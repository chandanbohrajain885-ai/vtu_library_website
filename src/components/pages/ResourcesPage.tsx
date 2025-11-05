import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Download, ExternalLink, FileText, Globe, Database, Users, ArrowLeft } from 'lucide-react';
import { Image } from '@/components/ui/image';

export default function ResourcesPage() {
  const { year } = useParams();
  
  // Check if this is the 2025-26 year (under progress)
  const isUnderProgress = year === '2025-26';
  
  // Check if this is the 2024-25 year (detailed content)
  const isDetailedYear = year === '2024-25';
  
  // Check if this is the 2023-24 year (plain text content)
  const is2023Year = year === '2023-24';
  
  // Check if this is the 2022-23 year (styled content)
  const is2022Year = year === '2022-23';
  
  // Check if this is the 2021-22 year (styled content)
  const is2021Year = year === '2021-22';

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

        {/* E-Resources Images Section */}
        <section className="py-20">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="space-y-8">
              <Image src="https://static.wixstatic.com/media/e79745_a2221d77a50a463f9d8eae98662f11b3~mv2.png" alt="E-Resources Document 1" className="w-full h-auto" />
              <Image src="https://static.wixstatic.com/media/e79745_cd0c902613df4e23b343f85ee7e82a1d~mv2.png" alt="E-Resources Document 2" className="w-full h-auto" />
              <Image src="https://static.wixstatic.com/media/e79745_ea76daf97b114666a1719f2c0acf558d~mv2.png" alt="E-Resources Document 3" className="w-full h-auto" />
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

  // Render styled content for 2021-22
  if (is2021Year) {
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

        {/* E-Resources Content Section */}
        <section className="py-20">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="prose prose-lg max-w-none">
                <h1 className="font-heading text-4xl font-bold text-primary text-center mb-12">
                  VTU CONSORTIUM SUBSCRIBED E-RESOURCES FOR THE YEAR 2021-22
                </h1>
                
                {/* E-Journals Section */}
                <div className="mb-12">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">
                    E-Journals
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-500 pl-6 bg-blue-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-blue-800 mb-2">
                        Elsevier (ScienceDirect)
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Engineering, Computer Science, Electrical Engineering, Mechanical Engineering, Electronics & Communication, Civil Engineering, Artificial Intelligence, and allied branches
                      </p>
                      <p className="font-paragraph text-blue-600 font-semibold text-lg">
                        280 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-6 bg-purple-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-purple-800 mb-2">
                        IEEE ASPP (All Society Periodicals Package)
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Covers Aerospace, Bioengineering, Communication Technology, Power Engineering, Robotics, Signal Processing, and more
                      </p>
                      <p className="font-paragraph text-purple-600 font-semibold text-lg">
                        190 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-6 bg-green-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-green-800 mb-2">
                        Springer Nature
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Electrical & Electronics Engineering, Mechanical Engineering, Civil Engineering, Computer Science, Chemistry, Mathematics, Physics, and allied sciences
                      </p>
                      <p className="font-paragraph text-green-600 font-semibold text-lg">
                        650 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-orange-500 pl-6 bg-orange-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-orange-800 mb-2">
                        Taylor & Francis
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Engineering disciplines, Computer Science & Engineering, Mechanical Engineering, Civil Engineering, Architecture, and Allied Sciences
                      </p>
                      <p className="font-paragraph text-orange-600 font-semibold text-lg">
                        550 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-teal-500 pl-6 bg-teal-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-teal-800 mb-2">
                        Emerald
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Management Studies, Finance, Economics, Human Resources, Marketing, Public Policy, and Business Strategy
                      </p>
                      <p className="font-paragraph text-teal-600 font-semibold text-lg">
                        200 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-indigo-500 pl-6 bg-indigo-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-indigo-800 mb-2">
                        ASCE (American Society of Civil Engineers)
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Civil Engineering, Environmental Engineering, Construction Engineering, and Structural Engineering
                      </p>
                      <p className="font-paragraph text-indigo-600 font-semibold text-lg">
                        35 e-journals
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* E-Books Section */}
                <div className="mb-12">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">
                    E-Books
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-red-500 pl-6 bg-red-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-red-800 mb-2">
                        McGraw Hill Education
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Engineering, Computer Science, Mathematics, Physics, Chemistry, and Management
                      </p>
                      <p className="font-paragraph text-red-600 font-semibold text-lg">
                        400+ e-books
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-pink-500 pl-6 bg-pink-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-pink-800 mb-2">
                        Cengage Learning
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Engineering disciplines, Mathematics, Computer Science, and MBA programs
                      </p>
                      <p className="font-paragraph text-pink-600 font-semibold text-lg">
                        280+ e-books
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-yellow-500 pl-6 bg-yellow-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-yellow-800 mb-2">
                        Wiley Online Library
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Engineering, Technology, Computer Science, Mathematics, and Applied Sciences
                      </p>
                      <p className="font-paragraph text-yellow-600 font-semibold text-lg">
                        250+ e-books
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-cyan-500 pl-6 bg-cyan-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-cyan-800 mb-2">
                        Cambridge University Press
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Engineering, Computer Science, Mathematics, Physics, Chemistry, and Applied Sciences
                      </p>
                      <p className="font-paragraph text-cyan-600 font-semibold text-lg">
                        180+ e-books
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Cloud-Based & Remote Access Solutions Section */}
                <div className="mb-12">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">
                    Cloud-Based & Remote Access Solutions
                  </h2>
                  
                  <div className="border-l-4 border-violet-500 pl-6 bg-violet-50/50 p-4 rounded-r-lg">
                    <h3 className="font-heading text-xl font-semibold text-violet-800 mb-2">
                      Remote Access Platform
                    </h3>
                    <p className="font-paragraph text-gray-700 mb-2">
                      Federated search platform providing remote access to journals, e-books, and educational resources
                    </p>
                    <p className="font-paragraph text-violet-600 font-semibold text-lg">
                      7,500+ e-books & 4,800+ e-journals
                    </p>
                  </div>
                </div>
                
                {/* Plagiarism Detection & Learning Tools Section */}
                <div className="mb-12">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">
                    Plagiarism Detection & Learning Tools
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-emerald-500 pl-6 bg-emerald-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-emerald-800 mb-2">
                        Plagiarism Detection Software
                      </h3>
                      <p className="font-paragraph text-gray-700">
                        Comprehensive plagiarism detection tool with instructor and student access for academic integrity
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-rose-500 pl-6 bg-rose-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-rose-800 mb-2">
                        Writing Enhancement Tools
                      </h3>
                      <p className="font-paragraph text-gray-700">
                        Grammar and writing improvement tools for academic writing and communication
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Language Lab & E-Learning Section */}
                <div className="mb-12">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">
                    Language Lab & E-Learning Platforms
                  </h2>
                  
                  <div className="border-l-4 border-lime-500 pl-6 bg-lime-50/50 p-4 rounded-r-lg">
                    <h3 className="font-heading text-xl font-semibold text-lime-800 mb-2">
                      English Language Communication Lab
                    </h3>
                    <p className="font-paragraph text-gray-700">
                      Interactive English language learning modules with comprehensive grammar and vocabulary support for technical communication
                    </p>
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

  // Render styled content for 2022-23
  if (is2022Year) {
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

        {/* E-Resources Content Section */}
        <section className="py-20">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="prose prose-lg max-w-none">
                <h1 className="font-heading text-4xl font-bold text-primary text-center mb-12">
                  VTU CONSORTIUM SUBSCRIBED E-RESOURCES FOR THE YEAR 2022-23
                </h1>
                
                {/* E-Journals Section */}
                <div className="mb-12">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">
                    E-Journals
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-500 pl-6 bg-blue-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-blue-800 mb-2">
                        Elsevier (ScienceDirect)
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Engineering, Computer Science, Electrical Engineering, Mechanical Engineering, Electronics & Communication, Civil Engineering, Artificial Intelligence, and allied branches
                      </p>
                      <p className="font-paragraph text-blue-600 font-semibold text-lg">
                        298 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-6 bg-purple-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-purple-800 mb-2">
                        IEEE ASPP (All Society Periodicals Package)
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Covers Aerospace, Bioengineering, Communication Technology, Power Engineering, Robotics, Signal Processing, and more
                      </p>
                      <p className="font-paragraph text-purple-600 font-semibold text-lg">
                        198 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-6 bg-green-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-green-800 mb-2">
                        Springer Nature
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Electrical & Electronics Engineering, Mechanical Engineering, Civil Engineering, Computer Science, Chemistry, Mathematics, Physics, and allied sciences
                      </p>
                      <p className="font-paragraph text-green-600 font-semibold text-lg">
                        690 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-orange-500 pl-6 bg-orange-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-orange-800 mb-2">
                        Taylor & Francis
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Engineering disciplines, Computer Science & Engineering, Mechanical Engineering, Civil Engineering, Architecture, and Allied Sciences
                      </p>
                      <p className="font-paragraph text-orange-600 font-semibold text-lg">
                        585 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-teal-500 pl-6 bg-teal-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-teal-800 mb-2">
                        Emerald
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Management Studies, Finance, Economics, Human Resources, Marketing, Public Policy, and Business Strategy
                      </p>
                      <p className="font-paragraph text-teal-600 font-semibold text-lg">
                        212 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-indigo-500 pl-6 bg-indigo-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-indigo-800 mb-2">
                        ProQuest
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Comprehensive coverage of Architecture, Engineering, Aerospace Engineering, and Material Science
                      </p>
                      <p className="font-paragraph text-indigo-600 font-semibold text-lg">
                        4,900 full-text journals, 7,800 indexed journals
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* E-Books Section */}
                <div className="mb-12">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">
                    E-Books
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-red-500 pl-6 bg-red-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-red-800 mb-2">
                        McGraw Hill Education
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Engineering, Computer Science, Mathematics, Physics, Chemistry, and Management
                      </p>
                      <p className="font-paragraph text-red-600 font-semibold text-lg">
                        450+ e-books
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-pink-500 pl-6 bg-pink-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-pink-800 mb-2">
                        Cengage Learning
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Engineering disciplines, Mathematics, Computer Science, and MBA programs
                      </p>
                      <p className="font-paragraph text-pink-600 font-semibold text-lg">
                        320+ e-books
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-yellow-500 pl-6 bg-yellow-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-yellow-800 mb-2">
                        Wiley Online Library
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Engineering, Technology, Computer Science, Mathematics, and Applied Sciences
                      </p>
                      <p className="font-paragraph text-yellow-600 font-semibold text-lg">
                        275+ e-books
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Cloud-Based & Remote Access Solutions Section */}
                <div className="mb-12">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">
                    Cloud-Based & Remote Access Solutions
                  </h2>
                  
                  <div className="border-l-4 border-cyan-500 pl-6 bg-cyan-50/50 p-4 rounded-r-lg">
                    <h3 className="font-heading text-xl font-semibold text-cyan-800 mb-2">
                      MAPMy Access
                    </h3>
                    <p className="font-paragraph text-gray-700 mb-2">
                      Universal federated search platform providing remote access to journals, e-books, e-theses, and educational videos
                    </p>
                    <p className="font-paragraph text-cyan-600 font-semibold text-lg">
                      8,500+ e-books & 5,200+ e-journals
                    </p>
                  </div>
                </div>
                
                {/* Plagiarism Detection & Learning Tools Section */}
                <div className="mb-12">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">
                    Plagiarism Detection & Learning Tools
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-violet-500 pl-6 bg-violet-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-violet-800 mb-2">
                        Plagiarism Originality Online Check
                      </h3>
                      <p className="font-paragraph text-gray-700">
                        Comprehensive plagiarism detection software with dedicated instructor and student profiles for academic integrity
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-emerald-500 pl-6 bg-emerald-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-emerald-800 mb-2">
                        NetAnalytiks' LANQUILL
                      </h3>
                      <p className="font-paragraph text-gray-700">
                        Advanced writing and grammar learning tool for improving academic writing skills
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Language Lab & E-Learning Section */}
                <div className="mb-12">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">
                    Language Lab & E-Learning Platforms
                  </h2>
                  
                  <div className="border-l-4 border-lime-500 pl-6 bg-lime-50/50 p-4 rounded-r-lg">
                    <h3 className="font-heading text-xl font-semibold text-lime-800 mb-2">
                      English Language Communication Lab
                    </h3>
                    <p className="font-paragraph text-gray-700">
                      Interactive English language learning modules with comprehensive grammar and vocabulary support for technical communication
                    </p>
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

  // Render plain text content for 2023-24
  if (is2023Year) {
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

        {/* E-Resources Content Section */}
        <section className="py-20">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="prose prose-lg max-w-none">
                <h1 className="font-heading text-4xl font-bold text-primary text-center mb-12">
                  VTU CONSORTIUM SUBSCRIBED E-RESOURCES FOR THE YEAR 2023-24
                </h1>
                
                {/* E-Journals Section */}
                <div className="mb-12">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">
                    E-Journals
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-500 pl-6 bg-blue-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-blue-800 mb-2">
                        Elsevier (ScienceDirect)
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Engineering, CS, EE, ME, EC, CV, AI, and allied branches
                      </p>
                      <p className="font-paragraph text-blue-600 font-semibold text-lg">
                        298 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-6 bg-purple-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-purple-800 mb-2">
                        IEEE ASPP (All Society Periodicals Package)
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Covers Aerospace, Bioengineering, Communication, Power, Robotics, etc.
                      </p>
                      <p className="font-paragraph text-purple-600 font-semibold text-lg">
                        198 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-6 bg-green-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-green-800 mb-2">
                        Springer Nature
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Electrical & Electronics, Mechanical, Civil, CS, Chemistry, Math, Physics
                      </p>
                      <p className="font-paragraph text-green-600 font-semibold text-lg">
                        690 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-orange-500 pl-6 bg-orange-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-orange-800 mb-2">
                        Taylor & Francis
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Engineering, CSE, ME, Civil, Architecture, and Allied Sciences
                      </p>
                      <p className="font-paragraph text-orange-600 font-semibold text-lg">
                        585 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-teal-500 pl-6 bg-teal-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-teal-800 mb-2">
                        Emerald
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Management, Finance, Economics, HR, Marketing, Public Policy
                      </p>
                      <p className="font-paragraph text-teal-600 font-semibold text-lg">
                        212 e-journals
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-indigo-500 pl-6 bg-indigo-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-indigo-800 mb-2">
                        ProQuest
                      </h3>
                      <p className="font-paragraph text-gray-700 mb-2">
                        Covers Architecture, Engineering, Aerospace, and Material Science
                      </p>
                      <p className="font-paragraph text-indigo-600 font-semibold text-lg">
                        4900 full-text journals, 7800 indexed journals
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Cloud-Based & Remote Access Solutions Section */}
                <div className="mb-12">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">
                    Cloud-Based & Remote Access Solutions
                  </h2>
                  
                  <div className="border-l-4 border-cyan-500 pl-6 bg-cyan-50/50 p-4 rounded-r-lg">
                    <h3 className="font-heading text-xl font-semibold text-cyan-800 mb-2">
                      MAPMy Access
                    </h3>
                    <p className="font-paragraph text-gray-700 mb-2">
                      Universal federated search, remote access to journals, e-books, e-theses, and educational videos
                    </p>
                    <p className="font-paragraph text-cyan-600 font-semibold text-lg">
                      10,000+ e-books & 5700+ e-journals
                    </p>
                  </div>
                </div>
                
                {/* Plagiarism Detection & Learning Tools Section */}
                <div className="mb-12">
                  <h2 className="font-heading text-3xl font-bold text-primary mb-8 border-b-2 border-primary/20 pb-2">
                    Plagiarism Detection & Learning Tools
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="border-l-4 border-red-500 pl-6 bg-red-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-red-800 mb-2">
                        Plagiarism Originality Online Check
                      </h3>
                      <p className="font-paragraph text-gray-700">
                        End-user licenses for instructor and student profiles
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-pink-500 pl-6 bg-pink-50/50 p-4 rounded-r-lg">
                      <h3 className="font-heading text-xl font-semibold text-pink-800 mb-2">
                        NetAnalytiks' LANQUILL
                      </h3>
                      <p className="font-paragraph text-gray-700">
                        Writing and grammar learning tool
                      </p>
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