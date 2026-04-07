'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { userService } from '@/lib/api/services';
import { getUserIdentifier } from '@/lib/auth-utils';

export function BalanceCard() {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string>('radix.user');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Mount phase: Set actual user ID
    const actualId = getUserIdentifier();
    if (actualId) {
      setUserId(actualId);
    }
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await userService.getBalance();
        setBalance(data.amount);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBalance();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 to-blue-700 p-6 sm:p-8 text-white shadow-lg">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full transform translate-x-16 -translate-y-8"></div>
      </div>

      {/* Content */}
      <div className="relative space-y-8">
        <div>
          <p className="text-sm font-medium opacity-90 mb-2">Total Balance</p>
          <h3 className="text-3xl sm:text-4xl font-bold">
            {isLoading ? '...' : `₹${balance?.toLocaleString() ?? '0'}`}
          </h3>
        </div>

        {/* Radix ID */}
        <div className="pt-4 border-t border-white border-opacity-30">
          <p className="text-xs opacity-75 mb-2">Radix ID</p>
          <button 
            onClick={() => {
              navigator.clipboard.writeText(userId);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="group flex items-center gap-2 text-lg sm:text-xl font-semibold hover:bg-white/10 px-2 py-1 -ml-2 rounded-lg transition-colors cursor-pointer"
            aria-label="Copy Radix ID"
          >
            <span className="truncate">{userId}</span>
            {copied ? (
              <Check size={18} className="text-green-400 shrink-0" />
            ) : (
              <Copy size={18} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
