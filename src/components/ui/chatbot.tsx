import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Send, Mic, MicOff, Volume2, VolumeX, MessageCircle, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Extend Window interface to include speech recognition properties
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export default function Chatbot({ isOpen, onClose, isFullscreen = false, onToggleFullscreen }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          handleSendMessage(transcript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      // Speech Synthesis
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Initial greeting when chatbot opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = "Hi, I am VTU consortium, how can I help you?";
      const greetingMessage: Message = {
        id: Date.now().toString(),
        text: greeting,
        isBot: true,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages([greetingMessage]);
        if (voiceEnabled) {
          speakText(greeting);
        }
      }, 500);
    }
  }, [isOpen, voiceEnabled]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text: string) => {
    if (synthRef.current && voiceEnabled) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // VTU Consortium specific responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to VTU Consortium. I'm here to help you with information about our e-resources, journals, user guides, and more. What would you like to know?";
    }
    
    if (message.includes('e-resource') || message.includes('eresource') || message.includes('digital resource')) {
      return "VTU Consortium provides access to various e-resources including e-journals, e-books, plagiarism detection software, and language labs. You can browse our e-resources by year in the E-Resources section. Would you like me to guide you there?";
    }
    
    if (message.includes('journal') || message.includes('onos')) {
      return "Our ONOS (Online Network of Scholarly Resources) provides access to academic journals and research papers. You can access them through the ONOS section of our portal.";
    }
    
    if (message.includes('user guide') || message.includes('help') || message.includes('how to')) {
      return "I can help you with user guides! We have comprehensive step-by-step guides for accessing and using consortium resources. You can find them in the User Guide section, or I can provide specific guidance. What do you need help with?";
    }
    
    if (message.includes('librarian') || message.includes('college') || message.includes('member')) {
      return "For librarians and member colleges, we provide a dedicated Librarian Corner where you can upload documents, manage membership status, and access training materials. Are you a librarian looking for specific assistance?";
    }
    
    if (message.includes('download') || message.includes('document') || message.includes('file')) {
      return "You can download circulars, forms, and important documents from our Downloads section. We also have training materials available. What type of document are you looking for?";
    }
    
    if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
      return "You can contact VTU Consortium at:\n📧 Email: vtuconsortium@gmail.com\n📞 Phone: 08312498191\n\nFor other enquiries: +91 80225-55555";
    }
    
    if (message.includes('about') || message.includes('what is') || message.includes('consortium')) {
      return "VTU Consortium is a collaborative platform providing access to digital resources, e-journals, e-books, and academic materials for member institutions. We facilitate resource sharing and provide training support for libraries and educational institutions.";
    }
    
    if (message.includes('news') || message.includes('event') || message.includes('announcement')) {
      return "Stay updated with the latest consortium news and events in our News & Events section. We regularly post announcements, workshops, and important updates for member institutions.";
    }
    
    if (message.includes('training') || message.includes('workshop')) {
      return "We offer training materials and workshop resources for library staff and users. You can access these materials in the Training section or through the Librarian Corner.";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! I'm always here to help with any questions about VTU Consortium services. Feel free to ask if you need anything else!";
    }
    
    if (message.includes('bye') || message.includes('goodbye')) {
      return "Goodbye! Thank you for using VTU Consortium. Have a great day, and feel free to return anytime you need assistance!";
    }
    
    // Default response
    return "I understand you're asking about '" + userMessage + "'. I can help you with information about VTU Consortium's e-resources, journals, user guides, downloads, training materials, and member services. Could you please be more specific about what you'd like to know?";
  };

  const handleSendMessage = (messageText?: string) => {
    const text = messageText || inputText.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse = getBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      if (voiceEnabled) {
        speakText(botResponse);
      }
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking && synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ${
          isFullscreen ? '' : 'md:p-8'
        }`}
      >
        <Card className={`w-full max-w-4xl h-full max-h-[90vh] flex flex-col shadow-2xl border-0 ${
          isFullscreen ? 'max-w-none max-h-none h-screen' : ''
        }`}>
          {/* Header */}
          <CardHeader className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">VTU Consortium Assistant</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-white/80">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Online • Ready to help</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={toggleVoice}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
                >
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                
                {onToggleFullscreen && (
                  <Button
                    onClick={onToggleFullscreen}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                )}
                
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                  {message.isBot && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <MessageCircle className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-xs text-gray-500">VTU Assistant</span>
                    </div>
                  )}
                  
                  <div
                    className={`p-3 rounded-2xl ${
                      message.isBot
                        ? 'bg-white border border-gray-200 text-gray-800'
                        : 'bg-primary text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <div className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-400' : 'text-white/70'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <MessageCircle className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs text-gray-500">VTU Assistant is typing...</span>
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl ml-8">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message or use voice..."
                  className="pr-12 border-gray-300 focus:border-primary"
                  disabled={isListening}
                />
                {isSpeaking && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                      Speaking
                    </Badge>
                  </div>
                )}
              </div>
              
              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "default" : "outline"}
                size="sm"
                className={`${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                disabled={!recognitionRef.current}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isListening}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Press Enter to send</span>
                {recognitionRef.current && (
                  <span>Click mic for voice input</span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {voiceEnabled && <Badge variant="outline" className="text-xs">Voice enabled</Badge>}
                {isListening && <Badge variant="outline" className="text-xs bg-red-50 text-red-600">Listening...</Badge>}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}