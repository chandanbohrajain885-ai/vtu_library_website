import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Send, Mic, MicOff, Volume2, VolumeX, MessageCircle, Minimize2, Maximize2, Bot, Zap, Brain, Eye } from 'lucide-react';
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
  isPersistent?: boolean;
  onMinimize?: () => void;
}

export default function Chatbot({ isOpen, onClose, isFullscreen = false, onToggleFullscreen, isPersistent = false, onMinimize }: ChatbotProps) {
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
      const greeting = "🤖 Hello! I'm your VTU Consortium AI Assistant. I have complete access to all website features and can help you navigate, search, and perform actions across our entire platform. I support voice interaction - just click the microphone to speak with me hands-free! How can I assist you today?";
      const greetingMessage: Message = {
        id: Date.now().toString(),
        text: greeting,
        isBot: true,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages([greetingMessage]);
        if (voiceEnabled) {
          speakText("Hello! I'm your VTU Consortium AI Assistant. I have complete access to all website features and can help you navigate, search, and perform actions. I support voice interaction too! How can I assist you today?");
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

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleClose = () => {
    // Immediately stop any ongoing speech
    stopSpeaking();
    // Call the original close handler
    onClose();
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Enhanced bot response with more comprehensive VTU knowledge
  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // VTU Consortium specific responses with enhanced knowledge
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('greet')) {
      return "Hello! I'm your AI assistant for VTU Consortium. I have access to all website features and can help you navigate e-resources, journals, user guides, downloads, member services, and much more. I can also perform actions like searching, filtering, and guiding you to specific sections. What would you like to explore today?";
    }
    
    if (message.includes('navigate') || message.includes('go to') || message.includes('take me') || message.includes('show me')) {
      if (message.includes('resource') || message.includes('e-resource')) {
        return "I'll help you navigate to the E-Resources section! You can browse our digital library by year, access e-journals, e-books, plagiarism detection software, and language labs. Would you like me to guide you to a specific year or type of resource?";
      }
      if (message.includes('journal') || message.includes('onos')) {
        return "Let me guide you to the ONOS (Online Network of Scholarly Resources) section where you can access academic journals and research papers. This is perfect for scholarly research and academic work.";
      }
      if (message.includes('news') || message.includes('event')) {
        return "I can take you to our News & Events section where you'll find the latest announcements, workshops, training sessions, and important updates for consortium members.";
      }
      if (message.includes('guide') || message.includes('help')) {
        return "I'll direct you to our comprehensive User Guide section with step-by-step tutorials for accessing and using all consortium resources effectively.";
      }
      return "I can help you navigate anywhere on the site! Just tell me where you'd like to go - E-Resources, ONOS Journals, News & Events, User Guides, Downloads, Librarian Corner, or any other section.";
    }
    
    if (message.includes('search') || message.includes('find') || message.includes('look for')) {
      return "I can help you search across all VTU Consortium resources! I have access to our comprehensive database including e-resources, journals, news articles, user guides, and training materials. What specific topic, resource, or information are you looking for?";
    }
    
    if (message.includes('e-resource') || message.includes('eresource') || message.includes('digital resource') || message.includes('digital library')) {
      return "Our E-Resources section provides comprehensive access to digital academic materials organized by year. This includes:\n\n📚 E-Books and digital textbooks\n📰 E-Journals and research publications\n🔍 Plagiarism detection software\n🗣️ Language labs and e-learning platforms\n💾 Specialized databases\n\nI can help you find resources for specific subjects or years. What are you researching?";
    }
    
    if (message.includes('journal') || message.includes('onos') || message.includes('research') || message.includes('publication')) {
      return "ONOS (Online Network of Scholarly Resources) is our premier academic journal platform providing access to:\n\n📖 Peer-reviewed research papers\n🔬 Scientific journals across disciplines\n📊 Citation databases\n🎓 Academic publications\n📈 Research metrics and analytics\n\nI can help you search for specific topics, authors, or journals. What research area interests you?";
    }
    
    if (message.includes('user guide') || message.includes('tutorial') || message.includes('how to') || message.includes('instruction')) {
      return "Our User Guide section contains comprehensive tutorials and instructions for:\n\n🎯 Accessing consortium resources\n🔐 Login and authentication procedures\n📱 Mobile access and apps\n🔍 Advanced search techniques\n📊 Using databases effectively\n💡 Tips and best practices\n\nI can provide specific guidance for any feature. What do you need help with?";
    }
    
    if (message.includes('librarian') || message.includes('college') || message.includes('member') || message.includes('institution')) {
      return "The Librarian Corner is designed for our member institutions and provides:\n\n👥 Member college directory\n📤 Document upload and sharing\n📋 Membership status management\n🎓 Training materials and workshops\n📊 Usage statistics and reports\n💬 Inter-library communication\n\nAre you a librarian looking for specific tools or information about membership services?";
    }
    
    if (message.includes('download') || message.includes('document') || message.includes('file') || message.includes('form')) {
      return "Our Downloads section provides access to:\n\n📄 Official forms and applications\n📋 Circulars and announcements\n📚 Training materials and manuals\n🎥 Video tutorials and presentations\n📊 Reports and statistics\n🔧 Software and tools\n\nI can help you locate specific documents or guide you to the right download section. What type of file are you looking for?";
    }
    
    if (message.includes('contact') || message.includes('phone') || message.includes('email') || message.includes('support')) {
      return "Here's how to reach VTU Consortium support:\n\n📧 Primary Email: vtuconsortium@gmail.com\n📞 Main Phone: 08312498191\n☎️ General Enquiries: +91 80225-55555\n🏢 Office Hours: Monday-Friday, 9:00 AM - 5:00 PM\n\n🌐 You can also use this chat for immediate assistance with navigation, searches, and general questions about consortium services!";
    }
    
    if (message.includes('about') || message.includes('what is') || message.includes('consortium') || message.includes('vtu')) {
      return "VTU Consortium is a collaborative digital platform serving educational institutions with:\n\n🎓 Shared access to premium academic resources\n📚 Comprehensive digital library services\n🤝 Inter-institutional collaboration tools\n📊 Training and capacity building programs\n💡 Technical support and guidance\n🌐 Centralized resource management\n\nWe facilitate resource sharing, provide training support, and enable seamless access to academic materials for member institutions across the VTU network.";
    }
    
    if (message.includes('news') || message.includes('event') || message.includes('announcement') || message.includes('update')) {
      return "Stay informed with our News & Events section featuring:\n\n📢 Latest consortium announcements\n🎓 Upcoming workshops and training sessions\n📅 Important dates and deadlines\n🏆 Member achievements and highlights\n🔄 System updates and new features\n📊 Usage reports and statistics\n\nI can help you find specific news items or upcoming events. What information are you looking for?";
    }
    
    if (message.includes('training') || message.includes('workshop') || message.includes('learn') || message.includes('course')) {
      return "Our training programs include:\n\n🎯 Resource utilization workshops\n💻 Digital literacy training\n🔍 Advanced search techniques\n📊 Database management courses\n👥 Librarian skill development\n🎓 User orientation programs\n\nI can provide information about upcoming sessions, registration procedures, and training materials. What type of training interests you?";
    }
    
    if (message.includes('access') || message.includes('login') || message.includes('password') || message.includes('account')) {
      return "For access and account management:\n\n🔐 Member institutions have dedicated login credentials\n👤 Individual user accounts for students and faculty\n🔄 Password reset options available\n📱 Mobile access supported\n🆔 Guest access for basic resources\n\nIf you're having login issues, I can guide you through the authentication process or direct you to account recovery options. What specific access issue are you experiencing?";
    }
    
    if (message.includes('mobile') || message.includes('app') || message.includes('phone') || message.includes('tablet')) {
      return "VTU Consortium is fully mobile-optimized:\n\n📱 Responsive web design for all devices\n💻 Cross-platform compatibility\n🔍 Mobile-friendly search interface\n📚 Optimized reading experience\n⚡ Fast loading on mobile networks\n🔄 Sync across devices\n\nYou can access all features from your smartphone or tablet. Need help with mobile navigation?";
    }
    
    if (message.includes('statistics') || message.includes('usage') || message.includes('report') || message.includes('analytics')) {
      return "Our analytics and reporting features provide:\n\n📊 Resource usage statistics\n👥 User engagement metrics\n📈 Download and access reports\n🎯 Popular content analysis\n📅 Temporal usage patterns\n🏢 Institutional comparisons\n\nLibrarians and administrators can access detailed reports. Would you like information about specific metrics or how to access reporting tools?";
    }
    
    if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
      return "You're very welcome! I'm here 24/7 to assist with all VTU Consortium services. Whether you need help navigating resources, searching for specific content, understanding features, or performing any actions on the site, just ask! I have comprehensive knowledge of all our systems and can guide you through any process.";
    }
    
    if (message.includes('bye') || message.includes('goodbye') || message.includes('exit') || message.includes('close')) {
      return "Thank you for using VTU Consortium! Remember, I'm always here whenever you need assistance with resources, navigation, searches, or any other consortium services. Have a productive day with your research and studies!";
    }
    
    if (message.includes('voice') || message.includes('speak') || message.includes('listen') || message.includes('audio')) {
      return "I support full voice interaction! 🎤 You can:\n\n🗣️ Speak your questions using the microphone button\n👂 Listen to my responses with text-to-speech\n🔄 Toggle voice features on/off as needed\n🎯 Use hands-free interaction for accessibility\n\nTry asking me anything using voice commands - I understand natural speech and can respond audibly!";
    }
    
    if (message.includes('feature') || message.includes('capability') || message.includes('what can you do') || message.includes('help me with')) {
      return "I'm your comprehensive VTU Consortium assistant with these capabilities:\n\n🧭 Navigate to any section of the website\n🔍 Search across all resources and databases\n📚 Provide detailed information about services\n🎯 Guide you through specific procedures\n📞 Connect you with support when needed\n🗣️ Support voice interaction and hands-free use\n💡 Answer questions about any consortium feature\n🔄 Perform actions and help with tasks\n\nI have access to all website information and can assist with virtually any consortium-related need!";
    }
    
    // Enhanced default response with action capabilities
    return `I understand you're asking about "${userMessage}". As your AI assistant, I have comprehensive access to all VTU Consortium resources and features. I can help you:\n\n🔍 Search for specific information\n🧭 Navigate to relevant sections\n📚 Access appropriate resources\n🎯 Perform specific actions\n💡 Provide detailed guidance\n\nCould you be more specific about what you'd like to do or find? I'm here to make your consortium experience as smooth and productive as possible!`;
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
          <CardHeader className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white p-4 rounded-t-lg relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            </div>
            
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <Bot className="h-7 w-7 text-white animate-pulse" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-bounce"></div>
                  {/* AI indicator */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 bg-purple-400 rounded-full flex items-center justify-center">
                    <Brain className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold flex items-center space-x-2">
                    <span>VTU AI Assistant</span>
                    <Zap className="h-4 w-4 text-yellow-300 animate-pulse" />
                  </CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-white/90">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Always Active • Voice Enabled • Full Access</span>
                    <Eye className="h-3 w-3 animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={toggleVoice}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 transition-all duration-200"
                  title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
                >
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                
                {onToggleFullscreen && !isPersistent && (
                  <Button
                    onClick={onToggleFullscreen}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 transition-all duration-200"
                    title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                )}
                
                {onMinimize && isPersistent && (
                  <Button
                    onClick={onMinimize}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 transition-all duration-200"
                    title="Minimize to floating avatar"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                )}
                
                {/* Always show close button for user control */}
                <Button
                  onClick={handleClose}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-red-500/80 hover:bg-white/20 transition-all duration-200 border border-white/30 hover:border-red-300"
                  title="Close AI Assistant"
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
                      <div className="w-7 h-7 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center relative">
                        <Bot className="h-4 w-4 text-white" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">VTU AI Assistant</span>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                        AI Powered
                      </Badge>
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
                <div className="max-w-[80%]">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-7 h-7 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center relative">
                      <Bot className="h-4 w-4 text-white animate-pulse" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">VTU AI Assistant is thinking...</span>
                    <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-600 border-yellow-200 animate-pulse">
                      Processing
                    </Badge>
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl ml-9 relative">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    {/* Thinking indicator */}
                    <div className="absolute -left-2 top-3 w-4 h-4 bg-white border-l border-b border-gray-200 transform rotate-45"></div>
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