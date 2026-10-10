import React from 'react';
import { X, Clock } from 'lucide-react';

export default function TradesDrawer({
  showTradesDrawer,
  setShowTradesDrawer,
  tradesDrawerTab,
  setTradesDrawerTab,
  activeTrades,
  closedTrades
}) {
  if (!showTradesDrawer) return null;

  return (
    <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#121927] border-l border-gray-800 z-30 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
      <div className="p-3 border-b border-gray-800 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setTradesDrawerTab('active')}
            className={`text-xs font-bold px-3 py-1 rounded-md ${
              tradesDrawerTab === 'active' ? 'bg-blue-600 text-white' : 'text-gray-400'
            }`}
          >
            Active ({activeTrades.length})
          </button>
          <button
            onClick={() => setTradesDrawerTab('closed')}
            className={`text-xs font-bold px-3 py-1 rounded-md ${
              tradesDrawerTab === 'closed' ? 'bg-blue-600 text-white' : 'text-gray-400'
            }`}
          >
            Closed ({closedTrades.length})
          </button>
        </div>
        <button onClick={() => setShowTradesDrawer(false)} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {tradesDrawerTab === 'active' ? (
          activeTrades.length === 0 ? (
            <div className="text-center text-gray-500 text-xs mt-10">No active trades right now</div>
          ) : (
            activeTrades.map((t) => (
              <div key={t.id} className="bg-[#182335] border border-gray-800 p-2.5 rounded-lg space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{t.asset}</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                    t.type === 'UP' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {t.type} ${t.amount}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Entry: {t.entryPrice.toFixed(5)}</span>
                  <span className="flex items-center text-blue-400 font-mono">
                    <Clock className="w-3 h-3 mr-1" /> {t.remainingTime}s
                  </span>
                </div>
              </div>
            ))
          )
        ) : (
          closedTrades.length === 0 ? (
            <div className="text-center text-gray-500 text-xs mt-10">No closed trades yet</div>
          ) : (
            closedTrades.map((t) => (
              <div key={t.id} className="bg-[#182335] border border-gray-800 p-2.5 rounded-lg space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{t.asset}</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    t.status === 'WIN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {t.status} {t.profit >= 0 ? `+$${t.profit}` : `-$${Math.abs(t.profit)}`}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Entry: {t.entryPrice.toFixed(5)}</span>
                  <span>Exit: {t.exitPrice.toFixed(5)}</span>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}