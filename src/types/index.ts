export interface Companion {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  personality: string[];
  interests: string[];
  relationshipType: 'friendship' | 'romantic' | 'professional' | 'mentor';
  description: string;
  avatar: string;
  greeting: string;
  responseStyle: string;
  // New media fields
  profileImage?: string;
  profileVideo?: string;
  profileGif?: string;
  galleryImages?: string[];
  galleryVideos?: string[];
  galleryGifs?: string[];
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
}

export interface ChatSession {
  companionId: string;
  messages: Message[];
}

export interface MediaFile {
  id: string;
  type: 'image' | 'video' | 'gif';
  url: string;
  name: string;
  size: number;
}