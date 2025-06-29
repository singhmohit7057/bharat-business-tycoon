import React, { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsClient } from '@/hooks/useIsClient';

const RetroCars = () => {
  const isClient = useIsClient();
  const [view, setView] = useState<'market' | 'collection'>('market');

  const {
    balance,
    retroCarsItems = [],
    ownedRetroCars = [],
    buyRetroCar,
    sellRetroCar,
  } = useGameStore();

  const handleBuy = (id: number) => buyRetroCar(id);
  const handleSell = (id: number) => sellRetroCar(id);

  const showItems =
    view === 'market'
      ? retroCarsItems.filter((item) => !ownedRetroCars.includes(item.id))
      : retroCarsItems.filter((item) => ownedRetroCars.includes(item.id));

  if (!isClient) return null;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Retro Cars</h1>
      <div className="text-right text-sm text-gray-600 mb-4">
        Balance: <span className="font-semibold text-green-600">₹{balance.toLocaleString()}</span>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('market')}
          className={`flex-1 py-2 rounded ${view === 'market' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Market
        </button>
        <button
          onClick={() => setView('collection')}
          className={`flex-1 py-2 rounded ${view === 'collection' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          My Collection
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence>
          {showItems.length > 0 ? (
            showItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-2 rounded-xl shadow"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-24 object-cover rounded"
                />
                <h2 className="text-center font-semibold mt-2">{item.name}</h2>

                {view === 'market' ? (
                  <button
                    onClick={() => handleBuy(item.id)}
                    className="w-full mt-2 bg-blue-600 text-white py-1 rounded"
                  >
                    Buy for ₹{item.price.toLocaleString()}
                  </button>
                ) : (
                  <>
                    <p className="text-center text-sm text-gray-500 mt-1">
                      Bought for ₹{item.price.toLocaleString()}
                    </p>
                    <p className="text-center text-xs text-red-500 mt-1 font-medium">
                      Resell Tax: 30%
                    </p>
                    <button
                      onClick={() => handleSell(item.id)}
                      className="w-full mt-2 bg-red-500 text-white py-1 rounded"
                    >
                      Sell for ₹{Math.floor(item.price * 0.7).toLocaleString()}
                    </button>
                  </>
                )}
              </motion.div>
            ))
          ) : (
            <motion.p
              key="no-items"
              className="text-center col-span-2 text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No items to display
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RetroCars;
