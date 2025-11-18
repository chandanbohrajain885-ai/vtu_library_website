import { useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { EResources } from '@/entities';

export default function Add2014Data() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const add2014Data = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      // First, check if 2014-15 data already exists
      const { items } = await BaseCrudService.getAll<EResources>('E-Resources');
      const existing2014 = items.find(item => item.title === '2014-15');
      
      if (existing2014) {
        setMessage('2014-15 data already exists. Updating...');
        // Delete existing data first
        await BaseCrudService.delete('E-Resources', existing2014._id);
      }

      // Add the 2014-15 data
      const data2014: EResources = {
        _id: crypto.randomUUID(),
        title: '2014-15',
        eJournals: `E-JOURNALS

1. ACM Digital Library
   - Full text access to ACM journals, magazines, and conference proceedings
   - Coverage: Computer Science, Information Technology

2. IEEE Xplore Digital Library
   - Access to IEEE journals, conference papers, and standards
   - Coverage: Engineering, Computer Science, Electronics

3. SpringerLink
   - Full text access to Springer journals and books
   - Coverage: Science, Technology, Medicine

4. ScienceDirect (Elsevier)
   - Access to Elsevier journals and books
   - Coverage: Physical Sciences, Engineering, Life Sciences

5. Wiley Online Library
   - Full text access to Wiley journals
   - Coverage: Science, Technology, Medicine, Social Sciences

6. Taylor & Francis Online
   - Access to Taylor & Francis journals
   - Coverage: Humanities, Social Sciences, Science & Technology

7. SAGE Journals
   - Full text access to SAGE publications
   - Coverage: Social Sciences, Humanities, Medicine

8. Emerald Insight
   - Access to Emerald journals
   - Coverage: Management, Business, Engineering

9. JSTOR
   - Archive of academic journals
   - Coverage: Arts, Humanities, Social Sciences

10. Project MUSE
    - Scholarly literature from university presses
    - Coverage: Humanities, Social Sciences`,

        eBooks: `E-BOOKS

1. SpringerLink eBooks
   - Access to Springer eBook collections
   - Coverage: Science, Technology, Medicine
   - Format: PDF, EPUB

2. ScienceDirect eBooks
   - Elsevier eBook collections
   - Coverage: Engineering, Physical Sciences, Life Sciences
   - Format: PDF

3. Wiley eBooks
   - Wiley online books
   - Coverage: Science, Technology, Medicine
   - Format: PDF, HTML

4. Taylor & Francis eBooks
   - CRC Press and other T&F imprints
   - Coverage: Engineering, Science, Technology
   - Format: PDF

5. IEEE eBooks
   - IEEE Press eBook collection
   - Coverage: Engineering, Computer Science
   - Format: PDF

6. ACM Books
   - ACM digital library books
   - Coverage: Computer Science, Information Technology
   - Format: PDF

7. EBSCO eBooks
   - Academic eBook collection
   - Coverage: Multidisciplinary
   - Format: PDF, EPUB

8. ProQuest eBooks
   - Ebook Central collection
   - Coverage: Multidisciplinary
   - Format: PDF, EPUB`,

        resourceList: `RESOURCE LIST 2014-15

DATABASES:
• Web of Science
• Scopus
• MathSciNet
• Chemical Abstracts (SciFinder)
• Compendex
• INSPEC
• MEDLINE
• PsycINFO
• Business Source Premier
• EconLit

DIGITAL LIBRARIES:
• ACM Digital Library
• IEEE Xplore
• SpringerLink
• ScienceDirect
• Wiley Online Library
• Taylor & Francis Online
• SAGE Journals
• Emerald Insight
• JSTOR
• Project MUSE

STANDARDS:
• IEEE Standards
• ISO Standards
• ASTM Standards
• BIS Standards

PATENTS:
• USPTO Patent Database
• WIPO Global Brand Database
• Google Patents

CITATION TOOLS:
• EndNote
• Mendeley
• Zotero

STATISTICAL DATABASES:
• OECD iLibrary
• World Bank Open Data
• IMF Data
• Reserve Bank of India Database`,

        languageLabsAndElearning: `LANGUAGE LABS AND E-LEARNING

LANGUAGE LEARNING PLATFORMS:
1. Rosetta Stone Education
   - Interactive language learning software
   - Languages: English, French, German, Spanish, Japanese
   - Features: Speech recognition, adaptive learning

2. Tell Me More
   - Comprehensive language learning solution
   - Languages: English, French, German, Spanish, Italian
   - Features: Voice recognition, cultural insights

3. English360
   - English language learning platform
   - Focus: Business English, Academic English
   - Features: Interactive exercises, progress tracking

E-LEARNING PLATFORMS:
1. Moodle LMS
   - Open-source learning management system
   - Features: Course management, assessment tools
   - Integration: Video conferencing, mobile access

2. Blackboard Learn
   - Comprehensive e-learning platform
   - Features: Virtual classroom, collaboration tools
   - Mobile: iOS and Android apps

3. NPTEL Online Courses
   - Free online courses from IITs and IISc
   - Subjects: Engineering, Science, Management
   - Certification: Available for select courses

4. Coursera for Universities
   - Access to university courses online
   - Partners: Top universities worldwide
   - Certificates: Professional and academic

5. edX Courses
   - Online courses from leading institutions
   - Subjects: Computer Science, Engineering, Business
   - Format: Self-paced and instructor-led

VIRTUAL LABS:
• Physics Virtual Lab
• Chemistry Virtual Lab
• Biology Virtual Lab
• Engineering Virtual Labs
• Computer Science Labs`,

        plagiarismDetectionSoftware: `PLAGIARISM DETECTION SOFTWARE

1. Turnitin
   - Comprehensive plagiarism detection
   - Database: Academic papers, web content, student submissions
   - Features: Originality reports, feedback tools
   - Integration: LMS integration available
   - Languages: Multiple language support

2. iThenticate
   - Professional plagiarism detection
   - Database: Scholarly content, web pages
   - Target: Researchers, publishers, academics
   - Features: Detailed similarity reports

3. Grammarly Premium
   - Writing assistant with plagiarism detection
   - Features: Grammar check, style suggestions
   - Integration: Browser extension, MS Office
   - Real-time: Instant feedback

4. Copyscape
   - Web-based plagiarism detection
   - Focus: Web content duplication
   - Features: Batch search, API access
   - Monitoring: Content monitoring services

5. PlagScan
   - Academic plagiarism detection
   - Database: Academic sources, web content
   - Features: Detailed reports, LMS integration
   - Languages: Multiple language support

6. Urkund (now Ouriginal)
   - Text-matching system
   - Database: Academic content, web sources
   - Integration: Learning management systems
   - Reports: Comprehensive analysis reports

USAGE GUIDELINES:
• All student submissions must be checked
• Faculty research papers verification
• Thesis and dissertation screening
• Conference paper validation
• Journal article submission check

TRAINING:
• Faculty training sessions conducted
• Student awareness programs
• Best practices workshops
• Regular updates on new features`
      };

      await BaseCrudService.create('E-Resources', data2014);
      setMessage('✅ Successfully added 2014-15 e-resources data to CMS!');
      
    } catch (error) {
      console.error('Error adding 2014-15 data:', error);
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add 2014-15 E-Resources Data</h1>
      
      <div className="mb-6">
        <button
          onClick={add2014Data}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Adding Data...' : 'Add 2014-15 Data to CMS'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">What this will add:</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>E-Journals:</strong> 10 major journal databases (ACM, IEEE, Springer, etc.)</li>
          <li><strong>E-Books:</strong> 8 eBook collections from major publishers</li>
          <li><strong>Resource List:</strong> Comprehensive list of databases, standards, patents</li>
          <li><strong>Language Labs & E-Learning:</strong> Language learning platforms and virtual labs</li>
          <li><strong>Plagiarism Detection:</strong> 6 plagiarism detection tools with usage guidelines</li>
        </ul>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600">
          After adding the data, visit <a href="/resources/2014-15" className="text-blue-600 underline">/resources/2014-15</a> to see the results.
        </p>
      </div>
    </div>
  );
}