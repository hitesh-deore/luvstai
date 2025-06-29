import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, MoreVertical, Heart, Phone, Video, Smile, Paperclip, Mic, Settings, Star, MessageCircle, Eye, Users, Search, Plus, Hash, Bell, Archive, Volume2, VolumeX, Pause, Play, ChevronDown, Menu, X } from 'lucide-react';
import { Companion, Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { VoiceSelector } from './VoiceSelector';
import { aiService } from '../services/aiService';
import { chatStorage } from '../services/chatStorage';
import { speechService } from '../services/speechService';

interface ChatInterfaceProps {
  companion: Companion;
  onBack: () => void;
  onViewProfile: (companion: Companion) => void;
  onSwitchCompanion?: (companionId: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  companion, 
  onBack, 
  onViewProfile, 
  onSwitchCompanion 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(speechService.isEnabled());
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [recentChats, setRecentChats] = useState<Array<{
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
    avatar: string;
  }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history when companion changes
  useEffect(() => {
    loadChatHistory();
    loadRecentChats();
    // Mark current chat as read
    chatStorage.markAsRead(companion.id);
    // Load selected voice
    setSelectedVoiceId(speechService.getSelectedVoiceId(companion.id, companion.gender));
  }, [companion.id]);

  // Update recent chats when messages change
  useEffect(() => {
    loadRecentChats();
  }, [messages]);

  // Monitor speech service state
  useEffect(() => {
    const checkSpeechState = () => {
      setIsSpeaking(speechService.isSpeaking());
    };

    const interval = setInterval(checkSpeechState, 100);
    return () => clearInterval(interval);
  }, []);

  // Close sidebars when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowSidebar(false);
        setShowRightPanel(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadChatHistory = () => {
    const session = chatStorage.getChatSession(companion.id);
    if (session && session.messages.length > 0) {
      // Convert stored messages to Message objects
      const loadedMessages: Message[] = session.messages.map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        isUser: msg.isUser
      }));
      setMessages(loadedMessages);
    } else {
      // Start with greeting message if no history
      const greetingMessage: Message = {
        id: '1',
        senderId: companion.id,
        content: companion.greeting,
        timestamp: new Date(),
        isUser: false
      };
      setMessages([greetingMessage]);
      
      // Save greeting message to storage
      chatStorage.addMessage(companion.id, companion.name, {
        id: greetingMessage.id,
        senderId: greetingMessage.senderId,
        content: greetingMessage.content,
        timestamp: greetingMessage.timestamp.toISOString(),
        isUser: greetingMessage.isUser
      });

      // Speak greeting if speech is enabled
      if (speechEnabled) {
        setTimeout(() => {
          speechService.speak(companion.greeting, companion);
        }, 500);
      }
    }
  };

  const loadRecentChats = () => {
    const chats = chatStorage.getRecentChats();
    setRecentChats(chats);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Check if AI service is configured
    if (!aiService.isConfigured()) {
      // Fallback to predefined responses
      const responses = {
        romantic: [
          "Your words always touch my heart. I love how thoughtful you are.",
          "I've been thinking about you too. There's something special about our connection.",
          "You make me smile every time we talk. Tell me more about what makes you happy.",
          "I feel so lucky to have met you. Your presence brightens my day.",
          "That's beautiful. I love how you see the world with such wonder."
        ],
        friendship: [
          "That's awesome! I'm always here if you want to chat about anything.",
          "You're such a great friend! I love our conversations.",
          "I totally get what you mean! Want to hear about something similar that happened to me?",
          "Thanks for sharing that with me. You know I'm always here to listen!",
          "Haha, you always know how to make me laugh! What else is going on?"
        ],
        professional: [
          "That's a great question. Let me share some insights that might help.",
          "I think you're on the right track. Have you considered this approach?",
          "Based on my experience, here's what I would recommend.",
          "That's an interesting challenge. Let's break it down step by step.",
          "You're showing great initiative. I'm here to support your growth."
        ],
        mentor: [
          "That's a profound question. Let me share some wisdom I've gathered over the years.",
          "I can see you're really thinking deeply about this. That's admirable.",
          "Remember, growth comes from facing challenges with courage and patience.",
          "You have great potential. Trust in your journey and be kind to yourself.",
          "Every experience teaches us something valuable. What do you think this is teaching you?"
        ]
      };

      const companionResponses = responses[companion.relationshipType] || responses.friendship;
      return companionResponses[Math.floor(Math.random() * companionResponses.length)];
    }

    try {
      // Use AI service for more dynamic responses
      const chatMessages = messages.slice(-5).map(msg => ({
        role: msg.isUser ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      chatMessages.push({
        role: 'user',
        content: userMessage
      });

      const personalityDescription = `${companion.description}. Personality traits: ${companion.personality.join(', ')}. Interests: ${companion.interests.join(', ')}. Response style: ${companion.responseStyle}`;

      return await aiService.generateResponse(chatMessages, personalityDescription, companion.name);
    } catch (error) {
      console.error('AI generation failed, using fallback:', error);
      
      // Fallback to predefined responses if AI fails
      const responses = {
        romantic: [
          "Your words always touch my heart. I love how thoughtful you are.",
          "I've been thinking about you too. There's something special about our connection."
        ],
        friendship: [
          "That's awesome! I'm always here if you want to chat about anything.",
          "You're such a great friend! I love our conversations."
        ],
        professional: [
          "That's a great question. Let me share some insights that might help.",
          "I think you're on the right track. Have you considered this approach?"
        ],
        mentor: [
          "That's a profound question. Let me share some wisdom I've gathered over the years.",
          "I can see you're really thinking deeply about this. That's admirable."
        ]
      };

      const companionResponses = responses[companion.relationshipType] || responses.friendship;
      return companionResponses[Math.floor(Math.random() * companionResponses.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      content: inputMessage,
      timestamp: new Date(),
      isUser: true
    };

    // Add user message to state
    setMessages(prev => [...prev, userMessage]);
    
    // Save user message to storage
    chatStorage.addMessage(companion.id, companion.name, {
      id: userMessage.id,
      senderId: userMessage.senderId,
      content: userMessage.content,
      timestamp: userMessage.timestamp.toISOString(),
      isUser: userMessage.isUser
    });

    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Generate AI response
      const responseContent = await generateResponse(currentMessage);
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        senderId: companion.id,
        content: responseContent,
        timestamp: new Date(),
        isUser: false
      };

      // Add AI response to state
      setMessages(prev => [...prev, aiResponse]);
      
      // Save AI response to storage
      chatStorage.addMessage(companion.id, companion.name, {
        id: aiResponse.id,
        senderId: aiResponse.senderId,
        content: aiResponse.content,
        timestamp: aiResponse.timestamp.toISOString(),
        isUser: aiResponse.isUser
      });

      // Speak the AI response if speech is enabled
      if (speechEnabled) {
        setTimeout(() => {
          speechService.speak(responseContent, companion);
        }, 300);
      }

    } catch (error) {
      console.error('Failed to generate response:', error);
      
      // Fallback response
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        senderId: companion.id,
        content: "I'm having trouble connecting right now. Could you try again?",
        timestamp: new Date(),
        isUser: false
      };

      setMessages(prev => [...prev, fallbackResponse]);
      
      // Save fallback response to storage
      chatStorage.addMessage(companion.id, companion.name, {
        id: fallbackResponse.id,
        senderId: fallbackResponse.senderId,
        content: fallbackResponse.content,
        timestamp: fallbackResponse.timestamp.toISOString(),
        isUser: fallbackResponse.isUser
      });

      // Speak fallback response if speech is enabled
      if (speechEnabled) {
        setTimeout(() => {
          speechService.speak(fallbackResponse.content, companion);
        }, 300);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleChatClick = (chatId: string) => {
    if (chatId !== companion.id && onSwitchCompanion) {
      // Stop any current speech when switching companions
      speechService.stop();
      onSwitchCompanion(chatId);
      setShowSidebar(false); // Close sidebar on mobile
    }
  };

  const toggleSpeech = () => {
    const newState = !speechEnabled;
    setSpeechEnabled(newState);
    speechService.setEnabled(newState);
    
    if (!newState) {
      speechService.stop();
    }
  };

  const handleSpeechControl = () => {
    if (speechService.isSpeaking()) {
      if (speechService.isPaused()) {
        speechService.resume();
      } else {
        speechService.pause();
      }
    } else {
      speechService.stop();
    }
  };

  const testVoice = () => {
    speechService.testVoice(companion);
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
  };

  const getSelectedVoiceName = () => {
    const voiceOptions = speechService.getVoiceOptions();
    const selectedVoice = voiceOptions.find(v => v.id === selectedVoiceId);
    return selectedVoice?.name || 'Default Voice';
  };

  const getCompanionImage = () => {
    // Use uploaded profile image if available
    if (companion.profileImage) {
      return companion.profileImage;
    }

    // Fallback to predefined images
    const imageMap: { [key: string]: string } = {
      // Female companions
      'emma-romantic': 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800',
      'sophia-friend': 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
      'maya-professional': 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800',
      'luna-romantic': 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=800',
      'zoe-friend': 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=800',
      'aria-mentor': 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=800',
      'nova-romantic': 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800',
      'ivy-friend': 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=800',
      'stella-professional': 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800',
      'ruby-romantic': 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=800',
      'jade-friend': 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=800',
      'aurora-mentor': 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=800',
      'scarlett-romantic': 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=800',
      'willow-friend': 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=800',
      'phoenix-professional': 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800',
      
      // Male companions
      'alex-romantic': 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800',
      'ryan-friend': 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
      'marcus-professional': 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800',
      'dante-romantic': 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=800',
      'jake-friend': 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=800',
      'samuel-mentor': 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
      'liam-romantic': 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=800',
      'mason-friend': 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=800',
      'ethan-professional': 'https://images.pexels.com/photos/1559117/pexels-photo-1559117.jpeg?auto=compress&cs=tinysrgb&w=800',
      'gabriel-romantic': 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=800',
      'tyler-friend': 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=800',
      'oliver-mentor': 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=800',
      'diego-romantic': 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=800',
      'noah-friend': 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800',
      'adam-professional': 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=800'
    };

    return imageMap[companion.id] || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  // Get companion background image for chat theme
  const getChatBackground = () => {
    const companionImage = getCompanionImage();
    return {
      backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9)), url(${companionImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    };
  };

  return (
    <div className="chat-container bg-slate-900 flex relative">
      {/* Mobile Overlay */}
      {(showSidebar || showRightPanel) && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => {
            setShowSidebar(false);
            setShowRightPanel(false);
          }}
        />
      )}

      {/* Left Sidebar - Responsive */}
      <div className={`
        ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:relative z-50 lg:z-auto
        w-72 bg-slate-800 border-r border-slate-700 flex flex-col h-full
        transition-transform duration-300 ease-in-out
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-slate-300" />
            </button>
            <h1 className="text-lg font-semibold text-white">Chats</h1>
            <button 
              className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 lg:hidden"
              onClick={() => setShowSidebar(false)}
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 hidden lg:block">
              <Plus className="w-5 h-5 text-slate-300" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-400 text-sm"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-2 border-b border-slate-700 flex-shrink-0">
          <div className="flex gap-1">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">
              <MessageCircle className="w-4 h-4" />
              All
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-700 text-slate-300 rounded-lg text-sm">
              <Star className="w-4 h-4" />
              Fav
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-700 text-slate-300 rounded-lg text-sm">
              <Archive className="w-4 h-4" />
              Arc
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-hide">
            <div className="space-y-0">
              {recentChats.length > 0 ? (
                recentChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleChatClick(chat.id)}
                    className={`p-3 hover:bg-slate-700/50 cursor-pointer border-b border-slate-700/30 transition-all duration-200 ${
                      chat.id === companion.id ? 'bg-slate-700/70 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className={`w-10 h-10 bg-gradient-to-br ${chat.avatar} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-semibold text-sm">
                            {chat.name.charAt(0)}
                          </span>
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-white truncate text-sm">{chat.name}</h3>
                          <span className="text-xs text-slate-400 flex-shrink-0">{chat.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">{chat.lastMessage}</p>
                      </div>
                      
                      {chat.unread > 0 && (
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-white font-medium">{chat.unread}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400 text-sm">No conversations yet</p>
                  <p className="text-slate-500 text-xs">Start chatting with companions!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">You</span>
            </div>
            <div className="flex-1">
              <div className="text-white font-medium text-sm">Your Account</div>
              <div className="text-slate-400 text-xs">Online</div>
            </div>
            <button className="p-1.5 hover:bg-slate-700 rounded-lg transition-all duration-200">
              <Settings className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area - Responsive */}
      <div className="flex-1 flex flex-col h-full" style={getChatBackground()}>
        {/* Chat Header - Mobile Responsive */}
        <div className="bg-slate-800/90 backdrop-blur-xl border-b border-slate-700/50 px-3 sm:px-6 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 lg:hidden"
              >
                <Menu className="w-5 h-5 text-slate-300" />
              </button>

              <div className="relative">
                <div className={`w-10 h-10 bg-gradient-to-br ${companion.avatar} rounded-full flex items-center justify-center`}>
                  <span className="text-white font-semibold text-sm">
                    {companion.name.charAt(0)}
                  </span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm sm:text-base">{companion.name}</h2>
                <p className="text-xs text-slate-400">
                  {isTyping ? 'Typing...' : isSpeaking ? 'Speaking...' : 'Online'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* Voice Controls - Responsive */}
              <div className="hidden sm:flex items-center gap-1 mr-2">
                <button
                  onClick={toggleSpeech}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    speechEnabled 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-400'
                  }`}
                  title={speechEnabled ? 'Voice enabled' : 'Voice disabled'}
                >
                  {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                
                {speechEnabled && (
                  <>
                    <button
                      onClick={handleSpeechControl}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200"
                      title={speechService.isSpeaking() ? (speechService.isPaused() ? 'Resume' : 'Pause') : 'Stop'}
                      disabled={!speechService.isSpeaking()}
                    >
                      {speechService.isSpeaking() && speechService.isPaused() ? (
                        <Play className="w-4 h-4 text-slate-400" />
                      ) : (
                        <Pause className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    
                    <div className="relative hidden md:block">
                      <button
                        onClick={() => setShowVoiceSelector(true)}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1"
                        title="Change voice"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span className="hidden lg:inline">{getSelectedVoiceName()}</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <button
                      onClick={testVoice}
                      className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-all duration-200 hidden md:block"
                      title="Test voice"
                    >
                      Test
                    </button>
                  </>
                )}
              </div>

              {/* Action Buttons - Responsive */}
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 hidden sm:block">
                <Phone className="w-4 h-4 text-slate-400" />
              </button>
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 hidden sm:block">
                <Video className="w-4 h-4 text-slate-400" />
              </button>
              
              {/* Profile Button - Always Visible */}
              <button 
                onClick={() => onViewProfile(companion)}
                className="px-2 sm:px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-1 sm:gap-2"
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Profile</span>
              </button>

              {/* Right Panel Toggle - Mobile */}
              <button
                onClick={() => setShowRightPanel(true)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 xl:hidden"
              >
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area - Responsive */}
        <div className="flex-1 px-3 sm:px-6 py-4 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-hide">
            <div className="max-w-4xl mx-auto">
              {/* Companion Intro */}
              <div className="mb-6 p-3 sm:p-4 bg-slate-800/70 backdrop-blur-xl rounded-xl border border-slate-700/50">
                <p className="text-slate-300 text-sm">{companion.description}</p>
                <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  {!aiService.isConfigured() && (
                    <div className="p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg flex-1">
                      <p className="text-yellow-300 text-xs">
                        💡 Using basic responses. Configure AI API keys in admin panel for more dynamic conversations.
                      </p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {speechEnabled ? (
                      <div className="flex items-center gap-1 text-green-400">
                        <Volume2 className="w-3 h-3" />
                        <span className="hidden sm:inline">Voice: {getSelectedVoiceName()}</span>
                        <span className="sm:hidden">Voice On</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <VolumeX className="w-3 h-3" />
                        <span>Voice disabled</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} companion={companion} />
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-8 h-8 bg-gradient-to-br ${companion.avatar} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-xs font-medium">
                      {companion.name.charAt(0)}
                    </span>
                  </div>
                  <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-4 py-3 max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area - Mobile Responsive */}
        <div className="bg-slate-800/90 backdrop-blur-xl border-t border-slate-700/50 px-3 sm:px-6 py-3 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-2 sm:gap-3">
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 hidden sm:block">
                <Paperclip className="w-4 h-4 text-slate-400" />
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${companion.name}${speechEnabled ? ` with ${getSelectedVoiceName()}` : ''}`}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none text-white placeholder-slate-400 transition-all duration-200 text-sm"
                  rows={1}
                  style={{ minHeight: '40px', maxHeight: '120px' }}
                />
              </div>
              
              <button className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 hidden sm:block">
                <Smile className="w-4 h-4 text-slate-400" />
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="p-2 sm:p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Profile Panel - Responsive */}
      <div className={`
        ${showRightPanel ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
        fixed xl:relative z-50 xl:z-auto right-0
        w-72 bg-slate-800/90 backdrop-blur-xl border-l border-slate-700 flex flex-col h-full
        transition-transform duration-300 ease-in-out
      `}>
        {/* Panel Header - Mobile */}
        <div className="p-4 border-b border-slate-700 xl:hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">{companion.name}</h3>
            <button
              onClick={() => setShowRightPanel(false)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>

        {/* Profile Image */}
        <div className="relative h-48 sm:h-64 overflow-hidden flex-shrink-0">
          {companion.profileVideo ? (
            <video 
              src={companion.profileVideo}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : companion.profileGif ? (
            <img 
              src={companion.profileGif}
              alt={companion.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <img 
              src={getCompanionImage()}
              alt={companion.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent"></div>
          
          {/* Voice indicator */}
          {speechEnabled && (
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-green-600/80 backdrop-blur-sm rounded-full text-xs text-white">
              <Volume2 className="w-3 h-3" />
              <span className="hidden sm:inline">{getSelectedVoiceName()}</span>
            </div>
          )}
          
          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">{companion.name}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-300 mb-2">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                8.2K
              </span>
              <span>⏱ 2:17</span>
              <span className="hidden sm:inline">By @{companion.name.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Profile Details - Scrollable */}
        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-hide">
            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2 text-sm">About</h4>
              <p className="text-slate-300 text-xs leading-relaxed">{companion.description}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2 text-sm">Personality</h4>
              <div className="flex flex-wrap gap-1">
                {companion.personality.slice(0, 4).map((trait) => (
                  <span key={trait} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full border border-slate-600/50">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-white font-semibold mb-2 text-sm">Interests</h4>
              <div className="flex flex-wrap gap-1">
                {companion.interests.slice(0, 4).map((interest) => (
                  <span key={interest} className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => setShowVoiceSelector(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-all duration-200 text-sm flex items-center justify-center gap-2"
              >
                <Volume2 className="w-4 h-4" />
                Change Voice
              </button>
              <button 
                onClick={testVoice}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-all duration-200 text-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Test Voice
              </button>
              <button 
                onClick={() => onViewProfile(companion)}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-all duration-200 text-sm"
              >
                View Full Profile
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-slate-700 p-4 flex-shrink-0">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm">
            <MessageCircle className="w-4 h-4" />
            Comments 10
          </h4>
          <div className="text-slate-400 text-xs">
            <p>Type your comment about this Talkie...</p>
          </div>
        </div>
      </div>

      {/* Voice Selector Modal */}
      <VoiceSelector
        companion={companion}
        onVoiceChange={handleVoiceChange}
        isOpen={showVoiceSelector}
        onClose={() => setShowVoiceSelector(false)}
      />
    </div>
  );
};