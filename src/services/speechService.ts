interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
}

interface CompanionVoice {
  voiceName?: string;
  gender: 'male' | 'female';
  settings: VoiceSettings;
}

interface VoiceOption {
  id: string;
  name: string;
  gender: 'male' | 'female';
  description: string;
  voiceNames: string[];
  settings: VoiceSettings;
  accent?: string;
  age?: string;
}

class SpeechService {
  private synthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private _isEnabled: boolean = true;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private selectedVoices: { [companionId: string]: string } = {};

  // Predefined voice options with different characteristics
  private voiceOptions: VoiceOption[] = [
    // Female Voices
    {
      id: 'aria-elegant',
      name: 'Aria (Elegant)',
      gender: 'female',
      description: 'Sophisticated and refined voice',
      voiceNames: ['Samantha', 'Victoria', 'en-US-AriaNeural', 'Microsoft Zira Desktop'],
      settings: { rate: 0.85, pitch: 1.1, volume: 0.8 },
      accent: 'American',
      age: 'Adult'
    },
    {
      id: 'bella-warm',
      name: 'Bella (Warm)',
      gender: 'female',
      description: 'Friendly and caring voice',
      voiceNames: ['Allison', 'en-US-JennyNeural', 'Google US English Female'],
      settings: { rate: 0.9, pitch: 1.15, volume: 0.85 },
      accent: 'American',
      age: 'Young Adult'
    },
    {
      id: 'claire-professional',
      name: 'Claire (Professional)',
      gender: 'female',
      description: 'Clear and authoritative voice',
      voiceNames: ['Susan', 'en-GB-SoniaNeural', 'Microsoft Hazel Desktop'],
      settings: { rate: 1.0, pitch: 1.05, volume: 0.8 },
      accent: 'British',
      age: 'Adult'
    },
    {
      id: 'diana-sweet',
      name: 'Diana (Sweet)',
      gender: 'female',
      description: 'Gentle and melodic voice',
      voiceNames: ['Ava', 'en-US-JennyNeural', 'Google UK English Female'],
      settings: { rate: 0.8, pitch: 1.2, volume: 0.75 },
      accent: 'American',
      age: 'Young'
    },
    {
      id: 'emma-confident',
      name: 'Emma (Confident)',
      gender: 'female',
      description: 'Strong and self-assured voice',
      voiceNames: ['Zira', 'en-US-AriaNeural', 'Microsoft Zira Desktop'],
      settings: { rate: 0.95, pitch: 1.0, volume: 0.85 },
      accent: 'American',
      age: 'Adult'
    },
    {
      id: 'fiona-playful',
      name: 'Fiona (Playful)',
      gender: 'female',
      description: 'Energetic and fun voice',
      voiceNames: ['Google US English Female', 'en-US-JennyNeural'],
      settings: { rate: 1.1, pitch: 1.25, volume: 0.8 },
      accent: 'American',
      age: 'Young Adult'
    },
    {
      id: 'grace-mature',
      name: 'Grace (Mature)',
      gender: 'female',
      description: 'Wise and experienced voice',
      voiceNames: ['Victoria', 'en-GB-SoniaNeural', 'Microsoft Hazel Desktop'],
      settings: { rate: 0.75, pitch: 0.95, volume: 0.8 },
      accent: 'British',
      age: 'Mature'
    },
    {
      id: 'helena-sultry',
      name: 'Helena (Sultry)',
      gender: 'female',
      description: 'Deep and alluring voice',
      voiceNames: ['Samantha', 'en-US-AriaNeural'],
      settings: { rate: 0.7, pitch: 0.9, volume: 0.85 },
      accent: 'American',
      age: 'Adult'
    },

    // Male Voices
    {
      id: 'alex-charming',
      name: 'Alex (Charming)',
      gender: 'male',
      description: 'Smooth and charismatic voice',
      voiceNames: ['Alex', 'Daniel', 'en-US-GuyNeural', 'Microsoft David Desktop'],
      settings: { rate: 0.85, pitch: 0.9, volume: 0.8 },
      accent: 'American',
      age: 'Adult'
    },
    {
      id: 'blake-friendly',
      name: 'Blake (Friendly)',
      gender: 'male',
      description: 'Warm and approachable voice',
      voiceNames: ['Tom', 'en-US-BrandonNeural', 'Google US English Male'],
      settings: { rate: 0.9, pitch: 0.95, volume: 0.85 },
      accent: 'American',
      age: 'Young Adult'
    },
    {
      id: 'connor-professional',
      name: 'Connor (Professional)',
      gender: 'male',
      description: 'Authoritative and clear voice',
      voiceNames: ['David', 'en-GB-RyanNeural', 'Microsoft Mark Desktop'],
      settings: { rate: 1.0, pitch: 0.85, volume: 0.8 },
      accent: 'British',
      age: 'Adult'
    },
    {
      id: 'derek-deep',
      name: 'Derek (Deep)',
      gender: 'male',
      description: 'Rich and resonant voice',
      voiceNames: ['Mark', 'en-US-GuyNeural', 'Google UK English Male'],
      settings: { rate: 0.8, pitch: 0.75, volume: 0.85 },
      accent: 'American',
      age: 'Mature'
    },
    {
      id: 'ethan-energetic',
      name: 'Ethan (Energetic)',
      gender: 'male',
      description: 'Upbeat and enthusiastic voice',
      voiceNames: ['James', 'en-US-BrandonNeural', 'Google US English Male'],
      settings: { rate: 1.1, pitch: 1.0, volume: 0.8 },
      accent: 'American',
      age: 'Young Adult'
    },
    {
      id: 'felix-gentle',
      name: 'Felix (Gentle)',
      gender: 'male',
      description: 'Soft and caring voice',
      voiceNames: ['Daniel', 'en-US-GuyNeural', 'Microsoft David Desktop'],
      settings: { rate: 0.85, pitch: 1.0, volume: 0.75 },
      accent: 'American',
      age: 'Adult'
    },
    {
      id: 'gabriel-wise',
      name: 'Gabriel (Wise)',
      gender: 'male',
      description: 'Thoughtful and mature voice',
      voiceNames: ['Alex', 'en-GB-RyanNeural', 'Microsoft Mark Desktop'],
      settings: { rate: 0.75, pitch: 0.8, volume: 0.8 },
      accent: 'British',
      age: 'Mature'
    },
    {
      id: 'hunter-confident',
      name: 'Hunter (Confident)',
      gender: 'male',
      description: 'Strong and assertive voice',
      voiceNames: ['Mark', 'en-US-GuyNeural', 'Google US English Male'],
      settings: { rate: 0.95, pitch: 0.85, volume: 0.85 },
      accent: 'American',
      age: 'Adult'
    }
  ];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
    this.loadSettings();
    
    // Load voices when they become available
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => {
        this.loadVoices();
      };
    }
  }

  private loadVoices(): void {
    this.voices = this.synthesis.getVoices();
  }

  private loadSettings(): void {
    const savedSettings = localStorage.getItem('speechSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this._isEnabled = settings.enabled !== false;
      this.selectedVoices = settings.selectedVoices || {};
    }
  }

  private saveSettings(): void {
    const settings = {
      enabled: this._isEnabled,
      selectedVoices: this.selectedVoices
    };
    localStorage.setItem('speechSettings', JSON.stringify(settings));
  }

  getVoiceOptions(gender?: 'male' | 'female'): VoiceOption[] {
    if (gender) {
      return this.voiceOptions.filter(option => option.gender === gender);
    }
    return this.voiceOptions;
  }

  setVoiceForCompanion(companionId: string, voiceId: string): void {
    this.selectedVoices[companionId] = voiceId;
    this.saveSettings();
  }

  getSelectedVoiceId(companionId: string, companionGender: 'male' | 'female'): string {
    // Return selected voice or default based on gender
    if (this.selectedVoices[companionId]) {
      return this.selectedVoices[companionId];
    }
    
    // Default voices based on gender
    const defaultVoices = {
      female: 'aria-elegant',
      male: 'alex-charming'
    };
    
    return defaultVoices[companionGender];
  }

  private getVoiceOption(voiceId: string): VoiceOption | null {
    return this.voiceOptions.find(option => option.id === voiceId) || null;
  }

  private findBestVoice(voiceNames: string[]): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    // Try to find exact matches first
    for (const voiceName of voiceNames) {
      const voice = this.voices.find(v => 
        v.name.toLowerCase().includes(voiceName.toLowerCase()) && 
        v.lang.startsWith('en')
      );
      if (voice) return voice;
    }

    // Fallback to any English voice
    return this.voices.find(v => v.lang.startsWith('en')) || this.voices[0] || null;
  }

  speak(text: string, companion: { id: string; gender: 'male' | 'female'; name: string; relationshipType: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this._isEnabled || !text.trim()) {
        resolve();
        return;
      }

      // Stop any current speech
      this.stop();

      // Clean the text for better speech
      const cleanText = this.cleanTextForSpeech(text);

      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;

      // Get selected voice option
      const voiceId = this.getSelectedVoiceId(companion.id, companion.gender);
      const voiceOption = this.getVoiceOption(voiceId);

      if (voiceOption) {
        // Set voice
        const voice = this.findBestVoice(voiceOption.voiceNames);
        if (voice) {
          utterance.voice = voice;
        }

        // Apply voice settings
        utterance.rate = voiceOption.settings.rate;
        utterance.pitch = voiceOption.settings.pitch;
        utterance.volume = voiceOption.settings.volume;

        // Adjust settings based on relationship type
        this.adjustForRelationshipType(utterance, companion.relationshipType);
      } else {
        // Fallback to default settings
        const defaultSettings = this.getDefaultVoiceSettings(companion.gender);
        utterance.rate = defaultSettings.rate;
        utterance.pitch = defaultSettings.pitch;
        utterance.volume = defaultSettings.volume;
      }

      // Set language
      utterance.lang = 'en-US';

      // Event handlers
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        
        // Handle different types of errors appropriately
        if (event.error === 'interrupted') {
          // This is expected behavior when speech is intentionally stopped
          console.info('Speech synthesis interrupted (expected behavior)');
          resolve(); // Resolve instead of reject for interruptions
        } else {
          // Log actual errors
          console.error('Speech synthesis error:', event.error);
          reject(event);
        }
      };

      // Start speaking
      this.synthesis.speak(utterance);
    });
  }

  private adjustForRelationshipType(utterance: SpeechSynthesisUtterance, relationshipType: string): void {
    switch (relationshipType) {
      case 'romantic':
        utterance.rate *= 0.9; // Slower, more intimate
        utterance.pitch *= 1.05; // Slightly more expressive
        break;
      case 'professional':
        utterance.rate *= 1.1; // Slightly faster, more business-like
        utterance.pitch *= 0.95; // More neutral
        break;
      case 'mentor':
        utterance.rate *= 0.85; // Thoughtful pace
        utterance.pitch *= 0.98; // Slightly lower, more authoritative
        break;
      case 'friendship':
      default:
        // Keep base settings
        break;
    }
  }

  private getDefaultVoiceSettings(gender: 'male' | 'female'): VoiceSettings {
    return {
      rate: 0.9,
      pitch: gender === 'female' ? 1.1 : 0.9,
      volume: 0.8
    };
  }

  private cleanTextForSpeech(text: string): string {
    return text
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/`(.*?)`/g, '$1') // Code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
      // Remove excessive punctuation
      .replace(/\.{2,}/g, '.')
      .replace(/!{2,}/g, '!')
      .replace(/\?{2,}/g, '?')
      // Replace common abbreviations
      .replace(/\bw\//g, 'with')
      .replace(/\bu\b/g, 'you')
      .replace(/\br\b/g, 'are')
      // Add pauses for better speech flow
      .replace(/([.!?])\s+/g, '$1 ')
      .replace(/,\s*/g, ', ')
      // Clean up whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  pause(): void {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  isPaused(): boolean {
    return this.synthesis.paused;
  }

  setEnabled(enabled: boolean): void {
    this._isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
    this.saveSettings();
  }

  isEnabled(): boolean {
    return this._isEnabled;
  }

  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices.filter(voice => voice.lang.startsWith('en'));
  }

  // Test voice with sample text
  testVoice(companion: { id: string; gender: 'male' | 'female'; name: string; relationshipType: string }, voiceId?: string): void {
    const sampleTexts = {
      romantic: "Hello darling, I'm so happy to hear from you. How has your day been?",
      friendship: "Hey there! Great to chat with you again. What's new and exciting?",
      professional: "Good day! I'm here to help you achieve your goals. What can we work on today?",
      mentor: "Welcome, my friend. I'm here to share wisdom and guide you on your journey."
    };

    const text = sampleTexts[companion.relationshipType as keyof typeof sampleTexts] || sampleTexts.friendship;
    
    // Temporarily set voice for testing if provided
    if (voiceId) {
      const originalVoice = this.selectedVoices[companion.id];
      this.selectedVoices[companion.id] = voiceId;
      this.speak(text, companion).finally(() => {
        // Restore original voice
        if (originalVoice) {
          this.selectedVoices[companion.id] = originalVoice;
        } else {
          delete this.selectedVoices[companion.id];
        }
      });
    } else {
      this.speak(text, companion);
    }
  }
}

export const speechService = new SpeechService();