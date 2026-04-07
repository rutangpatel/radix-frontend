'use client';

import { X } from 'lucide-react';

interface TransactionDetailProps {
  transaction: {
    id: string;
    fromId: string;
    toId: string;
    amount: number;
    type: 'received' | 'sent';
    remark: string;
    dateTime?: string;
    time?: string;
    date?: string;
    fromName: string;
    fromAvatar: string;
    profilePhoto?: string | null;
  };
  onClose: () => void;
}

export function TransactionDetail({ transaction, onClose }: TransactionDetailProps) {
  const displayId = transaction.fromName;

  return (
    <div className="fixed inset-0 z-50 max-w-md mx-auto bg-white/40 backdrop-blur-sm flex items-end sm:items-center p-4">
      <div className="w-full bg-white rounded-3xl p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 shrink-0">
              <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-lg overflow-hidden ${
                transaction.profilePhoto ? 'bg-slate-100' : transaction.type === 'received' ? 'bg-blue-100 text-blue-900' : 'bg-slate-200 text-slate-700'
              }`}>
                {transaction.profilePhoto ? (
                  <img src={transaction.profilePhoto} alt="User Profile" className="w-full h-full object-cover" />
                ) : (
                  transaction.fromAvatar
                )}
              </div>
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-lg">{displayId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors self-start"
          >
            <X size={24} className="text-slate-900" />
          </button>
        </div>

        {/* Amount Display */}
        <div className="text-center py-2">
          <p className={`text-3xl font-bold ${transaction.type === 'received' ? 'text-green-600' : 'text-slate-900'}`}>
            {transaction.type === 'received' ? '+' : '−'}₹{transaction.amount.toLocaleString()}
          </p>
          <p className="text-sm text-slate-500 mt-2 bg-slate-50 rounded-lg p-2 inline-block">{transaction.remark}</p>
        </div>

        {/* Details Grid */}
        <div className="space-y-4 bg-slate-50 p-4 rounded-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-slate-600 text-sm">Transaction ID</span>
            <span className="font-semibold text-slate-900 text-right max-w-xs truncate">{transaction.id}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-slate-600 text-sm">Date & Time</span>
            <span className="font-semibold text-slate-900">{transaction.dateTime || `${transaction.date} ${transaction.time}`}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-600 text-sm">Type</span>
            <span className="font-semibold text-slate-900 capitalize">{transaction.type}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl font-semibold text-slate-900 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
