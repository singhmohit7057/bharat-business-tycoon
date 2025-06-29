"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const DiamondVault = () => {
  const [showBuyPage, setShowBuyPage] = useState(false);
  const [showSellPage, setShowSellPage] = useState(false);
  const [price, setPrice] = useState(99999);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [ownedCarats, setOwnedCarats] = useState(0);
  const maxCarats = 8000000;

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prev) => {
        const change = Math.floor(Math.random() * 801) - 400;
        const newPrice = Math.max(100, prev + change);
        setPriceHistory((prevHistory) => {
          const updated = [...prevHistory, newPrice];
          return updated.length > 30 ? updated.slice(-30) : updated;
        });
        return newPrice;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBuy = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const quantity = parseInt((form.elements.namedItem("quantity") as HTMLInputElement).value);
    if (!isNaN(quantity) && quantity > 0 && ownedCarats + quantity <= maxCarats) {
      setOwnedCarats((prev) => prev + quantity);
      setShowBuyPage(false);
    }
  };

  const handleSell = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const quantity = parseInt((form.elements.namedItem("quantity") as HTMLInputElement).value);
    if (!isNaN(quantity) && quantity > 0 && ownedCarats >= quantity) {
      setOwnedCarats((prev) => prev - quantity);
      setShowSellPage(false);
    }
  };

  const renderGraph = () => {
    if (priceHistory.length < 2) return <p className="text-center text-gray-500">Graph loading...</p>;
    const min = Math.min(...priceHistory);
    const max = Math.max(...priceHistory);
    return (
      <svg viewBox={`0 0 300 100`} className="w-full h-24 bg-gray-100 rounded">
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          points={priceHistory
            .map((p, i) => `${(i * 10)},${100 - ((p - min) / (max - min + 1e-5)) * 100}`)
            .join(" ")}
        />
      </svg>
    );
  };

  if (showBuyPage) {
    return (
      <div className="min-h-screen bg-white p-4">
        <h2 className="text-xl font-bold mb-4">Buying Diamonds</h2>
        <div className="text-3xl">💎</div>
        <p className="text-lg font-semibold">₹ {price.toLocaleString()}</p>
        <p className="text-red-500 text-sm">Live market price</p>
        {renderGraph()}

        <form onSubmit={handleBuy} className="my-4">
          <label className="block text-sm font-medium mb-1">Quantity:</label>
          <input
            type="number"
            name="quantity"
            placeholder="Enter carats"
            className="w-full border px-3 py-2 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">Available: {maxCarats - ownedCarats} carat</p>
          <button type="submit" className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg">
            Buy
          </button>
        </form>
        <button
          onClick={() => setShowBuyPage(false)}
          className="mt-4 w-full text-blue-600 text-sm"
        >
          ⬅ Back to Vault
        </button>
      </div>
    );
  }

  if (showSellPage) {
    return (
      <div className="min-h-screen bg-white p-4">
        <h2 className="text-xl font-bold mb-4">Selling Diamonds</h2>
        <div className="text-3xl">💎</div>
        <p className="text-lg font-semibold">₹ {price.toLocaleString()}</p>
        <p className="text-green-500 text-sm">Live market price</p>
        {renderGraph()}

        <form onSubmit={handleSell} className="my-4">
          <label className="block text-sm font-medium mb-1">Quantity:</label>
          <input
            type="number"
            name="quantity"
            placeholder="Enter carats"
            className="w-full border px-3 py-2 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">Available: {ownedCarats} carat</p>
          <button type="submit" className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg">
            Sell
          </button>
        </form>
        <button
          onClick={() => setShowSellPage(false)}
          className="mt-4 w-full text-blue-600 text-sm"
        >
          ⬅ Back to Vault
        </button>
      </div>
    );
  }

  const progress = (ownedCarats / maxCarats) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-4">
      <div className="text-sm text-right text-black font-medium mb-2">
        Balance: <span className="font-semibold">₹ 23,90,05,19,74,441.10</span>
      </div>

      <div className="rounded-xl overflow-hidden mb-4">
        <Image
          src="/items/diamond.avif"
          alt="Diamonds"
          width={500}
          height={300}
          className="w-full h-48 object-cover rounded-xl"
        />
      </div>

      <div className="text-center mb-6">
        <div className="text-3xl">💎</div>
        <h2 className="text-xl font-semibold">₹ {(ownedCarats * price).toLocaleString()}</h2>
        <p className="text-green-500 text-sm">+ 0.00% (₹ 0.00)</p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setShowBuyPage(true)}
          className="bg-green-100 text-green-700 font-semibold py-2 px-6 rounded-lg w-32"
        >
          Buy
        </button>
        <button
          onClick={() => setShowSellPage(true)}
          className="bg-red-100 text-red-700 font-semibold py-2 px-6 rounded-lg w-32"
        >
          Sell
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-xl shadow mb-6">
        <h3 className="font-bold text-lg mb-2">Vault Expansion</h3>
        <ul className="text-sm text-gray-700">
          <li className="flex justify-between border-b py-1">
            <span>40,00,000 carat</span>
            <span>₹ 960.0 M</span>
          </li>
          <li className="flex justify-between border-b py-1">
            <span>2,40,00,000 carat</span>
            <span>₹ 9.8 B</span>
          </li>
          <li className="flex justify-between py-1">
            <span>18,00,00,000 carat</span>
            <span>₹ 106.2 B</span>
          </li>
        </ul>
        <p className="text-xs text-right mt-2 text-gray-500">
          Max vault capacity: 1,80,00,00,000 carat
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Vault visualization</h3>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-1">
          <div className="bg-blue-500 h-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-sm text-center text-gray-600">
          {progress.toFixed(2)}% ({ownedCarats.toLocaleString()} of {maxCarats.toLocaleString()} carat)
        </p>
      </div>
    </div>
  );
};

export default DiamondVault;
