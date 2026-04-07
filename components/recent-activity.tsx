'use client';

import { ChevronRight, ArrowDown, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TransactionDetail } from './transaction-detail';
import { transactionService } from '@/lib/api/services';

function TransactionItem({ txn, onClick }: { txn: any, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-left gap-2"
    >
      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold overflow-hidden ${
          txn.profilePhoto ? 'bg-slate-100' : txn.type === 'received' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-700'
        }`}>
          {txn.profilePhoto ? (
            <img src={txn.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : txn.type === 'received' ? (
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
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="text-right">
          <p className={`font-bold text-sm sm:text-base ${txn.type === 'received' ? 'text-green-600' : 'text-slate-900'}`}>
            {txn.type === 'received' ? '+' : '−'}₹{txn.amount.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">{txn.dateTime || txn.time}</p>
        </div>
      </div>
    </button>
  );
}
import { getUserIdentifier } from '@/lib/auth-utils';

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
  profilePhoto?: string | null;
}

export function RecentActivity() {
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await transactionService.getRecentActivity();
        const rawUser = getUserIdentifier() || '';
        const currentUser = rawUser.replace('@radix', '').toLowerCase();
        
        const mapped = data.map((t: any) => {
          const toId = (t.to_id || '').replace('@radix', '').toLowerCase();
          const isReceived = toId === currentUser;
          const displayId = isReceived ? t.from_id : t.to_id;
          const displayName = displayId || 'Unknown';
          
          let dTime = t.time || 'Unknown';
          if (t.time) {
            try {
              const d = new Date(t.time);
              if (!isNaN(d.getTime())) {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');
                dTime = `${year}-${month}-${day} ${hours}:${minutes}`;
              }
            } catch (e) {
              // fallback
            }
          }
          
          return {
            id: t.transaction_id,
            fromId: t.from_id,
            toId: t.to_id,
            amount: t.amount,
            type: isReceived ? 'received' : 'sent',
            remark: t.remark || 'Transfer',
            dateTime: dTime,
            fromName: displayName,
            fromAvatar: displayName.charAt(0).toUpperCase(),
            profilePhoto: t.profile_photo,
          };
        });
        setTransactions(mapped);
      } catch (error: any) {
        // silently handled network error
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
            <TransactionItem
              key={txn.id}
              txn={txn}
              onClick={() => setSelectedTxn(txn)}
            />
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
