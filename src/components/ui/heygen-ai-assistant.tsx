import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Mic, MicOff, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HeyGenAIAssistantProps {
  apiKey?: string;
  avatarId?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function HeyGenAIAssistant({ 
  apiKey = "your-heygen-api-key", 
  avatarId = "default-avatar" 
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
      // Initialize HeyGen streaming session
      // This is a placeholder for the actual HeyGen API integration
      // You would replace this with actual HeyGen SDK calls
      
      // Simulated session start
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSessionActive(true);
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Hello! I'm your AI library assistant. I can help you find resources, answer questions about our services, and guide you through our digital library. How can I assist you today?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
    } catch (error) {
      console.error('Failed to start HeyGen session:', error);
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

  // Simulate avatar response (replace with actual HeyGen integration)
  const simulateAvatarResponse = async (userInput: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const input = userInput.toLowerCase();
    
    if (input.includes('resource') || input.includes('database')) {
      return 'I can help you access our extensive digital resources. We have e-books, academic databases, and research tools available. Would you like me to guide you to a specific type of resource?';
    } else if (input.includes('journal') || input.includes('publication')) {
      return 'Our journal collection includes thousands of academic publications across various disciplines. I can help you search for specific journals or browse by subject area. What field are you researching?';
    } else if (input.includes('guide') || input.includes('help')) {
      return 'I\'d be happy to provide guidance! Our user guides cover everything from basic navigation to advanced research techniques. What specific area would you like help with?';
    } else if (input.includes('news') || input.includes('event')) {
      return 'Stay updated with our latest news and upcoming events. We regularly host workshops, seminars, and training sessions. Would you like to know about any specific type of event?';
    } else if (input.includes('librarian') || input.includes('contact')) {
      return 'You can connect with our professional librarians for personalized assistance. They\'re available through our Librarian Corner or you can schedule a consultation. Would you like me to help you get in touch?';
    } else {
      return 'I\'m here to help you navigate our library services and resources. I can assist with finding materials, using our databases, understanding our services, or connecting you with librarians. What would you like to explore?';
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
                <CardTitle className="text-lg font-semibold">AI Library Assistant</CardTitle>
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
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <MessageCircle className="h-10 w-10 text-primary" />
                  </div>
                  <Button
                    onClick={startSession}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-2"
                  >
                    {isLoading ? 'Connecting...' : 'Start Conversation'}
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
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>Speaking...</span>
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
                      placeholder="Ask me anything about the library..."
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