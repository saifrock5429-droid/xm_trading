import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, User, Trophy, Store, MoreHorizontal, 
  ShieldCheck, HelpCircle as QuestionIcon, Clock, Box, Percent, Gift, XCircle, ChevronRight, Menu, Volume2, Maximize2, Settings, MessageSquare
} from 'lucide-react';

export default function Market() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full bg-[#0d121d] text-gray-200 overflow-hidden font-sans select-none">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-20 bg-[#121927] border-r border-gray-800/60 flex flex-col items-center justify-between py-3 z-10 shrink-0">
        <div className="flex flex-col items-center space-y-4 w-full">
          {/* Menu Icon Top */}
          <button className="text-gray-400 hover:text-white mb-2">
            <Menu className="w-6 h-6" />
          </button>

          <button 
            onClick={() => navigate('/terminal')} 
            className="flex flex-col items-center justify-center w-full py-2.5 text-gray-400 hover:text-white transition"
          >
            <BarChart2 className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1 tracking-wider">TRADE</span>
          </button>

          <button 
            onClick={() => navigate('/support')} 
            className="flex flex-col items-center justify-center w-full py-2.5 text-gray-400 hover:text-white transition"
          >
            <QuestionIcon className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1 tracking-wider">SUPPORT</span>
          </button>

          <button 
            onClick={() => navigate('/account')} 
            className="flex flex-col items-center justify-center w-full py-2.5 text-gray-400 hover:text-white transition"
          >
            <User className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1 tracking-wider">ACCOUNT</span>
          </button>

          <button 
            onClick={() => navigate('/tournment/active')} 
            className="flex flex-col items-center justify-center w-full py-2.5 text-gray-400 hover:text-white relative transition"
          >
            <Trophy className="w-5 h-5" />
            <span className="absolute top-1 right-3 bg-blue-500 text-white text-[9px] rounded-full px-1.5 font-bold">4</span>
            <span className="text-[9px] font-bold mt-1 tracking-wider text-center leading-tight">TOURNAMENTS</span>
          </button>

          {/* ACTIVE MARKET BUTTON */}
          <button 
            className="flex flex-col items-center justify-center w-full py-2.5 text-blue-400 bg-blue-600/20 border-l-4 border-blue-500 relative transition"
          >
            <Store className="w-5 h-5" />
            <span className="absolute top-1 right-3 bg-blue-500 text-white text-[9px] rounded-full px-1.5 font-bold">4</span>
            <span className="text-[9px] font-bold mt-1 tracking-wider">MARKET</span>
          </button>

          <button className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-white transition">
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-1 tracking-wider">MORE</span>
          </button>
        </div>

        {/* BOTTOM UTILITY BUTTONS */}
        <div className="flex flex-col items-center space-y-4 w-full text-gray-400">
          <div className="flex space-x-1">
            <Maximize2 className="w-4 h-4 cursor-pointer hover:text-white" />
            <ChevronRight className="w-4 h-4 cursor-pointer hover:text-white" />
          </div>
          <div className="flex space-x-2">
            <Settings className="w-4 h-4 cursor-pointer hover:text-white" />
            <Volume2 className="w-4 h-4 cursor-pointer hover:text-white" />
          </div>

          <button className="w-12 h-10 bg-[#1e283d] rounded-lg flex flex-col items-center justify-center text-blue-400 text-[9px] font-bold">
            <MessageSquare className="w-4 h-4" />
            JOIN US
          </button>

          <button className="w-12 h-10 bg-[#22c55e] rounded-lg flex flex-col items-center justify-center text-black font-bold text-[10px]">
            <span className="w-2 h-2 bg-white rounded-full mb-0.5"></span>
            Help
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT MARKET GRID */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#101726]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
          
          {/* CARD 1: Risk Free */}
          <MarketCard 
            icon={<ShieldCheck className="w-6 h-6 text-white" />}
            iconBg="bg-blue-600"
            title="Risk Free"
            promoCount="0 PROMO CODES AVAILABLE"
            isEmpty={true}
          />

          {/* CARD 2: Cashback */}
          <MarketCard 
            icon={<Store className="w-6 h-6 text-white" />}
            iconBg="bg-purple-600"
            title="Cashback"
            promoCount="0 PROMO CODES AVAILABLE"
            isEmpty={true}
          />

          {/* CARD 3: Deposit Bonus (With items as seen in screenshot) */}
          <div className="bg-[#172033] rounded-xl border border-gray-800 flex flex-col justify-between overflow-hidden shadow-lg">
            <div className="p-4 border-b border-gray-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">Deposit Bonus</h3>
                    <p className="text-[10px] text-emerald-400 font-bold tracking-wider">4 PROMO CODES AVAILABLE</p>
                  </div>
                </div>
                <QuestionIcon className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-300" />
              </div>

              {/* Promo List */}
              <div className="mt-4 space-y-2">
                <PromoItem code="DEPOSIT30 (30%)" date="29/10/2030" />
                <PromoItem code="DEPOSIT40 (40%)" date="29/10/2030" />
                <PromoItem code="DEPOSIT50 (50%)" date="29/10/2030" />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-3 bg-[#131b2c] flex items-center justify-between border-t border-gray-800/80">
              <button className="flex items-center text-xs text-gray-300 hover:text-white font-medium">
                <Clock className="w-4 h-4 mr-1 text-gray-400" /> Show all
              </button>
              <button className="bg-[#10b981] hover:bg-emerald-600 text-black font-bold text-xs px-3.5 py-2 rounded-lg transition">
                Enter promo code
              </button>
            </div>
          </div>

          {/* CARD 4: Percentage of turnover */}
          <MarketCard 
            icon={<Percent className="w-6 h-6 text-white" />}
            iconBg="bg-pink-600"
            title="Percentage of turnover"
            promoCount="0 PROMO CODES AVAILABLE"
            isEmpty={true}
          />

          {/* CARD 5: Balance Bonus */}
          <MarketCard 
            icon={<Gift className="w-6 h-6 text-white" />}
            iconBg="bg-indigo-600"
            title="Balance Bonus"
            promoCount="0 PROMO CODES AVAILABLE"
            isEmpty={true}
          />

          {/* CARD 6: Cancel X points */}
          <MarketCard 
            icon={<XCircle className="w-6 h-6 text-white" />}
            iconBg="bg-teal-500"
            title="Cancel X points"
            promoCount="0 PROMO CODES AVAILABLE"
            isEmpty={true}
          />

        </div>
      </main>
    </div>
  );
}

// Sub-component for Empty Cards
function MarketCard({ icon, iconBg, title, promoCount }) {
  return (
    <div className="bg-[#172033] rounded-xl border border-gray-800 flex flex-col justify-between overflow-hidden shadow-lg min-h-[290px]">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{title}</h3>
              <p className="text-[10px] text-gray-400 font-bold tracking-wider">{promoCount}</p>
            </div>
          </div>
          <QuestionIcon className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-300" />
        </div>

        {/* Column Header */}
        <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-4 px-2">
          <span>PROMO CODE</span>
          <span>STATUS</span>
          <span>USING</span>
        </div>

        {/* Empty Box State */}
        <div className="flex flex-col items-center justify-center text-center my-6 px-4">
          <div className="w-12 h-12 bg-[#202b40] rounded-xl flex items-center justify-center text-gray-500 mb-2">
            <Box className="w-6 h-6" />
          </div>
          <p className="text-xs text-gray-400 max-w-[220px]">
            You don't have a promo code history yet. You can add a promo code using the button below.
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-3 bg-[#131b2c] flex items-center justify-between border-t border-gray-800/80">
        <button className="flex items-center text-xs text-gray-300 hover:text-white font-medium">
          <Clock className="w-4 h-4 mr-1 text-gray-400" /> Show all
        </button>
        <button className="bg-[#10b981] hover:bg-emerald-600 text-black font-bold text-xs px-3.5 py-2 rounded-lg transition">
          Enter promo code
        </button>
      </div>
    </div>
  );
}

// Sub-component for Promo List items
function PromoItem({ code, date }) {
  return (
    <div className="bg-[#1c273e] p-2.5 rounded-lg flex items-center justify-between text-xs border border-gray-700/50">
      <span className="font-bold text-white">{code}</span>
      <div className="flex items-center space-x-2">
        <span className="text-[11px] text-gray-400 flex items-center">
          <span className="w-3.5 h-3.5 bg-gray-600/50 rounded-full flex items-center justify-center text-[8px] text-white mr-1">✓</span>
          {date}
        </span>
        <button className="text-blue-400 hover:underline font-semibold flex items-center text-xs">
          Use it <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>
    </div>
  );
}