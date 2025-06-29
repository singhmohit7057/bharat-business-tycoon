import { create } from "zustand";
import { persist } from "zustand/middleware";

// Import collectible items data
import { garageItems } from "@/data/garageItems";
import { hangerItems } from "@/data/hangerItems";
import { harborItems } from "@/data/harborItems";
import { coinsItems } from "@/data/coinsItems";
import { islandItems } from "@/data/islandsItems";
import { jewelsItems } from "@/data/jewelsItems";
import { nftItems } from "@/data/nftItems";
import { paintingsItems } from "@/data/paintingsItems";
import { retroCarsItems } from "@/data/retrocarsItems";
import { stampsItems } from "@/data/stampsItems";
import { uniqueItems } from "@/data/uniqueItems";

// Types
export type Item = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export type Transaction = {
  type: "buy" | "sell" | "dividend";
  stockId: string;
  stockName: string;
  quantity: number;
  price: number;
  timestamp: string;
};

export type StableIncomeTxn = {
  type: "earn" | "fd-start" | "fd-end" | "fd-early" | "rd-start" | "rd-end" | "rd-early";
  amount: number;
  interest: number;
  timestamp: string;
};

export type FD = {
  id: number;
  amount: number;
  interest: number;
  start: Date;
  duration: number;
};

export type RD = {
  id: number;
  monthly: number;
  months: number;
  initial: number;
  contributed: number;
  interest: number;
  start: Date;
};

type GameState = {
  // Balance & updater
  balance: number;
  updateBalance: (amount: number) => void;
  lastEarnTime: string | null;
  setLastEarnTime: (time: string) => void;
  liveStocks?: { id: string; name: string; price: number; yield: number; capitalization: number }[];
  setLiveStocks?: (stocks: GameState["liveStocks"]) => void;
  earnDividends: () => void;

  // Collectibles
  garageItems: Item[];
  ownedCars: number[];
  buyCar: (id: number) => void;
  sellCar: (id: number) => void;
  hangerItems: Item[];
  ownedPlanes: number[];
  buyPlane: (id: number) => void;
  sellPlane: (id: number) => void;
  harborItems: Item[];
  ownedShips: number[];
  buyShip: (id: number) => void;
  sellShip: (id: number) => void;
  coinsItems: Item[];
  ownedCoins: number[];
  buyCoin: (id: number) => void;
  sellCoin: (id: number) => void;
  islandItems: Item[];
  ownedIslands: number[];
  buyIsland: (id: number) => void;
  sellIsland: (id: number) => void;
  jewelsItems: Item[];
  ownedJewels: number[];
  buyJewel: (id: number) => void;
  sellJewel: (id: number) => void;
  nftItems: Item[];
  ownedNfts: number[];
  buyNft: (id: number) => void;
  sellNft: (id: number) => void;
  paintingsItems: Item[];
  ownedPaintings: number[];
  buyPainting: (id: number) => void;
  sellPainting: (id: number) => void;
  retroCarsItems: Item[];
  ownedRetroCars: number[];
  buyRetroCar: (id: number) => void;
  sellRetroCar: (id: number) => void;
  stampsItems: Item[];
  ownedStamps: number[];
  buyStamp: (id: number) => void;
  sellStamp: (id: number) => void;
  uniqueItems: Item[];
  ownedUnique: number[];
  buyUnique: (id: number) => void;
  sellUnique: (id: number) => void;

  // Stocks
  stockHoldings: Record<string, number>;
  avgBuyPrices: Record<string, { totalQty: number; totalCost: number }>;
  stockTransactions: Transaction[];
  availableShares: Record<string, number>;
  setAvailableSharesIfUnset: (stockId: string, initialAvailable: number) => void;
  buyStock: (stockId: string, quantity: number, price: number, stockName?: string) => void;
  sellStock: (stockId: string, quantity: number, price: number, stockName?: string) => void;
  stockPriceHistory: Record<string, { timestamp: number; price: number }[]>;
  addStockPricePoint: (stockId: string, price: number) => void;

  // Stable income
  stableIncomeTxns: StableIncomeTxn[];
  addStableIncomeTxn: (txn: StableIncomeTxn) => void;
  fds: FD[];
  rds: RD[];
  setFds: (fds: FD[] | ((prev: FD[]) => FD[])) => void;
  setRds: (rds: RD[] | ((prev: RD[]) => RD[])) => void;

  // New: Last earn interest timestamp
  lastInterestTime: string | null;
  setLastInterestTime: (time: string) => void;

  // Summaries
  getTotalStableIncome: () => number;
  getTotalStockEarnings: () => number;

  // Reset game
  resetGame: () => void;
};

// Generic buy/sell logic for items
function buyItem<T extends Item>(
  owned: number[],
  items: T[],
  id: number,
  balance: number,
  setState: (partial: Partial<GameState>) => void,
  key: keyof GameState
) {
  const item = items.find((i) => i.id === id);
  if (!item || owned.includes(id) || balance < item.price) return;
  setState({ [key]: [...owned, id], balance: balance - item.price });
}

function sellItem<T extends Item>(
  owned: number[],
  items: T[],
  id: number,
  balance: number,
  setState: (partial: Partial<GameState>) => void,
  key: keyof GameState
) {
  const item = items.find((i) => i.id === id);
  if (!item || !owned.includes(id)) return;
  setState({ [key]: owned.filter((x) => x !== id), balance: balance + Math.floor(item.price * 0.7) });
}

// Zustand Store
export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial balance
      balance: 5000,
      updateBalance: (amount) => set((state) => ({ balance: state.balance + amount })),

      lastEarnTime: null,
      setLastEarnTime: (time) => set(() => ({ lastEarnTime: time })),

      // Initial asset ownership
      garageItems,
      ownedCars: [],
      buyCar: (id) => buyItem(get().ownedCars, garageItems, id, get().balance, set, "ownedCars"),
      sellCar: (id) => sellItem(get().ownedCars, garageItems, id, get().balance, set, "ownedCars"),
      hangerItems,
      ownedPlanes: [],
      buyPlane: (id) => buyItem(get().ownedPlanes, hangerItems, id, get().balance, set, "ownedPlanes"),
      sellPlane: (id) => sellItem(get().ownedPlanes, hangerItems, id, get().balance, set, "ownedPlanes"),
      harborItems,
      ownedShips: [],
      buyShip: (id) => buyItem(get().ownedShips, harborItems, id, get().balance, set, "ownedShips"),
      sellShip: (id) => sellItem(get().ownedShips, harborItems, id, get().balance, set, "ownedShips"),
      coinsItems,
      ownedCoins: [],
      buyCoin: (id) => buyItem(get().ownedCoins, coinsItems, id, get().balance, set, "ownedCoins"),
      sellCoin: (id) => sellItem(get().ownedCoins, coinsItems, id, get().balance, set, "ownedCoins"),
      islandItems,
      ownedIslands: [],
      buyIsland: (id) => buyItem(get().ownedIslands, islandItems, id, get().balance, set, "ownedIslands"),
      sellIsland: (id) => sellItem(get().ownedIslands, islandItems, id, get().balance, set, "ownedIslands"),
      jewelsItems,
      ownedJewels: [],
      buyJewel: (id) => buyItem(get().ownedJewels, jewelsItems, id, get().balance, set, "ownedJewels"),
      sellJewel: (id) => sellItem(get().ownedJewels, jewelsItems, id, get().balance, set, "ownedJewels"),
      nftItems,
      ownedNfts: [],
      buyNft: (id) => buyItem(get().ownedNfts, nftItems, id, get().balance, set, "ownedNfts"),
      sellNft: (id) => sellItem(get().ownedNfts, nftItems, id, get().balance, set, "ownedNfts"),
      paintingsItems,
      ownedPaintings: [],
      buyPainting: (id) => buyItem(get().ownedPaintings, paintingsItems, id, get().balance, set, "ownedPaintings"),
      sellPainting: (id) => sellItem(get().ownedPaintings, paintingsItems, id, get().balance, set, "ownedPaintings"),
      retroCarsItems,
      ownedRetroCars: [],
      buyRetroCar: (id) => buyItem(get().ownedRetroCars, retroCarsItems, id, get().balance, set, "ownedRetroCars"),
      sellRetroCar: (id) => sellItem(get().ownedRetroCars, retroCarsItems, id, get().balance, set, "ownedRetroCars"),
      stampsItems,
      ownedStamps: [],
      buyStamp: (id) => buyItem(get().ownedStamps, stampsItems, id, get().balance, set, "ownedStamps"),
      sellStamp: (id) => sellItem(get().ownedStamps, stampsItems, id, get().balance, set, "ownedStamps"),
      uniqueItems,
      ownedUnique: [],
      buyUnique: (id) => buyItem(get().ownedUnique, uniqueItems, id, get().balance, set, "ownedUnique"),
      sellUnique: (id) => sellItem(get().ownedUnique, uniqueItems, id, get().balance, set, "ownedUnique"),

      // Stocks
      stockHoldings: {},
      avgBuyPrices: {},
      stockTransactions: [],
      availableShares: {},
      setAvailableSharesIfUnset: (stockId, initialAvailable) =>
        set((state) => {
          if (state.availableShares[stockId] === undefined) {
            return {
              availableShares: {
                ...state.availableShares,
                [stockId]: initialAvailable,
              },
            };
          }
          return {};
        }),

      buyStock: (stockId, quantity, price, stockName = stockId) => {
        const available = get().availableShares[stockId] ?? Infinity;
        const cost = quantity * price;
        const balance = get().balance;

        if (quantity > available || cost > balance) return;

        const prevAvg = get().avgBuyPrices[stockId] || { totalQty: 0, totalCost: 0 };
        const updatedAvg = {
          totalQty: prevAvg.totalQty + quantity,
          totalCost: prevAvg.totalCost + cost,
        };

        set((state) => ({
          balance: state.balance - cost,
          stockHoldings: {
            ...state.stockHoldings,
            [stockId]: (state.stockHoldings[stockId] || 0) + quantity,
          },
          avgBuyPrices: {
            ...state.avgBuyPrices,
            [stockId]: updatedAvg,
          },
          stockTransactions: [
            ...state.stockTransactions,
            { type: "buy", stockId, stockName, quantity, price, timestamp: new Date().toLocaleString() },
          ],
          availableShares: {
            ...state.availableShares,
            [stockId]: available - quantity,
          },
        }));
      },

      sellStock: (stockId, quantity, price, stockName = stockId) => {
        const owned = get().stockHoldings[stockId] || 0;
        if (quantity > owned) return;

        const updatedHoldings = { ...get().stockHoldings };
        if (quantity === owned) delete updatedHoldings[stockId];
        else updatedHoldings[stockId] = owned - quantity;

        const currentAvailable = get().availableShares[stockId] ?? 0;

        set((state) => ({
          balance: state.balance + quantity * price,
          stockHoldings: updatedHoldings,
          stockTransactions: [
            ...state.stockTransactions,
            { type: "sell", stockId, stockName, quantity, price, timestamp: new Date().toLocaleString() },
          ],
          availableShares: {
            ...state.availableShares,
            [stockId]: currentAvailable + quantity,
          },
        }));
      },

      earnDividends: () => {
        const now = new Date();
        const state = get();

        const lastEarn = state.lastEarnTime ? new Date(state.lastEarnTime) : null;

        // ✅ 5-second cooldown (for testing)
        if (lastEarn && now.getTime() - lastEarn.getTime() < 5000) {
          console.log("⏳ Waiting for next dividend interval");
          return;
        }

        const timestamp = now.toLocaleString();
        const newTransactions: Transaction[] = [];

        if (!state.liveStocks || state.liveStocks.length === 0) {
          console.log("❌ liveStocks not available");
          return;
        }

        for (const stockId in state.stockHoldings) {
          const qty = state.stockHoldings[stockId];
          if (qty <= 0) continue;
          const stock = state.liveStocks.find((s) => s.id === stockId);
          if (!stock) continue;

          const dividendPerShare = stock.price * stock.yield;
          const totalDividend = dividendPerShare * qty;

          if (totalDividend > 0) {
            newTransactions.push({
              type: "dividend",
              stockId,
              stockName: stock.name,
              quantity: qty,
              price: totalDividend,
              timestamp,
            });
          }
        }

        if (newTransactions.length > 0) {
          const total = newTransactions.reduce((sum, t) => sum + t.price, 0);
          console.log("💸 Dividend earned:", total, newTransactions);

          set((s) => ({
            balance: s.balance + total,
            stockTransactions: [...s.stockTransactions, ...newTransactions],
            lastEarnTime: now.toISOString(), // ✅ ISO format for accurate comparison
          }));
        }
      },

      stockPriceHistory: {},

      addStockPricePoint: (stockId, price) => {
        const now = Date.now();
        const history = get().stockPriceHistory[stockId] || [];

        const updatedHistory = [...history, { timestamp: now, price }]
          // Keep only last 3 hours
          .filter((entry) => now - entry.timestamp <= 3 * 60 * 60 * 1000);

        set((state) => ({
          stockPriceHistory: {
            ...state.stockPriceHistory,
            [stockId]: updatedHistory,
          },
        }));
      },

      // Stable Income
      stableIncomeTxns: [],
      addStableIncomeTxn: (txn) => set((state) => ({ stableIncomeTxns: [txn, ...state.stableIncomeTxns] })),
      fds: [],
      rds: [],
      setFds: (fds) => set((state) => ({ fds: typeof fds === "function" ? fds(state.fds) : fds })),
      setRds: (rds) => set((state) => ({ rds: typeof rds === "function" ? rds(state.rds) : rds })),

      // ✅ New earn interest cooldown
      lastInterestTime: null,
      setLastInterestTime: (time) => set({ lastInterestTime: time }),

      // Summary earnings
      getTotalStableIncome: () => get().stableIncomeTxns.reduce((sum, txn) => sum + txn.interest, 0),

      getTotalStockEarnings: () => {
        let profit = 0;
        const avgMap = get().avgBuyPrices;
        for (const txn of get().stockTransactions) {
          if (txn.type === "sell") {
            const avg = (avgMap[txn.stockId]?.totalCost || 0) / (avgMap[txn.stockId]?.totalQty || 1);
            profit += (txn.price - avg) * txn.quantity;
          }
        }
        return profit;
      },

      // Reset everything
      resetGame: () =>
        set({
          balance: 5000,
          ownedCars: [],
          ownedPlanes: [],
          ownedShips: [],
          ownedCoins: [],
          ownedIslands: [],
          ownedJewels: [],
          ownedNfts: [],
          ownedPaintings: [],
          ownedRetroCars: [],
          ownedStamps: [],
          ownedUnique: [],
          stockHoldings: {},
          avgBuyPrices: {},
          stockTransactions: [],
          availableShares: {},
          stableIncomeTxns: [],
          fds: [],
          rds: [],
          lastInterestTime: null,
          lastEarnTime: null,
          stockPriceHistory: {},
        }),
    }),
    {
      name: "game-storage",
      version: 6,
      merge: (persisted, current) => {
        const state = { ...current, ...(persisted as GameState) };
        state.fds = (state.fds || []).map((fd) => ({ ...fd, start: new Date(fd.start) }));
        state.rds = (state.rds || []).map((rd) => ({ ...rd, start: new Date(rd.start) }));
        // ✅ Ensure lastInterestTime is valid string
        state.lastInterestTime = state.lastInterestTime ? new Date(state.lastInterestTime).toISOString() : null;
        return state;
      },
    }
  )
);
