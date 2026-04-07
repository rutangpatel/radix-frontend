'use client';

import { ChevronRight, ArrowDown, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TransactionDetail } from './transaction-detail';
import { transactionService } from '@/lib/api/services';

interface Transaction {
  id: string;
  fromId: string;
  toId: string;
  amount: number;
  type: 'received' | 'sent';
  remark: string;
  dateTime: string;
  fromName: string;
  fromAvatar: string;
}

export function RecentActivity() {
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await transactionService.getRecentActivity();
        // Assuming current user context allows us to map to 'sent' | 'received' later
        // for now mapping roughly based on the response array
        const mapped = data.map((t: any) => ({
          id: t.transaction_id,
          fromId: t.from_id,
          toId: t.to_id,
          amount: t.amount,
          type: 'received', // Placeholder, depends on actual check with user ID
          remark: t.remark || 'Transfer',
          dateTime: t.time,
          fromName: t.from_id, // Or map to a user name
          fromAvatar: 'U', // Profile initials fallback
        }));
        setTransactions(mapped);
      } catch (error) {
        console.error('Failed to fetch activity:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivity();
  }, []);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Recent Activity</h3>
      <div className="space-y-2">
        {isLoading ? (
          <div className="text-center p-4 text-sm text-slate-500">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center p-4 text-sm text-slate-500">No activity yet</div>
        ) : (
          transactions.map((txn) => (
            <button
              key={txn.id}
              onClick={() => setSelectedTxn(txn)}
              className="w-full flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-left gap-2"
            >
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${
                  txn.type === 'received' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {txn.type === 'received' ? (
                    <ArrowDown size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <ArrowUp size={18} className="sm:w-5 sm:h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">{txn.fromName}</p>
                  <p className="text-xs text-slate-500 truncate">{txn.remark}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <p className={`font-bold text-sm sm:text-base ${txn.type === 'received' ? 'text-green-600' : 'text-slate-900'}`}>
                    {txn.type === 'received' ? '+' : '−'}₹{txn.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">{txn.dateTime}</p>
                </div>
                <ChevronRight size={16} className="text-slate-400 sm:w-4.5 sm:h-4.5" />
              </div>
            </button>
          ))
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTxn && (
        <TransactionDetail 
          transaction={selectedTxn} 
          onClose={() => setSelectedTxn(null)}
        />
      )}
    </div>
  );
}
