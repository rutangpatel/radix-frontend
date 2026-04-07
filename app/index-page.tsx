'use client';

import Link from 'next/link';
import { Lock, Home } from 'lucide-react';

export default function IndexPage() {
  return (
    <div className="bg-slate-50 min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 sm:py-12 text-center border-b border-slate-100">
            <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Radix</h1>
            <p className="text-slate-600">Secure Digital Wallet</p>
          </div>

          {/* Content */}
          <div className="px-6 py-8 space-y-4">
            <p className="text-center text-slate-600 text-sm mb-6">
              Choose a demo to explore:
            </p>

            <Link
              href="/auth"
              className="block w-full p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors text-center"
            >
              <Lock className="w-5 h-5 inline mr-2" />
              Authentication Flow
            </Link>

            <Link
              href="/"
              className="block w-full p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors text-center"
            >
              <Home className="w-5 h-5 inline mr-2" />
              Main App
            </Link>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
            Radix Fintech Payment Application
          </div>
        </div>
      </div>
    </div>
  );
}
