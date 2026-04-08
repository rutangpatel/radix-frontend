'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, X, CheckCircle, Loader2 } from 'lucide-react';

interface PinVerificationModalProps {
  open: boolean;
  onClose: () => void;
  payment: { target: string; amount: string; remark: string } | null;
  onConfirm: (pin: string) => void;
  isProcessing?: boolean;
  isSuccess?: boolean;
}

export function PinVerificationModal({ open, onClose, payment, onConfirm, isProcessing, isSuccess }: PinVerificationModalProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    if (open) {
      setPin('');
      setShowPin(false);
    }
  }, [open]);

  const handleConfirm = () => {
    if (isProcessing) return;
    if (pin.length !== 4) {
      alert('Please enter a valid 4-digit PIN');
      return;
    }
    onConfirm(pin);
  };

  if (!open || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Verify PIN</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center p-2 space-y-6 text-center animate-in fade-in">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">Payment Successful</h3>
                <p className="text-slate-500">
                  Successfully sent ₹{payment.amount} to {payment.target}
                </p>
              </div>

              <button 
                onClick={onClose} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-2xl py-3 font-semibold transition-colors mt-4"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Payment Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">To:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[200px]">{payment.target}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3">
                  <span className="text-slate-600">Amount:</span>
                  <span className="font-bold text-slate-900">₹{payment.amount}</span>
                </div>
                {payment.remark && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Remark:</span>
                    <span className="text-slate-900 truncate max-w-[200px]">{payment.remark}</span>
                  </div>
                )}
              </div>

              {/* PIN Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Enter 4-Digit PIN
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    placeholder="••••"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-10 text-center text-2xl tracking-widest"
                  />
                  <button
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleConfirm}
                  disabled={isProcessing || pin.length !== 4}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-colors disabled:bg-blue-400 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                    </>
                  ) : (
                    'Confirm Payment'
                  )}
                </button>

                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
