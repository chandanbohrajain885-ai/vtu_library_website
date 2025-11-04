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
            
            {/* Database Access Section */}
            <div className="mb-16">
              <h2 className="font-heading text-3xl font-bold text-primary mb-8 text-center">
                Database Access & Digital Libraries
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* IEEE Xplore */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Database className="h-8 w-8 text-blue-500" />
                      <CardTitle className="font-heading text-xl text-primary">IEEE Xplore</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-paragraph text-gray-600 mb-4">
                      Access to IEEE journals, conference proceedings, and standards in engineering and technology.
                    </p>
                    <ul className="font-paragraph text-sm text-gray-600 space-y-1 mb-4">
                      <li>• 5+ million documents</li>
                      <li>• Latest research in engineering</li>
                      <li>• Conference proceedings</li>
                      <li>• IEEE standards</li>
                    </ul>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Access IEEE Xplore
                    </Button>
                  </CardContent>
                </Card>

                {/* Springer Nature */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-green-500">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-8 w-8 text-green-500" />
                      <CardTitle className="font-heading text-xl text-primary">Springer Nature</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-paragraph text-gray-600 mb-4">
                      Comprehensive collection of scientific journals, books, and reference works.
                    </p>
                    <ul className="font-paragraph text-sm text-gray-600 space-y-1 mb-4">
                      <li>• 3,000+ journals</li>
                      <li>• 300,000+ books</li>
                      <li>• Reference works</li>
                      <li>• Protocols and methods</li>
                    </ul>
                    <Button className="w-full bg-green-500 hover:bg-green-600">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Access Springer
                    </Button>
                  </CardContent>
                </Card>

                {/* ScienceDirect */}
                <Card className="hover:shadow-lg transition-shadow border-l-4 border-orange-500">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-8 w-8 text-orange-500" />
                      <CardTitle className="font-heading text-xl text-primary">ScienceDirect</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-paragraph text-gray-600 mb-4">
                      Elsevier's leading platform for peer-reviewed literature in science and technology.
                    </p>
                    <ul className="font-paragraph text-sm text-gray-600 space-y-1 mb-4">
                      <li>• 16+ million articles</li>
                      <li>• 2,500+ journals</li>
                      <li>• 39,000+ books</li>
                      <li>• Advanced search tools</li>
                    </ul>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Access ScienceDirect
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Subject-wise Resources */}
            <div className="mb-16">
              <h2 className="font-heading text-3xl font-bold text-primary mb-8 text-center">
                Subject-wise Digital Resources
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Engineering & Technology */}
                <Card className="border-l-4 border-purple-500">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-primary flex items-center">
                      <FileText className="h-6 w-6 mr-3 text-purple-500" />
                      Engineering & Technology
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-heading text-lg font-semibold text-gray-800 mb-2">Key Databases:</h4>
                        <ul className="font-paragraph text-gray-600 space-y-1">
                          <li>• IEEE Xplore Digital Library</li>
                          <li>• ASME Digital Collection</li>
                          <li>• ACM Digital Library</li>
                          <li>• Engineering Village (Compendex)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-heading text-lg font-semibold text-gray-800 mb-2">Specialized Resources:</h4>
                        <ul className="font-paragraph text-gray-600 space-y-1">
                          <li>• Standards and Patents</li>
                          <li>• Conference Proceedings</li>
                          <li>• Technical Reports</li>
                          <li>• Industry Publications</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Science & Mathematics */}
                <Card className="border-l-4 border-teal-500">
                  <CardHeader>
                    <CardTitle className="font-heading text-2xl text-primary flex items-center">
                      <Database className="h-6 w-6 mr-3 text-teal-500" />
                      Science & Mathematics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-heading text-lg font-semibold text-gray-800 mb-2">Key Databases:</h4>
                        <ul className="font-paragraph text-gray-600 space-y-1">
                          <li>• Web of Science</li>
                          <li>• Scopus</li>
                          <li>• MathSciNet</li>
                          <li>• Chemical Abstracts Service</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-heading text-lg font-semibold text-gray-800 mb-2">Specialized Resources:</h4>
                        <ul className="font-paragraph text-gray-600 space-y-1">
                          <li>• Research Articles</li>
                          <li>• Citation Analysis</li>
                          <li>• Data Sets</li>
                          <li>• Research Metrics</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Access Information */}
            <div className="mb-16">
              <h2 className="font-heading text-3xl font-bold text-primary mb-8 text-center">
                Access Information & Support
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center border-l-4 border-blue-500">
                  <CardHeader>
                    <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <CardTitle className="font-heading text-xl text-primary">User Authentication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-paragraph text-gray-600 mb-4">
                      Access through institutional login or VTU credentials
                    </p>
                    <ul className="font-paragraph text-sm text-gray-600 space-y-1">
                      <li>• Single Sign-On (SSO)</li>
                      <li>• VTU ID Authentication</li>
                      <li>• Remote Access Available</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="text-center border-l-4 border-green-500">
                  <CardHeader>
                    <Download className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <CardTitle className="font-heading text-xl text-primary">Download Limits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-paragraph text-gray-600 mb-4">
                      Generous download allowances for academic use
                    </p>
                    <ul className="font-paragraph text-sm text-gray-600 space-y-1">
                      <li>• 50 articles/day per user</li>
                      <li>• Full-text PDF access</li>
                      <li>• Citation export tools</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="text-center border-l-4 border-orange-500">
                  <CardHeader>
                    <BookOpen className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                    <CardTitle className="font-heading text-xl text-primary">Training & Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-paragraph text-gray-600 mb-4">
                      Comprehensive training and support services
                    </p>
                    <ul className="font-paragraph text-sm text-gray-600 space-y-1">
                      <li>• Online tutorials</li>
                      <li>• Webinar sessions</li>
                      <li>• 24/7 technical support</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h2 className="font-heading text-3xl font-bold text-primary mb-8">
                Quick Access Links
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button className="bg-primary hover:bg-primary/90">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Database Portal
                </Button>
                <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                  <Download className="h-4 w-4 mr-2" />
                  User Guides
                </Button>
                <Button variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  Contact Support
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