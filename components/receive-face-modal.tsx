'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ReceiveFaceModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReceiveFaceModal({ open, onClose }: ReceiveFaceModalProps) {
  const [amount, setAmount] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const handleProcess = () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }
    alert(`Received ₹${amount} via Face Recognition!`);
    setAmount('');
    setIsScanning(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-slate-900">Receive with Face</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Scanning Viewfinder */}
          <div className="relative w-full aspect-square bg-gradient-to-b from-blue-50 to-slate-50 rounded-3xl border-2 border-blue-200 overflow-hidden flex items-center justify-center mb-4">
            {!isScanning ? (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-2 border-blue-600 rounded-full opacity-30 animate-pulse" />
                  <div className="absolute inset-2 border-2 border-blue-600 rounded-full opacity-20" />
                </div>
                <p className="text-slate-600 font-medium">Face Recognition Ready</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-2 border-green-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-green-500 opacity-10 animate-ping" />
                </div>
                <p className="text-green-600 font-semibold">Scanning Face...</p>
              </div>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Amount to Request *
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Scan Toggle Button */}
          <button
            onClick={() => setIsScanning(!isScanning)}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-semibold transition-colors"
          >
            {isScanning ? 'Cancel Scan' : 'Start Face Scan'}
          </button>

          {/* Process Button */}
          <button
            onClick={handleProcess}
            disabled={!isScanning}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-semibold transition-colors"
          >
            Process Face Payment
          </button>
        </div>
      </div>
    </div>
  );
}
