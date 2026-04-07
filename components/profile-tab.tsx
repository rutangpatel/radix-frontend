'use client';

import { useState, useEffect } from 'react';
import { Fingerprint, Lock, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUserName, getUserInitials } from '@/lib/auth-utils';

export function ProfileTab() {
  const router = useRouter();
  const [userName, setUserName] = useState('...');
  const [initials, setInitials] = useState('M');

  useEffect(() => {
    const name = getUserName();
    if (name) {
      setUserName(name);
      setInitials(getUserInitials(name));
    } else {
      setUserName('My Account');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/');
  };

  return (
    <div className="pb-8 space-y-5 sm:space-y-6">
      {/* Profile Header */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2 sm:mb-3">
          <span className="text-blue-900 font-bold text-xl sm:text-2xl">{initials}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-0.5 sm:mb-1 capitalize">{userName}</h2>
        <p className="text-xs sm:text-sm text-slate-600">Verified User</p>
      </div>

      {/* Menu Options */}
      <div className="space-y-2.5 sm:space-y-3">
        <button className="w-full flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-left">
          <Fingerprint className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-xs sm:text-sm">Manage Face Enrollment</p>
            <p className="text-xs text-slate-500">Add or remove Face ID</p>
          </div>
        </button>

        <button className="w-full flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-left">
          <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-xs sm:text-sm">Change PIN</p>
            <p className="text-xs text-slate-500">Update your security PIN</p>
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 hover:bg-red-50 hover:border-red-300 transition-all text-left"
        >
          <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-red-600 text-xs sm:text-sm">Logout</p>
            <p className="text-xs text-slate-500">Sign out of your account</p>
          </div>
        </button>
      </div>
    </div>
  );
}
