import React, { useState, useEffect } from 'react';
import { CompanionGallery } from './components/CompanionGallery';
import { ChatInterface } from './components/ChatInterface';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';
import { ProfileView } from './components/ProfileView';
import { Homepage } from './components/Homepage';
import { companions as initialCompanions } from './data/companions';
import { Companion } from './types';
import { Settings } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState<'homepage' | 'gallery' | 'chat' | 'profile' | 'admin' | 'admin-login'>('homepage');
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [companions, setCompanions] = useState<Companion[]>(initialCompanions);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Check for admin route on load
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      if (isAdminAuthenticated) {
        setCurrentView('admin');
      } else {
        setCurrentView('admin-login');
      }
    }
  }, [isAdminAuthenticated]);

  // Handle URL changes
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        if (isAdminAuthenticated) {
          setCurrentView('admin');
        } else {
          setCurrentView('admin-login');
        }
      } else {
        setCurrentView('homepage');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAdminAuthenticated]);

  const handleSelectCompanion = (companion: Companion) => {
    setSelectedCompanion(companion);
    setCurrentView('chat');
  };

  const handleSwitchCompanion = (companionId: string) => {
    const companion = companions.find(c => c.id === companionId);
    if (companion) {
      setSelectedCompanion(companion);
      // Stay in chat view, just switch companion
    }
  };

  const handleViewProfile = (companion: Companion) => {
    setSelectedCompanion(companion);
    setCurrentView('profile');
  };

  const handleBackToGallery = () => {
    setCurrentView('gallery');
    setSelectedCompanion(null);
  };

  const handleBackToHomepage = () => {
    setCurrentView('homepage');
    setSelectedCompanion(null);
    window.history.pushState({}, '', '/');
  };

  const handleShowAdmin = () => {
    window.history.pushState({}, '', '/admin');
    if (isAdminAuthenticated) {
      setCurrentView('admin');
    } else {
      setCurrentView('admin-login');
    }
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdminAuthenticated(true);
      setCurrentView('admin');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    setCurrentView('homepage');
    window.history.pushState({}, '', '/');
  };

  const handleBackFromAdmin = () => {
    setCurrentView('gallery');
    window.history.pushState({}, '', '/');
  };

  const handleUpdateCompanions = (updatedCompanions: Companion[]) => {
    setCompanions(updatedCompanions);
  };

  const handleStartChat = (companion: Companion) => {
    setSelectedCompanion(companion);
    setCurrentView('chat');
  };

  if (currentView === 'admin-login') {
    return (
      <AdminLogin 
        onLogin={handleAdminLogin}
        onBack={handleBackToHomepage}
      />
    );
  }

  if (currentView === 'admin' && isAdminAuthenticated) {
    return (
      <AdminPanel 
        companions={companions}
        onUpdateCompanions={handleUpdateCompanions}
        onBack={handleBackFromAdmin}
        onLogout={handleAdminLogout}
      />
    );
  }

  if (currentView === 'profile' && selectedCompanion) {
    return (
      <ProfileView 
        companion={selectedCompanion}
        onBack={handleBackToGallery}
        onStartChat={handleStartChat}
      />
    );
  }

  if (currentView === 'chat' && selectedCompanion) {
    return (
      <ChatInterface 
        companion={selectedCompanion} 
        onBack={handleBackToGallery}
        onViewProfile={handleViewProfile}
        onSwitchCompanion={handleSwitchCompanion}
      />
    );
  }

  if (currentView === 'gallery') {
    return (
      <div className="relative">
        {/* Admin Button */}
        <button
          onClick={handleShowAdmin}
          className="fixed top-6 right-6 z-50 p-3 bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 hover:bg-gray-700/90 text-white rounded-full transition-all duration-200 shadow-lg"
          title="Admin Panel"
        >
          <Settings className="w-6 h-6" />
        </button>

        <CompanionGallery 
          companions={companions} 
          onSelectCompanion={handleSelectCompanion}
          onViewProfile={handleViewProfile}
          onBack={handleBackToHomepage}
        />
      </div>
    );
  }

  return (
    <Homepage 
      onEnterApp={() => setCurrentView('gallery')}
      onShowAdmin={handleShowAdmin}
    />
  );
}

export default App;