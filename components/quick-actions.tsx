'use client';

import { Smartphone, QrCode, Shield } from 'lucide-react';

interface QuickActionsProps {
  onPayMobile: () => void;
  onPayRadixId: () => void;
  onReceiveFace: () => void;
}

export function QuickActions({ onPayMobile, onPayRadixId, onReceiveFace }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {/* Receive with Face */}
      <button
        onClick={onReceiveFace}
        className="flex flex-col items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-slate-50 p-3 sm:p-4 hover:bg-slate-100 transition-colors"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Shield size={18} className="text-blue-600 sm:w-5.5 sm:h-5.5" />
        </div>
        <span className="text-[10px] sm:text-xs font-semibold text-slate-900 text-center leading-tight">
          Receive
        </span>
      </button>

      {/* Pay Mobile */}
      <button
        onClick={onPayMobile}
        className="flex flex-col items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-slate-50 p-3 sm:p-4 hover:bg-slate-100 transition-colors"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Smartphone size={18} className="text-blue-600 sm:w-5.5 sm:h-5.5" />
        </div>
        <span className="text-[10px] sm:text-xs font-semibold text-slate-900 text-center leading-tight">
          Pay Mobile
        </span>
      </button>

      {/* Pay Radix ID */}
      <button
        onClick={onPayRadixId}
        className="flex flex-col items-center justify-center gap-2 sm:gap-3 rounded-2xl bg-slate-50 p-3 sm:p-4 hover:bg-slate-100 transition-colors"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <QrCode size={18} className="text-blue-600 sm:w-5.5 sm:h-5.5" />
        </div>
        <span className="text-[10px] sm:text-xs font-semibold text-slate-900 text-center leading-tight">
          Pay Radix ID
        </span>
      </button>
    </div>
  );
}
