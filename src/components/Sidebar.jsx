import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart2, History, HelpCircle, User, Trophy, Store } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, showTradesDrawer, setShowTradesDrawer, activeTradesCount }) {
  const navigate = useNavigate();

  return (
    <aside className="w-16 bg-[#121927] border-r border-gray-800 flex-col items-center justify-between py-3 z-10 hidden md:flex shrink-0">
      <div className="flex flex-col items-center space-y-5 w-full">
        <button 
          onClick={() => setActiveTab('trade')}
          className={`flex flex-col items-center justify-center w-full py-2 border-l-2 ${
            activeTab === 'trade' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-gray-400'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[9px] font-medium mt-1">TRADE</span>
        </button>

        <button 
          onClick={() => setShowTradesDrawer(!showTradesDrawer)}
          className={`flex flex-col items-center justify-center w-full py-2 border-l-2 relative ${
            showTradesDrawer ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-transparent text-gray-400'
          }`}
        >
          <History className="w-5 h-5" />
          {activeTradesCount > 0 && (
            <span className="absolute top-1 right-2 bg-emerald-500 text-black text-[8px] rounded-full px-1 font-bold">
              {activeTradesCount}
            </span>
          )}
          <span className="text-[9px] font-medium mt-1">TRADES</span>
        </button>

        <button onClick={() => navigate('/support')} className="flex flex-col items-center justify-center w-full py-2 text-gray-400">
          <HelpCircle className="w-5 h-5" />
          <span className="text-[9px] font-medium mt-1">SUPPORT</span>
        </button>

        <button onClick={() => navigate('/account')} className="flex flex-col items-center justify-center w-full py-2 text-gray-400">
          <User className="w-5 h-5" />
          <span className="text-[9px] font-medium mt-1">ACCOUNT</span>
        </button>

        <button onClick={() => navigate('/tournment/active')} className="flex flex-col items-center justify-center w-full py-2 text-gray-400 relative">
          <Trophy className="w-5 h-5" />
          <span className="text-[9px] font-medium mt-1">TOURNAMENTS</span>
        </button>

        <button onClick={() => navigate('/market')} className="flex flex-col items-center justify-center w-full py-2 text-gray-400 relative">
          <Store className="w-5 h-5" />
          <span className="text-[9px] font-medium mt-1">MARKET</span>
        </button>
      </div>
    </aside>
  );
}