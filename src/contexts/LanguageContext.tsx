import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'kn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Header
    'header.email': 'Email',
    'header.phone': 'Phone',
    'header.vtuconsortium': 'VTU Consortium',
    
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.membercolleges': 'Member Colleges',
    'nav.committee': 'Committee',
    'nav.eresources': 'E-Resources',
    'nav.training': 'Training',
    'nav.userguide': 'User Guide',
    'nav.links': 'Links',
    'nav.downloads': 'Downloads',
    'nav.onos': 'ONOS',
    'nav.gallery': 'Gallary',
    'nav.librariancorner': 'Librarian Corner',
    'nav.publishercorner': "Publisher's Corner",
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.superexecutive': 'Super Executive',
    'nav.logout': 'Logout',
    'nav.adminpanel': 'Admin Panel',
    'nav.welcome': 'Welcome',
    
    // Hero Section
    'hero.title': 'Welcome to VTU Consortium',
    'hero.subtitle': 'Symbolizes the connection between learning resources and learners.',
    'hero.searchplaceholder': '🔍 Search E-Resources by year/provider/subject, Committee info, Downloads, Training, Gallery, ONOS, Member Colleges, News & Events...',
    
    // News Section
    'news.title': 'News & Events',
    'news.addnews': 'Add News',
    'news.manageall': 'Manage All',
    'news.comingsoon': 'Coming Soon',
    'news.venue': 'Venue',
    'news.readmore': 'Read More',
    'news.edit': 'Edit',
    'news.by': 'By',
    
    // Footer
    'footer.quicklinks': 'Quick Links',
    'footer.eresources': 'E-Resources',
    'footer.journals': 'Journals',
    'footer.consortium': 'Consortium',
    'footer.notifications': 'Notifications',
    'footer.contactus': 'Contact Us',
    'footer.followus': 'Follow Us',
    'footer.copyright': '© 2025 VTU Consortium Portal. All Rights Reserved.',
    
    // Committee Items
    'committee.governing': 'Governing Council Committee',
    'committee.steering': 'Steering Committee',
    'committee.nodal': 'Nodal Officer Committee',
    
    // Downloads
    'downloads.circulars': 'Circulars',
    'downloads.blankformats': "Blank Format's",
    
    // Links
    'links.vtulinks': "VTU Link's",
    'links.otherlinks': "Others link's",
    
    // Admin Controls
    'admin.add': 'Add',
    'admin.manage': 'Manage',
    'admin.addcommittee': 'Add Committee',
    'admin.managecommittees': 'Manage Committees',
    'admin.adderesource': 'Add E-Resource',
    'admin.manageeresources': 'Manage E-Resources',
    'admin.addtraining': 'Add Training',
    'admin.managetraining': 'Manage Training',
    'admin.addguide': 'Add Guide',
    'admin.manageguides': 'Manage Guides',
    'admin.adddownload': 'Add Download',
    'admin.managedownloads': 'Manage Downloads',
    'admin.addgalleryitem': 'Add Gallery Item',
    'admin.managegallery': 'Manage Gallery',
    
    // Search
    'search.searching': 'Searching...',
    'search.noresults': 'No results found for',
    
    // Language
    'language.english': 'English',
    'language.kannada': 'ಕನ್ನಡ'
  },
  kn: {
    // Header
    'header.email': 'ಇಮೇಲ್',
    'header.phone': 'ಫೋನ್',
    'header.vtuconsortium': 'ವಿಟಿಯು ಕನ್ಸೋರ್ಟಿಯಂ',
    
    // Navigation
    'nav.home': 'ಮುಖ್ಯ ಪುಟ',
    'nav.about': 'ನಮ್ಮ ಬಗ್ಗೆ',
    'nav.membercolleges': 'ಸದಸ್ಯ ಕಾಲೇಜುಗಳು',
    'nav.committee': 'ಸಮಿತಿ',
    'nav.eresources': 'ಇ-ಸಂಪನ್ಮೂಲಗಳು',
    'nav.training': 'ತರಬೇತಿ',
    'nav.userguide': 'ಬಳಕೆದಾರ ಮಾರ್ಗದರ್ಶಿ',
    'nav.links': 'ಲಿಂಕ್‌ಗಳು',
    'nav.downloads': 'ಡೌನ್‌ಲೋಡ್‌ಗಳು',
    'nav.onos': 'ಒನೋಸ್',
    'nav.gallery': 'ಗ್ಯಾಲರಿ',
    'nav.librariancorner': 'ಗ್ರಂಥಾಲಯಾಧ್ಯಕ್ಷ ಕಾರ್ನರ್',
    'nav.publishercorner': 'ಪ್ರಕಾಶಕರ ಕಾರ್ನರ್',
    'nav.login': 'ಲಾಗಿನ್',
    'nav.register': 'ನೋಂದಣಿ',
    'nav.superexecutive': 'ಸೂಪರ್ ಎಕ್ಸಿಕ್ಯೂಟಿವ್',
    'nav.logout': 'ಲಾಗ್‌ಔಟ್',
    'nav.adminpanel': 'ಅಡ್ಮಿನ್ ಪ್ಯಾನೆಲ್',
    'nav.welcome': 'ಸ್ವಾಗತ',
    
    // Hero Section
    'hero.title': 'ವಿಟಿಯು ಕನ್ಸೋರ್ಟಿಯಂಗೆ ಸ್ವಾಗತ',
    'hero.subtitle': 'ಕಲಿಕೆಯ ಸಂಪನ್ಮೂಲಗಳು ಮತ್ತು ಕಲಿಯುವವರ ನಡುವಿನ ಸಂಪರ್ಕವನ್ನು ಸಂಕೇತಿಸುತ್ತದೆ.',
    'hero.searchplaceholder': '🔍 ವರ್ಷ/ಪೂರೈಕೆದಾರ/ವಿಷಯದ ಮೂಲಕ ಇ-ಸಂಪನ್ಮೂಲಗಳು, ಸಮಿತಿ ಮಾಹಿತಿ, ಡೌನ್‌ಲೋಡ್‌ಗಳು, ತರಬೇತಿ, ಗ್ಯಾಲರಿ, ಒನೋಸ್, ಸದಸ್ಯ ಕಾಲೇಜುಗಳು, ಸುದ್ದಿ ಮತ್ತು ಕಾರ್ಯಕ್ರಮಗಳನ್ನು ಹುಡುಕಿ...',
    
    // News Section
    'news.title': 'ಸುದ್ದಿ ಮತ್ತು ಕಾರ್ಯಕ್ರಮಗಳು',
    'news.addnews': 'ಸುದ್ದಿ ಸೇರಿಸಿ',
    'news.manageall': 'ಎಲ್ಲವನ್ನೂ ನಿರ್ವಹಿಸಿ',
    'news.comingsoon': 'ಶೀಘ್ರದಲ್ಲೇ ಬರುತ್ತಿದೆ',
    'news.venue': 'ಸ್ಥಳ',
    'news.readmore': 'ಹೆಚ್ಚು ಓದಿ',
    'news.edit': 'ಸಂಪಾದಿಸಿ',
    'news.by': 'ಇವರಿಂದ',
    
    // Footer
    'footer.quicklinks': 'ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು',
    'footer.eresources': 'ಇ-ಸಂಪನ್ಮೂಲಗಳು',
    'footer.journals': 'ಜರ್ನಲ್‌ಗಳು',
    'footer.consortium': 'ಕನ್ಸೋರ್ಟಿಯಂ',
    'footer.notifications': 'ಅಧಿಸೂಚನೆಗಳು',
    'footer.contactus': 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
    'footer.followus': 'ನಮ್ಮನ್ನು ಅನುಸರಿಸಿ',
    'footer.copyright': '© ೨೦೨೫ ವಿಟಿಯು ಕನ್ಸೋರ್ಟಿಯಂ ಪೋರ್ಟಲ್. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    
    // Committee Items
    'committee.governing': 'ಆಡಳಿತ ಮಂಡಳಿ ಸಮಿತಿ',
    'committee.steering': 'ಸ್ಟೀರಿಂಗ್ ಸಮಿತಿ',
    'committee.nodal': 'ನೋಡಲ್ ಅಧಿಕಾರಿ ಸಮಿತಿ',
    
    // Downloads
    'downloads.circulars': 'ಪರಿಪತ್ರಗಳು',
    'downloads.blankformats': 'ಖಾಲಿ ಫಾರ್ಮ್ಯಾಟ್‌ಗಳು',
    
    // Links
    'links.vtulinks': 'ವಿಟಿಯು ಲಿಂಕ್‌ಗಳು',
    'links.otherlinks': 'ಇತರ ಲಿಂಕ್‌ಗಳು',
    
    // Admin Controls
    'admin.add': 'ಸೇರಿಸಿ',
    'admin.manage': 'ನಿರ್ವಹಿಸಿ',
    'admin.addcommittee': 'ಸಮಿತಿ ಸೇರಿಸಿ',
    'admin.managecommittees': 'ಸಮಿತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    'admin.adderesource': 'ಇ-ಸಂಪನ್ಮೂಲ ಸೇರಿಸಿ',
    'admin.manageeresources': 'ಇ-ಸಂಪನ್ಮೂಲಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    'admin.addtraining': 'ತರಬೇತಿ ಸೇರಿಸಿ',
    'admin.managetraining': 'ತರಬೇತಿಯನ್ನು ನಿರ್ವಹಿಸಿ',
    'admin.addguide': 'ಮಾರ್ಗದರ್ಶಿ ಸೇರಿಸಿ',
    'admin.manageguides': 'ಮಾರ್ಗದರ್ಶಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    'admin.adddownload': 'ಡೌನ್‌ಲೋಡ್ ಸೇರಿಸಿ',
    'admin.managedownloads': 'ಡೌನ್‌ಲೋಡ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    'admin.addgalleryitem': 'ಗ್ಯಾಲರಿ ಐಟಂ ಸೇರಿಸಿ',
    'admin.managegallery': 'ಗ್ಯಾಲರಿಯನ್ನು ನಿರ್ವಹಿಸಿ',
    
    // Search
    'search.searching': 'ಹುಡುಕುತ್ತಿದೆ...',
    'search.noresults': 'ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    
    // Language
    'language.english': 'English',
    'language.kannada': 'ಕನ್ನಡ'
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('vtu-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'kn')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vtu-language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}