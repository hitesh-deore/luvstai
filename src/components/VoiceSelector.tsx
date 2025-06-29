import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Check, User, Users } from 'lucide-react';
import { speechService } from '../services/speechService';
import { Companion } from '../types';

interface VoiceSelectorProps {
  companion: Companion;
  onVoiceChange?: (voiceId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ 
  companion, 
  onVoiceChange, 
  isOpen, 
  onClose 
}) => {
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('');
  const [testingVoice, setTestingVoice] = useState<string | null>(null);
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');

  useEffect(() => {
    if (isOpen) {
      const currentVoiceId = speechService.getSelectedVoiceId(companion.id, companion.gender);
      setSelectedVoiceId(currentVoiceId);
      setFilterGender(companion.gender);
    }
  }, [isOpen, companion]);

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    speechService.setVoiceForCompanion(companion.id, voiceId);
    onVoiceChange?.(voiceId);
  };

  const handleTestVoice = async (voiceId: string) => {
    if (testingVoice === voiceId) {
      speechService.stop();
      setTestingVoice(null);
      return;
    }

    setTestingVoice(voiceId);
    try {
      await speechService.testVoice(companion, voiceId);
    } catch (error) {
      console.error('Error testing voice:', error);
    } finally {
      setTestingVoice(null);
    }
  };

  const voiceOptions = speechService.getVoiceOptions(
    filterGender === 'all' ? undefined : filterGender
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Choose Voice for {companion.name}</h2>
              <p className="text-slate-400 text-sm">Select the perfect voice to match their personality</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Gender Filter */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFilterGender('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                filterGender === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All Voices
            </button>
            <button
              onClick={() => setFilterGender('female')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                filterGender === 'female'
                  ? 'bg-pink-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <User className="w-4 h-4" />
              Female ({speechService.getVoiceOptions('female').length})
            </button>
            <button
              onClick={() => setFilterGender('male')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                filterGender === 'male'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Users className="w-4 h-4" />
              Male ({speechService.getVoiceOptions('male').length})
            </button>
          </div>
        </div>

        {/* Voice List */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="grid gap-3">
            {voiceOptions.map((voice) => (
              <div
                key={voice.id}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  selectedVoiceId === voice.id
                    ? 'bg-blue-600/20 border-blue-500/50'
                    : 'bg-slate-700/50 border-slate-600/50 hover:bg-slate-700/70 hover:border-slate-500/50'
                }`}
                onClick={() => handleVoiceSelect(voice.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        voice.gender === 'female' 
                          ? 'bg-pink-600/20 text-pink-400' 
                          : 'bg-blue-600/20 text-blue-400'
                      }`}>
                        {voice.gender === 'female' ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{voice.name}</h3>
                        <p className="text-slate-400 text-sm">{voice.description}</p>
                      </div>
                      {selectedVoiceId === voice.id && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Accent: {voice.accent}</span>
                      <span>Age: {voice.age}</span>
                      <span>Rate: {voice.settings.rate}x</span>
                      <span>Pitch: {voice.settings.pitch}x</span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestVoice(voice.id);
                    }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      testingVoice === voice.id
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                    }`}
                    title={testingVoice === voice.id ? 'Stop' : 'Test Voice'}
                  >
                    {testingVoice === voice.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              <Volume2 className="w-4 h-4 inline mr-1" />
              {voiceOptions.length} voices available
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200"
              >
                Save Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};