"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Fingerprint, Lock, LogOut } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { getUserName, getUserIdentifier } from "@/lib/auth-utils";
import { userService } from "@/lib/api/services";

import { FaceEnrollmentModal } from "./face-enrollment-modal";

export function ProfileTab() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("...");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Modal states
  const [showFaceEnrollment, setShowFaceEnrollment] = useState(false);

  useEffect(() => {
    const name = getUserName();
    if (name) {
      setUserName(name);
    }
    
    const fetchProfilePhoto = async () => {
      try {
        const identifier = getUserIdentifier();
        if (identifier) {
          const photo = await userService.getProfilePhoto(identifier);
          if (typeof photo === 'string' && (photo.startsWith('http') || photo.startsWith('data:image') || photo.startsWith('blob:'))) {
            setProfilePhoto(photo);
          }
        }
      } catch (error) {
        console.error('Failed to fetch profile photo:', error);
      }
    };
    
    fetchProfilePhoto();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Profile Header */}
      <div className="bg-white p-6 pb-8 rounded-b-[2rem] shadow-sm mb-6 flex flex-col items-center justify-center">
        <UserAvatar name={userName} className="w-24 h-24 text-3xl mb-4" src={profilePhoto || undefined} />
        <h2 className="text-xl font-bold text-slate-800">{userName}</h2>
        <p className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mt-2">
          Verified User
        </p>
      </div>

      {/* Menu Options */}
      <div className="px-4 space-y-3 flex-1 overflow-y-auto pb-24">
        <button 
          onClick={() => setShowFaceEnrollment(true)}
          className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 p-3 rounded-full text-indigo-600">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-800">Face Enrollment</h3>
              <p className="text-xs text-slate-500">Manage Face ID authentication</p>
            </div>
          </div>
        </button>

        <button className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm active:scale-[0.98] transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 p-3 rounded-full text-emerald-600">
              <Lock className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-slate-800">Change PIN</h3>
              <p className="text-xs text-slate-500">Update your security PIN</p>
            </div>
          </div>
        </button>

        <button 
          onClick={handleLogout}
          className="w-full bg-white p-4 rounded-xl flex items-center justify-between shadow-sm active:scale-[0.98] transition-all border border-red-50 mt-8"
        >
          <div className="flex items-center gap-4">
            <div className="bg-red-50 p-3 rounded-full text-red-600">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-red-600">Log Out</h3>
              <p className="text-xs text-red-400">Securely sign out of Radix</p>
            </div>
          </div>
        </button>
      </div>

      <FaceEnrollmentModal 
        isOpen={showFaceEnrollment} 
        onClose={() => setShowFaceEnrollment(false)} 
      />
    </div>
  );
}
