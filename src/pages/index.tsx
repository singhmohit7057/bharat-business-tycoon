// pages/index.tsx
'use client';
import React, { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { MousePointerClick } from 'lucide-react'; // assuming you’re using Lucide icons

export default function HomePage() {
  const balance = useGameStore((state) => state.balance);
  const updateBalance = useGameStore((state) => state.updateBalance);
  const earnIncome = useGameStore((state) => state.earnIncome);

  const earningPerClick = 10000000000000000000;

  const handleClick = () => {
    updateBalance(earningPerClick);
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">🏢 Bharat Business Tycoon</h1>

      {/* Balance Display */}
      <div className="text-center bg-white p-4 rounded-xl shadow mb-4">
        <h2 className="text-lg font-semibold text-gray-700">💰 Your Balance</h2>
        <p className="text-2xl text-green-600 font-bold mt-1">
          ₹{balance.toLocaleString()}
        </p>
      </div>

      {/* Collect Button */}
      <button
        onClick={earnIncome}
        className="btn w-full mb-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold text-sm py-3 rounded-xl shadow-md"
      >
        📈 Collect Business Income
      </button>

      {/* Earnings Rate */}
      <div className="bg-white text-black rounded-xl w-full max-w-md p-4 mb-4 flex justify-between items-center mx-auto">
        <div>
          <div className="text-sm text-gray-500">₹{earningPerClick} per click</div>
        </div>
      </div>

      {/* Click Area */}
      <div
        onClick={handleClick}
        className="flex flex-col items-center mt-10 cursor-pointer active:scale-95 transition-transform"
      >
        <MousePointerClick className="w-12 h-12 mb-2 text-green-600" />
        <p className="text-center text-lg text-gray-700">Click in this area to earn money</p>
      </div>
    </div>
  );
}
