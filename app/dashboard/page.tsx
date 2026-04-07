'use client';

import { useState } from 'react';
import { HomeTab } from '@/components/home-tab';
import { HistoryTab } from '@/components/history-tab';
import { ProfileTab } from '@/components/profile-tab';
import { BottomNav } from '@/components/bottom-nav';
import { SendPaymentModal } from '@/components/send-payment-modal';
import { PinVerificationModal } from '@/components/pin-verification-modal';
import { ReceiveFaceModal } from '@/components/receive-face-modal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'profile'>('home');
  const [sendPaymentOpen, setSendPaymentOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'mobile' | 'radix-id'>('mobile');
  const [pinVerificationOpen, setPinVerificationOpen] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<{ target: string; amount: string; remark: string } | null>(null);
  const [receiveFaceOpen, setReceiveFaceOpen] = useState(false);

  const handlePayMobile = () => {
    setPaymentMode('mobile');
    setSendPaymentOpen(true);
  };

  const handlePayRadixId = () => {
    setPaymentMode('radix-id');
    setSendPaymentOpen(true);
  };

  const handleProceedToPay = (target: string, amount: string, remark: string) => {
    setPendingPayment({ target, amount, remark });
    setSendPaymentOpen(false);
    setPinVerificationOpen(true);
  };

  const handleConfirmPin = () => {
    setPinVerificationOpen(false);
    setPendingPayment(null);
    alert('Payment successful!');
  };

  const handleReceiveFace = () => {
    setReceiveFaceOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen w-full">
      {/* Responsive Container */}
      <div className="w-full h-screen max-w-md mx-auto bg-white flex flex-col overflow-hidden lg:rounded-3xl lg:shadow-2xl lg:h-[90vh] lg:my-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 z-20">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Radix</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-20 sm:pb-24">
          {activeTab === 'home' && (
            <HomeTab 
              onPayMobile={handlePayMobile}
              onPayRadixId={handlePayRadixId}
              onReceiveFace={handleReceiveFace}
            />
          )}
          {activeTab === 'history' && <HistoryTab />}
          {activeTab === 'profile' && <ProfileTab />}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Send Payment Modal */}
      <SendPaymentModal
        open={sendPaymentOpen}
        onClose={() => setSendPaymentOpen(false)}
        mode={paymentMode}
        onProceedToPay={handleProceedToPay}
      />

      {/* PIN Verification Modal */}
      <PinVerificationModal
        open={pinVerificationOpen}
        onClose={() => {
          setPinVerificationOpen(false);
          setPendingPayment(null);
        }}
        payment={pendingPayment}
        onConfirm={handleConfirmPin}
      />

      {/* Receive with Face Modal */}
      <ReceiveFaceModal
        open={receiveFaceOpen}
        onClose={() => setReceiveFaceOpen(false)}
      />
    </div>
  );
}
