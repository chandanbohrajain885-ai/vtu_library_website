import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Video, VideoOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeyGenAIAssistantProps {
  apiKey?: string;
  avatarId?: string;
}

export function HeyGenAIAssistant({ 
  apiKey = import.meta.env.VITE_HEYGEN_API_KEY, 
  avatarId = import.meta.env.VITE_HEYGEN_AVATAR_ID 
}: HeyGenAIAssistantProps) {
  // Check if environment variables are configured
  const isConfigured = apiKey && avatarId;

  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<any>(null);

  // Initialize HeyGen session
  const startSession = async () => {
    if (!containerRef.current) return;
    
    setIsLoading(true);
    try {
      // Validate environment variables
      if (!apiKey || !avatarId) {
        throw new Error('HeyGen API key or Avatar ID not configured');
      }

      console.log(`Initializing HeyGen session with API Key: ${apiKey} and Avatar: ${avatarId}`);
      
      // Load HeyGen streaming script dynamically
      const script = document.createElement('script');
      script.src = 'https://resource.heygen.ai/streaming-avatar/latest/streaming-avatar.js';
      script.onload = async () => {
        try {
          // Initialize HeyGen streaming session
          const StreamingAvatar = (window as any).StreamingAvatar;
          
          sessionRef.current = new StreamingAvatar({
            token: apiKey,
            avatarId: avatarId,
            container: containerRef.current,
            width: 400,
            height: 300,
            quality: 'high',
            voice: {
              voiceId: 'en-US-AriaNeural',
              rate: 1.0,
              pitch: 1.0
            }
          });

          await sessionRef.current.createStartAvatar();
          setIsSessionActive(true);
          
          // Send welcome message
          await sessionRef.current.speak({
            text: "Hello! I'm Wayne, your AI library assistant. I'm here to help you navigate our digital library resources and answer any questions about our services. How can I help you today?",
            taskType: 'talk'
          });
          
        } catch (error) {
          console.error('Failed to initialize HeyGen avatar:', error);
          throw error;
        }
      };
      
      script.onerror = () => {
        throw new Error('Failed to load HeyGen streaming script');
      };
      
      document.head.appendChild(script);
      
    } catch (error) {
      console.error('Failed to start HeyGen session:', error);
      // Show error in container
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; text-align: center; background: #f8f9fa;">
            <div style="color: #dc3545; margin-bottom: 10px;">⚠️</div>
            <div style="color: #6c757d; font-size: 14px;">Unable to connect to HeyGen service</div>
            <div style="color: #6c757d; font-size: 12px; margin-top: 5px;">Please check your API configuration</div>
          </div>
        `;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeSession = async () => {
    try {
      if (sessionRef.current) {
        await sessionRef.current.stopAvatar();
        sessionRef.current = null;
      }
      setIsSessionActive(false);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    } catch (error) {
      console.error('Failed to close session:', error);
    }
  };

  const toggleWidget = () => {
    if (isWidgetOpen && isSessionActive) {
      closeSession();
    }
    setIsWidgetOpen(!isWidgetOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Widget Button */}
      {!isWidgetOpen && (
        <Button
          onClick={toggleWidget}
          className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-xl transition-all duration-300 hover:scale-110 border-4 border-white group"
          size="icon"
          title="Chat with Wayne - AI Library Assistant"
        >
          <div className="relative">
            <Video className="h-8 w-8 text-white transition-transform group-hover:scale-110" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></div>
          </div>
        </Button>
      )}

      {/* HeyGen Video Widget */}
      {isWidgetOpen && (
        <div className="bg-white rounded-lg shadow-2xl border-2 border-primary/20 overflow-hidden w-[420px] h-[500px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/90 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-semibold text-lg">Wayne - AI Assistant</h3>
                <p className="text-xs text-white/80">Library Resource Expert</p>
              </div>
            </div>
            <Button
              onClick={toggleWidget}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Video Container */}
          <div className="relative h-[400px] bg-gradient-to-b from-gray-50 to-gray-100">
            {!isConfigured ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mb-4 border-4 border-red-300">
                  <Video className="h-10 w-10 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Configuration Required</h3>
                <p className="text-sm text-gray-600 mb-4">Please configure HeyGen API credentials</p>
                <p className="text-xs text-gray-500">Set VITE_HEYGEN_API_KEY and VITE_HEYGEN_AVATAR_ID environment variables</p>
              </div>
            ) : !isSessionActive ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-4 border-4 border-primary/20">
                  <Video className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Meet Wayne</h3>
                <p className="text-sm text-gray-600 mb-4">Your AI Library Assistant</p>
                <Button
                  onClick={startSession}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
                >
                  {isLoading ? 'Connecting to Wayne...' : 'Start Video Chat'}
                </Button>
              </div>
            ) : (
              <div className="relative w-full h-full">
                <div 
                  ref={containerRef} 
                  className="w-full h-full"
                  style={{ minHeight: '400px' }}
                />
                <Button
                  onClick={closeSession}
                  variant="destructive"
                  size="sm"
                  className="absolute top-3 right-3 z-10"
                >
                  <VideoOff className="h-4 w-4 mr-1" />
                  End Session
                </Button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t text-center">
            <p className="text-xs text-gray-500">
              Powered by HeyGen • AI Video Avatar Technology
            </p>
          </div>
        </div>
      )}
    </div>
  );
}