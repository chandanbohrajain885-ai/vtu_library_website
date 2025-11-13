import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Minimize2, Bot, Zap, Brain, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Chatbot from './chatbot';

export default function ChatbotTrigger() {
  const [isOpen, setIsOpen] = useState(true); // Always start open
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(true); // Start in fullscreen
  const [hasInitialized, setHasInitialized] = useState(false);

  // Always show the chatbot on every page load/refresh - PERSISTENT
  useEffect(() => {
    if (!hasInitialized) {
      // Always open and show the chatbot prominently in fullscreen
      setIsOpen(true);
      setIsMinimized(false);
      setIsFullscreen(true);
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  const handleMinimize = () => {
    setIsMinimized(true);
    setIsFullscreen(false);
  };

  const handleRestore = () => {
    setIsMinimized(false);
    setIsFullscreen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Auto-restore after 3 seconds to maintain persistent presence
    setTimeout(() => {
      setIsOpen(true);
      setIsMinimized(true);
      setIsFullscreen(false);
    }, 3000);
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      {/* Enhanced Minimized Floating AI Robot Avatar */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={handleRestore}
              className="w-24 h-24 rounded-full bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-blue-600 hover:via-purple-600 hover:to-primary shadow-2xl border-4 border-white group relative overflow-hidden transition-all duration-500"
              size="lg"
            >
              {/* Multiple animated backgrounds */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-purple-600 animate-pulse opacity-30"></div>
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.3),transparent_70%)] animate-ping opacity-40"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-spin opacity-20" style={{ animationDuration: '3s' }}></div>
              
              {/* AI Robot Avatar */}
              <div className="relative z-10 flex flex-col items-center">
                <Bot className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300 animate-pulse" />
                <div className="flex items-center space-x-1 mt-1">
                  <Brain className="h-2 w-2 text-yellow-300 animate-pulse" />
                  <Eye className="h-2 w-2 text-green-300 animate-bounce" />
                  <Zap className="h-2 w-2 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
              
              {/* AI Status indicator */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
              
              {/* Persistent indicator */}
              <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                <span className="text-xs font-bold text-white">∞</span>
              </div>
              
              {/* Voice indicator */}
              <div className="absolute top-0 left-0 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                <span className="text-xs font-bold text-white">🎤</span>
              </div>
            </Button>

            {/* Enhanced persistent tooltip with AI branding */}
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute right-28 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white px-4 py-3 rounded-lg text-sm whitespace-nowrap shadow-2xl border border-blue-400"
            >
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-blue-300 animate-pulse" />
                <span className="font-bold">VTU AI Assistant</span>
                <Zap className="h-3 w-3 text-yellow-300 animate-bounce" />
              </div>
              <div className="text-xs text-blue-200 mt-1 flex items-center space-x-1">
                <span>Always Active</span>
                <span>•</span>
                <span>Voice Ready</span>
                <span>•</span>
                <span>Full Access</span>
              </div>
              <div className="text-xs text-green-300 mt-1 font-semibold animate-pulse">
                Click to restore fullscreen!
              </div>
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent status indicator when chatbot is active */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-2xl border border-white/20"
          >
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-bold">AI Assistant Active</span>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <Zap className="h-3 w-3 text-yellow-300 animate-pulse" />
            </div>
            <div className="text-xs text-white/80 mt-1">
              Persistent • Voice-enabled • Always ready
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Chatbot Interface - Enhanced for persistence */}
      <Chatbot
        isOpen={isOpen && !isMinimized}
        onClose={handleClose}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        isPersistent={true}
      />
    </>
  );
}