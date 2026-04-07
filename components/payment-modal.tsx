'use client';

import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  mode?: 'mobile' | 'radix-id' | 'face';
}

export function PaymentModal({ open, onClose, mode = 'mobile' }: PaymentModalProps) {
  const [activeMode, setActiveMode] = useState(mode);
  const [target, setTarget] = useState('');
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleClose = () => {
    setTarget('');
    setAmount('');
    setRemark('');
    setPin('');
    setIsScanning(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-stone-900">
            {activeMode === 'face' ? 'Receive with Face' : 'Send Payment'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X size={24} className="text-stone-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {activeMode === 'face' ? (
            // Receive with Face
            <>
              {/* Scanning Viewfinder */}
              <div className="relative w-full aspect-square bg-gradient-to-b from-amber-50 to-stone-50 rounded-3xl border-2 border-amber-200 overflow-hidden flex items-center justify-center mb-4">
                {!isScanning ? (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      <div className="absolute inset-0 border-2 border-amber-600 rounded-full opacity-30 animate-pulse" />
                      <div className="absolute inset-2 border-2 border-amber-600 rounded-full opacity-20" />
                    </div>
                    <p className="text-stone-600 font-medium">Face Recognition Ready</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      <div className="absolute inset-0 border-2 border-amber-500 rounded-full animate-pulse" />
                      <div className="absolute inset-0 rounded-full bg-amber-500 opacity-10 animate-ping" />
                    </div>
                    <p className="text-amber-600 font-semibold">Scanning Face...</p>
                  </div>
                )}
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  Amount to Request
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              {/* Buttons */}
              <button
                onClick={() => setIsScanning(!isScanning)}
                className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-2xl font-semibold transition-colors"
              >
                {isScanning ? 'Cancel Scan' : 'Start Face Recognition'}
              </button>

              <button
                onClick={() => alert('Face payment request sent!')}
                disabled={!isScanning}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-semibold transition-colors"
              >
                Process Face Payment
              </button>
            </>
          ) : (
            // Send Payment (Mobile Number or Radix ID)
            <>
              {/* Mode Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveMode('mobile')}
                  className={`flex-1 py-2 rounded-2xl font-semibold transition-colors ${
                    activeMode === 'mobile'
                      ? 'bg-amber-500 text-white'
                      : 'bg-stone-100 text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  Mobile Number
                </button>
                <button
                  onClick={() => setActiveMode('radix-id')}
                  className={`flex-1 py-2 rounded-2xl font-semibold transition-colors ${
                    activeMode === 'radix-id'
                      ? 'bg-amber-500 text-white'
                      : 'bg-stone-100 text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  Radix ID
                </button>
              </div>

              {/* Target Input */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  {activeMode === 'mobile' ? 'Mobile Number' : 'Radix ID'}
                </label>
                <input
                  type="text"
                  placeholder={activeMode === 'mobile' ? '+91 98765 43210' : 'john.radix'}
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              {/* Remark Input */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  Remark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Lunch payment"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              {/* PIN Input */}
              <div>
                <label className="block text-sm font-medium text-stone-900 mb-2">
                  4-Digit PIN
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    placeholder="••••"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-stone-900 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 pr-10"
                  />
                  <button
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700"
                  >
                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={() => alert('Payment processed!')}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-semibold transition-colors mt-2"
              >
                Confirm Payment
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
