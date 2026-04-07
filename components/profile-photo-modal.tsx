'use client';

import { X, Camera, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { userService } from '@/lib/api/services';
import { getUserIdentifier } from '@/lib/auth-utils';

interface ProfilePhotoModalProps {
  onClose: () => void;
  onSuccess: () => void;
  mobileNumber?: string;
  initials: string;
}

export function ProfilePhotoModal({ onClose, onSuccess, mobileNumber, initials }: ProfilePhotoModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const userId = getUserIdentifier();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Invalid file type. Please select an image file (JPG, PNG, etc).");
      toast({ 
        title: "Invalid file type", 
        description: "Please select an image file (JPG, PNG, etc).",
        variant: "destructive" 
      });
      return;
    }

    // Validate file size (1MB = 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
      alert("File too large. Profile photo must be 1MB or smaller. Your file is " + (file.size / (1024 * 1024)).toFixed(2) + "MB.");
      toast({ 
        title: "File too large", 
        description: "Profile photo must be 1MB or smaller.",
        variant: "destructive" 
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await userService.uploadProfilePhoto(selectedFile);
      toast({ title: "Success", description: "Profile photo successfully updated." });
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to upload photo', error);
      toast({ title: "Upload Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center">
      <div className="w-full max-w-sm rounded-[2rem] bg-white p-6 shadow-xl relative animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Update Profile Photo</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* User Info Details */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Radix ID</span>
              <span className="text-sm font-semibold text-slate-900">{userId || 'Not available'}</span>
            </div>
            {mobileNumber && (
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">Mobile Number</span>
                <span className="text-sm font-semibold text-slate-900">{mobileNumber}</span>
              </div>
            )}
          </div>

          {/* Photo Selection Area */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div 
              className="relative h-24 w-24 sm:h-32 sm:w-32 cursor-pointer group" 
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-blue-100 border-4 border-white shadow-sm group-hover:opacity-90 transition-opacity">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl sm:text-4xl font-bold text-blue-900">{initials}</span>
                )}
              </div>
              <button
                className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white shadow-md group-hover:bg-blue-700 transition pointer-events-none"
              >
                <Camera size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-500 text-center">
              Max size 1MB. Images only (JPG, PNG).<br/>No executable files allowed.
            </p>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="w-full rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:shadow-none"
          >
            {isUploading ? 'Uploading...' : 'Save Profile Photo'}
          </button>
        </div>
      </div>
    </div>
  );
}