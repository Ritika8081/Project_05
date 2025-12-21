'use client';

import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 py-4 sm:py-6 overflow-y-auto overflow-x-hidden pb-20 sm:pb-24">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 via-rose-600 to-orange-600 bg-clip-text text-transparent mb-1 sm:mb-2">
            Emotional <span className="text-red-400">Mirror</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-orange-900/70 font-medium leading-relaxed">
            Understand yourself first.
            <br />
            Relationships change naturally after that.
          </p>
        </div>

        <div className="bg-gradient-to-br from-white/80 to-orange-50/80 rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-orange-200/50 w-full max-w-sm md:max-w-md">
          <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl sm:text-2xl flex-shrink-0">🪞</span>
              <div className="text-left">
                <h2 className="font-semibold text-orange-900 text-xs sm:text-sm mb-0.5 sm:mb-1">See Your Patterns</h2>
                <p className="text-orange-800/70 text-xs leading-snug">
                  Recognize emotional habits before blaming others.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-xl sm:text-2xl flex-shrink-0">💭</span>
              <div className="text-left">
                <h2 className="font-semibold text-orange-900 text-xs sm:text-sm mb-0.5 sm:mb-1">Daily Check-Ins</h2>
                <p className="text-orange-800/70 text-xs leading-snug">
                  One tap per day. No judgment. Just awareness.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-xl sm:text-2xl flex-shrink-0">🤝</span>
              <div className="text-left">
                <h2 className="font-semibold text-orange-900 text-xs sm:text-sm mb-0.5 sm:mb-1">Own Your Growth</h2>
                <p className="text-orange-800/70 text-xs leading-snug">
                  Understanding creates healthier relationships.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-100/60 to-orange-100/60 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-5 sm:mb-6 border border-rose-200/50">
            <p className="text-orange-900/80 text-xs italic font-medium text-center">
              "Awareness creates choice."
            </p>
          </div>

          <Link
            href="/check-in"
            className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl inline-block text-center text-xs sm:text-sm active:scale-95"
          >
            Start Your Check-In
          </Link>
        </div>

        <p className="text-orange-800/60 text-xs max-w-xs text-center mt-4 sm:mt-6 px-2">
          💚 All data stays on your device. No tracking, no accounts.
        </p>
      </main>
      <NavBar currentPath="/" />
    </div>
  );
}
