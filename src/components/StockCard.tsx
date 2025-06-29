import React from 'react';
import Link from 'next/link';

interface StockCardProps {
  name: string;
  logo: string;
  price: number;
  change: number;
  available?: boolean;
}

export default function StockCard({
  name,
  logo,
  price,
  change,
  available = true,
}: StockCardProps) {
  return (
    <Link href={`/stocks/${name.toLowerCase()}`}>
      <div className="flex justify-between items-center p-4 rounded-xl bg-white shadow-sm mb-3 hover:bg-gray-50 cursor-pointer transition">
        {/* Left: Logo + Name */}
        <div className="flex items-center gap-3">
          <img src={logo} alt={name} className="h-9 w-9 rounded-full object-contain" />
          <div>
            <h3 className="font-semibold text-gray-800">{name}</h3>
            <p className="text-xs text-gray-500">{available ? 'Available' : 'Unavailable'}</p>
          </div>
        </div>

        {/* Right: Price + Change */}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">₹ {price.toFixed(2)}</p>
          <p className={`text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '+' : '-'} ₹ {Math.abs(change).toFixed(2)} ({((change / price) * 100).toFixed(2)}%)
          </p>
        </div>
      </div>
    </Link>
  );
}
