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
    dateTime: string;
    fromName: string;
    fromAvatar: string;
  };
  onClose: () => void;
}

export function TransactionDetail({ transaction, onClose }: TransactionDetailProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end z-50 rounded-3xl p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-6 mx-auto max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">Transaction Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-900" />
          </button>
        </div>

        {/* Amount Display */}
        <div className="text-center py-4 border-y border-slate-100">
          <p className={`text-3xl font-bold ${transaction.type === 'received' ? 'text-green-600' : 'text-slate-900'}`}>
            {transaction.type === 'received' ? '+' : '−'}₹{transaction.amount.toLocaleString()}
          </p>
          <p className="text-sm text-slate-500 mt-2">{transaction.remark}</p>
        </div>

        {/* Details Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-600 text-sm">Transaction ID</span>
            <span className="font-semibold text-slate-900">{transaction.id}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-600 text-sm">From ID</span>
            <span className="font-semibold text-slate-900">{transaction.fromId}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-600 text-sm">To ID</span>
            <span className="font-semibold text-slate-900">{transaction.toId}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-600 text-sm">Date & Time</span>
            <span className="font-semibold text-slate-900">{transaction.dateTime}</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-900">
              {transaction.fromAvatar}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{transaction.fromName}</p>
              <p className="text-xs text-slate-500">{transaction.fromId}</p>
            </div>
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
