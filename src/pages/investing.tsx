// src/pages/investing/index.tsx
import React from 'react';
import Link from 'next/link';

const tabs = [
  { id: 'stable-income', label: 'Stable Income' },
  { id: 'buy-shares', label: 'Buy Shares' },
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'crypto', label: 'Buy Crypto' },
  { id: 'us-stocks', label: 'US Stocks' },
  { id: 'forex', label: 'Forex Trading' },
];

export default function InvestingIndex() {
  return (
    <div className="min-h-screen bg-[#f9fafb] px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">📊 Investment Options</h1>

      {/* Grid Box Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/investing/${tab.id}`}
            className="block rounded-xl bg-white border border-gray-300 shadow-sm hover:shadow-md transition p-6 text-center text-gray-700 font-medium hover:bg-blue-50"
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Instruction Message */}
      <p className="text-gray-600 text-center">
        Choose an investment type to explore and start investing.
      </p>
    </div>
  );
}
