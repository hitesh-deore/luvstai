interface StoredMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

interface StoredChatSession {
  companionId: string;
  companionName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: StoredMessage[];
}

class ChatStorageService {
  private readonly STORAGE_KEY = 'aiCompanionChats';

  // Get all chat sessions
  getAllChats(): StoredChatSession[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading chats:', error);
      return [];
    }
  }

  // Get specific chat session
  getChatSession(companionId: string): StoredChatSession | null {
    const chats = this.getAllChats();
    return chats.find(chat => chat.companionId === companionId) || null;
  }

  // Save or update chat session
  saveChatSession(session: StoredChatSession): void {
    try {
      const chats = this.getAllChats();
      const existingIndex = chats.findIndex(chat => chat.companionId === session.companionId);
      
      if (existingIndex >= 0) {
        chats[existingIndex] = session;
      } else {
        chats.unshift(session); // Add new chats to the beginning
      }

      // Sort by last message time (most recent first)
      chats.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(chats));
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  }

  // Add message to chat session
  addMessage(companionId: string, companionName: string, message: StoredMessage): void {
    const session = this.getChatSession(companionId) || {
      companionId,
      companionName,
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      messages: []
    };

    session.messages.push(message);
    session.lastMessage = message.content;
    session.lastMessageTime = message.timestamp;
    
    // Increment unread count if message is from companion
    if (!message.isUser) {
      session.unreadCount += 1;
    }

    this.saveChatSession(session);
  }

  // Mark chat as read
  markAsRead(companionId: string): void {
    const session = this.getChatSession(companionId);
    if (session) {
      session.unreadCount = 0;
      this.saveChatSession(session);
    }
  }

  // Get recent chats for sidebar
  getRecentChats(): Array<{
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    unread: number;
    avatar: string;
  }> {
    const chats = this.getAllChats();
    return chats.map(chat => ({
      id: chat.companionId,
      name: chat.companionName,
      lastMessage: chat.lastMessage || 'No messages yet',
      time: this.formatTime(chat.lastMessageTime),
      unread: chat.unreadCount,
      avatar: this.getAvatarForCompanion(chat.companionId)
    }));
  }

  private formatTime(timestamp: string): string {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now.getTime() - messageTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return `${Math.floor(diffDays / 7)}w`;
  }

  private getAvatarForCompanion(companionId: string): string {
    // Map companion IDs to their avatar gradients
    const avatarMap: { [key: string]: string } = {
      'emma-romantic': 'from-pink-400 to-purple-500',
      'alex-romantic': 'from-blue-500 to-indigo-600',
      'sophia-friend': 'from-yellow-400 to-orange-500',
      'maya-professional': 'from-blue-400 to-indigo-500',
      'luna-romantic': 'from-purple-400 to-indigo-600',
      'zoe-friend': 'from-green-400 to-teal-500',
      'aria-mentor': 'from-rose-400 to-pink-500',
      'nova-romantic': 'from-red-400 to-pink-500',
      'ivy-friend': 'from-emerald-400 to-green-500',
      'stella-professional': 'from-cyan-400 to-blue-500',
      'ruby-romantic': 'from-red-500 to-rose-500',
      'jade-friend': 'from-teal-400 to-emerald-500',
      'aurora-mentor': 'from-violet-400 to-purple-500',
      'scarlett-romantic': 'from-rose-500 to-red-500',
      'willow-friend': 'from-amber-400 to-orange-500',
      'phoenix-professional': 'from-orange-500 to-red-500',
      'ryan-friend': 'from-green-500 to-teal-600',
      'marcus-professional': 'from-gray-500 to-slate-600',
      'dante-romantic': 'from-purple-600 to-indigo-700',
      'jake-friend': 'from-orange-500 to-yellow-500',
      'samuel-mentor': 'from-amber-600 to-orange-600',
      'liam-romantic': 'from-teal-500 to-cyan-600',
      'mason-friend': 'from-stone-500 to-gray-600',
      'ethan-professional': 'from-blue-600 to-purple-600',
      'gabriel-romantic': 'from-sky-500 to-blue-600',
      'tyler-friend': 'from-red-500 to-orange-600',
      'oliver-mentor': 'from-emerald-600 to-teal-700',
      'diego-romantic': 'from-yellow-600 to-red-600',
      'noah-friend': 'from-violet-500 to-purple-600',
      'adam-professional': 'from-slate-600 to-gray-700'
    };

    return avatarMap[companionId] || 'from-gray-400 to-gray-600';
  }

  // Clear all chats (for testing/reset)
  clearAllChats(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const chatStorage = new ChatStorageService();