

// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   BarChart2, HelpCircle, User, Trophy, Store, MoreHorizontal, 
//   Plus, Bell, ChevronDown, Minus, ArrowUp, ArrowDown, 
//   Settings, Volume2, Maximize2, ShieldCheck,
//   Briefcase, Send, X, ArrowUpRight
// } from 'lucide-react';

// export default function TradingTerminal() {
//   const navigate = useNavigate();

//   // Trading States
//   const [balance, setBalance] = useState(10000.00);
//   const [selectedAsset] = useState({ symbol: 'AUD/USD', payout: 87 });
//   const [time, setTime] = useState('00:00');
//   const [investment, setInvestment] = useState(100);
//   const [activeTab, setActiveTab] = useState('trade');
//   const [trades, setTrades] = useState([]);
//   const [currentPrice, setCurrentPrice] = useState(0.69781);
//   const [timerCountdown, setTimerCountdown] = useState(20);
//   const [showBonus, setShowBonus] = useState(true);

//   // Canvas Reference
//   const canvasRef = useRef(null);
//   const candlesRef = useRef([
//     { open: 0.69830, high: 0.69920, low: 0.69800, close: 0.69880 },
//     { open: 0.69880, high: 0.69900, low: 0.69840, close: 0.69850 },
//     { open: 0.69850, high: 0.69890, low: 0.69810, close: 0.69860 },
//     { open: 0.69860, high: 0.69870, low: 0.69815, close: 0.69820 },
//     { open: 0.69820, high: 0.69910, low: 0.69780, close: 0.69800 },
//     { open: 0.69800, high: 0.69880, low: 0.69760, close: 0.69770 },
//     { open: 0.69770, high: 0.69950, low: 0.69760, close: 0.69940 },
//     { open: 0.69940, high: 0.70010, low: 0.69930, close: 0.70000 },
//     { open: 0.70000, high: 0.70071, low: 0.69950, close: 0.69970 },
//     { open: 0.69970, high: 0.69980, low: 0.69890, close: 0.69910 },
//     { open: 0.69910, high: 0.69930, low: 0.69860, close: 0.69880 },
//     { open: 0.69880, high: 0.69900, low: 0.69850, close: 0.69890 },
//     { open: 0.69890, high: 0.69940, low: 0.69760, close: 0.69781 }
//   ]);

//   // Real-Time Price Simulation
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const delta = (Math.random() - 0.49) * 0.00012;

//       candlesRef.current = candlesRef.current.map((candle, idx) => {
//         if (idx === candlesRef.current.length - 1) {
//           const newClose = +(candle.close + delta).toFixed(5);
//           return {
//             ...candle,
//             close: newClose,
//             high: Math.max(candle.high, newClose),
//             low: Math.min(candle.low, newClose)
//           };
//         }
//         return candle;
//       });

//       const latestCandle = candlesRef.current[candlesRef.current.length - 1];
//       setCurrentPrice(latestCandle.close);

//       setTimerCountdown((prev) => {
//         if (prev <= 1) {
//           const lastClose = candlesRef.current[candlesRef.current.length - 1].close;
//           candlesRef.current.shift();
//           candlesRef.current.push({
//             open: lastClose,
//             high: lastClose,
//             low: lastClose,
//             close: lastClose
//           });
//           return 30;
//         }
//         return prev - 1;
//       });

//     }, 400);

//     return () => clearInterval(interval);
//   }, []);

//   // Canvas Rendering & Dynamic Resize
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');

//     const renderChart = () => {
//       const parent = canvas.parentElement;
//       if (!parent) return;

//       const width = parent.clientWidth;
//       const height = parent.clientHeight;
//       canvas.width = width * window.devicePixelRatio;
//       canvas.height = height * window.devicePixelRatio;
//       ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

//       ctx.fillStyle = '#111726';
//       ctx.fillRect(0, 0, width, height);

//       ctx.strokeStyle = '#1d273a';
//       ctx.lineWidth = 1;

//       const minPrice = 0.69750;
//       const maxPrice = 0.70050;
//       const priceRange = maxPrice - minPrice;

//       for (let p = 0.69800; p <= 0.70000; p += 0.00100) {
//         const y = height - ((p - minPrice) / priceRange) * height;
//         ctx.beginPath();
//         ctx.moveTo(0, y);
//         ctx.lineTo(width, y);
//         ctx.stroke();

//         ctx.fillStyle = '#616e85';
//         ctx.font = '10px sans-serif';
//         ctx.fillText(p.toFixed(5), width - 50, y - 4);
//       }

//       const candles = candlesRef.current;
//       const candleWidth = Math.max(4, Math.floor((width - 55) / candles.length));

//       candles.forEach((c, i) => {
//         const x = i * candleWidth + 10;
//         const openY = height - ((c.open - minPrice) / priceRange) * height;
//         const closeY = height - ((c.close - minPrice) / priceRange) * height;
//         const highY = height - ((c.high - minPrice) / priceRange) * height;
//         const lowY = height - ((c.low - minPrice) / priceRange) * height;

//         const isGreen = c.close >= c.open;
//         const color = isGreen ? '#22c55e' : '#ef4444';

//         ctx.strokeStyle = color;
//         ctx.lineWidth = 1.5;
//         ctx.beginPath();
//         ctx.moveTo(x + candleWidth / 2, highY);
//         ctx.lineTo(x + candleWidth / 2, lowY);
//         ctx.stroke();

//         ctx.fillStyle = color;
//         const bodyY = Math.min(openY, closeY);
//         const bodyHeight = Math.max(Math.abs(closeY - openY), 3);
//         ctx.fillRect(x + 1, bodyY, Math.max(candleWidth - 2, 2), bodyHeight);
//       });

//       const expX = Math.max(width - 100, 100);
//       ctx.setLineDash([4, 4]);
//       ctx.strokeStyle = '#64748b';
//       ctx.beginPath();
//       ctx.moveTo(expX, 0);
//       ctx.lineTo(expX, height);
//       ctx.stroke();
//       ctx.setLineDash([]);

//       ctx.fillStyle = '#94a3b8';
//       ctx.font = '9px sans-serif';
//       ctx.fillText('Beginning of trade', expX - 80, 15);
//       ctx.fillText('End of trade', expX + 5, 15);

//       const currentY = height - ((currentPrice - minPrice) / priceRange) * height;
//       ctx.setLineDash([3, 3]);
//       ctx.strokeStyle = '#2563eb';
//       ctx.beginPath();
//       ctx.moveTo(0, currentY);
//       ctx.lineTo(width - 55, currentY);
//       ctx.stroke();
//       ctx.setLineDash([]);

//       ctx.fillStyle = '#2563eb';
//       ctx.fillRect(width - 58, currentY - 10, 56, 20);
//       ctx.fillStyle = '#ffffff';
//       ctx.font = 'bold 10px sans-serif';
//       ctx.fillText(currentPrice.toFixed(5), width - 54, currentY + 4);

//       ctx.fillStyle = '#1e293b';
//       ctx.fillRect(expX - 18, currentY - 9, 34, 18);
//       ctx.fillStyle = '#ffffff';
//       ctx.font = '9px sans-serif';
//       ctx.fillText(`16:${timerCountdown}`, expX - 14, currentY + 3);
//     };

//     renderChart();

//     window.addEventListener('resize', renderChart);
//     return () => window.removeEventListener('resize', renderChart);

//   }, [currentPrice, timerCountdown]);

//   const handleTrade = (type) => {
//     const newTrade = {
//       id: Date.now(),
//       asset: selectedAsset.symbol,
//       amount: investment,
//       type: type,
//       entryPrice: currentPrice,
//       payout: (investment * (1 + selectedAsset.payout / 100)).toFixed(0),
//       time: new Date().toLocaleTimeString()
//     };
//     setBalance(prev => prev - investment);
//     setTrades([newTrade, ...trades]);
//   };

//   return (
//     <div className="flex flex-col h-screen h-[100dvh] w-full max-w-full bg-[#0d121d] text-gray-200 overflow-hidden font-sans select-none">

//       {/* TOP HEADER */}
//       <header className="h-12 sm:h-14 bg-[#121927] border-b border-gray-800 flex items-center justify-between px-2 sm:px-4 z-20 shrink-0">
        
//         {/* Account Selector */}
//         <div className="flex items-center bg-[#1c2638] border border-gray-700/80 rounded-md px-2 py-1 cursor-pointer">
//           <Send className="w-3.5 h-3.5 text-emerald-400 mr-1 sm:mr-1.5 fill-emerald-400 shrink-0" />
//           <span className="text-[10px] sm:text-xs font-bold text-gray-300 mr-1 sm:mr-1.5">LIVE</span>
//           <span className="text-xs sm:text-sm font-extrabold text-white">${balance.toFixed(2)}</span>
//           <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1 shrink-0" />
//         </div>

//         {/* Action Buttons (Deposit + Withdrawal) */}
//         <div className="flex items-center space-x-1.5 sm:space-x-2">
//           <button className="relative p-1.5 bg-[#1c2638] rounded-md text-gray-300 hover:bg-[#253247] transition">
//             <Bell className="w-4 h-4" />
//             <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 text-white text-[8px] sm:text-[9px] font-bold rounded-full flex items-center justify-center">8</span>
//           </button>

//           {/* Withdrawal Button */}
//           <button 
//             onClick={() => navigate('/terminal/withdrawal')}
//             className="bg-[#1c2638] hover:bg-[#253247] text-gray-200 font-semibold px-2.5 sm:px-3 py-1.5 rounded-md text-xs border border-gray-700/80 flex items-center transition cursor-pointer"
//           >
//             <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-gray-400 hidden sm:inline" />
//             Withdraw
//           </button>

//           {/* Deposit Button */}
//           <button 
//             onClick={() => navigate('/terminal/deposit')}
//             className="bg-[#22c55e] hover:bg-emerald-600 text-black font-bold px-2.5 sm:px-3 py-1.5 rounded-md text-xs flex items-center transition cursor-pointer"
//           >
//             Deposit
//           </button>
//         </div>
//       </header>

//       {/* PROMO BONUS BANNER */}
//       {showBonus && (
//         <div className="bg-[#1bb954] text-white text-xs py-1 px-3 flex items-center justify-between shrink-0">
//           <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-hidden text-ellipsis whitespace-nowrap">
//             <span>🚀</span>
//             <span className="font-semibold text-[10px] sm:text-xs truncate">
//               Get a <strong className="underline">50% bonus</strong> on your deposit!
//             </span>
//             <span className="bg-[#14863c] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0">50%</span>
//           </div>
//           <button onClick={() => setShowBonus(false)} className="text-white hover:opacity-80 ml-2 shrink-0">
//             <X className="w-3.5 h-3.5" />
//           </button>
//         </div>
//       )}

//       {/* MAIN CONTENT WORKSPACE */}
//       <div className="flex flex-1 overflow-hidden relative">

//         {/* DESKTOP LEFT SIDEBAR */}
//         <aside className="w-16 bg-[#121927] border-r border-gray-800 flex-col items-center justify-between py-3 z-10 hidden md:flex">
//           <div className="flex flex-col items-center space-y-5 w-full">
//             <button 
//               onClick={() => setActiveTab('trade')}
//               className={`flex flex-col items-center justify-center w-full py-2 border-l-2 ${activeTab === 'trade' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-gray-400'}`}
//             >
//               <BarChart2 className="w-5 h-5" />
//               <span className="text-[9px] font-medium mt-1">TRADE</span>
//             </button>
//             <button 
//               onClick={() => navigate('/support')}
//               className={`flex flex-col items-center justify-center w-full py-2 border-l-2 ${activeTab === 'support' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-gray-400'}`}
//             >
//               <HelpCircle className="w-5 h-5" />
//               <span className="text-[9px] font-medium mt-1">SUPPORT</span>
//             </button>
//             <button onClick={() => navigate('/account')} className="flex flex-col items-center justify-center w-full py-2 text-gray-400">
//               <User className="w-5 h-5" />
//               <span className="text-[9px] font-medium mt-1">ACCOUNT</span>
//             </button>
//             <button onClick={() => navigate('/tournment/active')} className="flex flex-col items-center justify-center w-full py-2 text-gray-400 relative">
//               <Trophy className="w-5 h-5" />
//               <span className="absolute top-1 right-2 bg-blue-500 text-white text-[8px] rounded-full px-1 font-bold">3</span>
//               <span className="text-[9px] font-medium mt-1">TOURNAMENTS</span>
//             </button>
//             <button 
//               onClick={() => navigate('/market')} 
//               className={`flex flex-col items-center justify-center w-full py-2 border-l-2 ${activeTab === 'market' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-gray-400'}`}
//             >
//               <Store className="w-5 h-5" />
//               <span className="absolute top-1 right-2 bg-blue-500 text-white text-[8px] rounded-full px-1 font-bold">4</span>
//               <span className="text-[9px] font-medium mt-1">MARKET</span>
//             </button>
//           </div>
//           <div className="flex flex-col items-center space-y-4 w-full text-gray-400">
//             <Maximize2 className="w-4 h-4 cursor-pointer" />
//             <Volume2 className="w-4 h-4 cursor-pointer" />
//             <Settings className="w-4 h-4 cursor-pointer" />
//           </div>
//         </aside>

//         {/* CHART SECTION */}
//         <main className="flex-1 flex flex-col relative bg-[#0d121d] overflow-hidden">
//           <div className="flex-1 relative w-full h-full min-h-[180px]">

//             {/* Floating Top Left Controls */}
//             <div className="absolute top-2 left-2 flex flex-col space-y-1.5 z-10">
//               <button className="bg-[#1c2638]/80 backdrop-blur text-gray-300 p-1.5 rounded-lg border border-gray-700/60 shadow">
//                 <MoreHorizontal className="w-4 h-4" />
//               </button>
//               <button className="bg-[#1c2638]/80 backdrop-blur text-gray-300 p-1.5 rounded-lg border border-gray-700/60 shadow relative">
//                 <Briefcase className="w-4 h-4" />
//                 <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">0</span>
//               </button>
//             </div>

//             <canvas ref={canvasRef} className="w-full h-full block" />
//           </div>

//           {/* MOBILE BOTTOM CONTROL PANEL */}
//           <div className="bg-[#121927] border-t border-gray-800 p-2 sm:p-2.5 space-y-2 md:hidden shrink-0">
            
//             {/* Asset Selector Header */}
//             <div className="flex items-center justify-between text-xs font-bold text-white px-1">
//               <div className="flex items-center space-x-1.5 cursor-pointer">
//                 <span>🇦🇺🇺🇸</span>
//                 <span>{selectedAsset.symbol}</span>
//                 <span className="text-orange-400">{selectedAsset.payout}%</span>
//                 <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
//               </div>
              
//               <div className="flex items-center space-x-1.5 text-[10px] text-blue-400">
//                 <span>PENDING TRADE</span>
//                 <div className="w-7 h-4 bg-blue-600 rounded-full p-0.5 flex justify-end cursor-pointer">
//                   <div className="w-3 h-3 bg-white rounded-full"></div>
//                 </div>
//               </div>
//             </div>

//             {/* Inputs Grid */}
//             <div className="grid grid-cols-2 gap-2">
              
//               {/* Timer Input */}
//               <div className="bg-[#1a2332] border border-gray-700/80 rounded-lg p-1.5">
//                 <label className="text-[9px] text-gray-400 block">Timer</label>
//                 <div className="text-xs sm:text-sm font-bold text-white tracking-wider mt-0.5">{time}</div>
//               </div>

//               {/* Investment Input */}
//               <div className="bg-[#1a2332] border border-gray-700/80 rounded-lg p-1.5 relative">
//                 <div className="flex justify-between items-center">
//                   <span className="text-[9px] text-gray-400">Investment</span>
//                   <span className="text-[8px] text-blue-400 font-bold cursor-pointer">SWITCH</span>
//                 </div>
//                 <div className="flex justify-between items-center mt-0.5">
//                   <button onClick={() => setInvestment(p => Math.max(10, p - 10))} className="w-5 h-5 bg-[#253247] rounded flex items-center justify-center text-gray-300">
//                     <Minus className="w-3 h-3" />
//                   </button>
//                   <span className="text-xs sm:text-sm font-bold text-white">{investment} $</span>
//                   <button onClick={() => setInvestment(p => p + 10)} className="w-5 h-5 bg-[#253247] rounded flex items-center justify-center text-gray-300">
//                     <Plus className="w-3 h-3" />
//                   </button>
//                 </div>
//               </div>

//             </div>

//             {/* Payout Display */}
//             <div className="flex justify-between items-center text-xs px-1">
//               <span className="text-gray-400 text-[10px] sm:text-[11px]">Payout</span>
//               <span className="text-white font-bold text-xs">{(investment * (1 + selectedAsset.payout / 100)).toFixed(0)} $</span>
//             </div>

//             {/* Buy / Sell Buttons */}
//             <div className="grid grid-cols-2 gap-2">
//               <button 
//                 onClick={() => handleTrade('UP')}
//                 className="bg-[#22c55e] active:scale-95 text-black font-extrabold py-2 sm:py-2.5 rounded-lg flex items-center justify-between px-3 sm:px-4 text-xs sm:text-sm shadow transition cursor-pointer"
//               >
//                 <span>Buy</span>
//                 <div className="w-5 h-5 bg-emerald-600/40 rounded-full flex items-center justify-center">
//                   <ArrowUp className="w-3.5 h-3.5 stroke-[3] text-black" />
//                 </div>
//               </button>

//               <button 
//                 onClick={() => handleTrade('DOWN')}
//                 className="bg-[#ef4444] active:scale-95 text-white font-extrabold py-2 sm:py-2.5 rounded-lg flex items-center justify-between px-3 sm:px-4 text-xs sm:text-sm shadow transition cursor-pointer"
//               >
//                 <span>Sell</span>
//                 <div className="w-5 h-5 bg-red-700/40 rounded-full flex items-center justify-center">
//                   <ArrowDown className="w-3.5 h-3.5 stroke-[3] text-white" />
//                 </div>
//               </button>
//             </div>

//           </div>

//         </main>

//         {/* DESKTOP RIGHT TRADING PANEL */}
//         <aside className="w-72 bg-[#121927] border-l border-gray-800 p-4 flex-col justify-between z-10 hidden md:flex shrink-0">
//           <div className="space-y-4">
//             <div className="flex justify-between items-center bg-[#182335] p-2.5 rounded-lg border border-gray-800">
//               <div className="flex items-center space-x-2">
//                 <span className="text-base">🇦🇺🇺🇸</span>
//                 <div>
//                   <div className="text-xs font-bold text-white">{selectedAsset.symbol}</div>
//                   <div className="text-[10px] text-emerald-400 font-semibold flex items-center">
//                     <ShieldCheck className="w-3 h-3 mr-0.5" /> Payout: {selectedAsset.payout}%
//                   </div>
//                 </div>
//               </div>
//               <ChevronDown className="w-4 h-4 text-gray-400" />
//             </div>

//             <div>
//               <div className="flex justify-between text-[11px] text-gray-400 mb-1">
//                 <span>Time</span>
//                 <span className="text-blue-400 cursor-pointer">SWITCH TIME</span>
//               </div>
//               <div className="flex items-center bg-[#182335] border border-gray-700 rounded-lg p-1.5 justify-between">
//                 <button onClick={() => setTime('00:00')} className="p-1 text-gray-300"><Minus className="w-4 h-4" /></button>
//                 <span className="font-mono text-sm font-bold text-white">{time}</span>
//                 <button onClick={() => setTime('00:15')} className="p-1 text-gray-300"><Plus className="w-4 h-4" /></button>
//               </div>
//             </div>

//             <div>
//               <div className="flex justify-between text-[11px] text-gray-400 mb-1">
//                 <span>Investment</span>
//                 <span className="text-blue-400 cursor-pointer">SWITCH</span>
//               </div>
//               <div className="flex items-center bg-[#182335] border border-gray-700 rounded-lg p-1.5 justify-between">
//                 <button onClick={() => setInvestment(p => Math.max(10, p - 10))} className="p-1 text-gray-300"><Minus className="w-4 h-4" /></button>
//                 <div className="font-mono text-sm font-bold text-white">${investment}</div>
//                 <button onClick={() => setInvestment(p => p + 10)} className="p-1 text-gray-300"><Plus className="w-4 h-4" /></button>
//               </div>
//             </div>

//             <div className="flex justify-between items-center text-xs py-1 border-t border-b border-gray-800">
//               <span className="text-gray-400">Expected Payout</span>
//               <span className="text-emerald-400 font-bold text-sm">${(investment * (1 + selectedAsset.payout / 100)).toFixed(0)}$</span>
//             </div>

//             <div className="space-y-2 pt-1">
//               <button 
//                 onClick={() => handleTrade('UP')}
//                 className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-between px-5 transition cursor-pointer"
//               >
//                 <span>Buy</span>
//                 <ArrowUp className="w-5 h-5 stroke-[3]" />
//               </button>

//               <button 
//                 onClick={() => handleTrade('DOWN')}
//                 className="w-full bg-red-500 hover:bg-red-600 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-between px-5 transition cursor-pointer"
//               >
//                 <span>Sell</span>
//                 <ArrowDown className="w-5 h-5 stroke-[3]" />
//               </button>
//             </div>
//           </div>
//         </aside>

//       </div>

//       {/* MOBILE BOTTOM NAVIGATION BAR */}
//       <nav className="h-12 bg-[#121927] border-t border-gray-800 flex items-center justify-around px-2 md:hidden shrink-0 z-20">
//         <button onClick={() => setActiveTab('trade')} className={`p-1 ${activeTab === 'trade' ? 'text-white' : 'text-gray-500'}`}>
//           <BarChart2 className="w-5 h-5" />
//         </button>
//         <button onClick={() => navigate('/support')} className={`p-1 ${activeTab === 'support' ? 'text-white' : 'text-gray-500'}`}>
//           <HelpCircle className="w-5 h-5" />
//         </button>
//         <button onClick={() => navigate('/account')} className="p-1 text-gray-500">
//           <User className="w-5 h-5" />
//         </button>
//         <button onClick={() => navigate('/tournment/active')} className="p-1 text-gray-500 relative">
//           <Trophy className="w-5 h-5" />
//           <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full px-1 font-bold">3</span>
//         </button>
//         <button onClick={() => navigate('/market')} className="p-1 text-gray-500 relative">
//           <MoreHorizontal className="w-5 h-5" />
//           <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full px-1 font-bold">4</span>
//         </button>
//       </nav>

//     </div>
//   );
// }



import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, HelpCircle, User, Trophy, Store, MoreHorizontal, 
  Plus, Bell, ChevronDown, Minus, ArrowUp, ArrowDown, 
  Settings, Volume2, Maximize2, ShieldCheck,
  Send, X, ArrowUpRight, History, Clock, CheckCircle2, XCircle
} from 'lucide-react';

// Available Assets List
const ASSETS = [
  { symbol: 'AUD/USD', flag: '🇦🇺🇺🇸', payout: 87 },
  { symbol: 'EUR/USD', flag: '🇪🇺🇺🇸', payout: 92 },
  { symbol: 'GBP/USD', flag: '🇬🇧🇺🇸', payout: 85 },
  { symbol: 'USD/JPY', flag: '🇺🇸🇯🇵', payout: 80 },
  { symbol: 'BTC/USD', flag: '₿🇺🇸', payout: 90 },
  { symbol: 'ETH/USD', flag: '🪙🇺🇸', payout: 88 },
];

// Preset Expiry Durations in Seconds
const EXPIRY_TIMES = [
  { label: '5s', seconds: 5 },
  { label: '10s', seconds: 10 },
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '2m', seconds: 120 },
  { label: '5m', seconds: 300 }
];

export default function TradingTerminal() {
  const navigate = useNavigate();

  // Trading States
  const [balance, setBalance] = useState(10000.00);
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);
  const [selectedExpiry, setSelectedExpiry] = useState(EXPIRY_TIMES[2]); // 30s default
  const [investment, setInvestment] = useState(100);
  const [activeTab, setActiveTab] = useState('trade');
  
  // Trades State
  const [activeTrades, setActiveTrades] = useState([]);
  const [closedTrades, setClosedTrades] = useState([]);
  const [showTradesDrawer, setShowTradesDrawer] = useState(false);
  const [tradesDrawerTab, setTradesDrawerTab] = useState('active'); // 'active' | 'closed'

  // Notifications / Toast
  const [toastNotification, setToastNotification] = useState(null);

  const [currentPrice, setCurrentPrice] = useState(0.69781);
  const [timerCountdown, setTimerCountdown] = useState(30);
  const [showBonus, setShowBonus] = useState(true);

  // Canvas Reference
  const canvasRef = useRef(null);
  const candlesRef = useRef([
    { open: 0.69830, high: 0.69920, low: 0.69800, close: 0.69880 },
    { open: 0.69880, high: 0.69900, low: 0.69840, close: 0.69850 },
    { open: 0.69850, high: 0.69890, low: 0.69810, close: 0.69860 },
    { open: 0.69860, high: 0.69870, low: 0.69815, close: 0.69820 },
    { open: 0.69820, high: 0.69910, low: 0.69780, close: 0.69800 },
    { open: 0.69800, high: 0.69880, low: 0.69760, close: 0.69770 },
    { open: 0.69770, high: 0.69950, low: 0.69760, close: 0.69940 },
    { open: 0.69940, high: 0.70010, low: 0.69930, close: 0.70000 },
    { open: 0.70000, high: 0.70071, low: 0.69950, close: 0.69970 },
    { open: 0.69970, high: 0.69980, low: 0.69890, close: 0.69910 },
    { open: 0.69910, high: 0.69930, low: 0.69860, close: 0.69880 },
    { open: 0.69880, high: 0.69900, low: 0.69850, close: 0.69890 },
    { open: 0.69890, high: 0.69940, low: 0.69760, close: 0.69781 }
  ]);

  // Keep track of current price in Ref for async operations
  const currentPriceRef = useRef(currentPrice);
  useEffect(() => {
    currentPriceRef.current = currentPrice;
  }, [currentPrice]);

  // Toast Helper
  const triggerToast = (msg, type = 'win') => {
    setToastNotification({ message: msg, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  // Real-Time Price Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.49) * 0.00012;

      candlesRef.current = candlesRef.current.map((candle, idx) => {
        if (idx === candlesRef.current.length - 1) {
          const newClose = +(candle.close + delta).toFixed(5);
          return {
            ...candle,
            close: newClose,
            high: Math.max(candle.high, newClose),
            low: Math.min(candle.low, newClose)
          };
        }
        return candle;
      });

      const latestCandle = candlesRef.current[candlesRef.current.length - 1];
      setCurrentPrice(latestCandle.close);

      setTimerCountdown((prev) => {
        if (prev <= 1) {
          const lastClose = candlesRef.current[candlesRef.current.length - 1].close;
          candlesRef.current.shift();
          candlesRef.current.push({
            open: lastClose,
            high: lastClose,
            low: lastClose,
            close: lastClose
          });
          return 30;
        }
        return prev - 1;
      });

    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Active Trade Expiry & Timer Countdown Tick
  useEffect(() => {
    const tradeInterval = setInterval(() => {
      setActiveTrades((prevTrades) => {
        if (prevTrades.length === 0) return prevTrades;

        const updatedTrades = [];

        prevTrades.forEach((trade) => {
          const newRemainingTime = trade.remainingTime - 1;

          if (newRemainingTime <= 0) {
            // Trade expired - calculate outcome
            const exitPrice = currentPriceRef.current;
            const isWin = 
              (trade.type === 'UP' && exitPrice > trade.entryPrice) ||
              (trade.type === 'DOWN' && exitPrice < trade.entryPrice);

            const returnAmount = isWin ? trade.amount + (trade.amount * (trade.payout / 100)) : 0;
            const profit = isWin ? trade.amount * (trade.payout / 100) : -trade.amount;

            // Update Balance
            if (isWin) {
              setBalance((b) => +(b + returnAmount).toFixed(2));
              triggerToast(`+${returnAmount.toFixed(2)}$ Trade Won on ${trade.asset}!`, 'win');
            } else {
              triggerToast(`-${trade.amount}$ Trade Lost on ${trade.asset}`, 'loss');
            }

            // Save to Closed Trades
            const closedTrade = {
              ...trade,
              exitPrice,
              status: isWin ? 'WIN' : 'LOSS',
              profit: +profit.toFixed(2),
              returnAmount: +returnAmount.toFixed(2),
              closedAt: new Date().toLocaleTimeString()
            };

            setClosedTrades((closed) => [closedTrade, ...closed]);
          } else {
            updatedTrades.push({
              ...trade,
              remainingTime: newRemainingTime
            });
          }
        });

        return updatedTrades;
      });
    }, 1000);

    return () => clearInterval(tradeInterval);
  }, []);

  // Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const renderChart = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const width = parent.clientWidth;
      const height = parent.clientHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      ctx.fillStyle = '#0d121d';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#1d273a';
      ctx.lineWidth = 1;

      const minPrice = 0.69700;
      const maxPrice = 0.70050;
      const priceRange = maxPrice - minPrice;

      for (let p = 0.69750; p <= 0.70000; p += 0.00050) {
        const y = height - ((p - minPrice) / priceRange) * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        ctx.fillStyle = '#616e85';
        ctx.font = '10px sans-serif';
        ctx.fillText(p.toFixed(5), width - 50, y - 4);
      }

      const candles = candlesRef.current;
      const candleWidth = Math.max(4, Math.floor((width - 60) / candles.length));

      candles.forEach((c, i) => {
        const x = i * candleWidth + 10;
        const openY = height - ((c.open - minPrice) / priceRange) * height;
        const closeY = height - ((c.close - minPrice) / priceRange) * height;
        const highY = height - ((c.high - minPrice) / priceRange) * height;
        const lowY = height - ((c.low - minPrice) / priceRange) * height;

        const isGreen = c.close >= c.open;
        const color = isGreen ? '#22c55e' : '#ef4444';

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, highY);
        ctx.lineTo(x + candleWidth / 2, lowY);
        ctx.stroke();

        ctx.fillStyle = color;
        const bodyY = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 3);
        ctx.fillRect(x + 1, bodyY, Math.max(candleWidth - 2, 2), bodyHeight);
      });

      // Render Active Trade Entry Lines on Canvas
      activeTrades.forEach((trade) => {
        const tradeY = height - ((trade.entryPrice - minPrice) / priceRange) * height;
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = trade.type === 'UP' ? '#22c55e' : '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, tradeY);
        ctx.lineTo(width - 60, tradeY);
        ctx.stroke();

        // Label
        ctx.fillStyle = trade.type === 'UP' ? '#22c55e' : '#ef4444';
        ctx.fillRect(width - 110, tradeY - 10, 50, 18);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(`${trade.type} $${trade.amount}`, width - 106, tradeY + 2);
      });

      // Current Price Line
      const currentY = height - ((currentPrice - minPrice) / priceRange) * height;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, currentY);
      ctx.lineTo(width - 55, currentY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#2563eb';
      ctx.fillRect(width - 58, currentY - 10, 56, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(currentPrice.toFixed(5), width - 54, currentY + 4);
    };

    renderChart();

    window.addEventListener('resize', renderChart);
    return () => window.removeEventListener('resize', renderChart);

  }, [currentPrice, timerCountdown, activeTrades]);

  // Execute Trade Handler
  const handleTrade = (type) => {
    if (investment > balance) {
      triggerToast('Insufficient Balance!', 'loss');
      return;
    }

    const newTrade = {
      id: Date.now(),
      asset: selectedAsset.symbol,
      payout: selectedAsset.payout,
      amount: investment,
      type: type,
      entryPrice: currentPrice,
      duration: selectedExpiry.seconds,
      remainingTime: selectedExpiry.seconds,
      time: new Date().toLocaleTimeString()
    };

    setBalance((prev) => +(prev - investment).toFixed(2));
    setActiveTrades((prev) => [newTrade, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full max-w-full bg-[#0d121d] text-gray-200 overflow-hidden font-sans select-none relative">

      {/* TOAST NOTIFICATION POPUP */}
      {toastNotification && (
        <div className={`fixed top-16 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-2xl text-white border font-bold animate-bounce ${
          toastNotification.type === 'win' 
            ? 'bg-emerald-600/90 border-emerald-400' 
            : 'bg-red-600/90 border-red-400'
        }`}>
          {toastNotification.type === 'win' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span className="text-sm">{toastNotification.message}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="h-12 sm:h-14 bg-[#121927] border-b border-gray-800 flex items-center justify-between px-2 sm:px-4 z-20 shrink-0">
        
        {/* Account Selector */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-[#1c2638] border border-gray-700/80 rounded-md px-2.5 py-1 cursor-pointer">
            <Send className="w-3.5 h-3.5 text-emerald-400 mr-1.5 fill-emerald-400 shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold text-gray-300 mr-1.5">LIVE</span>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-400">${balance.toFixed(2)}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1 shrink-0" />
          </div>
        </div>

        {/* Action Buttons (Deposit + Withdrawal) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Active Trades Counter Button */}
          <button 
            onClick={() => setShowTradesDrawer(!showTradesDrawer)}
            className="relative bg-[#1c2638] hover:bg-[#253247] text-gray-200 font-semibold px-2.5 py-1.5 rounded-md text-xs border border-gray-700/80 flex items-center space-x-1 cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Trades</span>
            {activeTrades.length > 0 && (
              <span className="bg-emerald-500 text-black text-[10px] font-bold px-1.5 rounded-full">
                {activeTrades.length}
              </span>
            )}
          </button>

          <button className="relative p-1.5 bg-[#1c2638] rounded-md text-gray-300 hover:bg-[#253247] transition">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">2</span>
          </button>

          {/* Withdrawal Button */}
          <button 
            onClick={() => navigate('/terminal/withdrawal')}
            className="bg-[#1c2638] hover:bg-[#253247] text-gray-200 font-semibold px-2.5 sm:px-3 py-1.5 rounded-md text-xs border border-gray-700/80 flex items-center transition cursor-pointer"
          >
            <ArrowUpRight className="w-3.5 h-3.5 mr-1 text-gray-400 hidden sm:inline" />
            Withdraw
          </button>

          {/* Deposit Button */}
          <button 
            onClick={() => navigate('/terminal/deposit')}
            className="bg-[#22c55e] hover:bg-emerald-600 text-black font-bold px-2.5 sm:px-3 py-1.5 rounded-md text-xs flex items-center transition cursor-pointer"
          >
            Deposit
          </button>
        </div>
      </header>

      {/* PROMO BONUS BANNER */}
      {showBonus && (
        <div className="bg-[#1bb954] text-white text-xs py-1 px-3 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span>🚀</span>
            <span className="font-semibold text-[10px] sm:text-xs truncate">
              Get a <strong className="underline">50% bonus</strong> on your deposit!
            </span>
            <span className="bg-[#14863c] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0">50%</span>
          </div>
          <button onClick={() => setShowBonus(false)} className="text-white hover:opacity-80 ml-2 shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* DESKTOP LEFT SIDEBAR */}
        <aside className="w-16 bg-[#121927] border-r border-gray-800 flex-col items-center justify-between py-3 z-10 hidden md:flex shrink-0">
          <div className="flex flex-col items-center space-y-5 w-full">
            <button 
              onClick={() => setActiveTab('trade')}
              className={`flex flex-col items-center justify-center w-full py-2 border-l-2 ${activeTab === 'trade' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-gray-400'}`}
            >
              <BarChart2 className="w-5 h-5" />
              <span className="text-[9px] font-medium mt-1">TRADE</span>
            </button>
            <button 
              onClick={() => setShowTradesDrawer(!showTradesDrawer)}
              className={`flex flex-col items-center justify-center w-full py-2 border-l-2 relative ${showTradesDrawer ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'border-transparent text-gray-400'}`}
            >
              <History className="w-5 h-5" />
              {activeTrades.length > 0 && (
                <span className="absolute top-1 right-2 bg-emerald-500 text-black text-[8px] rounded-full px-1 font-bold">
                  {activeTrades.length}
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
          <div className="flex flex-col items-center space-y-4 w-full text-gray-400">
            <Maximize2 className="w-4 h-4 cursor-pointer" />
            <Volume2 className="w-4 h-4 cursor-pointer" />
            <Settings className="w-4 h-4 cursor-pointer" />
          </div>
        </aside>

        {/* CHART SECTION */}
        <main className="flex-1 flex flex-col relative bg-[#0d121d] overflow-hidden">
          
          {/* Asset Selector Top Bar Overlay */}
          <div className="absolute top-3 left-3 z-20 flex items-center space-x-2">
            <div className="relative">
              <button 
                onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
                className="flex items-center space-x-2 bg-[#182335]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition cursor-pointer"
              >
                <span className="text-base">{selectedAsset.flag}</span>
                <span className="text-xs font-bold text-white">{selectedAsset.symbol}</span>
                <span className="text-xs text-emerald-400 font-bold">{selectedAsset.payout}%</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* ASSET DROPDOWN MENU */}
              {isAssetDropdownOpen && (
                <div className="absolute top-10 left-0 w-56 bg-[#121927] border border-gray-700 rounded-lg shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 border-b border-gray-800">
                    SELECT ASSET PAIR
                  </div>
                  {ASSETS.map((asset) => (
                    <button
                      key={asset.symbol}
                      onClick={() => {
                        setSelectedAsset(asset);
                        setIsAssetDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-[#1c2638] transition cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{asset.flag}</span>
                        <span className="font-bold text-white">{asset.symbol}</span>
                      </div>
                      <span className="text-emerald-400 font-bold">{asset.payout}%</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CANVAS CHART */}
          <div className="flex-1 relative w-full h-full min-h-[180px]">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* MOBILE BOTTOM CONTROL PANEL */}
          <div className="bg-[#121927] border-t border-gray-800 p-2 sm:p-2.5 space-y-2 md:hidden shrink-0">
            
            {/* Expiry Time presets */}
            <div className="flex justify-between items-center space-x-1">
              {EXPIRY_TIMES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => setSelectedExpiry(t)}
                  className={`flex-1 py-1 rounded text-[10px] font-bold ${
                    selectedExpiry.seconds === t.seconds
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1a2332] text-gray-400 hover:bg-[#253247]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 gap-2">
              
              {/* Timer Input */}
              <div className="bg-[#1a2332] border border-gray-700/80 rounded-lg p-1.5 flex flex-col justify-center">
                <span className="text-[9px] text-gray-400">Duration</span>
                <span className="text-xs font-bold text-white">{selectedExpiry.label}</span>
              </div>

              {/* Investment Input */}
              <div className="bg-[#1a2332] border border-gray-700/80 rounded-lg p-1.5 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-gray-400">Investment</span>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <button onClick={() => setInvestment(p => Math.max(10, p - 10))} className="w-5 h-5 bg-[#253247] rounded flex items-center justify-center text-gray-300">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs sm:text-sm font-bold text-white">${investment}</span>
                  <button onClick={() => setInvestment(p => p + 10)} className="w-5 h-5 bg-[#253247] rounded flex items-center justify-center text-gray-300">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

            {/* Payout Display */}
            <div className="flex justify-between items-center text-xs px-1">
              <span className="text-gray-400 text-[10px] sm:text-[11px]">Payout (+{selectedAsset.payout}%):</span>
              <span className="text-emerald-400 font-bold text-xs">${(investment + (investment * selectedAsset.payout / 100)).toFixed(0)}</span>
            </div>

            {/* Buy / Sell Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleTrade('UP')}
                className="bg-[#22c55e] active:scale-95 text-black font-extrabold py-2.5 rounded-lg flex items-center justify-between px-4 text-sm shadow transition cursor-pointer"
              >
                <span>Buy</span>
                <ArrowUp className="w-4 h-4 stroke-[3] text-black" />
              </button>

              <button 
                onClick={() => handleTrade('DOWN')}
                className="bg-[#ef4444] active:scale-95 text-white font-extrabold py-2.5 rounded-lg flex items-center justify-between px-4 text-sm shadow transition cursor-pointer"
              >
                <span>Sell</span>
                <ArrowDown className="w-4 h-4 stroke-[3] text-white" />
              </button>
            </div>

          </div>

        </main>

        {/* DESKTOP RIGHT TRADING PANEL */}
        <aside className="w-72 bg-[#121927] border-l border-gray-800 p-4 flex-col justify-between z-10 hidden md:flex shrink-0">
          <div className="space-y-4">
            
            {/* Selected Asset Info */}
            <div 
              onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
              className="flex justify-between items-center bg-[#182335] p-2.5 rounded-lg border border-gray-800 cursor-pointer relative"
            >
              <div className="flex items-center space-x-2">
                <span className="text-base">{selectedAsset.flag}</span>
                <div>
                  <div className="text-xs font-bold text-white">{selectedAsset.symbol}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-0.5" /> Payout: {selectedAsset.payout}%
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            {/* Expiry Time Presets */}
            <div>
              <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
                <span>Expiration Time</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {EXPIRY_TIMES.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setSelectedExpiry(t)}
                    className={`py-1.5 rounded-md text-xs font-bold border transition ${
                      selectedExpiry.seconds === t.seconds
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-[#182335] border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Investment Input */}
            <div>
              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                <span>Investment Amount</span>
              </div>
              <div className="flex items-center bg-[#182335] border border-gray-700 rounded-lg p-1.5 justify-between">
                <button onClick={() => setInvestment(p => Math.max(10, p - 10))} className="p-1 text-gray-300 hover:text-white"><Minus className="w-4 h-4" /></button>
                <div className="font-mono text-sm font-bold text-white">${investment}</div>
                <button onClick={() => setInvestment(p => p + 10)} className="p-1 text-gray-300 hover:text-white"><Plus className="w-4 h-4" /></button>
              </div>

              {/* Quick Investment Buttons */}
              <div className="grid grid-cols-4 gap-1 mt-2">
                {[10, 50, 100, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setInvestment(amt)}
                    className="bg-[#182335] hover:bg-[#202d42] text-[10px] font-bold py-1 rounded text-gray-300 border border-gray-800"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Payout Display */}
            <div className="flex justify-between items-center text-xs py-2 border-t border-b border-gray-800">
              <span className="text-gray-400">Payout (+{selectedAsset.payout}%):</span>
              <span className="text-emerald-400 font-bold text-base">
                ${(investment + (investment * selectedAsset.payout / 100)).toFixed(0)}
              </span>
            </div>

            {/* Buy / Sell Buttons */}
            <div className="space-y-2 pt-1">
              <button 
                onClick={() => handleTrade('UP')}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-between px-5 transition cursor-pointer shadow-lg shadow-emerald-900/20"
              >
                <span className="text-base">Buy</span>
                <ArrowUp className="w-5 h-5 stroke-[3]" />
              </button>

              <button 
                onClick={() => handleTrade('DOWN')}
                className="w-full bg-red-500 hover:bg-red-600 active:scale-98 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-between px-5 transition cursor-pointer shadow-lg shadow-red-900/20"
              >
                <span className="text-base">Sell</span>
                <ArrowDown className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>
        </aside>

        {/* TRADES DRAWER (SIDE SLIDE-OVER FOR ACTIVE & CLOSED TRADES) */}
        {showTradesDrawer && (
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
                  <div className="text-center text-gray-500 text-xs mt-10">No closed trades history</div>
                ) : (
                  closedTrades.map((t) => (
                    <div key={t.id} className="bg-[#182335] border border-gray-800 p-2.5 rounded-lg space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{t.asset}</span>
                        <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                          t.status === 'WIN' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {t.status} {t.profit > 0 ? `+$${t.profit}` : `-$${t.amount}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>Entry: {t.entryPrice.toFixed(5)}</span>
                        <span>Exit: {t.exitPrice.toFixed(5)}</span>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          </div>
        )}

      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="h-12 bg-[#121927] border-t border-gray-800 flex items-center justify-around px-2 md:hidden shrink-0 z-20">
        <button onClick={() => setActiveTab('trade')} className={`p-1 ${activeTab === 'trade' ? 'text-white' : 'text-gray-500'}`}>
          <BarChart2 className="w-5 h-5" />
        </button>
        <button onClick={() => setShowTradesDrawer(!showTradesDrawer)} className="p-1 text-gray-500 relative">
          <History className="w-5 h-5" />
          {activeTrades.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-[8px] rounded-full px-1 font-bold">
              {activeTrades.length}
            </span>
          )}
        </button>
        <button onClick={() => navigate('/support')} className="p-1 text-gray-500">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button onClick={() => navigate('/account')} className="p-1 text-gray-500">
          <User className="w-5 h-5" />
        </button>
        <button onClick={() => navigate('/market')} className="p-1 text-gray-500">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </nav>

    </div>
  );
}