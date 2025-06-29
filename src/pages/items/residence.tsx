import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ResidencePage() {
  const totalValue = "4.6T";
  const vaultValue = "0.00";
  const improvementValue = "2.4T";

  const holdings = [
    {
      label: "Gold",
      icon: "🪙",
      value: "$0.00",
      color: "text-yellow-400",
    },
    {
      label: "Silver",
      icon: "🏅",
      value: "$0.00",
      color: "text-gray-300",
    },
    {
      label: "Diamonds",
      icon: "💎",
      value: "$0.00",
      color: "text-blue-300",
    },
  ];

  const improvementsPurchased = 13;
  const improvementsTotal = 14;

  const improvementImages = [
    "/items/improve-pool.jpg",
    "/items/improve-sauna.jpg",
    "/items/improve-gym.jpg",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-cyan-500 text-white px-4 py-6">
      {/* Header */}
      <h1 className="text-xl font-semibold mb-4">My residence</h1>

      {/* Image Banner */}
      <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
        <img
          src="/items/residence.jpg"
          alt="Residence"
          className="w-full h-48 object-cover"
        />
      </div>

      {/* Total Value */}
      <div className="mb-4">
        <div className="text-sm text-white/70 flex items-center gap-2 mb-1">
          🏦 Total value
        </div>
        <div className="text-2xl font-bold">${totalValue}</div>
      </div>

      <hr className="border-white/30 my-4" />

      {/* Vault */}
      <div className="mb-6">
        <div className="text-sm text-white/70 mb-1">In the vault</div>
        <div className="text-lg font-medium">${vaultValue}</div>
      </div>

      {/* Holdings */}
      <div className="space-y-4 mb-8">
        {holdings.map((item) => (
          <div
            key={item.label}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center"
          >
            <div>
              <div className={`text-sm font-semibold flex items-center gap-2 ${item.color}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <div className="text-white text-sm">{item.value}</div>
            </div>
            <Link
              href={`/items/residence/${item.label.toLowerCase()}`}
              className="text-white text-sm flex items-center gap-1 opacity-80 hover:opacity-100"
            >
              Manage <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {/* Security & Staff */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center shadow">
          <div className="text-2xl mb-1">🛡️</div>
          <h3 className="text-lg font-medium text-gray-800">Security</h3>
          <div className="text-blue-600 text-xl font-bold mt-1">6000</div>
          <p className="text-xs text-gray-500 mb-2">level</p>
          <Link
            href="/items/residence/security"
            className="text-sm font-medium text-white bg-blue-600 px-3 py-1 rounded-full"
          >
            Manage →
          </Link>
        </div>

        <div className="bg-white rounded-xl p-4 text-center shadow">
          <div className="text-2xl mb-1">🧍‍♂️</div>
          <h3 className="text-lg font-medium text-gray-800">Staff</h3>
          <div className="text-teal-600 text-xl font-bold mt-1">22410</div>
          <p className="text-xs text-gray-500 mb-2">level</p>
          <Link
            href="/items/residence/staff"
            className="text-sm font-medium text-white bg-teal-600 px-3 py-1 rounded-full"
          >
            Manage →
          </Link>
        </div>
      </div>

      {/* Residence Improvements */}
      <div className="bg-white text-gray-800 rounded-2xl p-4 mb-6 shadow">
        <h2 className="text-lg font-semibold mb-3">Residence Improvements</h2>

        {/* Preview Images */}
        <div className="flex gap-2 mb-3 overflow-x-auto">
          {improvementImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Improvement ${index + 1}`}
              className="w-24 h-16 object-cover rounded-lg"
            />
          ))}
        </div>

        {/* Checkbox Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {Array.from({ length: improvementsPurchased }).map((_, i) => (
            <div key={i} className="w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center">
              ✓
            </div>
          ))}
          {improvementsPurchased < improvementsTotal && (
            <div className="w-6 h-6 bg-gray-300 rounded-sm flex items-center justify-center text-gray-600 text-sm">
              $
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="text-sm text-gray-600 mb-2">
          {improvementsPurchased} of {improvementsTotal}
        </div>

        {/* Value Line */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-lg flex justify-between items-center text-sm font-medium">
          <div>${improvementValue}</div>
          <Link href="/items/residence/improvements" className="flex items-center gap-1">
            All purchased improvements →
          </Link>
        </div>
      </div>

      {/* Buy Improvements Button */}
      <div className="text-center">
        <button className="bg-gray-100 text-teal-700 font-semibold py-2 px-6 rounded-full shadow-sm hover:bg-gray-200 transition">
          Buy Improvements
        </button>
      </div>
    </div>
  );
}
