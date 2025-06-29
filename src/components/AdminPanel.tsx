import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  Settings, 
  Key, 
  Users, 
  Eye,
  EyeOff,
  Search,
  Filter,
  LogOut,
  Shield,
  Database,
  BarChart3,
  Volume2,
  VolumeX,
  Play,
  TestTube
} from 'lucide-react';
import { Companion } from '../types';
import { speechService } from '../services/speechService';

interface AdminPanelProps {
  companions: Companion[];
  onUpdateCompanions: (companions: Companion[]) => void;
  onBack: () => void;
  onLogout: () => void;
}

interface APISettings {
  openaiKey: string;
  anthropicKey: string;
  geminiKey: string;
  defaultModel: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  companions, 
  onUpdateCompanions, 
  onBack, 
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'companions' | 'settings' | 'voice'>('dashboard');
  const [editingCompanion, setEditingCompanion] = useState<Companion | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // API Settings
  const [apiSettings, setApiSettings] = useState<APISettings>({
    openaiKey: '',
    anthropicKey: '',
    geminiKey: '',
    defaultModel: 'gpt-3.5-turbo'
  });
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    gemini: false
  });

  // Voice Settings
  const [voiceEnabled, setVoiceEnabled] = useState(speechService.isEnabled());
  const [testingVoice, setTestingVoice] = useState<string | null>(null);

  // Form state for companion editing
  const [companionForm, setCompanionForm] = useState<Partial<Companion>>({
    name: '',
    age: 25,
    gender: 'female',
    personality: [],
    interests: [],
    relationshipType: 'friendship',
    description: '',
    avatar: 'from-blue-400 to-purple-500',
    greeting: '',
    responseStyle: '',
    profileImage: '',
    profileVideo: '',
    profileGif: '',
    galleryImages: [],
    galleryVideos: [],
    galleryGifs: []
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('aiCompanionSettings');
    if (savedSettings) {
      setApiSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('aiCompanionSettings', JSON.stringify(apiSettings));
    alert('Settings saved successfully!');
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    onLogout();
  };

  // Voice settings handlers
  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    speechService.setEnabled(newState);
  };

  const testCompanionVoice = async (companion: Companion) => {
    setTestingVoice(companion.id);
    try {
      await speechService.testVoice(companion);
    } catch (error) {
      console.error('Voice test failed:', error);
    } finally {
      setTimeout(() => setTestingVoice(null), 3000);
    }
  };

  // Filter companions
  const filteredCompanions = companions.filter(companion => {
    const matchesSearch = companion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         companion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || companion.relationshipType === filterType;
    return matchesSearch && matchesFilter;
  });

  // Handle companion form submission
  const handleSaveCompanion = () => {
    if (!companionForm.name || !companionForm.description) {
      alert('Please fill in all required fields');
      return;
    }

    const newCompanion: Companion = {
      id: isCreating ? `companion-${Date.now()}` : editingCompanion!.id,
      name: companionForm.name!,
      age: companionForm.age!,
      gender: companionForm.gender as 'male' | 'female',
      personality: companionForm.personality!,
      interests: companionForm.interests!,
      relationshipType: companionForm.relationshipType as any,
      description: companionForm.description!,
      avatar: companionForm.avatar!,
      greeting: companionForm.greeting!,
      responseStyle: companionForm.responseStyle!,
      profileImage: companionForm.profileImage,
      profileVideo: companionForm.profileVideo,
      profileGif: companionForm.profileGif,
      galleryImages: companionForm.galleryImages || [],
      galleryVideos: companionForm.galleryVideos || [],
      galleryGifs: companionForm.galleryGifs || []
    };

    let updatedCompanions;
    if (isCreating) {
      updatedCompanions = [...companions, newCompanion];
    } else {
      updatedCompanions = companions.map(c => c.id === newCompanion.id ? newCompanion : c);
    }

    onUpdateCompanions(updatedCompanions);
    setEditingCompanion(null);
    setIsCreating(false);
    setCompanionForm({
      name: '',
      age: 25,
      gender: 'female',
      personality: [],
      interests: [],
      relationshipType: 'friendship',
      description: '',
      avatar: 'from-blue-400 to-purple-500',
      greeting: '',
      responseStyle: '',
      profileImage: '',
      profileVideo: '',
      profileGif: '',
      galleryImages: [],
      galleryVideos: [],
      galleryGifs: []
    });
  };

  // Handle companion deletion
  const handleDeleteCompanion = (id: string) => {
    const updatedCompanions = companions.filter(c => c.id !== id);
    onUpdateCompanions(updatedCompanions);
    setShowDeleteConfirm(null);
  };

  // Start editing companion
  const startEditing = (companion: Companion) => {
    setEditingCompanion(companion);
    setCompanionForm(companion);
    setIsCreating(false);
  };

  // Start creating new companion
  const startCreating = () => {
    setIsCreating(true);
    setEditingCompanion(null);
    setCompanionForm({
      name: '',
      age: 25,
      gender: 'female',
      personality: [],
      interests: [],
      relationshipType: 'friendship',
      description: '',
      avatar: 'from-blue-400 to-purple-500',
      greeting: '',
      responseStyle: '',
      profileImage: '',
      profileVideo: '',
      profileGif: '',
      galleryImages: [],
      galleryVideos: [],
      galleryGifs: []
    });
  };

  // Handle array input changes
  const handleArrayInput = (field: 'personality' | 'interests', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setCompanionForm(prev => ({ ...prev, [field]: items }));
  };

  // Handle file uploads
  const handleFileUpload = (field: string, files: FileList | null, isMultiple = false) => {
    if (!files || files.length === 0) return;

    if (isMultiple) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setCompanionForm(prev => ({
        ...prev,
        [field]: [...(prev[field as keyof typeof prev] as string[] || []), ...urls]
      }));
    } else {
      const url = URL.createObjectURL(files[0]);
      setCompanionForm(prev => ({ ...prev, [field]: url }));
    }
  };

  // Remove media item
  const removeMediaItem = (field: string, index?: number) => {
    if (index !== undefined) {
      // Remove from array
      setCompanionForm(prev => ({
        ...prev,
        [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
      }));
    } else {
      // Remove single item
      setCompanionForm(prev => ({ ...prev, [field]: '' }));
    }
  };

  const avatarOptions = [
    'from-pink-400 to-purple-500',
    'from-blue-400 to-indigo-500',
    'from-green-400 to-teal-500',
    'from-yellow-400 to-orange-500',
    'from-red-400 to-pink-500',
    'from-purple-400 to-indigo-600',
    'from-teal-400 to-cyan-500',
    'from-orange-400 to-red-500',
    'from-emerald-400 to-green-500',
    'from-rose-400 to-pink-500'
  ];

  // Dashboard stats
  const stats = {
    totalCompanions: companions.length,
    femaleCompanions: companions.filter(c => c.gender === 'female').length,
    maleCompanions: companions.filter(c => c.gender === 'male').length,
    romanticCompanions: companions.filter(c => c.relationshipType === 'romantic').length,
    friendshipCompanions: companions.filter(c => c.relationshipType === 'friendship').length,
    professionalCompanions: companions.filter(c => c.relationshipType === 'professional').length,
    mentorCompanions: companions.filter(c => c.relationshipType === 'mentor').length
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-800 rounded-lg transition-all duration-200"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-gray-400">Manage your AI companion platform</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('companions')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'companions'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Users className="w-4 h-4" />
                Companions
              </button>
              <button
                onClick={() => setActiveTab('voice')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'voice'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                Voice
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Voice Settings Tab */}
        {activeTab === 'voice' && (
          <div className="space-y-6">
            {/* Voice Control */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Volume2 className="w-6 h-6" />
                Voice Settings
              </h2>
              
              <div className="space-y-6">
                {/* Global Voice Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Text-to-Speech</h3>
                    <p className="text-gray-400 text-sm">Enable voice responses for AI companions</p>
                  </div>
                  <button
                    onClick={toggleVoice}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      voiceEnabled ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        voiceEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Voice Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Voice Status</p>
                        <p className="text-xl font-bold text-white">
                          {voiceEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                        {voiceEnabled ? (
                          <Volume2 className="w-6 h-6 text-green-400" />
                        ) : (
                          <VolumeX className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Available Voices</p>
                        <p className="text-xl font-bold text-white">
                          {speechService.getAvailableVoices().length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Browser Support</p>
                        <p className="text-xl font-bold text-white">
                          {typeof window !== 'undefined' && 'speechSynthesis' in window ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                        <TestTube className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Voice Information */}
                <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                  <h3 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    How Voice Works
                  </h3>
                  <div className="text-blue-200 text-sm space-y-2">
                    <p>• <strong>Gender-Based Voices:</strong> Female companions use female voices, male companions use male voices</p>
                    <p>• <strong>Relationship Tuning:</strong> Voice speed and pitch adjust based on relationship type (romantic, professional, etc.)</p>
                    <p>• <strong>Browser-Based:</strong> Uses your browser's built-in text-to-speech engine</p>
                    <p>• <strong>Automatic Playback:</strong> AI responses are automatically spoken when voice is enabled</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Voice Testing */}
            {voiceEnabled && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Test Companion Voices</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {companions.slice(0, 6).map((companion) => (
                    <div key={companion.id} className="bg-gray-700/50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${companion.avatar} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-semibold text-sm">
                            {companion.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{companion.name}</h3>
                          <p className="text-gray-400 text-sm">{companion.gender} • {companion.relationshipType}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => testCompanionVoice(companion)}
                        disabled={testingVoice === companion.id}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        {testingVoice === companion.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Speaking...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Test Voice
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Companions</p>
                    <p className="text-3xl font-bold text-white">{stats.totalCompanions}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Female</p>
                    <p className="text-3xl font-bold text-white">{stats.femaleCompanions}</p>
                  </div>
                  <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-pink-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Male</p>
                    <p className="text-3xl font-bold text-white">{stats.maleCompanions}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Voice Status</p>
                    <p className="text-lg font-bold text-green-400">
                      {voiceEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                    {voiceEnabled ? (
                      <Volume2 className="w-6 h-6 text-green-400" />
                    ) : (
                      <VolumeX className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Relationship Types Breakdown */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Companion Types</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{stats.romanticCompanions}</div>
                  <div className="text-gray-400 text-sm">Romantic</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{stats.friendshipCompanions}</div>
                  <div className="text-gray-400 text-sm">Friendship</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.professionalCompanions}</div>
                  <div className="text-gray-400 text-sm">Professional</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{stats.mentorCompanions}</div>
                  <div className="text-gray-400 text-sm">Mentor</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setActiveTab('companions');
                    startCreating();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Companion
                </button>
                <button
                  onClick={() => setActiveTab('voice')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Volume2 className="w-5 h-5" />
                  Configure Voice
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Key className="w-5 h-5" />
                  Configure API Keys
                </button>
              </div>
            </div>
          </div>
        )}

        {/* API Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Key className="w-6 h-6" />
              API Configuration
            </h2>
            
            <div className="space-y-6">
              {/* OpenAI API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  OpenAI API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.openai ? 'text' : 'password'}
                    value={apiSettings.openaiKey}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, openaiKey: e.target.value }))}
                    placeholder="sk-..."
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys(prev => ({ ...prev, openai: !prev.openai }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showKeys.openai ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Anthropic API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Anthropic API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.anthropic ? 'text' : 'password'}
                    value={apiSettings.anthropicKey}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, anthropicKey: e.target.value }))}
                    placeholder="sk-ant-..."
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys(prev => ({ ...prev, anthropic: !prev.anthropic }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showKeys.anthropic ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Google Gemini API Key */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Google Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type={showKeys.gemini ? 'text' : 'password'}
                    value={apiSettings.geminiKey}
                    onChange={(e) => setApiSettings(prev => ({ ...prev, geminiKey: e.target.value }))}
                    placeholder="AIza..."
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKeys(prev => ({ ...prev, gemini: !prev.gemini }))}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showKeys.gemini ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Default Model */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Default AI Model
                </label>
                <select
                  value={apiSettings.defaultModel}
                  onChange={(e) => setApiSettings(prev => ({ ...prev, defaultModel: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                  <option value="claude-3-opus">Claude 3 Opus</option>
                  <option value="gemini-pro">Gemini Pro</option>
                </select>
              </div>

              <button
                onClick={saveSettings}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Companions Tab */}
        {activeTab === 'companions' && (
          <>
            {/* Companions Management */}
            {!editingCompanion && !isCreating && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search companions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
                      >
                        <option value="all">All Types</option>
                        <option value="romantic">Romantic</option>
                        <option value="friendship">Friendship</option>
                        <option value="professional">Professional</option>
                        <option value="mentor">Mentor</option>
                      </select>
                      
                      <button
                        onClick={startCreating}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add Companion
                      </button>
                    </div>
                  </div>
                </div>

                {/* Companions List */}
                <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden">
                  <div className="p-6 border-b border-gray-700/50">
                    <h2 className="text-xl font-bold text-white">
                      Companions ({filteredCompanions.length})
                    </h2>
                  </div>
                  
                  <div className="divide-y divide-gray-700/50">
                    {filteredCompanions.map((companion) => (
                      <div key={companion.id} className="p-6 hover:bg-gray-700/20 transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${companion.avatar} rounded-full flex items-center justify-center`}>
                              <span className="text-white font-semibold">
                                {companion.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{companion.name}</h3>
                              <p className="text-gray-400 text-sm">
                                {companion.age} years • {companion.gender} • {companion.relationshipType}
                              </p>
                              <p className="text-gray-300 text-sm mt-1 max-w-md truncate">
                                {companion.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {voiceEnabled && (
                              <button
                                onClick={() => testCompanionVoice(companion)}
                                disabled={testingVoice === companion.id}
                                className="p-2 hover:bg-gray-600 rounded-lg transition-all duration-200"
                                title="Test voice"
                              >
                                {testingVoice === companion.id ? (
                                  <div className="w-5 h-5 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
                                ) : (
                                  <Volume2 className="w-5 h-5 text-green-400" />
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => startEditing(companion)}
                              className="p-2 hover:bg-gray-600 rounded-lg transition-all duration-200"
                            >
                              <Edit className="w-5 h-5 text-blue-400" />
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(companion.id)}
                              className="p-2 hover:bg-gray-600 rounded-lg transition-all duration-200"
                            >
                              <Trash2 className="w-5 h-5 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Companion Form */}
            {(editingCompanion || isCreating) && (
              <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {isCreating ? 'Create New Companion' : 'Edit Companion'}
                  </h2>
                  <button
                    onClick={() => {
                      setEditingCompanion(null);
                      setIsCreating(false);
                    }}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-200"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={companionForm.name}
                        onChange={(e) => setCompanionForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400"
                        placeholder="Enter companion name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Age
                        </label>
                        <input
                          type="number"
                          value={companionForm.age}
                          onChange={(e) => setCompanionForm(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
                          min="18"
                          max="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Gender
                        </label>
                        <select
                          value={companionForm.gender}
                          onChange={(e) => setCompanionForm(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
                        >
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Relationship Type
                      </label>
                      <select
                        value={companionForm.relationshipType}
                        onChange={(e) => setCompanionForm(prev => ({ ...prev, relationshipType: e.target.value as any }))}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white"
                      >
                        <option value="friendship">Friendship</option>
                        <option value="romantic">Romantic</option>
                        <option value="professional">Professional</option>
                        <option value="mentor">Mentor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Avatar Color
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {avatarOptions.map((avatar) => (
                          <button
                            key={avatar}
                            onClick={() => setCompanionForm(prev => ({ ...prev, avatar }))}
                            className={`w-12 h-12 bg-gradient-to-br ${avatar} rounded-lg border-2 transition-all duration-200 ${
                              companionForm.avatar === avatar ? 'border-blue-500' : 'border-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Media Upload Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Profile Media</h3>
                      
                      {/* Profile Image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Profile Image
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('profileImage', e.target.files)}
                            className="hidden"
                            id="profile-image-upload"
                          />
                          <label
                            htmlFor="profile-image-upload"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Image
                          </label>
                          {companionForm.profileImage && (
                            <div className="flex items-center gap-2">
                              <img src={companionForm.profileImage} alt="Profile" className="w-10 h-10 object-cover rounded" />
                              <button
                                onClick={() => removeMediaItem('profileImage')}
                                className="p-1 bg-red-600 hover:bg-red-700 text-white rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Profile Video */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Profile Video
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileUpload('profileVideo', e.target.files)}
                            className="hidden"
                            id="profile-video-upload"
                          />
                          <label
                            htmlFor="profile-video-upload"
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Video
                          </label>
                          {companionForm.profileVideo && (
                            <div className="flex items-center gap-2">
                              <video src={companionForm.profileVideo} className="w-10 h-10 object-cover rounded" muted />
                              <button
                                onClick={() => removeMediaItem('profileVideo')}
                                className="p-1 bg-red-600 hover:bg-red-700 text-white rounded"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Gallery Images */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Gallery Images ({companionForm.galleryImages?.length || 0})
                        </label>
                        <div className="space-y-3">
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleFileUpload('galleryImages', e.target.files, true)}
                              className="hidden"
                              id="gallery-images-upload"
                            />
                            <label
                              htmlFor="gallery-images-upload"
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2 w-fit"
                            >
                              <Upload className="w-4 h-4" />
                              Add Images
                            </label>
                          </div>
                          {companionForm.galleryImages && companionForm.galleryImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                              {companionForm.galleryImages.map((image, index) => (
                                <div key={index} className="relative">
                                  <img src={image} alt={`Gallery ${index}`} className="w-full h-16 object-cover rounded" />
                                  <button
                                    onClick={() => removeMediaItem('galleryImages', index)}
                                    className="absolute -top-1 -right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        value={companionForm.description}
                        onChange={(e) => setCompanionForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 resize-none"
                        rows={3}
                        placeholder="Describe the companion's personality and background"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Personality Traits (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={companionForm.personality?.join(', ')}
                        onChange={(e) => handleArrayInput('personality', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400"
                        placeholder="caring, funny, intelligent, creative"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Interests (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={companionForm.interests?.join(', ')}
                        onChange={(e) => handleArrayInput('interests', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400"
                        placeholder="music, art, cooking, travel"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Greeting Message
                      </label>
                      <textarea
                        value={companionForm.greeting}
                        onChange={(e) => setCompanionForm(prev => ({ ...prev, greeting: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 resize-none"
                        rows={2}
                        placeholder="First message the companion will send"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Response Style
                      </label>
                      <input
                        type="text"
                        value={companionForm.responseStyle}
                        onChange={(e) => setCompanionForm(prev => ({ ...prev, responseStyle: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400"
                        placeholder="warm and caring, professional, playful"
                      />
                    </div>

                    {/* Voice Test for Current Companion */}
                    {voiceEnabled && companionForm.name && (
                      <div className="p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                        <h4 className="text-green-300 font-medium mb-2 flex items-center gap-2">
                          <Volume2 className="w-4 h-4" />
                          Voice Preview
                        </h4>
                        <p className="text-green-200 text-sm mb-3">
                          Test how {companionForm.name} will sound with a {companionForm.gender} voice
                        </p>
                        <button
                          onClick={() => testCompanionVoice(companionForm as Companion)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Test Voice
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-700/50">
                  <button
                    onClick={() => {
                      setEditingCompanion(null);
                      setIsCreating(false);
                    }}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCompanion}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {isCreating ? 'Create Companion' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-4">Confirm Deletion</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this companion? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCompanion(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};