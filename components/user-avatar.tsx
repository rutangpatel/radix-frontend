'use client';

import { useState } from 'react';
import { getInitials } from '@/lib/utils'; // Adjust import if needed

interface UserAvatarProps {
  src?: string | null;
  name: string;
  className?: string; // For passing sizing classes like 'w-10 h-10'
}

export function UserAvatar({ src, name, className = "w-10 h-10" }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const initials = getInitials(name);
  const showImage = src && !imgError;

  return (
    <div className={`relative shrink-0 rounded-full flex items-center justify-center font-bold overflow-hidden bg-blue-100 text-blue-600 border border-blue-200 ${className}`}>
      {/* Base Layer: Initials */}
      <span className="z-0">
        {initials}
      </span>

      {/* Top Layer: Image */}
      {showImage && (
        <img
          src={src}
          alt={name}
          onLoad={(e) => {
            if (e.currentTarget.naturalWidth <= 1) setImgError(true);
            else setImgLoaded(true);
          }}
          onError={() => setImgError(true)}
          className={`absolute inset-0 z-10 w-full h-full object-cover bg-white transition-opacity duration-200 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}