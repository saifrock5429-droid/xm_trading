
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   BarChart2, HelpCircle, User, Trophy, Store, MoreHorizontal, 
//   Plus, Bell, ChevronDown, PlusCircle, Minus, ArrowUp, ArrowDown, 
//   Clock, History, Compass, Settings, Volume2, Maximize2, Layers, 
//   PenTool, ShieldCheck, DollarSign, Wallet
// } from 'lucide-react';

// export default function TradingTerminal() {
//   const navigate = useNavigate();

//   // Trading States
//   const [balance, setBalance] = useState(10000.00);
//   const [selectedAsset, setSelectedAsset] = useState({ symbol: 'AUD/USD (OTC)', payout: 93 });
//   const [time, setTime] = useState('00:00:05');
//   const [investment, setInvestment] = useState(100);
//   const [activeTab, setActiveTab] = useState('trade'); // trade, support, tournaments, market
//   const [trades, setTrades] = useState([]);
//   const [currentPrice, setCurrentPrice] = useState(0.69938);
//   const [timerCountdown, setTimerCountdown] = useState(29);

//   // Canvas Reference for Real-time Candlesticks Rendering
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
//     { open: 0.69890, high: 0.69940, low: 0.69870, close: 0.69938 }
//   ]);

//   // Real-Time Price Engine Simulation
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

//   // Canvas Drawing Logic
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');

//     const width = canvas.parentElement.clientWidth;
//     const height = canvas.parentElement.clientHeight;
//     canvas.width = width * window.devicePixelRatio;
//     canvas.height = height * window.devicePixelRatio;
//     ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

//     ctx.fillStyle = '#101522';
//     ctx.fillRect(0, 0, width, height);

//     ctx.strokeStyle = '#1b2333';
//     ctx.lineWidth = 1;

//     const minPrice = 0.69750;
//     const maxPrice = 0.70100;
//     const priceRange = maxPrice - minPrice;

//     for (let p = 0.69800; p <= 0.70100; p += 0.00050) {
//       const y = height - ((p - minPrice) / priceRange) * height;
//       ctx.beginPath();
//       ctx.moveTo(0, y);
//       ctx.lineTo(width, y);
//       ctx.stroke();

//       ctx.fillStyle = '#616e85';
//       ctx.font = '11px sans-serif';
//       ctx.fillText(p.toFixed(5), width - 55, y - 4);
//     }

//     const candles = candlesRef.current;
//     const candleWidth = Math.floor((width - 70) / candles.length);

//     candles.forEach((c, i) => {
//       const x = i * candleWidth + 20;
//       const openY = height - ((c.open - minPrice) / priceRange) * height;
//       const closeY = height - ((c.close - minPrice) / priceRange) * height;
//       const highY = height - ((c.high - minPrice) / priceRange) * height;
//       const lowY = height - ((c.low - minPrice) / priceRange) * height;

//       const isGreen = c.close >= c.open;
//       const color = isGreen ? '#22c55e' : '#ef4444';

//       ctx.strokeStyle = color;
//       ctx.lineWidth = 2;
//       ctx.beginPath();
//       ctx.moveTo(x + candleWidth / 2, highY);
//       ctx.lineTo(x + candleWidth / 2, lowY);
//       ctx.stroke();

//       ctx.fillStyle = color;
//       const bodyY = Math.min(openY, closeY);
//       const bodyHeight = Math.max(Math.abs(closeY - openY), 3);
//       ctx.fillRect(x + 4, bodyY, candleWidth - 8, bodyHeight);
//     });

//     const expX = width - 180;
//     ctx.setLineDash([4, 4]);
//     ctx.strokeStyle = '#94a3b8';
//     ctx.lineWidth = 1;
//     ctx.beginPath();
//     ctx.moveTo(expX, 0);
//     ctx.lineTo(expX, height);
//     ctx.stroke();
//     ctx.setLineDash([]);

//     ctx.fillStyle = '#94a3b8';
//     ctx.font = '10px sans-serif';
//     ctx.fillText('Beginning of trade', expX - 100, 20);
//     ctx.fillText('End of trade', expX + 10, 20);

//     const currentY = height - ((currentPrice - minPrice) / priceRange) * height;
//     ctx.setLineDash([3, 3]);
//     ctx.strokeStyle = '#0284c7';
//     ctx.beginPath();
//     ctx.moveTo(0, currentY);
//     ctx.lineTo(width - 60, currentY);
//     ctx.stroke();
//     ctx.setLineDash([]);

//     ctx.fillStyle = '#0284c7';
//     ctx.fillRect(width - 65, currentY - 12, 60, 24);
//     ctx.fillStyle = '#ffffff';
//     ctx.font = 'bold 11px sans-serif';
//     ctx.fillText(currentPrice.toFixed(5), width - 60, currentY + 4);

//     ctx.fillStyle = '#334155';
//     ctx.fillRect(expX - 25, currentY - 10, 36, 20);
//     ctx.fillStyle = '#ffffff';
//     ctx.font = '10px sans-serif';
//     ctx.fillText(`00:${timerCountdown < 10 ? '0' : ''}${timerCountdown}`, expX - 22, currentY + 4);

//   }, [currentPrice, timerCountdown]);

//   // Handle Trade Execution
//   const handleTrade = (type) => {
//     const newTrade = {
//       id: Date.now(),
//       asset: selectedAsset.symbol,
//       amount: investment,
//       type: type,
//       entryPrice: currentPrice,
//       payout: (investment * (1 + selectedAsset.payout / 100)).toFixed(2),
//       time: new Date().toLocaleTimeString()
//     };
//     setBalance(prev => prev - investment);
//     setTrades([newTrade, ...trades]);
//   };

//   return (
//     <div className="flex flex-col h-screen w-full bg-[#0d121d] text-gray-200 overflow-hidden font-sans select-none">

//       {/* 1. TOP HEADER NAVIGATION BAR */}
//       <header className="h-14 bg-[#121927] border-b border-gray-800 flex items-center justify-between px-3 md:px-4 z-20">

//         {/* Left: Logo & Platform Title */}
//         <div className="flex items-center space-x-3">
//           <button className="md:hidden text-gray-400 hover:text-white">
//             <BarChart2 className="w-6 h-6" />
//           </button>
//           <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
//             <div className="w-7 h-7 bg-emerald-500 rounded flex items-center justify-center font-black text-black text-lg">
//               Q
//             </div>
//             <span className="font-bold tracking-wide text-white text-base hidden sm:inline-block">QUOTEX</span>
//             <span className="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded hidden lg:inline-block">WEB TRADING PLATFORM</span>
//           </div>
//         </div>

//         {/* Center: Promotional Banner / Deposit Bonus */}
//         <div 
//           onClick={() => navigate('/terminal/deposit')}
//           className="hidden lg:flex items-center bg-[#182335] hover:bg-[#1f2d44] border border-emerald-500/30 rounded-full px-3 py-1 cursor-pointer transition"
//         >
//           <span className="text-xl mr-2">🚀</span>
//           <span className="text-xs text-gray-300 font-medium">Get a <strong className="text-emerald-400">50% bonus</strong> on your deposit!</span>
//           <span className="ml-2 text-[10px] font-bold bg-emerald-500 text-black px-2 py-0.5 rounded-full">50%</span>
//         </div>

//         {/* Right: Account Balance, Notifications & Actions */}
//         <div className="flex items-center space-x-2 sm:space-x-3">

//           {/* Notifications */}
//           <button className="relative p-2 bg-[#1b2537] hover:bg-gray-700 rounded-lg text-gray-300">
//             <Bell className="w-4 h-4" />
//             <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">8</span>
//           </button>

//           {/* Live Account Selector */}
//           <div className="flex items-center bg-[#1b2537] hover:bg-[#232e44] px-3 py-1.5 rounded-lg cursor-pointer border border-gray-700">
//             <div className="flex flex-col text-right mr-2">
//               <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-end">
//                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-ping"></span> Live Account
//               </span>
//               <span className="text-xs font-bold text-white">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
//             </div>
//             <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
//           </div>

//           {/* Deposit Button */}
//           <button 
//             onClick={() => navigate('/terminal/deposit')}
//             className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-black font-bold px-3 py-2 rounded-lg text-xs flex items-center space-x-1 transition shadow-lg shadow-emerald-500/10 cursor-pointer"
//           >
//             <Plus className="w-4 h-4" />
//             <span className="hidden sm:inline">Deposit</span>
//           </button>

//           <button className="bg-[#242e42] hover:bg-gray-700 text-gray-200 font-semibold px-3 py-2 rounded-lg text-xs transition border border-gray-700">
//             Withdrawal
//           </button>
//         </div>
//       </header>

//       {/* 2. MAIN BODY AREA */}
//       <div className="flex flex-1 overflow-hidden relative">

//         {/* LEFT NAVIGATION SIDEBAR */}
//         <aside className="w-16 bg-[#121927] border-r border-gray-800 flex flex-col items-center justify-between py-3 z-10 hidden sm:flex">
//           <div className="flex flex-col items-center space-y-5 w-full">

//             <button 
//               onClick={() => setActiveTab('trade')}
//               className={`flex flex-col items-center justify-center w-full py-2 border-l-2 transition ${activeTab === 'trade' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
//             >
//               <BarChart2 className="w-5 h-5" />
//               <span className="text-[9px] font-medium mt-1">TRADE</span>
//             </button>

//             <button 
//               onClick={() => setActiveTab('support')}
//               className={`flex flex-col items-center justify-center w-full py-2 border-l-2 transition ${activeTab === 'support' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
//             >
//               <HelpCircle className="w-5 h-5" />
//               <span className="text-[9px] font-medium mt-1">SUPPORT</span>
//             </button>

//             {/* Account Option: Directly Navigates to /account */}
//             <button 
//               onClick={() => navigate('/account')}
//               className="flex flex-col items-center justify-center w-full py-2 border-l-2 border-transparent text-gray-400 hover:text-gray-200 transition"
//             >
//               <User className="w-5 h-5" />
//               <span className="text-[9px] font-medium mt-1">ACCOUNT</span>
//             </button>

//             <button 
//               onClick={() => navigate('/tournment/active')}
//               className="flex flex-col items-center justify-center w-full py-2 border-l-2 border-transparent text-gray-400 hover:text-gray-200 transition"
//             >
//               <div className="relative">
//                 <Trophy className="w-5 h-5" />
//                 <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full px-1 font-bold">3</span>
//               </div>
//               <span className="text-[9px] font-medium mt-1">TOURNAMENTS</span>
//             </button>

//             <button 
//               onClick={() => setActiveTab('market')}
//               className={`flex flex-col items-center justify-center w-full py-2 border-l-2 transition ${activeTab === 'market' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
//             >
//               <div className="relative">
//                 <Store className="w-5 h-5" />
//                 <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full px-1 font-bold">4</span>
//               </div>
//               <span className="text-[9px] font-medium mt-1">MARKET</span>
//             </button>

//             <button className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-gray-200">
//               <MoreHorizontal className="w-5 h-5" />
//               <span className="text-[9px] font-medium mt-1">MORE</span>
//             </button>
//           </div>

//           <div className="flex flex-col items-center space-y-4 w-full">
//             <button className="text-gray-400 hover:text-white p-1">
//               <Maximize2 className="w-4 h-4" />
//             </button>
//             <button className="text-gray-400 hover:text-white p-1">
//               <Volume2 className="w-4 h-4" />
//             </button>
//             <button className="text-gray-400 hover:text-white p-1">
//               <Settings className="w-4 h-4" />
//             </button>
//           </div>
//         </aside>

//         {/* MIDDLE REAL-TIME CHART AREA */}
//         <main className="flex-1 flex flex-col relative bg-[#0d121d] overflow-hidden">

//           <div className="h-10 bg-[#121927] border-b border-gray-800 flex items-center px-2 space-x-2 overflow-x-auto">
//             <div 
//               onClick={() => setSelectedAsset({ symbol: 'AUD/USD (OTC)', payout: 93 })}
//               className="flex items-center bg-[#1b2537] text-white text-xs px-3 py-1.5 rounded-t-md border-t-2 border-emerald-500 space-x-2 min-w-[130px] justify-between cursor-pointer"
//             >
//               <div className="flex items-center space-x-1.5">
//                 <span className="text-xs">🇦🇺🇺🇸</span>
//                 <span className="font-semibold">{selectedAsset.symbol}</span>
//               </div>
//               <span className="text-emerald-400 font-bold text-[10px]">{selectedAsset.payout}%</span>
//             </div>

//             <div 
//               onClick={() => setSelectedAsset({ symbol: 'AUD/USD', payout: 85 })}
//               className="flex items-center bg-[#121927] hover:bg-[#182232] text-gray-400 text-xs px-3 py-1.5 rounded space-x-2 min-w-[120px] justify-between cursor-pointer border border-gray-800"
//             >
//               <div className="flex items-center space-x-1.5">
//                 <span className="text-xs">🇦🇺🇺🇸</span>
//                 <span>AUD/USD</span>
//               </div>
//               <span className="text-orange-400 font-bold text-[10px]">85%</span>
//             </div>

//             <button className="bg-[#182232] hover:bg-gray-700 text-emerald-400 p-1.5 rounded-full flex items-center justify-center">
//               <PlusCircle className="w-4 h-4" />
//             </button>

//             <div className="ml-auto flex items-center text-gray-400 text-xs space-x-2 px-3">
//               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
//               <span>14:00:53 UTC</span>
//             </div>
//           </div>

//           <div className="flex-1 relative w-full h-full">

//             <div className="absolute top-4 left-4 flex flex-col space-y-2 z-10">
//               <button className="bg-[#121927]/80 hover:bg-[#182232] border border-gray-700 text-gray-300 p-2 rounded-lg backdrop-blur flex items-center space-x-1 text-xs">
//                 <Compass className="w-4 h-4 text-emerald-400" />
//                 <span className="text-[11px] font-medium hidden sm:inline">PAIR INFORMATION</span>
//               </button>
//             </div>

//             <div className="absolute bottom-4 left-4 flex items-center space-x-2 z-10">
//               <div className="bg-[#121927]/90 border border-gray-800 rounded-lg p-1 flex items-center space-x-2 text-xs">
//                 <button className="bg-[#1f2c40] text-white px-2 py-1 rounded text-xs font-medium">30m</button>
//                 <button className="text-gray-400 hover:text-white p-1"><PenTool className="w-3.5 h-3.5" /></button>
//                 <button className="text-gray-400 hover:text-white p-1"><Layers className="w-3.5 h-3.5" /></button>
//               </div>
//             </div>

//             <canvas ref={canvasRef} className="w-full h-full block" />
//           </div>

//         </main>

//         {/* RIGHT TRADING CONTROL PANEL */}
//         <aside className="w-full sm:w-72 bg-[#121927] border-l border-gray-800 p-4 flex flex-col justify-between z-10">

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
//                 <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> Time</span>
//                 <span className="text-blue-400 cursor-pointer hover:underline">SWITCH TIME</span>
//               </div>
//               <div className="flex items-center bg-[#182335] border border-gray-700 rounded-lg p-1.5 justify-between">
//                 <button onClick={() => setTime('00:00:05')} className="p-1 hover:bg-gray-700 rounded text-gray-300">
//                   <Minus className="w-4 h-4" />
//                 </button>
//                 <span className="font-mono text-sm font-bold text-white">{time}</span>
//                 <button onClick={() => setTime('00:00:15')} className="p-1 hover:bg-gray-700 rounded text-gray-300">
//                   <Plus className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             <div>
//               <div className="flex justify-between text-[11px] text-gray-400 mb-1">
//                 <span className="flex items-center"><DollarSign className="w-3 h-3 mr-1" /> Investment</span>
//                 <span className="text-blue-400 cursor-pointer hover:underline">SWITCH</span>
//               </div>
//               <div className="flex items-center bg-[#182335] border border-gray-700 rounded-lg p-1.5 justify-between">
//                 <button onClick={() => setInvestment(prev => Math.max(10, prev - 10))} className="p-1 hover:bg-gray-700 rounded text-gray-300">
//                   <Minus className="w-4 h-4" />
//                 </button>
//                 <div className="font-mono text-sm font-bold text-white">${investment}</div>
//                 <button onClick={() => setInvestment(prev => prev + 10)} className="p-1 hover:bg-gray-700 rounded text-gray-300">
//                   <Plus className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             <div className="flex justify-between items-center text-xs py-1 px-1 border-t border-b border-gray-800">
//               <span className="text-gray-400">Expected Payout</span>
//               <span className="text-emerald-400 font-bold text-sm">${(investment * (1 + selectedAsset.payout / 100)).toFixed(0)}$</span>
//             </div>

//             <div className="space-y-2 pt-1">
//               <button 
//                 onClick={() => handleTrade('UP')}
//                 className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-between px-5 text-base transition shadow-lg shadow-emerald-500/20"
//               >
//                 <span>Buy</span>
//                 <ArrowUp className="w-5 h-5 stroke-[3]" />
//               </button>

//               <button 
//                 onClick={() => handleTrade('DOWN')}
//                 className="w-full bg-red-500 hover:bg-red-600 active:scale-95 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-between px-5 text-base transition shadow-lg shadow-red-500/20"
//               >
//                 <span>Sell</span>
//                 <ArrowDown className="w-5 h-5 stroke-[3]" />
//               </button>
//             </div>

//           </div>

//           <div className="mt-4 border-t border-gray-800 pt-3 flex-1 overflow-y-auto">
//             <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
//               <span className="font-bold text-gray-300">Trades ({trades.length})</span>
//               <div className="flex space-x-2">
//                 <History className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-white" />
//               </div>
//             </div>

//             {trades.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-6 text-center">
//                 <div className="w-10 h-10 bg-gray-800/60 rounded-lg flex items-center justify-center text-gray-500 mb-2">
//                   <Wallet className="w-5 h-5" />
//                 </div>
//                 <p className="text-[11px] text-gray-400">You don't have a trade history yet. Open a trade using the buttons above.</p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {trades.map((t) => (
//                   <div key={t.id} className="bg-[#182335] p-2 rounded text-xs flex justify-between items-center border-l-2 border-emerald-500">
//                     <div>
//                       <div className="font-bold text-white">{t.asset}</div>
//                       <div className="text-[10px] text-gray-400">{t.type} @ {t.entryPrice}</div>
//                     </div>
//                     <div className="text-right">
//                       <div className="font-bold text-emerald-400">+${t.payout}</div>
//                       <div className="text-[9px] text-gray-500">{t.time}</div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//         </aside>

//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, HelpCircle, User, Trophy, Store, MoreHorizontal, 
  Plus, Bell, ChevronDown, Minus, ArrowUp, ArrowDown, 
  Settings, Volume2, Maximize2, ShieldCheck,
  Briefcase, Send, X, ArrowUpRight
} from 'lucide-react';

export default function TradingTerminal() {
  const navigate = useNavigate();

  // Trading States
  const [balance, setBalance] = useState(10000.00);
  const [selectedAsset] = useState({ symbol: 'AUD/USD', payout: 87 });
  const [time, setTime] = useState('00:00');
  const [investment, setInvestment] = useState(100);
  const [activeTab, setActiveTab] = useState('trade');
  const [trades, setTrades] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0.69781);
  const [timerCountdown, setTimerCountdown] = useState(20);
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

    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Canvas Rendering & Dynamic Resize
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

      ctx.fillStyle = '#111726';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#1d273a';
      ctx.lineWidth = 1;

      const minPrice = 0.69750;
      const maxPrice = 0.70050;
      const priceRange = maxPrice - minPrice;

      for (let p = 0.69800; p <= 0.70000; p += 0.00100) {
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
      const candleWidth = Math.max(4, Math.floor((width - 55) / candles.length));

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

      const expX = Math.max(width - 100, 100);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(expX, 0);
      ctx.lineTo(expX, height);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '9px sans-serif';
      ctx.fillText('Beginning of trade', expX - 80, 15);
      ctx.fillText('End of trade', expX + 5, 15);

      const currentY = height - ((currentPrice - minPrice) / priceRange) * height;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#2563eb';
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

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(expX - 18, currentY - 9, 34, 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px sans-serif';
      ctx.fillText(`16:${timerCountdown}`, expX - 14, currentY + 3);
    };

    renderChart();

    window.addEventListener('resize', renderChart);
    return () => window.removeEventListener('resize', renderChart);

  }, [currentPrice, timerCountdown]);

  const handleTrade = (type) => {
    const newTrade = {
      id: Date.now(),
      asset: selectedAsset.symbol,
      amount: investment,
      type: type,
      entryPrice: currentPrice,
      payout: (investment * (1 + selectedAsset.payout / 100)).toFixed(0),
      time: new Date().toLocaleTimeString()
    };
    setBalance(prev => prev - investment);
    setTrades([newTrade, ...trades]);
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full max-w-full bg-[#0d121d] text-gray-200 overflow-hidden font-sans select-none">

      {/* TOP HEADER */}
      <header className="h-12 sm:h-14 bg-[#121927] border-b border-gray-800 flex items-center justify-between px-2 sm:px-4 z-20 shrink-0">
        
        {/* Account Selector */}
        <div className="flex items-center bg-[#1c2638] border border-gray-700/80 rounded-md px-2 py-1 cursor-pointer">
          <Send className="w-3.5 h-3.5 text-emerald-400 mr-1 sm:mr-1.5 fill-emerald-400 shrink-0" />
          <span className="text-[10px] sm:text-xs font-bold text-gray-300 mr-1 sm:mr-1.5">LIVE</span>
          <span className="text-xs sm:text-sm font-extrabold text-white">${balance.toFixed(2)}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1 shrink-0" />
        </div>

        {/* Action Buttons (Deposit + Withdrawal) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <button className="relative p-1.5 bg-[#1c2638] rounded-md text-gray-300 hover:bg-[#253247] transition">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-500 text-white text-[8px] sm:text-[9px] font-bold rounded-full flex items-center justify-center">8</span>
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
        <div className="bg-[#1bb954] text-white text-xs py-1 px-3 flex items-center justify-between shrink-0">
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
        <aside className="w-16 bg-[#121927] border-r border-gray-800 flex-col items-center justify-between py-3 z-10 hidden md:flex">
          <div className="flex flex-col items-center space-y-5 w-full">
            <button 
              onClick={() => setActiveTab('trade')}
              className={`flex flex-col items-center justify-center w-full py-2 border-l-2 ${activeTab === 'trade' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-gray-400'}`}
            >
              <BarChart2 className="w-5 h-5" />
              <span className="text-[9px] font-medium mt-1">TRADE</span>
            </button>
            <button 
              onClick={() => setActiveTab('support')}
              className={`flex flex-col items-center justify-center w-full py-2 border-l-2 ${activeTab === 'support' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-gray-400'}`}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="text-[9px] font-medium mt-1">SUPPORT</span>
            </button>
            <button onClick={() => navigate('/account')} className="flex flex-col items-center justify-center w-full py-2 text-gray-400">
              <User className="w-5 h-5" />
              <span className="text-[9px] font-medium mt-1">ACCOUNT</span>
            </button>
            <button onClick={() => navigate('/tournment/active')} className="flex flex-col items-center justify-center w-full py-2 text-gray-400 relative">
              <Trophy className="w-5 h-5" />
              <span className="absolute top-1 right-2 bg-blue-500 text-white text-[8px] rounded-full px-1 font-bold">3</span>
              <span className="text-[9px] font-medium mt-1">TOURNAMENTS</span>
            </button>
            <button onClick={() => setActiveTab('market')} className="flex flex-col items-center justify-center w-full py-2 text-gray-400 relative">
              <Store className="w-5 h-5" />
              <span className="absolute top-1 right-2 bg-blue-500 text-white text-[8px] rounded-full px-1 font-bold">4</span>
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
          <div className="flex-1 relative w-full h-full min-h-[180px]">

            {/* Floating Top Left Controls */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1.5 z-10">
              <button className="bg-[#1c2638]/80 backdrop-blur text-gray-300 p-1.5 rounded-lg border border-gray-700/60 shadow">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <button className="bg-[#1c2638]/80 backdrop-blur text-gray-300 p-1.5 rounded-lg border border-gray-700/60 shadow relative">
                <Briefcase className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">0</span>
              </button>
            </div>

            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* MOBILE BOTTOM CONTROL PANEL */}
          <div className="bg-[#121927] border-t border-gray-800 p-2 sm:p-2.5 space-y-2 md:hidden shrink-0">
            
            {/* Asset Selector Header */}
            <div className="flex items-center justify-between text-xs font-bold text-white px-1">
              <div className="flex items-center space-x-1.5 cursor-pointer">
                <span>🇦🇺🇺🇸</span>
                <span>{selectedAsset.symbol}</span>
                <span className="text-orange-400">{selectedAsset.payout}%</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </div>
              
              <div className="flex items-center space-x-1.5 text-[10px] text-blue-400">
                <span>PENDING TRADE</span>
                <div className="w-7 h-4 bg-blue-600 rounded-full p-0.5 flex justify-end cursor-pointer">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 gap-2">
              
              {/* Timer Input */}
              <div className="bg-[#1a2332] border border-gray-700/80 rounded-lg p-1.5">
                <label className="text-[9px] text-gray-400 block">Timer</label>
                <div className="text-xs sm:text-sm font-bold text-white tracking-wider mt-0.5">{time}</div>
              </div>

              {/* Investment Input */}
              <div className="bg-[#1a2332] border border-gray-700/80 rounded-lg p-1.5 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-gray-400">Investment</span>
                  <span className="text-[8px] text-blue-400 font-bold cursor-pointer">SWITCH</span>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <button onClick={() => setInvestment(p => Math.max(10, p - 10))} className="w-5 h-5 bg-[#253247] rounded flex items-center justify-center text-gray-300">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs sm:text-sm font-bold text-white">{investment} $</span>
                  <button onClick={() => setInvestment(p => p + 10)} className="w-5 h-5 bg-[#253247] rounded flex items-center justify-center text-gray-300">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>

            {/* Payout Display */}
            <div className="flex justify-between items-center text-xs px-1">
              <span className="text-gray-400 text-[10px] sm:text-[11px]">Payout</span>
              <span className="text-white font-bold text-xs">{(investment * (1 + selectedAsset.payout / 100)).toFixed(0)} $</span>
            </div>

            {/* Buy / Sell Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleTrade('UP')}
                className="bg-[#22c55e] active:scale-95 text-black font-extrabold py-2 sm:py-2.5 rounded-lg flex items-center justify-between px-3 sm:px-4 text-xs sm:text-sm shadow transition cursor-pointer"
              >
                <span>Buy</span>
                <div className="w-5 h-5 bg-emerald-600/40 rounded-full flex items-center justify-center">
                  <ArrowUp className="w-3.5 h-3.5 stroke-[3] text-black" />
                </div>
              </button>

              <button 
                onClick={() => handleTrade('DOWN')}
                className="bg-[#ef4444] active:scale-95 text-white font-extrabold py-2 sm:py-2.5 rounded-lg flex items-center justify-between px-3 sm:px-4 text-xs sm:text-sm shadow transition cursor-pointer"
              >
                <span>Sell</span>
                <div className="w-5 h-5 bg-red-700/40 rounded-full flex items-center justify-center">
                  <ArrowDown className="w-3.5 h-3.5 stroke-[3] text-white" />
                </div>
              </button>
            </div>

          </div>

        </main>

        {/* DESKTOP RIGHT TRADING PANEL */}
        <aside className="w-72 bg-[#121927] border-l border-gray-800 p-4 flex-col justify-between z-10 hidden md:flex shrink-0">
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-[#182335] p-2.5 rounded-lg border border-gray-800">
              <div className="flex items-center space-x-2">
                <span className="text-base">🇦🇺🇺🇸</span>
                <div>
                  <div className="text-xs font-bold text-white">{selectedAsset.symbol}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-0.5" /> Payout: {selectedAsset.payout}%
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                <span>Time</span>
                <span className="text-blue-400 cursor-pointer">SWITCH TIME</span>
              </div>
              <div className="flex items-center bg-[#182335] border border-gray-700 rounded-lg p-1.5 justify-between">
                <button onClick={() => setTime('00:00')} className="p-1 text-gray-300"><Minus className="w-4 h-4" /></button>
                <span className="font-mono text-sm font-bold text-white">{time}</span>
                <button onClick={() => setTime('00:15')} className="p-1 text-gray-300"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                <span>Investment</span>
                <span className="text-blue-400 cursor-pointer">SWITCH</span>
              </div>
              <div className="flex items-center bg-[#182335] border border-gray-700 rounded-lg p-1.5 justify-between">
                <button onClick={() => setInvestment(p => Math.max(10, p - 10))} className="p-1 text-gray-300"><Minus className="w-4 h-4" /></button>
                <div className="font-mono text-sm font-bold text-white">${investment}</div>
                <button onClick={() => setInvestment(p => p + 10)} className="p-1 text-gray-300"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs py-1 border-t border-b border-gray-800">
              <span className="text-gray-400">Expected Payout</span>
              <span className="text-emerald-400 font-bold text-sm">${(investment * (1 + selectedAsset.payout / 100)).toFixed(0)}$</span>
            </div>

            <div className="space-y-2 pt-1">
              <button 
                onClick={() => handleTrade('UP')}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-between px-5 transition cursor-pointer"
              >
                <span>Buy</span>
                <ArrowUp className="w-5 h-5 stroke-[3]" />
              </button>

              <button 
                onClick={() => handleTrade('DOWN')}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-between px-5 transition cursor-pointer"
              >
                <span>Sell</span>
                <ArrowDown className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>
        </aside>

      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="h-12 bg-[#121927] border-t border-gray-800 flex items-center justify-around px-2 md:hidden shrink-0 z-20">
        <button onClick={() => setActiveTab('trade')} className={`p-1 ${activeTab === 'trade' ? 'text-white' : 'text-gray-500'}`}>
          <BarChart2 className="w-5 h-5" />
        </button>
        <button onClick={() => setActiveTab('support')} className={`p-1 ${activeTab === 'support' ? 'text-white' : 'text-gray-500'}`}>
          <HelpCircle className="w-5 h-5" />
        </button>
        <button onClick={() => navigate('/account')} className="p-1 text-gray-500">
          <User className="w-5 h-5" />
        </button>
        <button onClick={() => navigate('/tournment/active')} className="p-1 text-gray-500 relative">
          <Trophy className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full px-1 font-bold">3</span>
        </button>
        <button onClick={() => setActiveTab('market')} className="p-1 text-gray-500 relative">
          <MoreHorizontal className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full px-1 font-bold">4</span>
        </button>
      </nav>

    </div>
  );
}