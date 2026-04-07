'use client';

import { useState, useEffect, useRef } from 'react';
import { Camera, Fingerprint, Lock, LogOut, User, AtSign, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getUserName, getUserInitials } from '@/lib/auth-utils';
import { PinManagementModal } from './pin-management-modal';
import { userService, faceService } from '@/lib/api/services';
import { useToast } from '@/hooks/use-toast';

export function AdvancedProfileTab() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const [userName, setUserName] = useState('...');
  const [initials, setInitials] = useState('M');
  const [isFaceEnrolled, setIsFaceEnrolled] = useState(true);
  
  const [showPinModal, setShowPinModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const name = getUserName();
    if (name) {
      setUserName(name);
      setInitials(getUserInitials(name));
    } else {
      setUserName('My Account');
    }
    
    // Check if face identity is active on mount
    const checkFace = async () => {
      try {
        const res = await faceService.checkFaceStatus();
        setIsFaceEnrolled(res.status === 'True');
      } catch (err) {
        setIsFaceEnrolled(false);
      }
    };
    checkFace();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await userService.uploadProfilePhoto(file);
      toast({ title: "Profile Photo Uploaded!" });
    } catch (error: any) {
      console.error('Failed to upload photo', error);
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateRadixId = async () => {
    const newFormat = confirm('Click OK to use your Name for Radix ID, or Cancel to use your Mobile Number.') ? true : false;
    try {
      await userService.updateRadixId({ name_in_id: newFormat });
      toast({ title: "Radix ID Updated successfully." });
    } catch (error: any) {
      console.error('Failed to update Radix ID', error);
      toast({ title: "Failed to update ID format", description: error.message, variant: "destructive" });
    }
  };

  const handleFaceAuth = async () => {
    // Basic stub, normally you would capture webcam images here
    toast({ title: "Face Auth Flow Triggered", description: "Integration logic for webcam goes here" });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await userService.deleteAccount();
      toast({ title: "Account Deleted" });
      localStorage.removeItem('access_token');
      router.push('/');
    } catch (error: any) {
      console.error('Failed to delete account', error);
      toast({ title: "Account Deletion Failed", description: error.message, variant: "destructive" });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="pb-8 space-y-6">
      {/* Profile Header */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center shadow-sm">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            {/* Assume a state var for photoUrl could go here, fallback to initials */}
            <span className="text-blue-900 font-bold text-3xl">{initials}</span>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full border-2 border-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handlePhotoUpload}
          />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1 capitalize">{userName}</h2>
        <p className="text-sm text-slate-600">Verified User</p>
      </div>

      <div className="space-y-4">
        {/* Account Settings Section */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 mb-2 px-1 uppercase tracking-wider">Account Settings</h3>
          <div className="space-y-2">
            <button 
              onClick={handleUpdateRadixId}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-left"
            >
              <AtSign className="w-6 h-6 text-blue-600 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 text-sm">Update Radix ID</p>
                <p className="text-sm text-slate-500 truncate">Change your ID format</p>
              </div>
            </button>

            <button 
              onClick={handleFaceAuth}
              className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-left gap-4"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <Fingerprint className="w-6 h-6 text-blue-600 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">Face Authentication</p>
                  <p className="text-sm text-slate-500 truncate">Manage biometric login</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${isFaceEnrolled ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {isFaceEnrolled ? 'Active' : 'Not Enrolled'}
              </span>
            </button>

            <button 
              onClick={() => setShowPinModal(true)}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-left"
            >
              <Lock className="w-6 h-6 text-blue-600 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm">PIN Management</p>
                <p className="text-sm text-slate-500">Change or reset your PIN</p>
              </div>
            </button>
          </div>
        </div>

        {/* Danger Zone Section */}
        <div>
          <h3 className="text-sm font-semibold text-red-500 mb-2 px-1 uppercase tracking-wider">Danger Zone</h3>
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all text-left"
            >
              <LogOut className="w-6 h-6 text-slate-600 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm">Logout</p>
                <p className="text-sm text-slate-500">Sign out of your account</p>
              </div>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-4 p-4 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all text-left"
            >
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-red-600 text-sm">Delete Account</p>
                <p className="text-sm text-red-500/80">Permanently remove your data</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {showPinModal && (
        <PinManagementModal onClose={() => setShowPinModal(false)} />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 px-4 text-red-600">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Account?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure? This action cannot be undone and you will lose all the data associated with your Radix account.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}