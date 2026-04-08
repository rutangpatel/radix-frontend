'use client';

import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TransactionDetail } from './transaction-detail';
import { transactionService } from '@/lib/api/services';
import { getUserIdentifier } from '@/lib/auth-utils';
import { getInitials } from '@/lib/utils';
import { UserAvatar } from './user-avatar';

function HistoryItem({ txn, onClick }: { txn: any, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 sm:p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors text-left gap-2"
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <UserAvatar src={txn.profilePhoto} name={txn.fromName} className="w-10 h-10 text-sm" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">{txn.fromName}</p>
          <p className="text-xs text-slate-500 truncate">{txn.remark}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="text-right">
          <p className={`font-bold text-sm sm:text-base ${txn.type === 'received' ? 'text-green-600' : 'text-slate-900'}`}>
            {txn.type === 'received' ? '+' : '−'}₹{txn.amount.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">{txn.time}</p>
        </div>
      </div>
    </button>
  );
}

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
  profilePhoto?: string | null;
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
          let dateStr = 'Unknown';
          let timeStr = 'Unknown';
          
          if (t.time) {
            const d = new Date(t.time);
            if (!isNaN(d.getTime())) {
              const dd = String(d.getDate()).padStart(2, '0');
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const yyyy = d.getFullYear();
              dateStr = `${dd}-${mm}-${yyyy}`;
              timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
              dateStr = t.time;
              timeStr = t.time;
            }
          }
          
          if (!grouped[dateStr]) {
            grouped[dateStr] = [];
          }
          
          const rawUser = getUserIdentifier() || '';
          const currentUser = rawUser.replace('@radix', '').toLowerCase();
          const toId = (t.to_id || '').replace('@radix', '').toLowerCase();
          
          const isReceived = toId === currentUser;
          const displayId = isReceived ? t.from_id : t.to_id;
          const displayName = displayId || 'Unknown';

          const photoUrl = t.profile_photo || '';
          const isValidPhoto = photoUrl.startsWith('http') || photoUrl.startsWith('data:') || photoUrl.startsWith('blob:') || photoUrl.startsWith('/');
          const realName = isValidPhoto ? displayName : (photoUrl || displayName);
          
          grouped[dateStr].push({
            id: t.transaction_id,
            fromId: t.from_id,
            toId: t.to_id,
            fromName: realName,
            fromAvatar: realName.charAt(0).toUpperCase(),
            profilePhoto: isValidPhoto ? photoUrl : null,
            type: isReceived ? 'received' : 'sent',
            amount: t.amount,
            time: timeStr,
            date: dateStr,
            remark: t.remark || 'Transfer'
          });
        });

        setTransactionsMap(grouped);
      } catch (error) {
        // Silently handle error (e.g. backend 500 resulting in CORS network failure) 
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
              <HistoryItem
                key={txn.id}
                txn={txn}
                onClick={() => setSelectedTxn(txn)}
              />
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
