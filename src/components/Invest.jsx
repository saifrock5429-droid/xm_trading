// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   ArrowLeft, ArrowUpRight, CheckCircle2, AlertCircle, 
//   BarChart2, History, HelpCircle, User, Trophy, TrendingUp, Plus
// } from 'lucide-react';

// const ASSETS = [
//   { id: 'btc', symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: 'bg-amber-500 text-white', border: 'border-amber-500/30' },
//   { id: 'eth', symbol: 'ETH', name: 'Ethereum', icon: '⟠', color: 'bg-indigo-500 text-white', border: 'border-indigo-500/30' },
//   { id: 'bnb', symbol: 'BNB', name: 'BNB', icon: '◈', color: 'bg-yellow-500 text-black font-black', border: 'border-yellow-500/30' },
//   { id: 'sol', symbol: 'SOL', name: 'Solana', icon: '≡', color: 'bg-purple-600 text-white font-bold', border: 'border-purple-500/30' },
//   { id: 'eur', symbol: 'EUR', name: 'Euro', icon: '🇪🇺', isFlag: true, border: 'border-blue-500/30' },
//   { id: 'usd_green', symbol: 'USD', name: 'US Dollar', icon: '$', color: 'bg-emerald-600 text-white font-bold', border: 'border-emerald-500/30' },
//   { id: 'usd_flag', symbol: 'USD', name: 'US Dollar', icon: '🇺🇸', isFlag: true, border: 'border-blue-400/30' },
//   { id: 'jpy', symbol: 'JPY', name: 'Japanese Yen', icon: '🇯🇵', isFlag: true, border: 'border-red-400/30' }
// ];

// const INVESTMENT_PLANS = [25, 50, 100, 200];

// export default function Invest() {
//   const navigate = useNavigate();

//   const [balance, setBalance] = useState(() => {
//     const saved = localStorage.getItem('trading_live_balance');
//     return saved && !isNaN(Number(saved)) ? Number(saved) : 0;
//   });

//   const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
//   const [selectedPlan, setSelectedPlan] = useState(25);
//   const [customAmount, setCustomAmount] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);

//   // Investment History (matching Screenshot 5 with live fluctuating return)
//   const [investments, setInvestments] = useState(() => {
//     try {
//       const saved = localStorage.getItem('user_investments_history');
//       if (saved) return JSON.parse(saved);
//     } catch (e) {}

//     return [
//       {
//         id: 'inv-init-1',
//         assetSymbol: 'BTC',
//         assetName: 'Bitcoin',
//         icon: '₿',
//         color: 'bg-amber-500 text-white',
//         amount: 25000,
//         date: '11 Oct 2026',
//         time: '10:24 AM',
//         todayReturn: 0.60
//       }
//     ];
//   });

//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//     setTimeout(() => setToast(null), 3500);
//   };

//   // 1. Fetch live balance from backend for the logged-in user
//   const fetchLiveBalance = async () => {
//     try {
//       const userId = localStorage.getItem('userId') || '';
//       const email = (localStorage.getItem('userEmail') || '').toLowerCase().trim();
//       const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();

//       // Priority 1: Fetch user profile directly (Strictly Isolated by User ID)
//       if (userId) {
//         const profileRes = await fetch(`${API_URL}/api/users/profile/${userId}`);
//         if (profileRes.ok) {
//           const profileData = await profileRes.json();
//           if (profileData.success && profileData.user && profileData.user.balance !== undefined) {
//             const bal = Number(profileData.user.balance);
//             if (!isNaN(bal)) {
//               setBalance(bal);
//               localStorage.setItem('trading_live_balance', bal.toString());
//               return;
//             }
//           }
//         }
//       }

//       // Priority 2: Fallback with guard
//       const params = new URLSearchParams();
//       if (userId) params.append('userId', userId);
//       if (email) params.append('email', email);

//       const res = await fetch(`${API_URL}/api/payments/live-balance?${params.toString()}`, {
//         headers: { 'x-user-id': userId, 'x-user-email': email }
//       });
//       if (!res.ok) return;

//       const data = await res.json();
//       if (data.success) {
//         const resEmail = (data.user?.email || '').toLowerCase().trim();
//         if (email && resEmail && resEmail !== email) return;

//         if (data.liveBalance !== undefined) {
//           const bal = Number(data.liveBalance);
//           setBalance(bal);
//           localStorage.setItem('trading_live_balance', bal.toString());
//         }
//       }
//     } catch (err) {
//       console.warn('Balance fetch error:', err);
//     }
//   };

//   useEffect(() => {
//     fetchLiveBalance();

//     const handleStorage = (e) => {
//       if (e.key === 'trading_live_balance' && e.newValue !== null) {
//         const val = Number(e.newValue);
//         if (!isNaN(val)) setBalance(val);
//       }
//     };
//     window.addEventListener('storage', handleStorage);

//     let bc;
//     try {
//       bc = new BroadcastChannel('trading_balance_sync');
//       bc.onmessage = (event) => {
//         if (event.data && typeof event.data.balanceUSD === 'number') {
//           setBalance(Number(event.data.balanceUSD));
//         }
//       };
//     } catch (e) {}

//     return () => {
//       window.removeEventListener('storage', handleStorage);
//       if (bc) bc.close();
//     };
//   }, []);

//   // 2. Fluctuating Live Returns for Real Market Effect (As Requested)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setInvestments((prev) =>
//         prev.map((inv) => {
//           const delta = (Math.random() - 0.42) * 0.08;
//           const newReturn = Math.max(0.1, +(inv.todayReturn + delta).toFixed(2));
//           return { ...inv, todayReturn: newReturn };
//         })
//       );
//     }, 2500);

//     return () => clearInterval(interval);
//   }, []);

//   // Save investments to localStorage when changed
//   useEffect(() => {
//     try {
//       localStorage.setItem('user_investments_history', JSON.stringify(investments));
//     } catch (e) {}
//   }, [investments]);

//   // Determine current active amount (Plan or Custom)
//   const currentInvestmentAmount = customAmount !== '' ? Number(customAmount) : selectedPlan;

//   // Handle Plan selection
//   const handleSelectPlan = (amt) => {
//     setSelectedPlan(amt);
//     setCustomAmount('');
//   };

//   // Handle Custom Amount Input
//   const handleCustomAmountChange = (e) => {
//     const val = e.target.value;
//     setCustomAmount(val);
//     if (val !== '') {
//       setSelectedPlan(null);
//     }
//   };

//   // Handle "Invest Now"
//   const handleInvestNow = async () => {
//     const amt = Number(currentInvestmentAmount);

//     if (!amt || isNaN(amt) || amt <= 0) {
//       showToast('Please enter a valid investment amount!', 'error');
//       return;
//     }

//     if (amt > balance) {
//       showToast(`Insufficient Live Balance! You have $${balance.toFixed(2)}, need $${amt.toFixed(2)}.`, 'error');
//       return;
//     }

//     setLoading(true);

//     try {
//       const userId = localStorage.getItem('userId') || '';
//       const email = localStorage.getItem('userEmail') || '';
//       const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();

//       let newBal = +(balance - amt).toFixed(2);

//       // 1. Sync via Profile PUT (100% works on Vercel)
//       if (userId) {
//         try {
//           await fetch(`${API_URL}/api/users/profile/${userId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ balance: newBal })
//           });
//         } catch (e) {}
//       }

//       // 2. Also call invest endpoint
//       try {
//         const res = await fetch(`${API_URL}/api/payments/invest`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             userId,
//             email,
//             amountUSD: amt,
//             asset: selectedAsset.symbol
//           })
//         });
//         const data = await res.json();
//         if (data.success && data.liveBalance !== undefined) {
//           newBal = Number(data.liveBalance);
//         }
//       } catch (err) {
//         console.warn('Backend invest call fallback:', err);
//       }

//       setBalance(newBal);
//       localStorage.setItem('trading_live_balance', newBal.toString());
//       window.dispatchEvent(new Event('storage'));
//       try {
//         const bc = new BroadcastChannel('trading_balance_sync');
//         bc.postMessage({ balanceUSD: newBal });
//         bc.close();
//       } catch (e) {}

//       const now = new Date();
//       const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
//       const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

//       const newInvestment = {
//         id: `inv-${Date.now()}`,
//         assetSymbol: selectedAsset.symbol,
//         assetName: selectedAsset.name,
//         icon: selectedAsset.icon,
//         isFlag: selectedAsset.isFlag,
//         color: selectedAsset.color || '',
//         amount: amt,
//         date: dateStr,
//         time: timeStr,
//         todayReturn: +(amt * 0.008 + (Math.random() * 0.4)).toFixed(2)
//       };

//       setInvestments((prev) => [newInvestment, ...prev]);
//       showToast(`🎉 Successfully invested $${amt} in ${selectedAsset.symbol}!`, 'success');
//       setCustomAmount('');
//       setSelectedPlan(25);
//     } catch (error) {
//       showToast('Error processing investment. Please try again.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen w-full bg-[#0d121d] text-gray-200 overflow-hidden font-sans select-none">
      
//       {/* Toast Alert */}
//       {toast && (
//         <div className={`fixed top-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-2xl text-white font-bold text-xs ${
//           toast.type === 'success' ? 'bg-emerald-600 border border-emerald-400' : 'bg-red-600 border border-red-400'
//         }`}>
//           {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
//           <span>{toast.message}</span>
//         </div>
//       )}

//       {/* LEFT SIDEBAR (Matching Trading Terminal) */}
//       <aside className="w-16 bg-[#121927] border-r border-gray-800 flex-col items-center justify-between py-3 z-10 hidden md:flex shrink-0">
//         <div className="flex flex-col items-center space-y-5 w-full">
//           <button 
//             onClick={() => navigate('/terminal')} 
//             className="flex flex-col items-center justify-center w-full py-2 border-l-2 border-transparent text-gray-400 hover:text-white transition cursor-pointer"
//           >
//             <BarChart2 className="w-5 h-5" />
//             <span className="text-[9px] font-medium mt-1">TRADE</span>
//           </button>

//           <button 
//             onClick={() => navigate('/terminal')} 
//             className="flex flex-col items-center justify-center w-full py-2 border-l-2 border-transparent text-gray-400 hover:text-white transition cursor-pointer"
//           >
//             <History className="w-5 h-5" />
//             <span className="text-[9px] font-medium mt-1">TRADES</span>
//           </button>

//           <button 
//             onClick={() => navigate('/support')} 
//             className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-white transition cursor-pointer"
//           >
//             <HelpCircle className="w-5 h-5" />
//             <span className="text-[9px] font-medium mt-1">SUPPORT</span>
//           </button>

//           <button 
//             onClick={() => navigate('/account')} 
//             className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-white transition cursor-pointer"
//           >
//             <User className="w-5 h-5" />
//             <span className="text-[9px] font-medium mt-1">ACCOUNT</span>
//           </button>

//           <button 
//             onClick={() => navigate('/tournment/active')} 
//             className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-white transition cursor-pointer"
//           >
//             <Trophy className="w-5 h-5" />
//             <span className="text-[9px] font-medium mt-1">TOURNAMENTS</span>
//           </button>

//           {/* ACTIVE INVEST TAB */}
//           <button 
//             className="flex flex-col items-center justify-center w-full py-2 border-l-2 border-emerald-500 text-emerald-400 bg-emerald-500/10 cursor-pointer"
//           >
//             <TrendingUp className="w-5 h-5" />
//             <span className="text-[9px] font-medium mt-1 font-bold">INVEST</span>
//           </button>
//         </div>
//       </aside>

//       {/* MAIN CONTAINER */}
//       <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0f19]">
        
//         {/* TOP HEADER */}
//         <header className="h-14 bg-[#121927] border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
//           <div className="flex items-center space-x-3">
//             <button 
//               onClick={() => navigate('/terminal')}
//               className="flex items-center space-x-1.5 text-gray-400 hover:text-white bg-[#1b2537] px-3 py-1.5 rounded-lg border border-gray-700 text-xs font-semibold transition cursor-pointer"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               <span>Back to Terminal</span>
//             </button>
//             <div className="h-4 w-px bg-gray-800 hidden sm:block"></div>
//             <span className="text-white font-bold text-sm hidden sm:inline">Investment Platform</span>
//           </div>

//           <div className="flex items-center space-x-3">
//             {/* Live Balance Badge */}
//             <div className="flex items-center space-x-2 bg-[#182335] border border-gray-700 px-3 py-1.5 rounded-lg">
//               <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">LIVE</span>
//               <span className="text-sm font-extrabold text-white font-mono">
//                 ${Number(balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//               </span>
//             </div>

//             <button
//               onClick={() => navigate('/terminal/deposit')}
//               className="bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1 transition shadow cursor-pointer"
//             >
//               <Plus className="w-3.5 h-3.5 stroke-[3]" />
//               <span>Deposit</span>
//             </button>
//           </div>
//         </header>

//         {/* SCREENSHOT 5 UI BODY */}
//         <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
//           <div className="max-w-2xl mx-auto space-y-6">
            
//             {/* 1. SELECT ASSET */}
//             <section className="space-y-3">
//               <h2 className="text-sm font-bold text-gray-100 tracking-wide">Select Asset</h2>
              
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
//                 {ASSETS.map((asset) => {
//                   const isSelected = selectedAsset.id === asset.id;
//                   return (
//                     <div
//                       key={asset.id}
//                       onClick={() => setSelectedAsset(asset)}
//                       className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition border ${
//                         isSelected 
//                           ? 'bg-[#182538] border-emerald-500 shadow-md ring-1 ring-emerald-500/40' 
//                           : 'bg-[#131b2a] border-gray-800 hover:border-gray-700'
//                       }`}
//                     >
//                       {/* Asset Icon */}
//                       <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-base shadow-sm overflow-hidden">
//                         {asset.isFlag ? (
//                           <span className="text-2xl">{asset.icon}</span>
//                         ) : (
//                           <div className={`w-full h-full flex items-center justify-center ${asset.color}`}>
//                             {asset.icon}
//                           </div>
//                         )}
//                       </div>

//                       {/* Asset Details */}
//                       <div className="min-w-0">
//                         <div className="text-xs font-bold text-white leading-tight">{asset.symbol}</div>
//                         <div className="text-[10px] text-gray-400 truncate leading-tight mt-0.5">{asset.name}</div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </section>

//             {/* 2. INVESTMENT PLAN */}
//             <section className="space-y-2">
//               <h2 className="text-sm font-bold text-gray-100 tracking-wide">Investment Plan</h2>
//               <p className="text-xs text-gray-400">Choose an amount and start your investment</p>

//               <div className="grid grid-cols-4 gap-2.5 pt-1">
//                 {INVESTMENT_PLANS.map((planAmt) => {
//                   const isSelected = selectedPlan === planAmt && customAmount === '';
//                   return (
//                     <button
//                       key={planAmt}
//                       type="button"
//                       onClick={() => handleSelectPlan(planAmt)}
//                       className={`py-3 rounded-xl text-sm font-extrabold transition cursor-pointer border ${
//                         isSelected
//                           ? 'bg-[#142629] border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/50'
//                           : 'bg-[#131b2a] border-gray-800 text-gray-300 hover:border-gray-700'
//                       }`}
//                     >
//                       ${planAmt}
//                     </button>
//                   );
//                 })}
//               </div>
//             </section>

//             {/* 3. CUSTOM AMOUNT */}
//             <section className="space-y-2">
//               <label className="text-xs font-semibold text-gray-300 block">Custom Amount</label>
//               <div className="relative flex items-center">
//                 <span className="absolute left-4 text-gray-400 font-bold text-sm">$</span>
//                 <input
//                   type="number"
//                   min="1"
//                   placeholder="Enter amount"
//                   value={customAmount}
//                   onChange={handleCustomAmountChange}
//                   className="w-full bg-[#131b2a] border border-gray-800 rounded-xl pl-9 pr-4 py-3 text-sm text-white font-mono outline-none focus:border-emerald-500 transition"
//                 />
//               </div>
//             </section>

//             {/* 4. INVEST NOW BUTTON */}
//             <button
//               onClick={handleInvestNow}
//               disabled={loading}
//               className="w-full bg-[#00c076] hover:bg-[#00ad6a] active:scale-[0.99] text-white font-black py-4 rounded-xl text-sm transition shadow-lg shadow-emerald-900/20 cursor-pointer disabled:opacity-50"
//             >
//               {loading ? 'Processing Investment...' : 'Invest Now'}
//             </button>

//             {/* 5. INVESTMENT HISTORY */}
//             <section className="space-y-3 pt-2">
//               <h2 className="text-sm font-bold text-gray-100 tracking-wide">Investment History</h2>

//               {investments.length === 0 ? (
//                 <div className="text-center p-6 bg-[#131b2a] rounded-xl border border-gray-800 text-gray-400 text-xs">
//                   No active investments yet. Start one above!
//                 </div>
//               ) : (
//                 <div className="space-y-2.5">
//                   {investments.map((inv) => (
//                     <div 
//                       key={inv.id}
//                       className="bg-[#131b2a] border border-gray-800/90 rounded-xl p-3.5 flex items-center justify-between shadow-sm hover:border-gray-700 transition"
//                     >
//                       {/* Left: Asset Icon & Name */}
//                       <div className="flex items-center space-x-3">
//                         <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
//                           {inv.isFlag ? (
//                             <span className="text-2xl">{inv.icon}</span>
//                           ) : (
//                             <div className={`w-full h-full flex items-center justify-center ${inv.color || 'bg-amber-500 text-white font-bold'}`}>
//                               {inv.icon || '₿'}
//                             </div>
//                           )}
//                         </div>
//                         <div>
//                           <div className="text-xs font-bold text-white leading-tight">{inv.assetSymbol}</div>
//                           <div className="text-[10px] text-gray-400 leading-tight mt-0.5">Investment</div>
//                         </div>
//                       </div>

//                       {/* Middle: Amount & Date */}
//                       <div className="text-left sm:text-center px-2">
//                         <div className="text-xs font-extrabold text-white font-mono">
//                           ${Number(inv.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                         </div>
//                         <div className="text-[10px] text-gray-400 mt-0.5">
//                           {inv.date} &nbsp;{inv.time}
//                         </div>
//                       </div>

//                       {/* Right: Live Fluctuating Return Pill */}
//                       <div>
//                         <div className="bg-[#0e2722] border border-emerald-500/30 text-emerald-400 font-bold text-[11px] px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-inner">
//                           <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
//                           <span>Today Return ${Number(inv.todayReturn || 0).toFixed(2)}</span>
//                         </div>
//                       </div>

//                     </div>
//                   ))}
//                 </div>
//               )}
//             </section>

//           </div>
//         </main>

//       </div>
//     </div>
//   );
// }



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowUpRight, CheckCircle2, AlertCircle, 
  BarChart2, History, HelpCircle, User, Trophy, TrendingUp, Plus, LogOut
} from 'lucide-react';

const ASSETS = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: 'bg-amber-500 text-white', border: 'border-amber-500/30' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', icon: '⟠', color: 'bg-indigo-500 text-white', border: 'border-indigo-500/30' },
  { id: 'bnb', symbol: 'BNB', name: 'BNB', icon: '◈', color: 'bg-yellow-500 text-black font-black', border: 'border-yellow-500/30' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', icon: '≡', color: 'bg-purple-600 text-white font-bold', border: 'border-purple-500/30' },
  { id: 'eur', symbol: 'EUR', name: 'Euro', icon: '🇪🇺', isFlag: true, border: 'border-blue-500/30' },
  { id: 'usd_green', symbol: 'USD', name: 'US Dollar', icon: '$', color: 'bg-emerald-600 text-white font-bold', border: 'border-emerald-500/30' },
  { id: 'usd_flag', symbol: 'USD', name: 'US Dollar', icon: '🇺🇸', isFlag: true, border: 'border-blue-400/30' },
  { id: 'jpy', symbol: 'JPY', name: 'Japanese Yen', icon: '🇯🇵', isFlag: true, border: 'border-red-400/30' }
];

const INVESTMENT_PLANS = [25, 50, 100, 200];

export default function Invest() {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('trading_live_balance');
    return saved && !isNaN(Number(saved)) ? Number(saved) : 0;
  });

  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [selectedPlan, setSelectedPlan] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Get unique storage key for current logged-in user
  const getUserInvestmentsKey = () => {
    const userId = localStorage.getItem('userId') || 'guest';
    const email = localStorage.getItem('userEmail') || 'guest';
    return `user_investments_history_${userId}_${email}`;
  };

  // My Investment State (Strictly empty by default for new users)
  const [investments, setInvestments] = useState(() => {
    try {
      const storageKey = `user_investments_history_${localStorage.getItem('userId') || 'guest'}_${localStorage.getItem('userEmail') || 'guest'}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync Live Balance to Backend & Storage
  const updateAndSyncBalance = async (newBal) => {
    const parsedBal = Number(newBal);
    setBalance(parsedBal);
    localStorage.setItem('trading_live_balance', parsedBal.toString());
    window.dispatchEvent(new Event('storage'));

    try {
      const bc = new BroadcastChannel('trading_balance_sync');
      bc.postMessage({ balanceUSD: parsedBal });
      bc.close();
    } catch (e) {}

    try {
      const userId = localStorage.getItem('userId') || '';
      const email = localStorage.getItem('userEmail') || '';
      const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();

      if (userId) {
        await fetch(`${API_URL}/api/users/profile/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ balance: parsedBal })
        });
      }

      await fetch(`${API_URL}/api/payments/set-user-balance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balanceUSD: parsedBal, userId, email })
      });
    } catch (err) {
      console.error('Error syncing balance:', err);
    }
  };

  // Fetch live balance from backend
  const fetchLiveBalance = async () => {
    try {
      const userId = localStorage.getItem('userId') || '';
      const email = (localStorage.getItem('userEmail') || '').toLowerCase().trim();
      const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();

      if (userId) {
        const profileRes = await fetch(`${API_URL}/api/users/profile/${userId}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success && profileData.user && profileData.user.balance !== undefined) {
            const bal = Number(profileData.user.balance);
            if (!isNaN(bal)) {
              setBalance(bal);
              localStorage.setItem('trading_live_balance', bal.toString());
              return;
            }
          }
        }
      }

      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (email) params.append('email', email);

      const res = await fetch(`${API_URL}/api/payments/live-balance?${params.toString()}`, {
        headers: { 'x-user-id': userId, 'x-user-email': email }
      });
      if (!res.ok) return;

      const data = await res.json();
      if (data.success) {
        const resEmail = (data.user?.email || '').toLowerCase().trim();
        if (email && resEmail && resEmail !== email) return;

        if (data.liveBalance !== undefined) {
          const bal = Number(data.liveBalance);
          setBalance(bal);
          localStorage.setItem('trading_live_balance', bal.toString());
        }
      }
    } catch (err) {
      console.warn('Balance fetch error:', err);
    }
  };

  useEffect(() => {
    fetchLiveBalance();

    // Load specific user investments upon mount or login change
    try {
      const saved = localStorage.getItem(getUserInvestmentsKey());
      if (saved) {
        setInvestments(JSON.parse(saved));
      } else {
        setInvestments([]);
      }
    } catch (e) {}

    const handleStorage = (e) => {
      if (e.key === 'trading_live_balance' && e.newValue !== null) {
        const val = Number(e.newValue);
        if (!isNaN(val)) setBalance(val);
      }
    };
    window.addEventListener('storage', handleStorage);

    let bc;
    try {
      bc = new BroadcastChannel('trading_balance_sync');
      bc.onmessage = (event) => {
        if (event.data && typeof event.data.balanceUSD === 'number') {
          setBalance(Number(event.data.balanceUSD));
        }
      };
    } catch (e) {}

    return () => {
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, []);

  // Fluctuating Live Returns for Real Market Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setInvestments((prev) =>
        prev.map((inv) => {
          const delta = (Math.random() - 0.42) * 0.08;
          const newReturn = Math.max(0.1, +(inv.todayReturn + delta).toFixed(2));
          return { ...inv, todayReturn: newReturn };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Save investments to user-specific localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(getUserInvestmentsKey(), JSON.stringify(investments));
    } catch (e) {}
  }, [investments]);

  const currentInvestmentAmount = customAmount !== '' ? Number(customAmount) : selectedPlan;

  const handleSelectPlan = (amt) => {
    setSelectedPlan(amt);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    if (val !== '') {
      setSelectedPlan(null);
    }
  };

  // Handle "Invest Now"
  const handleInvestNow = async () => {
    const amt = Number(currentInvestmentAmount);

    if (!amt || isNaN(amt) || amt <= 0) {
      showToast('Please enter a valid investment amount!', 'error');
      return;
    }

    if (amt > balance) {
      showToast(`Insufficient Live Balance! You have $${balance.toFixed(2)}, need $${amt.toFixed(2)}.`, 'error');
      return;
    }

    setLoading(true);

    try {
      const newBal = +(balance - amt).toFixed(2);
      await updateAndSyncBalance(newBal);

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      const newInvestment = {
        id: `inv-${Date.now()}`,
        assetSymbol: selectedAsset.symbol,
        assetName: selectedAsset.name,
        icon: selectedAsset.icon,
        isFlag: selectedAsset.isFlag,
        color: selectedAsset.color || '',
        amount: amt,
        date: dateStr,
        time: timeStr,
        todayReturn: +(amt * 0.008 + (Math.random() * 0.4)).toFixed(2)
      };

      setInvestments((prev) => [newInvestment, ...prev]);
      showToast(`🎉 Successfully invested $${amt} in ${selectedAsset.symbol}!`, 'success');
      setCustomAmount('');
      setSelectedPlan(25);
    } catch (error) {
      showToast('Error processing investment. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Exit Investment (Refund principal + return to live balance)
  const handleExitInvestment = async (invId) => {
    const targetInv = investments.find(inv => inv.id === invId);
    if (!targetInv) return;

    const totalPayout = Number((targetInv.amount + targetInv.todayReturn).toFixed(2));
    const newBal = +(balance + totalPayout).toFixed(2);

    await updateAndSyncBalance(newBal);

    setInvestments(prev => prev.filter(inv => inv.id !== invId));
    showToast(`✅ Exited ${targetInv.assetSymbol} investment! +$${totalPayout.toFixed(2)} added to your live balance.`, 'success');
  };

  return (
    <div className="flex h-screen w-full bg-[#0d121d] text-gray-200 overflow-hidden font-sans select-none">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-2xl text-white font-bold text-xs ${
          toast.type === 'success' ? 'bg-emerald-600 border border-emerald-400' : 'bg-red-600 border border-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <aside className="w-16 bg-[#121927] border-r border-gray-800 flex-col items-center justify-between py-3 z-10 hidden md:flex shrink-0">
        <div className="flex flex-col items-center space-y-5 w-full">
          <button 
            onClick={() => navigate('/terminal')} 
            className="flex flex-col items-center justify-center w-full py-2 border-l-2 border-transparent text-gray-400 hover:text-white transition cursor-pointer"
          >
            <BarChart2 className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1">TRADE</span>
          </button>

          <button 
            onClick={() => navigate('/terminal')} 
            className="flex flex-col items-center justify-center w-full py-2 border-l-2 border-transparent text-gray-400 hover:text-white transition cursor-pointer"
          >
            <History className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1">TRADES</span>
          </button>

          <button 
            onClick={() => navigate('/support')} 
            className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1">SUPPORT</span>
          </button>

          <button 
            onClick={() => navigate('/account')} 
            className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <User className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1">ACCOUNT</span>
          </button>

          <button 
            onClick={() => navigate('/tournment/active')} 
            className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1">TOURNAMENTS</span>
          </button>

          <button 
            className="flex flex-col items-center justify-center w-full py-2 border-l-2 border-emerald-500 text-emerald-400 bg-emerald-500/10 cursor-pointer"
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1 font-bold">INVEST</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#0a0f19]">
        
        {/* TOP HEADER */}
        <header className="h-14 bg-[#121927] border-b border-gray-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => navigate('/terminal')}
              className="flex items-center space-x-1.5 text-gray-400 hover:text-white bg-[#1b2537] px-3 py-1.5 rounded-lg border border-gray-700 text-xs font-semibold transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Terminal</span>
            </button>
            <div className="h-4 w-px bg-gray-800 hidden sm:block"></div>
            <span className="text-white font-bold text-sm hidden sm:inline">Investment Platform</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live Balance Badge */}
            <div className="flex items-center space-x-2 bg-[#182335] border border-gray-700 px-3 py-1.5 rounded-lg">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">LIVE</span>
              <span className="text-sm font-extrabold text-white font-mono">
                ${Number(balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <button
              onClick={() => navigate('/terminal/deposit')}
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1 transition shadow cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Deposit</span>
            </button>
          </div>
        </header>

        {/* BODY */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* 1. SELECT ASSET */}
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-gray-100 tracking-wide">Select Asset</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ASSETS.map((asset) => {
                  const isSelected = selectedAsset.id === asset.id;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition border ${
                        isSelected 
                          ? 'bg-[#182538] border-emerald-500 shadow-md ring-1 ring-emerald-500/40' 
                          : 'bg-[#131b2a] border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      {/* Asset Icon - Responsive Size (Smaller on phone, normal on laptop) */}
                      <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 text-xs sm:text-base shadow-sm overflow-hidden">
                        {asset.isFlag ? (
                          <span className="text-xl sm:text-2xl">{asset.icon}</span>
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${asset.color}`}>
                            {asset.icon}
                          </div>
                        )}
                      </div>

                      {/* Asset Details */}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white leading-tight">{asset.symbol}</div>
                        <div className="text-[10px] text-gray-400 truncate leading-tight mt-0.5">{asset.name}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 2. INVESTMENT PLAN */}
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-gray-100 tracking-wide">Investment Plan</h2>
              <p className="text-xs text-gray-400">Choose an amount and start your investment</p>

              <div className="grid grid-cols-4 gap-2.5 pt-1">
                {INVESTMENT_PLANS.map((planAmt) => {
                  const isSelected = selectedPlan === planAmt && customAmount === '';
                  return (
                    <button
                      key={planAmt}
                      type="button"
                      onClick={() => handleSelectPlan(planAmt)}
                      className={`py-3 rounded-xl text-sm font-extrabold transition cursor-pointer border ${
                        isSelected
                          ? 'bg-[#142629] border-emerald-500 text-emerald-400 ring-1 ring-emerald-500/50'
                          : 'bg-[#131b2a] border-gray-800 text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      ${planAmt}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 3. CUSTOM AMOUNT */}
            <section className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">Custom Amount</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400 font-bold text-sm">$</span>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full bg-[#131b2a] border border-gray-800 rounded-xl pl-9 pr-4 py-3 text-sm text-white font-mono outline-none focus:border-emerald-500 transition"
                />
              </div>
            </section>

            {/* 4. INVEST NOW BUTTON */}
            <button
              onClick={handleInvestNow}
              disabled={loading}
              className="w-full bg-[#00c076] hover:bg-[#00ad6a] active:scale-[0.99] text-white font-black py-4 rounded-xl text-sm transition shadow-lg shadow-emerald-900/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Processing Investment...' : 'Invest Now'}
            </button>

            {/* 5. MY INVESTMENT SECTION */}
            <section className="space-y-3 pt-2">
              <h2 className="text-sm font-bold text-gray-100 tracking-wide">My Investment</h2>

              {investments.length === 0 ? (
                <div className="text-center p-6 bg-[#131b2a] rounded-xl border border-gray-800 text-gray-400 text-xs">
                  No active investments yet. Start one above!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {investments.map((inv) => (
                    <div 
                      key={inv.id}
                      className="bg-[#131b2a] border border-gray-800/90 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm hover:border-gray-700 transition"
                    >
                      {/* Left: Asset Icon & Name */}
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                          {inv.isFlag ? (
                            <span className="text-xl sm:text-2xl">{inv.icon}</span>
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center text-xs sm:text-base ${inv.color || 'bg-amber-500 text-white font-bold'}`}>
                              {inv.icon || '₿'}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white leading-tight">{inv.assetSymbol}</div>
                          <div className="text-[10px] text-gray-400 leading-tight mt-0.5">Investment</div>
                        </div>
                      </div>

                      {/* Middle: Amount & Date */}
                      <div className="text-left sm:text-center px-2">
                        <div className="text-xs font-extrabold text-white font-mono">
                          ${Number(inv.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {inv.date} &nbsp;{inv.time}
                        </div>
                      </div>

                      {/* Right: Live Return & Exit Button */}
                      <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="bg-[#0e2722] border border-emerald-500/30 text-emerald-400 font-bold text-[11px] px-2.5 py-1.5 rounded-lg flex items-center space-x-1 shadow-inner">
                          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Today Return ${Number(inv.todayReturn || 0).toFixed(2)}</span>
                        </div>

                        <button
                          onClick={() => handleExitInvestment(inv.id)}
                          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-400 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 transition cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Exit</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        </main>

      </div>
    </div>
  );
}
