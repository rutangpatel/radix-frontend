'use client';

import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { TransactionDetail } from './transaction-detail';
import { transactionService } from '@/lib/api/services';
import { getUserIdentifier } from '@/lib/auth-utils';
import { getInitials } from '@/lib/utils';
import { UserAvatar } from './user-avatar';

function TransactionItem({ txn, onClick }: { txn: any, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors text-left gap-2"
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
          <p className="text-xs text-slate-500">{txn.dateTime || txn.time}</p>
        </div>
      </div>
    </button>
  );
}

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
            const d = new Date(t.time);
            if (!isNaN(d.getTime())) {
              const dd = String(d.getDate()).padStart(2, '0');
              const mm = String(d.getMonth() + 1).padStart(2, '0');
              const yyyy = d.getFullYear();
              dTime = `${dd}-${mm}-${yyyy} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            }
          }

          const photoUrl = t.profile_photo || '';
          const isValidPhoto = photoUrl.startsWith('http') || photoUrl.startsWith('data:') || photoUrl.startsWith('blob:') || photoUrl.startsWith('/');
          const realName = isValidPhoto ? displayName : (photoUrl || displayName);
          
          return {
            id: t.transaction_id,
            fromId: t.from_id,
            toId: t.to_id,
            amount: t.amount,
            type: isReceived ? 'received' : 'sent',
            remark: t.remark || 'Transfer',
            dateTime: dTime,
            fromName: realName,
            fromAvatar: realName.charAt(0).toUpperCase(),
            profilePhoto: isValidPhoto ? photoUrl : null,
          };
        });
        setTransactions(mapped);
      } catch (error) {
        // Silently handle error (e.g. backend 500 resulting in CORS network failure) 
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
