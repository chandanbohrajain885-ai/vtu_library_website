import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot from './chatbot';

export default function ChatbotTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  // Auto-open chatbot when site loads (only once per session)
  useEffect(() => {
    const hasOpenedBefore = sessionStorage.getItem('chatbot-auto-opened');
    
    if (!hasOpenedBefore && !hasAutoOpened) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setIsFullscreen(true);
        setHasAutoOpened(true);
        sessionStorage.setItem('chatbot-auto-opened', 'true');
      }, 2000); // Open after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [hasAutoOpened]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsFullscreen(false); // Start in windowed mode when manually opened
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsFullscreen(false);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button
              onClick={handleToggle}
              className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-2xl border-4 border-white group relative overflow-hidden"
              size="lg"
            >
              {/* Pulse animation */}
              <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></div>
              
              {/* Icon */}
              <MessageCircle className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-200" />
              
              {/* Notification badge */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">!</span>
              </div>
            </Button>

            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg"
            >
              Need help? Chat with VTU Assistant!
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Modal */}
      <Chatbot
        isOpen={isOpen}
        onClose={handleClose}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </>
  );
}