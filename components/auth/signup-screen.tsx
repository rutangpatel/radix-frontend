'use client';

import { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, Copy, Check } from 'lucide-react';
import { userService } from '@/lib/api/services';

interface SignupScreenProps {
  onSwitchToLogin: () => void;
}

export function SignupScreen({ onSwitchToLogin }: SignupScreenProps) {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [useNameForRadixId, setUseNameForRadixId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const getGeneratedRadixId = () => {
    if (useNameForRadixId && fullName.trim().length > 0) {
      return `${fullName.toLowerCase().replace(/\s+/g, '')}@radix`;
    }
    if (mobileNumber.trim().length > 0) {
      return `${mobileNumber}@radix`;
    }
    return '...@radix';
  };

  const handleCopyRadixId = () => {
    const id = getGeneratedRadixId();
    if (id !== '...@radix') {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (pin.length !== 4) {
      setError('PIN must be exactly 4 digits');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await userService.signup({
        name: fullName,
        mob_no: mobileNumber,
        password: password,
        pin: pin,
        useNameForRadixId: useNameForRadixId
      });
      
      setSuccess('Account created securely! Redirecting to login...');
      setTimeout(() => {
        setIsLoading(false);
        onSwitchToLogin();
      }, 1500);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
      setIsLoading(false);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPin(value);
  };

  return (
    <div className="animate-fadeIn w-full h-full flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-8 sm:pt-12 pb-8 sm:pb-10 text-center border-b border-slate-100">
        <div className="flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Join Radix</h1>
        <p className="text-sm sm:text-base text-slate-600">Set up your secure digital wallet.</p>
      </div>

      {/* Form Area */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto">
        <form onSubmit={handleSignup} className="space-y-4 sm:space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g., John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
              required
              maxLength={10}
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
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
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
            <p className="text-xs text-slate-500 mt-1">Minimum 8 characters for security</p>
          </div>

          {/* 4-Digit PIN */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Secure 4-Digit PIN
            </label>
            <input
              type="password"
              placeholder="••••"
              value={pin}
              onChange={handlePinChange}
              maxLength={4}
              required
              className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-semibold"
            />
            <p className="text-xs text-slate-500 mt-1">Used for transaction authorization</p>
          </div>

          {/* Toggle for Radix ID */}
          <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="useNameRadixId"
                checked={useNameForRadixId}
                onChange={(e) => setUseNameForRadixId(e.target.checked)}
                className="w-5 h-5 rounded-lg border border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-200 cursor-pointer"
              />
              <label htmlFor="useNameRadixId" className="text-sm font-medium text-slate-900 cursor-pointer flex-1">
                Use my name for my Radix ID instead of my mobile number
              </label>
            </div>
            
            <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 text-sm flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 font-medium mb-0.5">Your Radix ID will be:</span>
                <span className="font-semibold text-blue-700 font-mono">
                  {getGeneratedRadixId()}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyRadixId}
                disabled={getGeneratedRadixId() === '...@radix'}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
                title="Copy Radix ID"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 mb-2 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 mb-2 rounded-xl bg-green-50 text-green-600 text-sm border border-green-100 flex items-center justify-center gap-2 font-medium">
              <CheckCircle className="w-5 h-5"/> {success}
            </div>
          )}

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-2xl transition-colors active:scale-95 flex justify-center items-center"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Login Link */}
        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            disabled={isLoading}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
