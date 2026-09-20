import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { initialAssets } from '../data/navigationData';

export default function TradingTerminal() {
  const [selectedAsset, setSelectedAsset] = useState(initialAssets[0]);
  const [candles, setCandles] = useState([]);
  const [balance] = useState(10000.00);
  const [positions, setPositions] = useState([]);
  const [lotSize, setLotSize] = useState(0.1);

  useEffect(() => {
    const initialCandles = [];
    let basePrice = selectedAsset.price;
    for (let i = 0; i < 20; i++) {
      const open = basePrice + (Math.random() - 0.5) * 2;
      const close = open + (Math.random() - 0.5) * 3;
      const high = Math.max(open, close) + Math.random() * 1.5;
      const low = Math.min(open, close) - Math.random() * 1.5;
      initialCandles.push({ open, close, high, low, time: i });
      basePrice = close;
    }
    setCandles(initialCandles);
  }, [selectedAsset]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCandles((prev) => {
        if (prev.length === 0) return prev;
        const lastCandle = prev[prev.length - 1];
        const delta = (Math.random() - 0.49) * (selectedAsset.price * 0.001);
        const newClose = lastCandle.close + delta;
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...lastCandle,
          close: newClose,
          high: Math.max(lastCandle.high, newClose),
          low: Math.min(lastCandle.low, newClose)
        };
        return updated;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [selectedAsset]);

  const handleOrder = (type) => {
    const currentPrice = candles[candles.length - 1]?.close || selectedAsset.price;
    const newPos = {
      id: Date.now(),
      symbol: selectedAsset.symbol,
      type,
      price: currentPrice,
      lots: lotSize,
      pnl: 0
    };
    setPositions([newPos, ...positions]);
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <h3 className="font-bold text-slate-300 mb-3 text-sm">MARKETS</h3>
        <div className="space-y-2">
          {initialAssets.map((asset) => (
            <div
              key={asset.symbol}
              onClick={() => setSelectedAsset(asset)}
              className={`p-3 rounded-lg cursor-pointer flex justify-between items-center transition-colors ${
                selectedAsset.symbol === asset.symbol ? 'bg-slate-700 border border-blue-500' : 'hover:bg-slate-700/50'
              }`}
            >
              <div>
                <div className="font-bold text-sm">{asset.symbol}</div>
                <div className="text-xs text-slate-400">{asset.name}</div>
              </div>
              <div className="text-right font-mono text-sm">${asset.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">{selectedAsset.symbol}</h2>
              <p className="text-xs text-slate-400">{selectedAsset.name}</p>
            </div>
            <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded border border-slate-700">
              <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
              <span className="text-xs text-emerald-400 font-mono">LIVE TICKS</span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between bg-slate-950 p-4 rounded-lg border border-slate-800 space-x-1">
            {candles.map((c, i) => {
              const isGreen = c.close >= c.open;
              const heightPct = Math.min(Math.max(Math.abs(c.close - c.open) * 15, 10), 90);
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                  <div
                    className={`w-1 rounded-sm ${isGreen ? 'bg-emerald-500' : 'bg-red-500'} transition-all duration-300`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">LOTS:</span>
            <input
              type="number"
              value={lotSize}
              onChange={(e) => setLotSize(Number(e.target.value))}
              step="0.01"
              className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm font-mono text-white text-center"
            />
          </div>
          <div className="flex space-x-3">
            <button onClick={() => handleOrder('SELL')} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm flex items-center space-x-1">
              <TrendingDown className="w-4 h-4" />
              <span>SELL</span>
            </button>
            <button onClick={() => handleOrder('BUY')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>BUY</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-300 mb-3 text-sm">ACCOUNT SUMMARY</h3>
          <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 mb-4">
            <div className="text-xs text-slate-400">BALANCE</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">${balance.toFixed(2)}</div>
          </div>

          <h4 className="font-bold text-slate-300 mb-2 text-xs">OPEN POSITIONS</h4>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {positions.length === 0 ? (
              <div className="text-xs text-slate-500 text-center py-4">No active positions</div>
            ) : (
              positions.map((pos) => (
                <div key={pos.id} className="bg-slate-900 p-2.5 rounded border border-slate-700 flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className={pos.type === 'BUY' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>{pos.type}</span> {pos.symbol}
                    <div className="text-[10px] text-slate-500">@{pos.price.toFixed(2)}</div>
                  </div>
                  <button onClick={() => setPositions(positions.filter(p => p.id !== pos.id))} className="text-xs text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded">
                    Close
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}