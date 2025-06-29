import React, { useState } from 'react';
import { Search, Filter, Heart, Users, Briefcase, GraduationCap, ArrowLeft } from 'lucide-react';
import { Companion } from '../types';
import { CompanionCard } from './CompanionCard';

interface CompanionGalleryProps {
  companions: Companion[];
  onSelectCompanion: (companion: Companion) => void;
  onViewProfile: (companion: Companion) => void;
  onBack: () => void;
}

export const CompanionGallery: React.FC<CompanionGalleryProps> = ({ 
  companions, 
  onSelectCompanion, 
  onViewProfile,
  onBack 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');

  const filteredCompanions = companions.filter(companion => {
    const matchesSearch = companion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         companion.personality.some(trait => trait.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         companion.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || companion.relationshipType === selectedFilter;
    const matchesGender = selectedGender === 'all' || companion.gender === selectedGender;
    
    return matchesSearch && matchesFilter && matchesGender;
  });

  const getFilterIcon = (type: string) => {
    switch (type) {
      case 'romantic':
        return <Heart className="w-4 h-4" />;
      case 'friendship':
        return <Users className="w-4 h-4" />;
      case 'professional':
        return <Briefcase className="w-4 h-4" />;
      case 'mentor':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Filter className="w-4 h-4" />;
    }
  };

  const handleCompanionSelect = (companion: Companion) => {
    console.log('Selecting companion:', companion.name);
    onSelectCompanion(companion);
  };

  const handleCompanionProfile = (companion: Companion) => {
    console.log('Viewing profile:', companion.name);
    onViewProfile(companion);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6 text-gray-400" />
          </button>
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Your <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">AI Companions</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover meaningful connections with our diverse community of AI companions, each with unique personalities and interests.
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, personality, or interests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-200"
              />
            </div>

            {/* Relationship Type Filter */}
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All Types', icon: 'filter' },
                { value: 'romantic', label: 'Romantic', icon: 'romantic' },
                { value: 'friendship', label: 'Friends', icon: 'friendship' },
                { value: 'professional', label: 'Professional', icon: 'professional' },
                { value: 'mentor', label: 'Mentors', icon: 'mentor' }
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                    selectedFilter === filter.value
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 border border-gray-600/50'
                  }`}
                >
                  {getFilterIcon(filter.icon)}
                  <span className="hidden sm:inline">{filter.label}</span>
                </button>
              ))}
            </div>

            {/* Gender Filter */}
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-4 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
            >
              <option value="all">All Genders</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing <span className="font-semibold text-blue-400">{filteredCompanions.length}</span> companions
          </p>
        </div>

        {/* Companions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCompanions.map((companion) => (
            <CompanionCard
              key={companion.id}
              companion={companion}
              onSelect={handleCompanionSelect}
              onViewProfile={handleCompanionProfile}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredCompanions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-600 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No companions found</h3>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};