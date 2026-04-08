'use client';

import { useState, useEffect } from 'react';
import { Fingerprint, Lock, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUserName, getUserIdentifier } from '@/lib/auth-utils';
import { userService } from '@/lib/api/services';
import { UserAvatar } from './user-avatar';

export function ProfileTab() {
  const router = useRouter();
  const [userName, setUserName] = useState('...');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    const name = getUserName();
    if (name) {
      setUserName(name);
    } else {
      setUserName('My Account');
    }

    const fetchProfilePhoto = async () => {
      try {
        const userId = getUserIdentifier();
        if (userId) {
          const res = await userService.getProfilePhoto(userId);
          const photoUrl = res.profile_photo || '';
          // Only use as an image if it's a valid URL or base64 data string
          // The backend might return the user's name if they don't have a photo
          if (photoUrl.startsWith('http') || photoUrl.startsWith('data:image') || photoUrl.startsWith('blob:') || photoUrl.startsWith('/')) {
            setProfilePhoto(photoUrl);
          }
        }
      } catch (error) {
        console.error('Failed to load profile photo:', error);
      }
    };
    fetchProfilePhoto();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/');
  };

  return (
    <div className="pb-8 space-y-5 sm:space-y-6">
      {/* Profile Header */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
        <UserAvatar 
          src={profilePhoto} 
          name={userName} 
          className="w-14 h-14 sm:w-16 sm:h-16 text-xl sm:text-2xl mx-auto mb-2 sm:mb-3" 
        />
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
