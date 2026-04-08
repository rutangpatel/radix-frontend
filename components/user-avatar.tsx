'use client';

import { getInitials } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  src?: string | null;
  name: string;
  className?: string; // For passing sizing classes like 'w-10 h-10'
}

export function UserAvatar({ src, name, className = "w-10 h-10" }: UserAvatarProps) {
  const initials = getInitials(name);

  return (
    <Avatar className={cn("border border-blue-200", className)}>
      {src && (
        <AvatarImage src={src} alt={name} className="object-cover" />
      )}
      <AvatarFallback 
        delayMs={0} 
        className="bg-blue-100 text-blue-600 font-bold"
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}