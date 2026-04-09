'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { authService, userService } from '@/lib/api/services';
import { ForgotPasswordModal } from './forgot-password-modal';

interface LoginScreenProps {
  onSwitchToSignup: () => void;
}

export function LoginScreen({ onSwitchToSignup }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    
    try {
      let finalIdentifier = identifier.trim();
      if (finalIdentifier && !finalIdentifier.includes('@')) {
        finalIdentifier = `${finalIdentifier}@radix`;
      }
      const response = await authService.login(finalIdentifier, password);
      // Store the token
      localStorage.setItem('access_token', response.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      // Remove console.error to prevent Next.js dev overlay from popping up
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn w-full h-full flex flex-col">
      {/* Branding Area */}
      <div className="px-4 sm:px-6 pt-8 sm:pt-12 pb-8 sm:pb-10 text-center border-b border-slate-100">
        <div className="flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 select-none">Radix</h1>
        <p className="text-sm sm:text-base text-slate-600">Welcome back. Log in to your wallet.</p>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto">
        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}
          {/* Radix ID / Mobile Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Radix ID
            </label>
            <input
              type="text"
              placeholder="e.g., johndoe@radix or 9876543210@radix"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => setShowForgotModal(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-2xl transition-colors active:scale-95 flex justify-center items-center"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Signup Link */}
        <div className="mt-6 text-center text-sm text-slate-600">
          New to Radix?{' '}
          <button
            onClick={onSwitchToSignup}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Create an account
          </button>
        </div>
      </div>
      
      {showForgotModal && (
        <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
      )}
    </div>
  );
}
