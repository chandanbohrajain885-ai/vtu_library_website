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

        {/* E-Resources Content Section */}
        <section className="py-20">
          <div className="max-w-[120rem] mx-auto px-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
{`ANNEXURE-1
VTU CONSORTIUM SUBSCRIBED E-RESOURCES FOR THE YEAR 2025-26
Sl. No Publisher Logo Publishers e-Resources Website
Subscription
Period
Contact person
1
IEEE
ASPP 202 Journals &
POP ALL conference
1800 proceedings
https://ieeexplore.ieee.org
01-10-2025
to
30-06-2026
Mr.Manjunath Rudrappa
mrudrappa@ebsco.com
9870200104
2
Elsevier Science
Direct
405 e-Journals https://www.sciencedirect.com
23-05-2025
to
22-05-2026
Pranav Shukla
p.shukla.1@elsevier.com
9810332529
3
Springer Nature 710 e-Journals https://link.springer.com
01-06-2025
to
31-05-2026
Rajaneesh Appayya
rajaneesh@springer.com
9900555516
4
Taylor &
Francis
260 e-Journals https://www.tandfonline.com/
01-09-2025
to
31-08-2026
Rajesh Shetty
rajesh.shetty@informa.com
9818500210
5
Emerald
Publishing
Management 212 e-
Journals
https://www.emerald.com/insight/
01-10-2025
to
30-09-2026
S Vinay Kumar
svkumar@emerald.com
9916252539
6
ICE 29 e-Journals https://www.emerald.com/insight/
01-10-2025
to
30-09-2026
S Vinay Kumar
svkumar@emerald.com
9916252539
7
EBSCO
Engineering
Suite
6100 e-Journals
24015 e-Books
80+ microcourses
https://search.ebscohost.com
01-10-2025
to
30-09-2026
Rekha Choyal
rchoyal@ebsco.com
81309 95682
8
Magzter
database
Magazines-3174
Newspapers-1260
Journals-4581
Others -2595
https://library.magzter.com
01-09-2025
to
31-08-2026
Savam Talukdar
contact@verse.in, sovam.talukdar@verse.in
8102556806
Deepa Balaji
clienthelpdesk@magzter.com
9840952472
9
PACKT 2300 e-Books https://learning.packt.com
01-09-2025
to
31-08-2026
Pravin Shet
pravins@packt.com
9987680770
10
New Age
International
450 e-Books https://digital.elib4u.com/
Perpetual
access from
01-09-2025
Manish Gupta
manish@newagepublishers.com
9315905295
11
Edsol Informatics
20 e-Books https://ebooks.edsolinformatics.com/
Perpetual access from 01-09-2025
Vikas Madan
vikas@edsolinformatics.com
9711175377
12
Quiklrn
Language Communication Lab unlimited users
https://home.quiklrn.com
19-09-2025
to
18-09-2026
Rajesh Shetty
rajesh@quiklrn.com
9845005732
13
Quiklrn
185 e-Books access with smart mobile app
https://home.quiklrn.com
19-09-2025
to
18-09-2026
Rajesh Shetty
rajesh@quiklrn.com
9845005732
14
IEEE Blended e-Learning
70 e-Learning Courses
http://blendedlearning.ieee.org
19-09-2025
to
18-09-2026
Pramod Kumar P
pramod.p@ieee.org
9343071441
15
PAT Technology
14 e-Learning Courses https://vtu.edutainer.in/
01-09-2025
to
31-08-2026
Mr.Shrawan Tiwari
info@edutainer.in
9513399613
16
DrillBit
Plagiarism Detection Software https://www.drillbitplagiarism.com
12-05-2025
to
11-05-2026
Mr.Jayanna jayanna.belavadi@drillbitplagiarism.com
9739904021
17
MAP Systems
Technology Platform https://access.vtuconsortium.com
18-11-2025
to
17-05-2027
Mr.Somshekhar V Thalange
somshekhar@maplibraryservices.com 86001 05949
18
CELUS Online Software for automated harvesting and analysis of COUNTER and non-COUNTER statistics https://www.celus.net/
01-10-2025
to
31-09-2026
Amit Verma
amit@umbrellapalm.in
9999354563
ANNEXURE-II
VTU CONSORTIUM EXISTING PERPETUAL /SUBSCRIPTION ACCESS OF E-BOOKS
Sl. No
Publisher
Logo
Publishers e-Resources Website
Subscriptio
n Period
Contact Details
1
CBS Publishers 174 e-Books https://www.eduport-global.com
17-09-2024
To
16-09-2031
G Anjaneyulu
anji.ebooks@cbspd.com
9908075875
2
Cambridge University
Press
58 e-Books https://www.cambridge.org
Perpetual
access from
September
2024
Aiam Aftab
Aftab.alam2@cambridge.org
7795045801
3
Cengage Learning 69 e-Books
https://cengageindiaelibrary.ipublis
hcentral.net
17-09-2024
to
16-09-2031
Vishal Kumar Singh
vishal.kumar@cengage.com
8800001621
4
BSP Books 141 e-Books
https://ebookstore.bspublications.ne
t
17-09-2024
to
16-09-2029
Nikunjesh A Shah
nikunjesh.shah@bspbooks.net
8374105220
5
Taylor & Francis 5731 e-Books
https://www.taylorfrancis.com
Perpetual
access from
2014
Rajesh Shetty
rajesh.shetty@informa.com
9818500210
6
Springer 12,863 e-Books https://link.springer.com
Perpetual
access from
2014
Rajaneesh Appayya
rajaneesh@springer.com
9900555516
7
PACKT 5000 e-Books https://learning.packt.com
Perpetual
access from
2019
Pravin Shet
pravins@packt.com
9987680770
8
New Age International 220 e-Books https://digital.elib4u.com/
Perpetual
access from
2019
Manish Gupta
manish@newagepublishers.com
9315905295
9
Elsevier Science Direct 436 e-Books https://www.sciencedirect.com
Perpetual
access from
2019
Pranav Shukla
p.shukla.1@elsevier.com
9810332529`}
              </pre>
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