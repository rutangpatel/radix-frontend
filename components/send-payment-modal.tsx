'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface SendPaymentModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'mobile' | 'radix-id';
  onProceedToPay: (target: string, amount: string, remark: string) => void;
}

export function SendPaymentModal({ open, onClose, mode, onProceedToPay }: SendPaymentModalProps) {
  const [target, setTarget] = useState('');
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');

  const handleProceed = () => {
    if (!target || !amount) {
      alert('Please fill in all required fields');
      return;
    }
    onProceedToPay(target, amount, remark);
    setTarget('');
    setAmount('');
    setRemark('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end z-50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-slate-900">
            Send {mode === 'mobile' ? 'via Mobile' : 'via Radix ID'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-900" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Target Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {mode === 'mobile' ? 'Mobile Number' : 'Radix ID'}
            </label>
            <input
              type="text"
              placeholder={mode === 'mobile' ? '+91 98765 43210' : 'john.radix'}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Amount *
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Remark Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Remark (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Lunch payment"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-colors mt-6"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
}
