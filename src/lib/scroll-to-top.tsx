import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Component to handle automatic scroll management with instant navigation
export function ScrollToTop() {
  const location = useLocation();
  const prevLocationRef = useRef<string | null>(null);

  useEffect(() => {
    // Check if this is the same page (same pathname)
    const isSamePage = prevLocationRef.current === location.pathname;

    // Check if the URL has a hash
    if (location.hash) {
      // URL with hash: Wait 50ms and then call scrollIntoView() to the target element
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      // URL without hash: Scroll to the top of the page immediately
      // Use instant scrolling for better navigation performance
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto' // Always use auto for instant navigation
      });
    }

    // Update the previous location reference
    prevLocationRef.current = location.pathname;
  }, [location]);

  return null;
}
