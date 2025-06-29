'use client';
import React from 'react';
import { useGameStore } from '@/store/useGameStore';

export default function ProfilePage() {
  const store = useGameStore();

  const {
    balance,
    ownedCars,
    ownedPlanes,
    ownedShips,
    ownedIslands,
    ownedCoins,
    ownedJewels,
    ownedNfts,
    ownedPaintings,
    ownedRetroCars,
    ownedStamps,
    ownedUnique,
    stockHoldings,
    stockTransactions,
    stableIncomeTxns,
    resetGame,
  } = store;

  const collectiblesCount =
    ownedCoins.length +
    ownedJewels.length +
    ownedPaintings.length +
    ownedRetroCars.length +
    ownedStamps.length +
    ownedUnique.length;

  // 🧮 Total earned from Stable Income
  const totalStableIncome = stableIncomeTxns.reduce((sum, txn) => sum + (txn.type === 'earn' || txn.type.includes('-end') ? txn.interest : 0), 0);

  // 🧮 Total earned from stock trading
  const totalStockEarnings = stockTransactions.reduce((acc, txn) => {
    if (txn.type === 'sell') {
      const { stockId, quantity, price } = txn;
      const avg = store.avgBuyPrices[stockId];
      const avgPrice = avg ? avg.totalCost / avg.totalQty : 0;
      const profit = (price - avgPrice) * quantity;
      return acc + profit;
    }
    return acc;
  }, 0);

  const assets = [
    { label: 'Balance', value: balance, color: 'bg-cyan-500' },
    { label: 'Businesses', value: 8.9e12, color: 'bg-red-200' },
    { label: 'Stable Income', value: totalStableIncome, color: 'bg-yellow-100' },
    { label: 'Stocks', value: totalStockEarnings, color: 'bg-teal-300' },
    { label: 'Real estate', value: 1.3e9, color: 'bg-purple-300' },
    { label: 'Cryptoassets', value: 3734.46, color: 'bg-cyan-500' },
    { label: 'Forex', value: 0, color: 'bg-red-200' },
    { label: 'Collections', value: collectiblesCount, color: 'bg-yellow-100' },
    { label: 'Investment', value: 0, color: 'bg-teal-300' },
    { label: 'Residence', value: 2.3e12, color: 'bg-blue-900 text-white' },
  ];

  const totalFortune = assets.reduce((sum, a) => sum + a.value, 0);

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-2">Profile</h1>
      <p className="text-3xl font-semibold mb-4">
        ₹{(totalFortune / 1e12).toFixed(2)} T
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {assets.map((asset, i) => (
          <div key={i} className={`rounded p-3 ${asset.color}`}>
            <p className="text-sm font-medium">{asset.label}</p>
            <p className="text-lg font-bold">
              {typeof asset.value === 'number' ? (
                asset.value >= 1e12
                  ? `${(asset.value / 1e12).toFixed(1)} T`
                  : asset.value >= 1e9
                  ? `${(asset.value / 1e9).toFixed(1)} B`
                  : asset.value >= 1e6
                  ? `${(asset.value / 1e6).toFixed(1)} M`
                  : asset.value.toLocaleString()
              ) : (
                asset.value
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-teal-400 to-blue-900 text-white rounded-lg p-4">
        <h2 className="text-xl font-bold mb-2">Statistics</h2>
        <p>Cars: {ownedCars.length}</p>
        <p>Aircraft: {ownedPlanes.length}</p>
        <p>Ships/Yachts: {ownedShips.length}</p>
        <p>Islands: {ownedIslands.length}</p>
        <p>Collectibles: {collectiblesCount}</p>
        <p>NFTs: {ownedNfts.length}</p>

        <h3 className="text-white text-lg mt-4">Earned</h3>
        <p>In the clicker: ₹135,500,000</p>
        <p>In business: ₹7,700,000,000,000</p>
        <p>On rent: ₹9,400,000,000</p>
        <p>On dividends: ₹2,000,000,000</p>
        <p>On trading: ₹{totalStockEarnings.toLocaleString('en-IN')}</p>
        <p>From stable income: ₹{totalStableIncome.toLocaleString('en-IN')}</p>
        <p>On crypto trading: ₹3,400,000,000</p>
      </div>

    {/* 🔁 Reset Button */}
      <button
        onClick={resetGame}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg shadow"
      >
        🔁 Reset Game
      </button>

    </div>
  );
}
