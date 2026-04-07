'use client';

import { ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TransactionDetail } from './transaction-detail';
import { transactionService } from '@/lib/api/services';

interface HistoryTransaction {
  id: string;
  fromId: string;
  toId: string;
  fromName: string;
  fromAvatar: string;
  type: 'sent' | 'received';
  amount: number;
  time: string;
  date: string;
  remark: string;
}

export function HistoryTab() {
  const [selectedTxn, setSelectedTxn] = useState<HistoryTransaction | null>(null);
  const [transactionsMap, setTransactionsMap] = useState<{ [key: string]: HistoryTransaction[] }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await transactionService.getHistory();
        
        // Map and Group transactions
        const grouped: { [key: string]: HistoryTransaction[] } = {};
        
        data.forEach((t: any) => {
          const dtParts = t.time?.split(' ') || ['Unknown', ''];
          const dateStr = dtParts[0]; 
          const timeStr = dtParts[1] || t.time;
          
          if (!grouped[dateStr]) {
            grouped[dateStr] = [];
          }
          
          grouped[dateStr].push({
            id: t.transaction_id,
            fromId: t.from_id,
            toId: t.to_id,
            fromName: t.from_id, // Placeholder, map actual name if provided
            fromAvatar: 'U',
            type: 'received', // Placeholder, depends on user ID Context
            amount: t.amount,
            time: timeStr,
            date: dateStr,
            remark: t.remark || 'Transfer'
          });
        });

        setTransactionsMap(grouped);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  return (
    <div className="pb-8">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Transaction History</h1>

      {isLoading ? (
        <div className="text-center p-8 text-slate-500">Loading history...</div>
      ) : Object.keys(transactionsMap).length === 0 ? (
        <div className="text-center p-8 text-slate-500">No transactions found.</div>
      ) : (
        Object.entries(transactionsMap).map(([dateLabel, transactions]) => (
        <div key={dateLabel} className="mb-5 sm:mb-6">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-600 mb-2 sm:mb-3">{dateLabel}</h3>
          <div className="space-y-2">
            {transactions.map((txn) => (
              <button
                key={txn.id}
                onClick={() => setSelectedTxn(txn)}
                className="w-full flex items-center justify-between p-3 sm:p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors text-left gap-2"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0 ${
                    txn.type === 'received'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {txn.type === 'received' ? (
                      <ArrowDown size={20} />
                    ) : (
                      <ArrowUp size={20} />
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
                    <p className="text-xs text-slate-500">{txn.time}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 sm:w-4.5 sm:h-4.5 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )))}

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
