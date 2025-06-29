import { useEffect, useState } from 'react';
import { stockList as initialList } from '@/data/stocks'; // Import initial stock data
import { useGameStore } from '@/store/useGameStore'; // Zustand store for game state

// Type for each historical price point
type HistoryPoint = {
  time: string;
  price: number;
};

// Type for each live-updated stock
type LiveStock = {
  id: string;
  name: string;
  price: number;
  availableShares: number;
  yield: number;
  capitalization: number;
  history: HistoryPoint[];
  change: number; // The price change in the last update
  logo: string;
};

// Custom hook to simulate live stock price updates
export function useLiveStocks() {
  // 🟡 Initialize stock state with a copy of the initial stock list + set default `change: 0`
  const [stocks, setStocks] = useState<LiveStock[]>(
    initialList.map((stock) => ({
      ...stock,
      change: 0,
      history: [...stock.history], // Create a shallow copy of the price history
    }))
  );

  // Access `setAvailableSharesIfUnset` function from Zustand store
  const setAvailableSharesIfUnset = useGameStore((s) => s.setAvailableSharesIfUnset);
  const updateStockHistory = useGameStore((state) => state.addStockPricePoint);


  // ✅ On mount: set the available shares for each stock in the store (only if not already set)
  useEffect(() => {
    initialList.forEach((stock) => {
      setAvailableSharesIfUnset(stock.id, stock.availableShares);
    });
  }, [setAvailableSharesIfUnset]);

  // 🔁 Simulate live stock price updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Update each stock with a new price and history entry
      setStocks((prevStocks) =>
        prevStocks.map((stock) => {
          // Generate random price change between -100 and +100
          const change = +(Math.random() * 200 - 100).toFixed(2);

          // Apply change and ensure price doesn't go below 1
          const newPrice = +(stock.price + change).toFixed(2);
          const updatedPrice = Math.max(1, newPrice);

          // Update persistent 3-hour history in Zustand store
          updateStockHistory(stock.id, updatedPrice);

          // Create new history entry
          const newHistoryPoint: HistoryPoint = {
            time: timeLabel,
            price: updatedPrice,
          };

          // Return updated stock object
          return {
            ...stock,
            price: updatedPrice,
            change,
            history: [...stock.history.slice(-19), newHistoryPoint], // Keep max 20 history points
          };
        })
      );
    }, 3000); // Every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Return current stock list with live updates
  return stocks;
}
