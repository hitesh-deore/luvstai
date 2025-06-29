import React from 'react';
import { Heart, MessageCircle, Star, User, Eye, Play, Image as ImageIcon } from 'lucide-react';
import { Companion } from '../types';

interface CompanionCardProps {
  companion: Companion;
  onSelect: (companion: Companion) => void;
  onViewProfile: (companion: Companion) => void;
}

export const CompanionCard: React.FC<CompanionCardProps> = ({ companion, onSelect, onViewProfile }) => {
  const getRelationshipIcon = () => {
    switch (companion.relationshipType) {
      case 'romantic':
        return <Heart className="w-4 h-4 text-red-400" />;
      case 'friendship':
        return <User className="w-4 h-4 text-blue-400" />;
      case 'professional':
        return <Star className="w-4 h-4 text-yellow-400" />;
      case 'mentor':
        return <Star className="w-4 h-4 text-purple-400" />;
      default:
        return <MessageCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRelationshipColor = () => {
    switch (companion.relationshipType) {
      case 'romantic':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'friendship':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'professional':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'mentor':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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
      'emma-romantic': 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      'sophia-friend': 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      'maya-professional': 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      'luna-romantic': 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
      'zoe-friend': 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400',
      'aria-mentor': 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400',
      'nova-romantic': 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400',
      'ivy-friend': 'https://images.pexels.com/photos/1462980/pexels-photo-1462980.jpeg?auto=compress&cs=tinysrgb&w=400',
      'stella-professional': 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      'ruby-romantic': 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
      'jade-friend': 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=400',
      'aurora-mentor': 'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=400',
      'scarlett-romantic': 'https://images.pexels.com/photos/1024311/pexels-photo-1024311.jpeg?auto=compress&cs=tinysrgb&w=400',
      'willow-friend': 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=400',
      'phoenix-professional': 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      
      // Male companions
      'alex-romantic': 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      'ryan-friend': 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
      'marcus-professional': 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
      'dante-romantic': 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
      'jake-friend': 'https://images.pexels.com/photos/1484794/pexels-photo-1484794.jpeg?auto=compress&cs=tinysrgb&w=400',
      'samuel-mentor': 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
      'liam-romantic': 'https://images.pexels.com/photos/1300402/pexels-photo-1300402.jpeg?auto=compress&cs=tinysrgb&w=400',
      'mason-friend': 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
      'ethan-professional': 'https://images.pexels.com/photos/1559117/pexels-photo-1559117.jpeg?auto=compress&cs=tinysrgb&w=400',
      'gabriel-romantic': 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=400',
      'tyler-friend': 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=400',
      'oliver-mentor': 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400',
      'diego-romantic': 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=400',
      'noah-friend': 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
      'adam-professional': 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400'
    };

    return imageMap[companion.id] || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  const hasMedia = companion.profileVideo || companion.profileGif || 
                   (companion.galleryImages && companion.galleryImages.length > 0) ||
                   (companion.galleryVideos && companion.galleryVideos.length > 0) ||
                   (companion.galleryGifs && companion.galleryGifs.length > 0);

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/70 transform hover:scale-105 transition-all duration-300 overflow-hidden group shadow-xl">
      <div className="relative">
        <div className="w-full h-48 overflow-hidden relative">
          {companion.profileVideo ? (
            <video 
              src={companion.profileVideo}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : companion.profileGif ? (
            <img 
              src={companion.profileGif}
              alt={companion.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <img 
              src={getCompanionImage()}
              alt={companion.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium border ${getRelationshipColor()} flex items-center gap-1 backdrop-blur-sm`}>
          {getRelationshipIcon()}
          {companion.relationshipType}
        </div>

        {/* Media indicators */}
        {hasMedia && (
          <div className="absolute top-4 left-4 flex gap-1">
            {companion.profileVideo && (
              <div className="w-6 h-6 bg-blue-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Play className="w-3 h-3 text-white" />
              </div>
            )}
            {companion.profileGif && (
              <div className="w-6 h-6 bg-purple-600/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                <ImageIcon className="w-3 h-3 text-white" />
              </div>
            )}
            {((companion.galleryImages?.length || 0) + (companion.galleryVideos?.length || 0) + (companion.galleryGifs?.length || 0)) > 0 && (
              <div className="px-2 py-1 bg-yellow-600/80 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                +{(companion.galleryImages?.length || 0) + (companion.galleryVideos?.length || 0) + (companion.galleryGifs?.length || 0)}
              </div>
            )}
          </div>
        )}
        
        {/* Hover overlay with view profile button */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewProfile(companion);
            }}
            className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-white/30 flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Profile
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">{companion.name}</h3>
            <p className="text-sm text-gray-400">{companion.age} years old • {companion.gender}</p>
          </div>
        </div>
        
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{companion.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {companion.personality.slice(0, 3).map((trait) => (
            <span key={trait} className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50">
              {trait}
            </span>
          ))}
          {companion.personality.length > 3 && (
            <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full border border-gray-600/50">
              +{companion.personality.length - 3} more
            </span>
          )}
        </div>
        
        <button 
          onClick={() => onSelect(companion)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
        >
          <MessageCircle className="w-4 h-4" />
          Start Chat
        </button>
      </div>
    </div>
  );
};