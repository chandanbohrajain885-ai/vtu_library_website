import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Mic, MicOff, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HeyGenAIAssistantProps {
  apiKey: string;
  avatarId: string;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function HeyGenAIAssistant({ 
  apiKey, 
  avatarId 
}: HeyGenAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const sessionRef = useRef<any>(null);

  // Initialize HeyGen session
  const startSession = async () => {
    setIsLoading(true);
    try {
      console.log(`Initializing HeyGen session with API Key: ${apiKey} and Avatar: ${avatarId}`);
      
      // Initialize HeyGen streaming session with actual API
      // Note: This is a placeholder for the actual HeyGen SDK integration
      // The actual implementation would use HeyGen's streaming API
      
      // For now, we'll simulate the session initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSessionActive(true);
      
      // Add welcome message from Wayne
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `Hello! I'm Wayne, your AI library assistant. I'm here to help you navigate our digital library resources, find academic materials, and answer any questions about our services. What can I help you discover today?`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
    } catch (error) {
      console.error('Failed to start HeyGen session:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment, or feel free to browse our resources in the meantime.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSession = async () => {
    try {
      if (sessionRef.current) {
        // Close HeyGen session
        await sessionRef.current.close();
        sessionRef.current = null;
      }
      setIsSessionActive(false);
      setIsTalking(false);
      setMessages([]);
    } catch (error) {
      console.error('Failed to close session:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !isSessionActive) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTalking(true);

    try {
      // Send message to HeyGen avatar
      // This would be replaced with actual HeyGen API calls
      const response = await simulateAvatarResponse(inputMessage);
      
      const avatarMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, avatarMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble responding right now. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTalking(false);
    }
  };

  // Enhanced avatar response with Wayne's personality
  const simulateAvatarResponse = async (userInput: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return `Hi there! I'm Wayne, and I'm excited to help you explore our library's digital resources. Whether you're looking for research materials, academic journals, or need guidance on using our systems, I'm here to assist. What brings you to the library today?`;
    } else if (input.includes('resource') || input.includes('database')) {
      return `Great question! Our digital resource collection is quite extensive. We have access to academic databases, e-books, research tools, and specialized software including plagiarism detection tools. I can help you find exactly what you need for your research. What subject area or type of resource are you looking for?`;
    } else if (input.includes('journal') || input.includes('publication')) {
      return `Our journal collection is one of our strongest assets! We provide access to thousands of peer-reviewed academic journals across all disciplines. I can help you search by subject, publication name, or even help you find the most relevant journals for your research topic. What field are you researching?`;
    } else if (input.includes('guide') || input.includes('help') || input.includes('how')) {
      return `I'd be delighted to guide you! Our comprehensive user guides cover everything from basic navigation to advanced research techniques. Whether you need help with database searches, citation management, or accessing e-books, I can walk you through it step by step. What specific area would you like help with?`;
    } else if (input.includes('news') || input.includes('event') || input.includes('announcement')) {
      return `Stay in the loop with our latest updates! We regularly host workshops, research seminars, training sessions, and special events. Plus, we share important announcements about new resources and services. Would you like to know about upcoming events or recent news?`;
    } else if (input.includes('librarian') || input.includes('contact') || input.includes('staff')) {
      return `Our professional librarians are amazing resources! They're available through our Librarian Corner for personalized research assistance, and you can schedule one-on-one consultations. They're experts at helping with complex research questions and can provide specialized subject guidance. Would you like me to connect you with a librarian?`;
    } else if (input.includes('search') || input.includes('find')) {
      return `I can definitely help you search more effectively! Our search tools are quite powerful once you know how to use them. You can search across all our databases simultaneously, use advanced filters, and even set up alerts for new publications in your field. What are you trying to find?`;
    } else if (input.includes('access') || input.includes('login') || input.includes('account')) {
      return `Access questions are common! Most of our digital resources require authentication through your institutional account. If you're having trouble accessing something, I can guide you through the login process or help you understand which resources are available to you. What specific access issue are you experiencing?`;
    } else if (input.includes('thank') || input.includes('thanks')) {
      return `You're very welcome! I'm here whenever you need assistance with our library services. Feel free to ask me anything about our resources, and don't hesitate to reach out to our librarians for more specialized help. Happy researching!`;
    } else {
      return `That's an interesting question! As your AI library assistant, I'm here to help you make the most of our digital library resources. I can assist with finding materials, navigating our databases, understanding our services, or connecting you with our expert librarians. Could you tell me a bit more about what you're looking for?`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleWidget = () => {
    if (isOpen && isSessionActive) {
      closeSession();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Widget Button */}
      {!isOpen && (
        <Button
          onClick={toggleWidget}
          className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90 shadow-xl transition-all duration-300 hover:scale-110 border-4 border-white"
          size="icon"
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </Button>
      )}

      {/* AI Assistant Widget */}
      {isOpen && (
        <Card className="w-96 h-[600px] shadow-2xl border-2 border-primary/20 bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <CardTitle className="text-lg font-semibold">Wayne - AI Assistant</CardTitle>
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
          </CardHeader>
          
          <CardContent className="p-0 flex flex-col h-[536px]">
            {/* Video Avatar Area */}
            <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 h-48 flex items-center justify-center border-b">
              {!isSessionActive ? (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto border-4 border-primary/20">
                    <Bot className="h-12 w-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-800">Meet Wayne</h3>
                    <p className="text-sm text-gray-600">Your AI Library Assistant</p>
                  </div>
                  <Button
                    onClick={startSession}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
                  >
                    {isLoading ? 'Connecting to Wayne...' : 'Start Conversation'}
                  </Button>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    playsInline
                  />
                  {isTalking && (
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>Wayne is speaking...</span>
                    </div>
                  )}
                  <Button
                    onClick={closeSession}
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    End Session
                  </Button>
                </div>
              )}
            </div>

            {/* Messages Area */}
            {isSessionActive && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-lg text-sm shadow-sm ${
                          message.isUser
                            ? 'bg-primary text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  {isTalking && (
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-lg rounded-bl-none border border-gray-200">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-white">
                  <div className="flex space-x-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask Wayne about library resources..."
                      className="flex-1 border-gray-300 focus:border-primary"
                      disabled={isTalking}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isTalking}
                      size="icon"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-center mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs text-gray-600 border-gray-300"
                      disabled={!isSessionActive}
                    >
                      <Mic className="h-3 w-3 mr-1" />
                      Voice Input (Coming Soon)
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}