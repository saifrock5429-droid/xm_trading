import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Headphones, MessageCircle, Send, ShieldCheck, X, ExternalLink } from 'lucide-react';

export default function SupportPage() {
  const navigate = useNavigate();

  const handleTelegramSupport = () => {
    window.open('https://t.me/Kingtradexsupport', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen w-full bg-[#0d121d] text-white flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-[#121927] rounded-2xl border border-gray-800 shadow-2xl p-6 sm:p-8 relative overflow-hidden">
        
        {/* Glow Effect Background */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Header with Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Headphones className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Customer Support</h1>
          </div>
          <button 
            onClick={() => navigate('/terminal')} 
            className="text-gray-400 hover:text-white transition p-1.5 rounded-lg hover:bg-gray-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Section */}
        <div className="py-8 text-center space-y-6 relative z-10">
          
          {/* Main Support Icon */}
          <div 
            onClick={handleTelegramSupport}
            className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-3xl p-0.5 shadow-xl shadow-blue-500/20 hover:scale-105 transition duration-300 cursor-pointer group"
          >
            <div className="w-full h-full bg-[#121927] rounded-[22px] flex items-center justify-center relative overflow-hidden">
              <Send className="w-9 h-9 text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition duration-300" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">How can we help you?</h2>
            <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
              Our support team is active 24/7 on Telegram to assist you with deposits, withdrawals, and trading queries.
            </p>
          </div>

          {/* Features Card */}
          <div className="bg-[#182335]/70 border border-gray-800 rounded-xl p-4 space-y-3 text-left">
            <div className="flex items-center space-x-3 text-xs text-gray-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Official KingTradeX Verified Support</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-gray-300">
              <MessageCircle className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Average response time: &lt; 2 minutes</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleTelegramSupport}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold py-4 rounded-xl text-sm transition shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 active:scale-[0.98] cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Connect on Telegram</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>

        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-gray-800/80 text-center relative z-10">
          <p className="text-[11px] text-gray-500">
            Official Telegram ID: <span className="text-blue-400 font-mono font-semibold">@Kingtradexsupport</span>
          </p>
        </div>

      </div>
    </div>
  );
}