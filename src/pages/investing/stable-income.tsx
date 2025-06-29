'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';

type FD = {
  id: number;
  amount: number;
  interest: number;
  start: Date;
  duration: number;
};

type RD = {
  id: number;
  monthly: number;
  months: number;
  initial: number;
  contributed: number;
  interest: number;
  start: Date;
};

let idCounter = 1;

export default function StableIncomePage() {
  // Zustand store access
  const balance = useGameStore(s => s.balance);
  const updateBalance = useGameStore(s => s.updateBalance);
  const stableIncomeTxns = useGameStore(s => s.stableIncomeTxns);
  const addStableIncomeTxn = useGameStore(s => s.addStableIncomeTxn);

  const fds = useGameStore(s => s.fds);
  const rds = useGameStore(s => s.rds);
  const setFds = useGameStore(s => s.setFds);
  const setRds = useGameStore(s => s.setRds);

  const lastEarnTime = useGameStore(s => s.lastEarnTime);
  const setLastEarnTime = useGameStore(s => s.setLastEarnTime);

  const [fdAmount, setFdAmount] = useState('');
  const [rdMonthly, setRdMonthly] = useState('');
  const [rdMonths, setRdMonths] = useState('');
  const [rdInitial, setRdInitial] = useState('');

  // Cooldown timer states
  const [cooldownLeft, setCooldownLeft] = useState(0);
  const [canEarn, setCanEarn] = useState(true);

  // Track time left on cooldown
  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastEarnTime) return;

      const lastTime = new Date(lastEarnTime).getTime();
      const now = Date.now();
      const diff = now - lastTime;
      const hours = 12;
      const cooldown = hours * 60 * 60 * 1000;

      if (diff >= cooldown) {
        setCanEarn(true);
        setCooldownLeft(0);
      } else {
        setCanEarn(false);
        setCooldownLeft(cooldown - diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastEarnTime]);

  // Format cooldown as HH:MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Earn interest (0.5%) function with cooldown
  const handleEarn = () => {
    if (!canEarn) return;
    const interest = +(balance * 0.005).toFixed(2);
    updateBalance(interest);
    addStableIncomeTxn({
      type: 'earn',
      amount: balance,
      interest,
      timestamp: new Date().toLocaleString(),
    });
    setLastEarnTime(new Date().toISOString());
    alert(`You earned ₹${interest}!`);
  };

  // FD setup functions
  const startFD = () => {
    const amount = parseFloat(fdAmount || '0');
    if (amount <= 0 || amount > balance) return alert('Invalid amount');
    const interest = +(amount * 0.07).toFixed(2);
    const newFd: FD = {
      id: idCounter++,
      amount,
      interest,
      start: new Date(),
      duration: 12,
    };
    updateBalance(-amount);
    setFds(prev => [...prev, newFd]);
    addStableIncomeTxn({ type: 'fd-start', amount, interest, timestamp: new Date().toLocaleString() });
    setFdAmount('');
  };

  const endFD = (fd: FD) => {
    updateBalance(fd.amount + fd.interest);
    setFds(prev => prev.filter(x => x.id !== fd.id));
    addStableIncomeTxn({ type: 'fd-end', amount: fd.amount, interest: fd.interest, timestamp: new Date().toLocaleString() });
  };

  const earlyFD = (fd: FD) => {
    const penalty = +(0.02 * (fd.amount + fd.interest)).toFixed(2);
    const netInterest = +(fd.interest - penalty).toFixed(2);
    updateBalance(fd.amount + netInterest);
    setFds(prev => prev.filter(x => x.id !== fd.id));
    addStableIncomeTxn({ type: 'fd-early', amount: fd.amount, interest: netInterest, timestamp: new Date().toLocaleString() });
  };

  // RD setup functions
  const startRD = () => {
    const initial = parseFloat(rdInitial || '0');
    const monthly = parseFloat(rdMonthly || '0');
    const months = parseInt(rdMonths || '0');
    const total = initial + monthly * months;
    if (monthly <= 0 || months <= 0 || total > balance) return alert('Invalid RD');
    const interest = +(total * 0.08).toFixed(2);
    const newRd: RD = {
      id: idCounter++,
      monthly,
      months,
      initial,
      contributed: total,
      interest,
      start: new Date(),
    };
    updateBalance(-total);
    setRds(prev => [...prev, newRd]);
    addStableIncomeTxn({ type: 'rd-start', amount: total, interest, timestamp: new Date().toLocaleString() });
    setRdInitial('');
    setRdMonthly('');
    setRdMonths('');
  };

  const earlyRD = (rd: RD) => {
    const penalty = +(0.03 * (rd.contributed + rd.interest)).toFixed(2);
    const netInterest = +(rd.interest - penalty).toFixed(2);
    updateBalance(rd.contributed + netInterest);
    setRds(prev => prev.filter(x => x.id !== rd.id));
    addStableIncomeTxn({ type: 'rd-early', amount: rd.contributed, interest: netInterest, timestamp: new Date().toLocaleString() });
  };

  // Utility: progress % and months left
  const pct = (start: Date, months: number) => Math.min(((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)) / months * 100, 100);
  const monthsLeft = (start: Date, months: number) => Math.max(Math.ceil(months - ((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))), 0);

  // Transaction filter
  const [txnFilter, setTxnFilter] = useState<'all' | 'interest' | 'fd' | 'rd'>('all');
  const filteredTxns = stableIncomeTxns.filter(t => {
    if (txnFilter === 'all') return true;
    if (txnFilter === 'interest') return t.type === 'earn';
    if (txnFilter === 'fd') return t.type.startsWith('fd');
    if (txnFilter === 'rd') return t.type.startsWith('rd');
    return false;
  });

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6">
      <h1 className="text-2xl font-bold mb-4">💼 Stable Income</h1>
      <p className="mb-6">Balance: ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>

      <Link href="/investing" className="inline-block mb-4 text-blue-600 hover:underline text-sm font-medium">
        ← Back to Investment Options
      </Link>

      {/* Earn Interest Section */}
      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2>Earn Interest</h2>
        <button
          className={`mt-2 px-4 py-2 rounded text-white ${canEarn ? 'bg-green-600' : 'bg-gray-400 cursor-not-allowed'}`}
          onClick={handleEarn}
          disabled={!canEarn}
        >
          {canEarn ? 'Earn 0.5% now' : `Wait ${formatTime(cooldownLeft)}`}
        </button>
      </section>

      {/* FD Section */}
      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="mb-2">Fixed Deposit (7% p.a.)</h2>
        <input type="number" placeholder="Enter FD Amount" value={fdAmount} onChange={e => setFdAmount(e.target.value)} className="border px-2 py-1 rounded w-full mb-2" />
        <button onClick={startFD} className="px-4 py-2 bg-blue-600 text-white rounded w-full">Start FD</button>

        {fds.map(fd => (
          <div key={fd.id} className="mt-4 border-t pt-3">
            <p>₹{fd.amount} → ₹{(fd.amount + fd.interest).toFixed(2)}</p>
            <p className="text-sm text-gray-500">⏳ {monthsLeft(fd.start, fd.duration)} month(s) left</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-1 mb-2">
              <div className="bg-blue-600 h-2 rounded" style={{ width: `${pct(fd.start, fd.duration)}%` }} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => endFD(fd)} disabled={pct(fd.start, fd.duration) < 100} className={`px-3 py-1 rounded text-white ${pct(fd.start, fd.duration) < 100 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>Finish</button>
              <button onClick={() => earlyFD(fd)} className="px-3 py-1 bg-red-600 text-white rounded">Early Withdraw</button>
            </div>
            <p className="text-xs text-red-600 mt-1">Early withdrawal has 2% penalty.</p>
          </div>
        ))}
      </section>

      {/* RD Section */}
      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="mb-2">Recurring Deposit (8% p.a.)</h2>
        <input type="number" placeholder="Initial Lumpsum" value={rdInitial} onChange={e => setRdInitial(e.target.value)} className="border px-2 py-1 rounded w-full mb-2" />
        <input type="number" placeholder="Monthly Amount" value={rdMonthly} onChange={e => setRdMonthly(e.target.value)} className="border px-2 py-1 rounded w-full mb-2" />
        <input type="number" placeholder="Months" value={rdMonths} onChange={e => setRdMonths(e.target.value)} className="border px-2 py-1 rounded w-full mb-2" />
        <button onClick={startRD} className="px-4 py-2 bg-blue-600 text-white rounded w-full">Start RD</button>

        {rds.map(rd => (
          <div key={rd.id} className="mt-4 border-t pt-3">
            <p>₹{rd.contributed} → ₹{(rd.contributed + rd.interest).toFixed(2)}</p>
            <p className="text-sm text-gray-500">⏳ {monthsLeft(rd.start, rd.months)} month(s) left</p>
            <div className="w-full bg-gray-200 h-2 rounded mt-1 mb-2">
              <div className="bg-blue-600 h-2 rounded" style={{ width: `${pct(rd.start, rd.months)}%` }} />
            </div>
            <button onClick={() => earlyRD(rd)} className="px-3 py-1 bg-red-600 text-white rounded">Early Withdraw</button>
            <p className="text-xs text-red-600 mt-1">Early withdrawal has 3% penalty.</p>
          </div>
        ))}
      </section>

      {/* Transaction Log */}
      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="mb-2">Transaction Log</h2>

        <div className="mb-4 text-sm text-green-700 font-semibold">
          Total Profit: ₹{stableIncomeTxns.reduce((sum, t) => sum + t.interest, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {(['all', 'interest', 'fd', 'rd'] as const).map((type) => (
  <button
    key={type}
    onClick={() => setTxnFilter(type)}
    className={`px-3 py-1 rounded border text-sm ${
      txnFilter === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {type === 'all' ? 'All' : type.toUpperCase()}
  </button>
))}
        </div>

        {filteredTxns.length === 0 ? (
          <p>No transactions for this filter.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {filteredTxns.map((t, i) => (
              <li key={i} className="flex justify-between">
                <span>{t.type.replace('-', ' ').toUpperCase()}: ₹{t.amount} (+₹{t.interest})</span>
                <span className="text-gray-500">{t.timestamp}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
