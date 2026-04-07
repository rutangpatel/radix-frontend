'use client';

import { useState } from 'react';
import { LoginScreen } from './login-screen';
import { SignupScreen } from './signup-screen';

export function AuthFlow() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="bg-slate-50 min-h-screen w-full overflow-hidden">
      {/* Responsive Container */}
      <div className="w-full h-screen max-w-md mx-auto bg-white flex flex-col overflow-hidden lg:rounded-3xl lg:shadow-2xl lg:h-[90vh] lg:my-4">
        {/* Animated Content */}
        <div className="flex-1 relative overflow-hidden">
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: isLogin ? 1 : 0, pointerEvents: isLogin ? 'auto' : 'none' }}
          >
            <LoginScreen onSwitchToSignup={() => setIsLogin(false)} />
          </div>

          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: !isLogin ? 1 : 0, pointerEvents: !isLogin ? 'auto' : 'none' }}
          >
            <SignupScreen onSwitchToLogin={() => setIsLogin(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}
