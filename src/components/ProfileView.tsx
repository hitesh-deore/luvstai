import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MessageCircle, 
  Heart, 
  Star, 
  MapPin, 
  Calendar,
  Users,
  Briefcase,
  GraduationCap,
  Share,
  MoreVertical,
  Play,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  Video
} from 'lucide-react';
import { Companion } from '../types';

interface ProfileViewProps {
  companion: Companion;
  onBack: () => void;
  onStartChat: (companion: Companion) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ companion, onBack, onStartChat }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const getRelationshipIcon = () => {
    switch (companion.relationshipType) {
      case 'romantic':
        return <Heart className="w-5 h-5 text-red-400" />;
      case 'friendship':
        return <Users className="w-5 h-5 text-blue-400" />;
      case 'professional':
        return <Briefcase className="w-5 h-5 text-yellow-400" />;
      case 'mentor':
        return <GraduationCap className="w-5 h-5 text-purple-400" />;
      default:
        return <MessageCircle className="w-5 h-5 text-gray-400" />;
    }
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

    return imageMap[companion.id] || `https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800`;
  };

  // Combine all gallery media
  const allGalleryMedia = [
    ...(companion.galleryImages?.map(url => ({ type: 'image', url })) || []),
    ...(companion.galleryVideos?.map(url => ({ type: 'video', url })) || []),
    ...(companion.galleryGifs?.map(url => ({ type: 'gif', url })) || [])
  ];

  // Profile media carousel
  const profileMedia = [
    companion.profileImage && { type: 'image', url: companion.profileImage },
    companion.profileVideo && { type: 'video', url: companion.profileVideo },
    companion.profileGif && { type: 'gif', url: companion.profileGif }
  ].filter(Boolean) as Array<{ type: string; url: string }>;

  const currentProfileMedia = profileMedia[currentMediaIndex] || { type: 'image', url: getCompanionImage() };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % Math.max(profileMedia.length, 1));
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + Math.max(profileMedia.length, 1)) % Math.max(profileMedia.length, 1));
  };

  const openGallery = (index: number) => {
    setGalleryIndex(index);
    setShowGallery(true);
  };

  const nextGalleryItem = () => {
    setGalleryIndex((prev) => (prev + 1) % allGalleryMedia.length);
  };

  const prevGalleryItem = () => {
    setGalleryIndex((prev) => (prev - 1 + allGalleryMedia.length) % allGalleryMedia.length);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="relative">
        <button
          onClick={onBack}
          className="absolute top-6 left-6 z-10 p-3 bg-black/50 backdrop-blur-xl hover:bg-black/70 text-white rounded-full transition-all duration-200"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        
        <button className="absolute top-6 right-16 z-10 p-3 bg-black/50 backdrop-blur-xl hover:bg-black/70 text-white rounded-full transition-all duration-200">
          <Share className="w-6 h-6" />
        </button>
        
        <button className="absolute top-6 right-6 z-10 p-3 bg-black/50 backdrop-blur-xl hover:bg-black/70 text-white rounded-full transition-all duration-200">
          <MoreVertical className="w-6 h-6" />
        </button>

        {/* Hero Media */}
        <div className="relative h-96 overflow-hidden">
          {currentProfileMedia.type === 'video' ? (
            <video 
              src={currentProfileMedia.url}
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              loop
            />
          ) : (
            <img 
              src={currentProfileMedia.url}
              alt={companion.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
          
          {/* Media navigation */}
          {profileMedia.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-xl hover:bg-black/70 text-white rounded-full transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 backdrop-blur-xl hover:bg-black/70 text-white rounded-full transition-all duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Media indicators */}
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2">
                {profileMedia.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMediaIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentMediaIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Profile Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{companion.name}</h1>
                <div className="flex items-center gap-4 text-gray-300 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {companion.age} years old
                  </span>
                  <span className="flex items-center gap-1">
                    {getRelationshipIcon()}
                    {companion.relationshipType}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-400 text-sm">Online now</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-400 mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">4.9</span>
                </div>
                <div className="text-gray-400 text-sm">8.2K followers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => onStartChat(companion)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Start Conversation
          </button>
          <button className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all duration-200 border border-gray-700">
            Follow
          </button>
        </div>

        {/* Gallery Section */}
        {allGalleryMedia.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-6 h-6" />
              Gallery ({allGalleryMedia.length})
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allGalleryMedia.slice(0, 8).map((media, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => openGallery(index)}
                >
                  {media.type === 'video' ? (
                    <>
                      <video 
                        src={media.url}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        muted
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <img 
                      src={media.url}
                      alt={`Gallery ${index}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                  {media.type === 'gif' && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                      GIF
                    </div>
                  )}
                </div>
              ))}
              
              {allGalleryMedia.length > 8 && (
                <div className="aspect-square rounded-lg bg-gray-700/50 border border-gray-600/50 flex items-center justify-center cursor-pointer hover:bg-gray-700/70 transition-all duration-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">+{allGalleryMedia.length - 8}</div>
                    <div className="text-gray-400 text-sm">More</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* About Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">About {companion.name}</h2>
          <p className="text-gray-300 leading-relaxed mb-6">{companion.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Personality Traits</h3>
              <div className="flex flex-wrap gap-2">
                {companion.personality.map((trait) => (
                  <span key={trait} className="px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full border border-purple-500/30">
                    {trait}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {companion.interests.map((interest) => (
                  <span key={interest} className="px-3 py-1 bg-blue-600/20 text-blue-300 text-sm rounded-full border border-blue-500/30">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Conversation Style */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Conversation Style</h2>
          <p className="text-gray-300 mb-4">{companion.responseStyle}</p>
          
          <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${companion.avatar} rounded-full flex items-center justify-center flex-shrink-0`}>
                <span className="text-white font-semibold text-sm">
                  {companion.name.charAt(0)}
                </span>
              </div>
              <div>
                <div className="text-sm text-gray-400 mb-1">{companion.name}</div>
                <div className="bg-gray-800 text-gray-100 px-4 py-2 rounded-2xl rounded-tl-md">
                  {companion.greeting}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">8.2K</div>
            <div className="text-gray-400 text-sm">Conversations</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">4.9</div>
            <div className="text-gray-400 text-sm">Rating</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">24/7</div>
            <div className="text-gray-400 text-sm">Available</div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Recent Reviews</h2>
          
          <div className="space-y-4">
            <div className="border-b border-gray-700/50 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">S</span>
                </div>
                <div>
                  <div className="text-white font-medium">Sarah M.</div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                "Amazing conversations! {companion.name} really understands me and always knows what to say."
              </p>
            </div>
            
            <div className="border-b border-gray-700/50 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">M</span>
                </div>
                <div>
                  <div className="text-white font-medium">Mike R.</div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                "Perfect companion for deep conversations. Highly recommend!"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-6 right-6 p-3 bg-black/50 backdrop-blur-xl hover:bg-black/70 text-white rounded-full transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={prevGalleryItem}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 backdrop-blur-xl hover:bg-black/70 text-white rounded-full transition-all duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextGalleryItem}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 backdrop-blur-xl hover:bg-black/70 text-white rounded-full transition-all duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center p-6">
            {allGalleryMedia[galleryIndex]?.type === 'video' ? (
              <video 
                src={allGalleryMedia[galleryIndex]?.url}
                className="max-w-full max-h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <img 
                src={allGalleryMedia[galleryIndex]?.url}
                alt={`Gallery ${galleryIndex}`}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {galleryIndex + 1} / {allGalleryMedia.length}
          </div>
        </div>
      )}
    </div>
  );
};