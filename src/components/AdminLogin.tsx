import React, { useState } from 'react';
import { ArrowLeft, Lock, User, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Default admin credentials (in production, this should be properly secured)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (
      credentials.username === ADMIN_CREDENTIALS.username &&
      credentials.password === ADMIN_CREDENTIALS.password
    ) {
      // Store authentication in sessionStorage (more secure than localStorage for admin)
      sessionStorage.setItem('adminAuthenticated', 'true');
      onLogin(true);
    } else {
      setError('Invalid username or password');
      onLogin(false);
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 p-3 bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 hover:bg-gray-700/90 text-white rounded-full transition-all duration-200 shadow-lg"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400">Enter your credentials to access the admin panel</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter username"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-gray-400 transition-all duration-200"
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !credentials.username || !credentials.password}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Access Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
            <h3 className="text-blue-300 font-medium mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Demo Credentials
            </h3>
            <div className="text-blue-200 text-sm space-y-1">
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
            <p className="text-blue-300/70 text-xs mt-2">
              In production, use secure authentication with encrypted passwords
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            🔒 This admin panel is protected and only accessible to authorized users
          </p>
        </div>
      </div>
    </div>
  );
};