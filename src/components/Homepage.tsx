import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Heart, 
  Users, 
  Sparkles, 
  ArrowRight, 
  Star,
  Shield,
  Zap,
  Settings,
  Play,
  ChevronDown
} from 'lucide-react';

interface HomepageProps {
  onEnterApp: () => void;
  onShowAdmin: () => void;
}

export const Homepage: React.FC<HomepageProps> = ({ onEnterApp, onShowAdmin }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah M.",
      text: "The conversations feel so natural and engaging. Emma has become my daily companion!",
      rating: 5
    },
    {
      name: "Mike R.",
      text: "Amazing variety of personalities. Each companion feels unique and authentic.",
      rating: 5
    },
    {
      name: "Lisa K.",
      text: "Perfect for meaningful conversations. The AI responses are incredibly thoughtful.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Natural Conversations",
      description: "Engage in meaningful dialogues with AI companions that understand context and emotion."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Diverse Relationships",
      description: "From friendship to romance, find the perfect companion for every type of connection."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "30+ Unique Personalities",
      description: "Each companion has distinct traits, interests, and conversation styles."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI-Powered Intelligence",
      description: "Advanced AI technology creates realistic and engaging conversation experiences."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe & Private",
      description: "Your conversations are private and secure. Connect without judgment."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Connection",
      description: "Start chatting immediately with any companion that catches your interest."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 overflow-x-hidden">
      {/* Admin Button */}
      <button
        onClick={onShowAdmin}
        className="fixed top-6 right-6 z-50 p-3 bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 hover:bg-gray-700/90 text-white rounded-full transition-all duration-200 shadow-lg"
        title="Admin Panel"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">Powered by Advanced AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Meet Your Perfect
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent block">
                AI Companion
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Connect with 30+ unique AI personalities designed for meaningful conversations,
              <br className="hidden md:block" />
              companionship, and genuine emotional connections.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={onEnterApp}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3"
            >
              <Play className="w-6 h-6" />
              Start Chatting Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="px-8 py-4 border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-gray-800/50">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">30+</div>
              <div className="text-gray-400">AI Companions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Always Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400">Private & Safe</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose Our AI Companions?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of digital companionship with cutting-edge AI technology
              and carefully crafted personalities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 hover:border-gray-600/50 hover:bg-gray-800/70 transition-all duration-300 group"
              >
                <div className="text-purple-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companion Preview Section */}
      <section className="py-20 px-4 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet Some of Our Companions
            </h2>
            <p className="text-xl text-gray-400">
              Each with unique personalities, interests, and conversation styles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Emma Preview */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300 group">
              <div className="h-64 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center relative">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Emma"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30 flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Romantic
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Emma</h3>
                <p className="text-gray-400 text-sm mb-3">28 years • Artist & Dreamer</p>
                <p className="text-gray-300 text-sm">A passionate artist who believes in deep connections and meaningful conversations.</p>
              </div>
            </div>

            {/* Alex Preview */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300 group">
              <div className="h-64 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative">
                <img 
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Alex"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm border border-red-500/30 flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Romantic
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Alex</h3>
                <p className="text-gray-400 text-sm mb-3">29 years • Gentleman & Musician</p>
                <p className="text-gray-300 text-sm">A charming gentleman who believes in old-fashioned romance and meaningful connections.</p>
              </div>
            </div>

            {/* Sophia Preview */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden hover:border-gray-600/50 transition-all duration-300 group">
              <div className="h-64 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center relative">
                <img 
                  src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400" 
                  alt="Sophia"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Friendship
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Sophia</h3>
                <p className="text-gray-400 text-sm mb-3">26 years • Adventurer & Best Friend</p>
                <p className="text-gray-300 text-sm">Your energetic best friend who always has your back and loves trying new things.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={onEnterApp}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Explore All Companions
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of satisfied users who found their perfect AI companion
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 text-center">
            <div className="flex justify-center mb-4">
              {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-xl text-gray-300 mb-6 italic">
              "{testimonials[currentTestimonial].text}"
            </blockquote>
            <cite className="text-purple-400 font-semibold">
              - {testimonials[currentTestimonial].name}
            </cite>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? 'bg-purple-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your Perfect Companion?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start meaningful conversations today with AI companions who understand you
          </p>
          <button
            onClick={onEnterApp}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            Get Started Now - It's Free!
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">AI Companions</h3>
            <p className="text-gray-400 mb-6">
              Your gateway to meaningful AI relationships
            </p>
            <div className="text-gray-500 text-sm">
              © 2024 AI Companions. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};