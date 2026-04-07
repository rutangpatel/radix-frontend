'use client';

import { useState, useEffect } from 'react';
import { BalanceCard } from './balance-card';
import { QuickActions } from './quick-actions';
import { RecentActivity } from './recent-activity';
import { getUserIdentifier, getUserName, getUserInitials } from '@/lib/auth-utils';
import { userService } from '@/lib/api/services';

interface HomeTabProps {
  onPayMobile: () => void;
  onPayRadixId: () => void;
  onReceiveFace: () => void;
}

export function HomeTab({ onPayMobile, onPayRadixId, onReceiveFace }: HomeTabProps) {
  const [userName, setUserName] = useState('...');
  const [initials, setInitials] = useState('RU');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const name = getUserName();
    if (name) {
      setUserName(name); // Display full name globally on Home
      setInitials(getUserInitials(name));
    } else {
      setUserName('User');
    }

    const fetchPhoto = async () => {
      try {
        const userId = getUserIdentifier();
        if (userId) {
          const res = await userService.getProfilePhoto(userId);
          if (res && res.profile_photo) {
            setPhotoUrl(res.profile_photo);
          }
        }
      } catch (err: any) {
        // silently handled network error
      }
    };
    fetchPhoto();
  }, []);

  return (
    <div className="space-y-5 sm:space-y-6 pb-8">
      {/* Profile Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-slate-600 font-medium">Welcome,</p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate capitalize">{userName}</h2>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-blue-900 font-bold text-sm sm:text-lg">{initials}</span>
          )}
        </div>
      </div>

      {/* Balance Card */}
      <BalanceCard />

      {/* Quick Actions */}
      <QuickActions 
        onPayMobile={onPayMobile}
        onPayRadixId={onPayRadixId}
        onReceiveFace={onReceiveFace}
      />

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}
