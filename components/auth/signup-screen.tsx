'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock } from 'lucide-react';
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
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
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
    
    try {
      await userService.signup({
        name: fullName,
        mob_no: mobileNumber,
        password: password,
        pin: pin,
        useNameForRadixId: useNameForRadixId
      });
      // Optionally login immediately or redirect
      alert('Signup successful! Please login.');
      onSwitchToLogin();
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
    } finally {
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
              placeholder="9876543210"
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
          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200">
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

          {error && (
            <div className="p-3 mb-2 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
              {error}
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
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
