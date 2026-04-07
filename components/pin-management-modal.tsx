'use client';

import { useState } from 'react';
import { X, KeyRound, Lock } from 'lucide-react';
import { userService } from '@/lib/api/services';
import { useToast } from '@/hooks/use-toast';

interface PinManagementModalProps {
  onClose: () => void;
}

type TabType = 'change' | 'forgot';

export function PinManagementModal({ onClose }: PinManagementModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('change');
  const { toast } = useToast();
  
  // Change PIN State
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  
  // Forgot PIN State
  const [password, setPassword] = useState('');
  const [resetNewPin, setResetNewPin] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (activeTab === 'change') {
        await userService.updatePin({ old_pin: oldPin, new_pin: newPin });
        toast({
          title: "PIN Updated",
          description: "Your PIN has been changed successfully.",
        });
      } else {
        await userService.forgotPin({ password: password, new_pin: resetNewPin });
        toast({
          title: "PIN Reset Successful",
          description: "Your PIN has been reset successfully.",
        });
      }
      onClose();
    } catch (error: any) {
      console.error('Failed to save new PIN', error);
      toast({
        title: "Failed to Update PIN",
        description: error.message || "An error occurred while updating your PIN.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full sm:max-w-sm bg-white sm:rounded-3xl rounded-t-3xl shadow-xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">PIN Management</h2>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab('change')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'change' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Change PIN
            </button>
            <button
              onClick={() => setActiveTab('forgot')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'forgot' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Forgot PIN
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'change' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Old PIN</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={oldPin}
                      onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 4-digit old PIN"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-widest text-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New PIN</label>
                  <div className="relative flex items-center">
                    <KeyRound className="absolute left-3 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 4-digit new PIN"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-widest text-lg"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Account Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your account password"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">New PIN</label>
                  <div className="relative flex items-center">
                    <KeyRound className="absolute left-3 w-5 h-5 text-slate-400" />
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={resetNewPin}
                      onChange={(e) => setResetNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 4-digit new PIN"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all tracking-widest text-lg"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={
                  isLoading || 
                  (activeTab === 'change' ? oldPin.length !== 4 || newPin.length !== 4 : !password || resetNewPin.length !== 4)
                }
                className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-2xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Saving...' : 'Save New PIN'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}