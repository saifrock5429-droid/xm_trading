
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//    Trophy, Sparkles, TrendingUp, Medal, Award
// } from 'lucide-react';

// const INITIAL_USERS = [
//   { id: 'usr-849201', name: 'Alex_Trader', balance: 452633, avatar: '👨‍💻' },
//   { id: 'usr-392011', name: 'CryptoKing99', balance: 448500, avatar: '🚀' },
//   { id: 'usr-582019', name: 'Sophia_FX', balance: 435000, avatar: '👩‍💼' },
//   { id: 'usr-104928', name: 'Rahul_Bull', balance: 420000, avatar: '🐂' },
//   { id: 'usr-992381', name: 'Satoshi_N', balance: 410000, avatar: '🪙' },
//   { id: 'usr-482012', name: 'Elena_Trade', balance: 395000, avatar: '📈' },
//   { id: 'usr-753021', name: 'Vikram_Singh', balance: 380000, avatar: '👑' },
//   { id: 'usr-621943', name: 'David_FX', balance: 365000, avatar: '⚡' },
//   { id: 'usr-310492', name: 'Aisha_Crypto', balance: 350000, avatar: '💎' },
//   { id: 'usr-883012', name: 'Li_Wei_Pro', balance: 335000, avatar: '🐉' },
// ];

// export default function Tournaments() {
//   const navigate = useNavigate();
//   const [users, setUsers] = useState(INITIAL_USERS);

//   // Har 3 seconds me balances change honge aur ranks automatically upar-neeche shuffle ho jayengi
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setUsers((prevUsers) => {
//         const updated = prevUsers.map((user) => {
//           // Badi fluctuation taaki positions tezi se badlein
//           const fluctuation = Math.floor((Math.random() - 0.47) * 45000);
//           const newBalance = Math.max(50000, user.balance + fluctuation);
//           return { ...user, balance: newBalance };
//         });

//         // Turant sort karke leader ko upar aur baakio ko rank ke hisab se shift kar denge
//         updated.sort((a, b) => b.balance - a.balance);
//         return [...updated];
//       });
//     }, 3000);

//     return () => clearInterval(interval);
//   }, []);

//   const getRankBadge = (index) => {
//     if (index === 0) return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />;
//     if (index === 1) return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]" />;
//     if (index === 2) return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]" />;
//     return <span className="text-[11px] sm:text-xs font-bold text-gray-400 w-4 sm:w-5 text-center">#{index + 1}</span>;
//   };

//   return (
//     <div className="flex flex-col min-h-[100dvh] w-full bg-[#121824] text-gray-200 font-sans select-none">
      
//       {/* HEADER BAR */}
//       <header className="h-14 sm:h-16 bg-[#172033] border-b border-gray-800 flex items-center justify-between px-3 sm:px-8 shrink-0 sticky top-0 z-20">
//         <div className="flex items-center space-x-2 sm:space-x-3">
//           <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 border border-blue-500/40 rounded-lg sm:rounded-xl flex items-center justify-center text-blue-400 shrink-0">
//             <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
//           </div>
//           <div className="truncate">
//             <h1 className="text-xs sm:text-base font-bold text-white tracking-wide truncate">Trading Tournaments</h1>
//             <p className="text-[9px] sm:text-[10px] text-gray-400 truncate hidden sm:block">Compete with global traders & win massive rewards</p>
//           </div>
//         </div>

//         <button 
//           onClick={() => navigate('/terminal')}
//           className="bg-[#1e293b] hover:bg-[#283548] text-gray-300 hover:text-white text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-gray-700 transition cursor-pointer shrink-0"
//         >
//           Back to Terminal
//         </button>
//       </header>

//       {/* MAIN CONTENT AREA */}
//       <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto bg-[#121824] p-3 sm:p-6 lg:p-8 gap-4 sm:gap-6 max-w-7xl mx-auto w-full items-center lg:items-start justify-center">
        
//         {/* LEFT COMING SOON BANNER */}
//         <div className="w-full lg:w-5/12 flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-gradient-to-br from-[#172033] via-[#121824] to-[#0d131f] border border-blue-500/30 rounded-2xl sm:rounded-3xl shadow-[0_10px_30px_rgba(8,112,184,0.15)] relative overflow-hidden shrink-0">
//           <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full pointer-events-none animate-pulse"></div>

//           <div className="relative z-10 mb-3 sm:mb-4 flex justify-center">
//             <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 animate-bounce">
//               <Trophy className="w-6 h-6 sm:w-10 sm:h-10 text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]" />
//             </div>
//           </div>

//           <div className="relative z-10 space-y-1.5 sm:space-y-2">
//             <div className="inline-flex items-center space-x-1 bg-blue-500/20 text-blue-400 text-[9px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-blue-500/30">
//               <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin" />
//               <span>LIVE BATTLES SOON</span>
//             </div>

//             <h2 className="text-xl sm:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400">
//               GLOBAL LEADERBOARD
//             </h2>

//             <p className="text-[11px] sm:text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
//               Top traders are battling out for weekly prize pools. Watch rankings shuffle dynamically in real-time!
//             </p>
//           </div>
//         </div>

//         {/* RIGHT LIVE LEADERBOARD TABLE */}
//         <div className="w-full lg:w-7/12 bg-[#172033]/60 border border-gray-800 rounded-2xl p-3 sm:p-5 shadow-xl flex flex-col min-h-[420px] max-h-[580px]">
//           <div className="flex items-center justify-between pb-2.5 border-b border-gray-800 mb-2.5 shrink-0">
//             <div className="flex items-center space-x-1.5 sm:space-x-2">
//               <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
//               <h3 className="text-[11px] sm:text-sm font-bold text-white uppercase tracking-wider">Live Top Traders</h3>
//             </div>
//             <span className="inline-flex items-center text-[9px] sm:text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
//               ● Live Shuffling
//             </span>
//           </div>

//           {/* Leaderboard List */}
//           <div className="flex-1 overflow-y-auto space-y-1.5 sm:space-y-2 pr-0.5 custom-scrollbar">
//             {users.map((user, index) => (
//               <div 
//                 key={user.id}
//                 className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all duration-500 transform ${
//                   index === 0 
//                     ? 'bg-gradient-to-r from-amber-500/10 via-[#1c2638] to-[#172033] border-amber-500/40 shadow-md' 
//                     : index === 1 
//                     ? 'bg-gradient-to-r from-slate-400/10 via-[#1c2638] to-[#172033] border-slate-500/30'
//                     : index === 2 
//                     ? 'bg-gradient-to-r from-amber-700/10 via-[#1c2638] to-[#172033] border-amber-700/30'
//                     : 'bg-[#121824] border-gray-800/80 hover:border-gray-700'
//                 }`}
//               >
//                 {/* Rank & User Info */}
//                 <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
//                   <div className="w-5 sm:w-7 flex justify-center shrink-0">
//                     {getRankBadge(index)}
//                   </div>
//                   <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gray-800 rounded-full flex items-center justify-center text-sm sm:text-lg shrink-0 border border-gray-700">
//                     {user.avatar}
//                   </div>
//                   <div className="min-w-0">
//                     <div className="text-[11px] sm:text-xs font-bold text-white flex items-center gap-1 truncate">
//                       <span className="truncate">{user.name}</span>
//                       {index === 0 && <span className="text-[8px] sm:text-[9px] bg-amber-500/20 text-amber-400 px-1 py-0.1 rounded font-mono shrink-0">👑 Leader</span>}
//                     </div>
//                     <div className="text-[9px] sm:text-[10px] text-gray-400 font-mono truncate">ID: {user.id}</div>
//                   </div>
//                 </div>

//                 {/* Balance & Trend */}
//                 <div className="text-right shrink-0 ml-2">
//                   <div className="text-xs sm:text-sm font-extrabold text-emerald-400 font-mono transition-all duration-300">
//                     ${user.balance.toLocaleString('en-US')}
//                   </div>
//                   <div className="text-[9px] sm:text-[10px] text-gray-400 flex items-center justify-end space-x-0.5 mt-0.5">
//                     <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500" />
//                     <span className="hidden sm:inline">Active Balance</span>
//                     <span className="sm:hidden">Active</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//       </main>

//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
   Trophy, Sparkles, TrendingUp, Medal, Award
} from 'lucide-react';

const INITIAL_USERS = [
  { id: 'usr-849201', name: 'Alex_Trader', balance: 585, avatar: '👨‍💻' },
  { id: 'usr-392011', name: 'CryptoKing99', balance: 540, avatar: '🚀' },
  { id: 'usr-582019', name: 'Sophia_FX', balance: 512, avatar: '👩‍💼' },
  { id: 'usr-104928', name: 'Rahul_Bull', balance: 488, avatar: '🐂' },
  { id: 'usr-992381', name: 'Satoshi_N', balance: 470, avatar: '🪙' },
  { id: 'usr-482012', name: 'Elena_Trade', balance: 455, avatar: '📈' },
  { id: 'usr-753021', name: 'Vikram_Singh', balance: 440, avatar: '👑' },
  { id: 'usr-621943', name: 'David_FX', balance: 425, avatar: '⚡' },
  { id: 'usr-310492', name: 'Aisha_Crypto', balance: 410, avatar: '💎' },
  { id: 'usr-883012', name: 'Li_Wei_Pro', balance: 395, avatar: '🐉' },
];

export default function Tournaments() {
  const navigate = useNavigate();
  const [users, setUsers] = useState(INITIAL_USERS);

  // Har 3 seconds me balances change honge aur ranks automatically upar-neeche shuffle ho jayengi ($350 - $650 range)
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prevUsers) => {
        const updated = prevUsers.map((user) => {
          const fluctuation = Math.floor((Math.random() - 0.47) * 45);
          const newBalance = Math.min(650, Math.max(350, user.balance + fluctuation));
          return { ...user, balance: newBalance };
        });

        // Turant sort karke leader ko upar aur baakio ko rank ke hisab se shift kar denge
        updated.sort((a, b) => b.balance - a.balance);
        return [...updated];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getRankBadge = (index) => {
    if (index === 0) return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />;
    if (index === 1) return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.6)]" />;
    if (index === 2) return <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.6)]" />;
    return <span className="text-[11px] sm:text-xs font-bold text-gray-400 w-4 sm:w-5 text-center">#{index + 1}</span>;
  };

  return (
    <div className="flex flex-col min-h-[100dvh] w-full bg-[#121824] text-gray-200 font-sans select-none">
      
      {/* HEADER BAR */}
      <header className="h-14 sm:h-16 bg-[#172033] border-b border-gray-800 flex items-center justify-between px-3 sm:px-8 shrink-0 sticky top-0 z-20">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600/20 border border-blue-500/40 rounded-lg sm:rounded-xl flex items-center justify-center text-blue-400 shrink-0">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="truncate">
            <h1 className="text-xs sm:text-base font-bold text-white tracking-wide truncate">Trading Tournaments</h1>
            <p className="text-[9px] sm:text-[10px] text-gray-400 truncate hidden sm:block">Compete with global traders & win massive rewards</p>
          </div>
        </div>

        <button 
          onClick={() => navigate('/terminal')}
          className="bg-[#1e293b] hover:bg-[#283548] text-gray-300 hover:text-white text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-lg border border-gray-700 transition cursor-pointer shrink-0"
        >
          Back to Terminal
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto bg-[#121824] p-3 sm:p-6 lg:p-8 gap-4 sm:gap-6 max-w-7xl mx-auto w-full items-center lg:items-start justify-center">
        
        {/* LEFT COMING SOON BANNER */}
        <div className="w-full lg:w-5/12 flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-gradient-to-br from-[#172033] via-[#121824] to-[#0d131f] border border-blue-500/30 rounded-2xl sm:rounded-3xl shadow-[0_10px_30px_rgba(8,112,184,0.15)] relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full pointer-events-none animate-pulse"></div>

          <div className="relative z-10 mb-3 sm:mb-4 flex justify-center">
            <div className="w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 animate-bounce">
              <Trophy className="w-6 h-6 sm:w-10 sm:h-10 text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]" />
            </div>
          </div>

          <div className="relative z-10 space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center space-x-1 bg-blue-500/20 text-blue-400 text-[9px] sm:text-xs font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-blue-500/30">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-spin" />
              <span>LIVE BATTLES SOON</span>
            </div>

            <h2 className="text-xl sm:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-400">
              GLOBAL LEADERBOARD
            </h2>

            <p className="text-[11px] sm:text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
              Top traders are battling out for weekly prize pools. Watch rankings shuffle dynamically in real-time!
            </p>
          </div>
        </div>

        {/* RIGHT LIVE LEADERBOARD TABLE */}
        <div className="w-full lg:w-7/12 bg-[#172033]/60 border border-gray-800 rounded-2xl p-3 sm:p-5 shadow-xl flex flex-col min-h-[420px] max-h-[580px]">
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-800 mb-2.5 shrink-0">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <h3 className="text-[11px] sm:text-sm font-bold text-white uppercase tracking-wider">Live Top Traders</h3>
            </div>
            <span className="inline-flex items-center text-[9px] sm:text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 animate-pulse">
              ● Live Shuffling
            </span>
          </div>

          {/* Leaderboard List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 sm:space-y-2 pr-0.5 custom-scrollbar">
            {users.map((user, index) => (
              <div 
                key={user.id}
                className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all duration-500 transform ${
                  index === 0 
                    ? 'bg-gradient-to-r from-amber-500/10 via-[#1c2638] to-[#172033] border-amber-500/40 shadow-md' 
                    : index === 1 
                    ? 'bg-gradient-to-r from-slate-400/10 via-[#1c2638] to-[#172033] border-slate-500/30'
                    : index === 2 
                    ? 'bg-gradient-to-r from-amber-700/10 via-[#1c2638] to-[#172033] border-amber-700/30'
                    : 'bg-[#121824] border-gray-800/80 hover:border-gray-700'
                }`}
              >
                {/* Rank & User Info */}
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <div className="w-5 sm:w-7 flex justify-center shrink-0">
                    {getRankBadge(index)}
                  </div>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gray-800 rounded-full flex items-center justify-center text-sm sm:text-lg shrink-0 border border-gray-700">
                    {user.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] sm:text-xs font-bold text-white flex items-center gap-1 truncate">
                      <span className="truncate">{user.name}</span>
                      {index === 0 && <span className="text-[8px] sm:text-[9px] bg-amber-500/20 text-amber-400 px-1 py-0.1 rounded font-mono shrink-0">👑 Leader</span>}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-gray-400 font-mono truncate">ID: {user.id}</div>
                  </div>
                </div>

                {/* Balance & Trend */}
                <div className="text-right shrink-0 ml-2">
                  <div className="text-xs sm:text-sm font-extrabold text-emerald-400 font-mono transition-all duration-300">
                    ${user.balance.toLocaleString('en-US')}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-gray-400 flex items-center justify-end space-x-0.5 mt-0.5">
                    <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-500" />
                    <span className="hidden sm:inline">Active Balance</span>
                    <span className="sm:hidden">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}