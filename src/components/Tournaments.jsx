import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, HelpCircle, User, Trophy, Store, Sparkles 
} from 'lucide-react';

export default function Tournaments() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#121824] text-gray-200 font-sans select-none overflow-hidden">
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#121824] px-4 sm:px-6 py-4 items-center justify-center">
        
        {/* 3D ANIMATED COMING SOON SECTION */}
        <div className="flex flex-col items-center justify-center p-2 sm:p-6 text-center w-full my-auto">
          <div className="relative group perspective-1000 max-w-lg w-full py-10 sm:py-16 px-6 sm:px-8 bg-gradient-to-br from-[#172033] via-[#121824] to-[#0d131f] border border-blue-500/30 rounded-3xl shadow-[0_20px_50px_rgba(8,112,184,0.2)] transform transition-transform duration-500 hover:scale-105">
            
            {/* Glowing Background Blur Effect */}
            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full pointer-events-none animate-pulse"></div>

            {/* Floating Trophy Icon */}
            <div className="relative z-10 mb-5 sm:mb-6 flex justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 animate-bounce">
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]" />
              </div>
            </div>

            {/* 3D Styled Typography Effect */}
            <div className="relative z-10 space-y-2 sm:space-y-3">
              <div className="inline-flex items-center space-x-1.5 bg-blue-500/20 text-blue-400 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30 mb-1">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                <span>EXCITING BATTLES AHEAD</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400 drop-shadow-[0_4px_10px_rgba(59,130,246,0.4)]">
                COMING SOON
              </h2>

              <p className="text-xs sm:text-sm text-gray-400 max-w-xs mx-auto leading-relaxed pt-1 sm:pt-2">
                We are crafting epic trading tournaments with massive prize pools for you. Stay tuned!
              </p>
            </div>

            {/* Bottom Action Button */}
            <div className="relative z-10 mt-6 sm:mt-8">
              <button 
                onClick={() => navigate('/terminal')}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold px-6 py-2.5 sm:py-3 rounded-xl shadow-lg shadow-blue-600/30 transition transform active:scale-95 cursor-pointer"
              >
                Back to Trading
              </button>
            </div>

          </div>
        </div>

      </main>

    </div>
  );
}