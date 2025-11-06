import React from 'react';
import { BookOpen, Users, Download } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white py-16">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="text-center">
            <h1 className="font-heading text-5xl font-bold mb-4">About VTU Consortium</h1>
            <p className="font-paragraph text-xl max-w-3xl mx-auto">
              Empowering academic excellence through collaborative resource sharing and innovative digital solutions
            </p>
          </div>
        </div>
      </header>
      {/* About Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[120rem] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Vision & Mission */}
            <div className="space-y-12">
              {/* Vision */}
              <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-primary">
                <h3 className="font-heading text-2xl font-bold text-primary mb-4">Our Vision</h3>
                <p className="font-paragraph text-gray-700 leading-relaxed">
                  To be the premier digital consortium that transforms academic research and learning through 
                  innovative resource sharing, fostering excellence in education and research across all 
                  member institutions of Visvesvaraya Technological University.
                </p>
              </div>

              {/* Mission */}
              <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-secondary">
                <h3 className="font-heading text-2xl font-bold text-secondary mb-4">Our Mission</h3>
                <p className="font-paragraph text-gray-700 leading-relaxed">
                  To provide seamless access to world-class digital resources, facilitate collaborative 
                  research initiatives, and support the academic community through comprehensive library 
                  services, training programs, and technological innovation.
                </p>
              </div>

              {/* Preamble */}
              <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-orange-500">
                <h3 className="font-heading text-2xl font-bold text-orange-600 mb-4">Preamble</h3>
                <p className="font-paragraph text-gray-700 leading-relaxed">
                  The VTU Consortium represents a groundbreaking initiative in academic resource sharing, 
                  bringing together the collective strength of engineering institutions under the 
                  Visvesvaraya Technological University umbrella. Established to democratize access to 
                  premium academic resources, the consortium embodies the spirit of collaboration and 
                  shared knowledge that drives educational excellence.
                </p>
              </div>
            </div>

            {/* Right Column - University Background & Details */}
            <div className="space-y-12">
              {/* University Background */}
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="font-heading text-2xl font-bold text-gray-800 mb-6">University Background</h3>
                <div className="space-y-4">
                  <p className="font-paragraph text-gray-700 leading-relaxed">{"Visvesvaraya Technological University (VTU), established in 1998, stands as one of India's largest technological universities, serving over 210  colleges across Karnataka state."}</p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <div className="font-heading text-3xl font-bold text-primary">{"210"}</div>
                      <div className="font-paragraph text-sm text-gray-600">{"Colleges"}</div>
                    </div>
                    <div className="text-center p-4 bg-secondary/5 rounded-lg">
                      <div className="font-heading text-3xl font-bold text-secondary">500K+</div>
                      <div className="font-paragraph text-sm text-gray-600">Students</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engineering Colleges */}
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="font-heading text-2xl font-bold text-gray-800 mb-6">Engineering Colleges Network</h3>
                <p className="font-paragraph text-gray-700 leading-relaxed mb-4">
                  Our consortium encompasses a diverse network of engineering institutions, including:
                </p>
                <ul className="font-paragraph text-gray-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Government Engineering Colleges</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Private Engineering Institutions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Autonomous Engineering Colleges</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>Research Institutions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Libraries Section */}
          <div className="mt-16">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="font-heading text-3xl font-bold text-gray-800 mb-8 text-center">Library Network</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-heading text-xl font-semibold text-gray-800 mb-2">Central Library</h4>
                  <p className="font-paragraph text-gray-600">
                    State-of-the-art central library facility with comprehensive collection and digital resources
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-secondary" />
                  </div>
                  <h4 className="font-heading text-xl font-semibold text-gray-800 mb-2">College Libraries</h4>
                  <p className="font-paragraph text-gray-600">
                    Network of individual college libraries connected through the consortium platform
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="h-8 w-8 text-orange-600" />
                  </div>
                  <h4 className="font-heading text-xl font-semibold text-gray-800 mb-2">Digital Resources</h4>
                  <p className="font-paragraph text-gray-600">
                    Extensive digital collection including e-books, journals, and research databases
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Consortia Section */}
          <div className="mt-16">

          </div>

          {/* Aims Section */}
          <div className="mt-16">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="font-heading text-3xl font-bold text-gray-800 mb-8 text-center">Our Aims</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-primary/5 rounded-lg">
                  <div className="font-heading text-lg font-semibold text-primary mb-2">Resource Sharing</div>
                  <p className="font-paragraph text-sm text-gray-600">
                    Facilitate seamless sharing of academic resources across all member institutions
                  </p>
                </div>
                <div className="text-center p-6 bg-secondary/5 rounded-lg">
                  <div className="font-heading text-lg font-semibold text-secondary mb-2">Cost Optimization</div>
                  <p className="font-paragraph text-sm text-gray-600">
                    Reduce individual institutional costs through collective procurement and licensing
                  </p>
                </div>
                <div className="text-center p-6 bg-orange-500/5 rounded-lg">
                  <div className="font-heading text-lg font-semibold text-orange-600 mb-2">Quality Enhancement</div>
                  <p className="font-paragraph text-sm text-gray-600">
                    Improve the quality of education and research through premium resource access
                  </p>
                </div>
                <div className="text-center p-6 bg-green-500/5 rounded-lg">
                  <div className="font-heading text-lg font-semibold text-green-600 mb-2">Innovation Support</div>
                  <p className="font-paragraph text-sm text-gray-600">
                    Foster innovation and research excellence through advanced digital tools
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-16">

          </div>

          {/* Governance Section */}
          <div className="mt-16">

          </div>
        </div>
      </section>
    </div>
  );
}