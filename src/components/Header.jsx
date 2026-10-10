

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ChevronDown, History, ArrowUpRight, DollarSign } from 'lucide-react';

export default function Header({ balance, showTradesDrawer, setShowTradesDrawer, activeTradesCount }) {
  const navigate = useNavigate();

  return (
    <header className="h-12 sm:h-14 bg-[#121927] border-b border-gray-800 flex items-center justify-between px-2 sm:px-4 z-20 shrink-0">
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-[#1c2638] border border-gray-700/80 rounded-md px-2.5 py-1 cursor-pointer">
          <Send className="w-3.5 h-3.5 text-emerald-400 mr-1.5 fill-emerald-400 shrink-0" />
          <span className="text-[10px] sm:text-xs font-bold text-gray-300 mr-1.5">LIVE</span>
          {/* USD Symbol with balance */}
          <span className="text-xs sm:text-sm font-extrabold text-emerald-400 flex items-center">
            <DollarSign className="w-3.5 h-3.5" />
            {Number(balance).toFixed(2)}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1 shrink-0" />
        </div>
      </div>

      <div className="flex items-center space-x-1.5 sm:space-x-2">
        <button 
          onClick={() => setShowTradesDrawer(!showTradesDrawer)}
          className="relative bg-[#1c2638] hover:bg-[#253247] text-gray-200 font-semibold px-2.5 py-1.5 rounded-md text-xs border border-gray-700/80 flex items-center space-x-1 cursor-pointer"
        >
          <History className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Trades</span>
          {activeTradesCount > 0 && (
            <span className="bg-emerald-500 text-black text-[10px] font-bold px-1.5 rounded-full">
              {activeTradesCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => navigate('/terminal/withdrawal')}
          className="bg-[#1c2638] hover:bg-[#253247] text-gray-200 font-semibold px-2.5 sm:px-3 py-1.5 rounded-md text-xs border border-gray-700/80 flex items-center transition cursor-pointer"
        >
          <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-gray-400 hidden sm:inline" />
          Withdraw
        </button>

        <button 
          onClick={() => navigate('/terminal/deposit')}
          className="bg-[#22c55e] hover:bg-emerald-600 text-black font-bold px-2.5 sm:px-3 py-1.5 rounded-md text-xs flex items-center transition cursor-pointer"
        >
          Deposit
        </button>
      </div>
    </header>
  );
}