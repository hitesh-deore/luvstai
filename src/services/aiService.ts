interface AIServiceConfig {
  apiKey: string;
  model: string;
  provider: 'openai' | 'anthropic' | 'gemini';
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

class AIService {
  private config: AIServiceConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    const savedSettings = localStorage.getItem('aiCompanionSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      
      // Determine which API to use based on available keys
      if (settings.openaiKey) {
        this.config = {
          apiKey: settings.openaiKey,
          model: settings.defaultModel || 'gpt-3.5-turbo',
          provider: 'openai'
        };
      } else if (settings.anthropicKey) {
        this.config = {
          apiKey: settings.anthropicKey,
          model: settings.defaultModel || 'claude-3-sonnet',
          provider: 'anthropic'
        };
      } else if (settings.geminiKey) {
        this.config = {
          apiKey: settings.geminiKey,
          model: settings.defaultModel || 'gemini-pro',
          provider: 'gemini'
        };
      }
    }
  }

  async generateResponse(
    messages: ChatMessage[],
    companionPersonality: string,
    companionName: string
  ): Promise<string> {
    if (!this.config) {
      throw new Error('AI service not configured. Please add API keys in admin panel.');
    }

    const systemPrompt = `You are ${companionName}, an AI companion with the following personality: ${companionPersonality}. 
    Respond in character, keeping your responses natural, engaging, and true to your personality. 
    Keep responses conversational and not too long.`;

    try {
      switch (this.config.provider) {
        case 'openai':
          return await this.callOpenAI([
            { role: 'system', content: systemPrompt },
            ...messages
          ]);
        
        case 'anthropic':
          return await this.callAnthropic([
            { role: 'system', content: systemPrompt },
            ...messages
          ]);
        
        case 'gemini':
          return await this.callGemini([
            { role: 'system', content: systemPrompt },
            ...messages
          ]);
        
        default:
          throw new Error('Unsupported AI provider');
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to generate response. Please check your API configuration.');
    }
  }

  private async callOpenAI(messages: ChatMessage[]): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config!.apiKey}`
      },
      body: JSON.stringify({
        model: this.config!.model,
        messages: messages,
        max_tokens: 150,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callAnthropic(messages: ChatMessage[]): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config!.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config!.model,
        max_tokens: 150,
        messages: messages.filter(m => m.role !== 'system'),
        system: messages.find(m => m.role === 'system')?.content
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private async callGemini(messages: ChatMessage[]): Promise<string> {
    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.config!.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          maxOutputTokens: 150,
          temperature: 0.8
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  isConfigured(): boolean {
    return this.config !== null;
  }

  getProvider(): string | null {
    return this.config?.provider || null;
  }
}

export const aiService = new AIService();