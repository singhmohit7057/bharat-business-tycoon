"use client";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import { useLiveStocks } from "@/hooks/useLiveStocks";
import { useGameStore } from "@/store/useGameStore";
import { LineChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, DotProps } from "recharts";

export default function BuySharesPage() {
  const stocks = useLiveStocks();
  const [activeTab, setActiveTab] = useState<"market" | "portfolio" | "history">("market");
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const buyStock = useGameStore((state) => state.buyStock);
  const sellStock = useGameStore((state) => state.sellStock);
  const portfolio = useGameStore((state) => state.stockHoldings);
  const balance = useGameStore((state) => state.balance);
  const transactions = useGameStore((state) => state.stockTransactions);
  const avgBuyPrices = useGameStore((state) => state.avgBuyPrices);
  const availableSharesMap = useGameStore((state) => state.availableShares);
  const earnDividends = useGameStore((state) => state.earnDividends);

  const selectedStock = stocks.find((s) => s.id === selectedStockId) || null;
  const availableShares = selectedStock
    ? Number.isFinite(availableSharesMap[selectedStock.id])
      ? availableSharesMap[selectedStock.id]
      : selectedStock.availableShares ?? 0
    : 0;

  const stockPriceHistory = useGameStore((state) => state.stockPriceHistory);

  const historyFromStore = useMemo(() => {
    if (!selectedStock) return [];
    const history = stockPriceHistory[selectedStock.id] || [];
    return history.map((entry) => ({
      time: new Date(entry.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      price: entry.price,
    }));
  }, [selectedStock, stockPriceHistory]);

  // Set live stocks when they change
  useEffect(() => {
    useGameStore.getState().setLiveStocks?.(stocks);
  }, [stocks]);

  // Auto trigger dividend every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      earnDividends();
    }, 5000); // 5 sec
    return () => clearInterval(interval);
  }, [earnDividends]);

  const handleBuy = (stock: (typeof stocks)[0]) => {
    const actualAvailable = availableSharesMap[stock.id] ?? stock.availableShares;
    const clampedQty = Math.min(Math.max(1, quantity), actualAvailable);
    const cost = clampedQty * stock.price;

    if (clampedQty > actualAvailable) {
      alert(`Only ${actualAvailable} share(s) available to buy.`);
      return;
    }

    if (balance < cost) {
      alert("Insufficient balance!");
      return;
    }

    buyStock(stock.id, clampedQty, stock.price, stock.name);
    alert(`You bought ${clampedQty} share(s) of ${stock.name}`);
    setQuantity(1);
  };

  const handleSell = (stock: (typeof stocks)[0]) => {
    const sellQty = Math.max(1, quantity);
    const ownedQty = portfolio[stock.id] || 0;

    if (sellQty > ownedQty) {
      alert(`You only own ${ownedQty} share(s) of ${stock.name}`);
      return;
    }

    sellStock(stock.id, sellQty, stock.price, stock.name);
    alert(`You sold ${sellQty} share(s) of ${stock.name}`);
    setQuantity(1);
  };

  const totalPL = transactions.reduce((acc, txn) => {
    if (txn.type === "sell") {
      const avg = avgBuyPrices[txn.stockId];
      if (!avg || avg.totalQty === 0) return acc;
      const avgPrice = avg.totalCost / avg.totalQty;
      return acc + (txn.price - avgPrice) * txn.quantity;
    }
    if (txn.type === "dividend") {
      return acc + txn.price;
    }
    return acc;
  }, 0);

  const tabs = [
    { id: "market", label: "📈 Buy Shares" },
    { id: "portfolio", label: "💼 My Portfolio" },
    { id: "history", label: "📊 P/L Statement" },
  ];

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 pb-20">
      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as typeof activeTab);
              setSelectedStockId(null);
            }}
            className={`flex-1 px-4 py-2 text-sm rounded-full font-medium ${
              activeTab === tab.id ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Market View */}
      {activeTab === "market" && !selectedStock && (
        <>
          <Link href="/investing" className="inline-block mb-4 text-blue-600 hover:underline text-sm font-medium">
            ← Back to Investment Options
          </Link>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Stock Market</h2>
          <div className="grid gap-4">
            {stocks.map((stock) => (
              <div
                key={stock.id}
                onClick={() => setSelectedStockId(stock.id)}
                className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-blue-50 transition"
              >
                <div className="flex items-center gap-4">
                  <img src={stock.logo} alt={stock.name} className="h-10 w-10 object-contain" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{stock.name}</p>
                    <p className="text-sm text-gray-500">₹{stock.price.toFixed(2)}</p>
                  </div>
                  <p className={`text-sm font-medium ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {stock.change >= 0 ? "+" : "-"}₹{Math.abs(stock.change).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Buy UI */}
      {activeTab === "market" && selectedStock && (
        <>
          <button onClick={() => setSelectedStockId(null)} className="text-sm text-gray-500 mb-2">
            ← Back to list
          </button>

          <div className="flex flex-col items-center mb-4">
            <img
              src={selectedStock.logo}
              alt={selectedStock.name}
              className="h-16 w-16 rounded-full object-contain mb-2"
            />
            <h1 className="text-2xl font-bold text-gray-800">{selectedStock.name}</h1>
            <p className="text-sm text-gray-500 mt-1">₹{selectedStock.price.toFixed(2)}</p>
            <p className={`text-sm font-medium ${selectedStock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {selectedStock.change >= 0 ? "+" : "-"}₹{Math.abs(selectedStock.change).toFixed(2)}
            </p>
          </div>

          <div className="w-full h-52 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyFromStore}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length && payload[0].value !== undefined) {
                      return (
                        <div className="bg-white p-2 shadow rounded text-sm">
                          <p>{label}</p>
                          <p className="font-semibold text-blue-600">₹{(payload[0].value as number).toFixed(2)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Area type="natural" dataKey="price" stroke="none" fill="url(#priceGradient)" fillOpacity={0.3} />
                <Line
                  type="natural"
                  dataKey="price"
                  stroke="url(#priceGradient)"
                  strokeWidth={2}
                  isAnimationActive={true}
                  dot={(props: any) => {
                    const { index, cx, cy } = props;
                    if (index === selectedStock.history.length - 1) {
                      return <circle cx={cx} cy={cy} r={4} fill="#2563eb" />;
                    }
                    return null;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-sm text-gray-600 mb-4 text-center">
            You own <span className="font-semibold text-black">{portfolio[selectedStock.id] || 0}</span> share
            {(portfolio[selectedStock.id] || 0) !== 1 ? "s" : ""} out of{" "}
            <span className="font-semibold text-black">{availableShares}</span> available
          </p>

          <label className="block text-sm text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            max={portfolio[selectedStock.id] || 1}
            value={quantity}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") setQuantity(NaN);
              else {
                const parsed = parseInt(val);
                if (!isNaN(parsed) && parsed > 0) setQuantity(parsed);
              }
            }}
            className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-red-500"
          />

          {/* Error message if needed */}
          {quantity > availableShares && (
            <p className="text-sm text-red-500 mb-2">
              Only {availableShares} share{availableShares !== 1 ? "s" : ""} available to buy.
            </p>
          )}

          {quantity * selectedStock.price > balance && (
            <p className="text-sm text-red-500 mb-2">
              Insufficient balance. You need ₹{(quantity * selectedStock.price - balance).toFixed(2)} more.
            </p>
          )}

          <button
            onClick={() => handleBuy(selectedStock)}
            disabled={quantity > availableShares || quantity * selectedStock.price > balance}
            className={`w-full py-3 rounded-xl font-medium transition ${
              quantity > availableShares || quantity * selectedStock.price > balance
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Buy {quantity} Share{quantity > 1 ? "s" : ""} : ₹{(selectedStock.price * quantity).toFixed(2)}
          </button>

          {/* 📄 Stock Details Section */}
          <div className="mt-6 p-4 bg-white border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3">📄 Stock Details</h3>
            <p className="text-sm text-gray-700 mb-1">
              📈 <span className="font-medium">Dividend Yield (Per 3h on holding quantity):</span>{" "}
              {(selectedStock.yield * 100).toFixed(2)}% ( ₹{(selectedStock.price * selectedStock.yield).toFixed(2)} per
              share)
            </p>
            <p className="text-sm text-gray-700 mb-1">
              🏢 <span className="font-medium">Capitalization:</span> ₹
              {selectedStock.capitalization.toLocaleString("en-IN")}
            </p>
            <p className="text-sm text-gray-700">
              📊 <span className="font-medium">Available Shares:</span> {availableShares.toLocaleString("en-IN")}
            </p>
          </div>
        </>
      )}

      {/* Portfolio View */}
      {activeTab === "portfolio" && !selectedStock && (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 My Portfolio</h2>
          {Object.keys(portfolio).length === 0 ? (
            <p className="text-gray-500">You haven’t purchased any stocks yet.</p>
          ) : (
            <div className="grid gap-4">
              {Object.entries(portfolio).map(([stockId, qty]) => {
                const stock = stocks.find((s) => s.id === stockId);
                if (!stock) return null;
                return (
                  <div
                    key={stock.id}
                    onClick={() => setSelectedStockId(stock.id)}
                    className="bg-white p-4 rounded-xl shadow space-y-2 cursor-pointer hover:bg-red-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      <img src={stock.logo} alt={stock.name} className="h-10 w-10 object-contain" />
                      <div>
                        <p className="font-semibold text-gray-800">{stock.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {qty} × ₹{stock.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="ml-auto font-bold text-green-600">₹{(stock.price * qty).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Sell View */}
      {activeTab === "portfolio" && selectedStock && (
        <>
          <button onClick={() => setSelectedStockId(null)} className="text-sm text-gray-500 mb-2">
            ← Back to Portfolio
          </button>

          <div className="flex flex-col items-center mb-4">
            <img
              src={selectedStock.logo}
              alt={selectedStock.name}
              className="h-16 w-16 rounded-full object-contain mb-2"
            />
            <h1 className="text-2xl font-bold text-gray-800">{selectedStock.name}</h1>
            <p className="text-sm text-gray-700 mt-1">₹{selectedStock.price.toFixed(2)}</p>
            <p className={`text-sm font-medium ${selectedStock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {selectedStock.change >= 0 ? "+" : "-"}₹{Math.abs(selectedStock.change).toFixed(2)}
            </p>
          </div>

          <div className="w-full h-52 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyFromStore}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length && payload[0].value !== undefined) {
                      return (
                        <div className="bg-white p-2 shadow rounded text-sm">
                          <p>{label}</p>
                          <p className="font-semibold text-blue-600">₹{(payload[0].value as number).toFixed(2)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Area type="natural" dataKey="price" stroke="none" fill="url(#priceGradient)" fillOpacity={0.3} />
                <Line
                  type="natural"
                  dataKey="price"
                  stroke="url(#priceGradient)"
                  strokeWidth={2}
                  isAnimationActive={true}
                  dot={(props: any) => {
                    const { index, cx, cy } = props;
                    if (index === selectedStock.history.length - 1) {
                      return <circle cx={cx} cy={cy} r={4} fill="#2563eb" />;
                    }
                    return null;
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-sm text-gray-600 text-center mb-4">
            You own <span className="font-semibold text-black">{portfolio[selectedStock.id] || 0}</span> share
            {(portfolio[selectedStock.id] || 0) !== 1 ? "s" : ""}
          </p>

          <label className="block text-sm text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            max={portfolio[selectedStock.id] || 1}
            value={quantity}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") setQuantity(NaN);
              else {
                const parsed = parseInt(val);
                if (!isNaN(parsed) && parsed > 0) setQuantity(parsed);
              }
            }}
            className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-red-500"
          />

          <button
            onClick={() => handleSell(selectedStock)}
            className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition"
          >
            Sell {quantity} Share{quantity > 1 ? "s" : ""} : ₹{(selectedStock.price * quantity).toFixed(2)}
          </button>
        </>
      )}

      {/* P/L History */}
      {activeTab === "history" && (
        <>
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 P/L Statement</h2>

          <div className="text-center mb-4 p-3 rounded-xl bg-white shadow">
            <p className="text-sm text-gray-500">Total Profit / Loss</p>
            <p className={`text-xl font-bold ${totalPL >= 0 ? "text-green-600" : "text-red-500"}`}>
              ₹{totalPL.toFixed(2)}
            </p>
          </div>

          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center">No transactions yet.</p>
          ) : (
            <div className="grid gap-2">
              {transactions.map((txn, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-md shadow flex justify-between items-center ${
                    txn.type === "buy" ? "bg-green-50" : txn.type === "dividend" ? "bg-yellow-50" : "bg-red-50"
                  }`}
                >
                  <div>
                    <p className="font-semibold">
                      {txn.type === "buy"
                        ? `Bought ${txn.quantity} × ${txn.stockName}`
                        : txn.type === "sell"
                        ? `Sold ${txn.quantity} × ${txn.stockName}`
                        : `Dividend from ${txn.stockName}`}
                    </p>

                    <p className="text-xs text-gray-500">
                      ₹{txn.price}
                      {txn.quantity ? ` (${txn.quantity} shares)` : ""} | {txn.timestamp}
                    </p>
                  </div>
                  <p className="font-bold text-sm">
                    ₹{txn.type === "dividend" ? txn.price.toFixed(2) : (txn.quantity * txn.price).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
