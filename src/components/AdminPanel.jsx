
// import React, { useEffect, useState } from 'react';
// import { 
//   ExternalLink, 
//   RefreshCw, 
//   IndianRupee, 
//   Send, 
//   DollarSign, 
//   User, 
//   Wallet, 
//   CheckCircle2, 
//   Clock, 
//   Sparkles 
// } from 'lucide-react';

// const EXCHANGE_RATE = 96;

// export default function AdminPanel() {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [customAmounts, setCustomAmounts] = useState({});
//   const [submittingId, setSubmittingId] = useState(null);

//   // User Profile & Live Balance State
//   const [userData, setUserData] = useState(null);
//   const [directBalanceInput, setDirectBalanceInput] = useState('');
//   const [directCurrency, setDirectCurrency] = useState('USD');
//   const [updatingDirectBalance, setUpdatingDirectBalance] = useState(false);

//   // Helper function to broadcast new balance directly to Trading Terminal (0ms latency)
//   const broadcastNewBalance = (newBal) => {
//     try {
//       const numBal = Number(newBal);
//       localStorage.setItem('trading_live_balance', numBal.toString());
//       window.dispatchEvent(new Event('storage'));
//       const bc = new BroadcastChannel('trading_balance_sync');
//       bc.postMessage({ balanceUSD: numBal });
//       bc.close();
//     } catch (e) {
//       console.warn('Cross-tab broadcast sync error:', e);
//     }
//   };

//   // 1. Fetch User Data (Live Balance)
//   const fetchUserData = async () => {
//     try {
//       const res = await fetch('http://localhost:5000/api/payments/live-balance');
//       const data = await res.json();
//       if (data.success && data.user) {
//         setUserData(data.user);
//         if (data.user.balance !== undefined) {
//           broadcastNewBalance(Number(data.user.balance));
//         }
//       }
//     } catch (err) {
//       console.error('Error fetching user data:', err);
//     }
//   };

//   // 2. Fetch Payments
//   const fetchPayments = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5000/api/payments/all');
//       const data = await res.json();
//       if (data.success) {
//         setPayments(data.payments);

//         const initialAmounts = {};
//         data.payments.forEach((p) => {
//           initialAmounts[p._id] = p.amountINR || p.amount || '';
//         });
//         setCustomAmounts(initialAmounts);
//       }
//     } catch (err) {
//       console.error('Error fetching payments:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const refreshAll = () => {
//     fetchPayments();
//     fetchUserData();
//   };

//   useEffect(() => {
//     refreshAll();
//   }, []);

//   const handleAmountChange = (id, value) => {
//     setCustomAmounts((prev) => ({
//       ...prev,
//       [id]: value,
//     }));
//   };

//   // 3. Amount Submit (INR -> USD Conversion & Live Terminal Credit)
//   const handleAmountSubmit = async (id) => {
//     const enteredInr = customAmounts[id];

//     if (!enteredInr || Number(enteredInr) <= 0) {
//       alert('Kripya valid INR amount enter karein!');
//       return;
//     }

//     const inrValue = Number(enteredInr);
//     const usdConverted = Number((inrValue / EXCHANGE_RATE).toFixed(2));

//     setSubmittingId(id);

//     try {
//       const res = await fetch(`http://localhost:5000/api/payments/amount/${id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           amountINR: inrValue,
//           amountUSD: usdConverted,
//           exchangeRate: EXCHANGE_RATE
//         }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         setPayments((prevPayments) =>
//           prevPayments.map((p) =>
//             p._id === id ? { ...p, ...data.payment, status: 'Approved' } : p
//           )
//         );

//         const finalBalance = data.liveBalance !== undefined 
//           ? Number(data.liveBalance) 
//           : (data.user ? Number(data.user.balance) : usdConverted);

//         if (data.user) {
//           setUserData(data.user);
//         } else {
//           setUserData((prev) => ({ ...(prev || {}), balance: finalBalance }));
//           fetchUserData();
//         }

//         // Realtime instant broadcast to Trading Terminal across tabs
//         broadcastNewBalance(finalBalance);

//         alert(`✅ SUCCESS!\n₹${inrValue} INR ($${usdConverted} USD) Trading Terminal ke LIVE balance me add ho gaya!\n\nNaya Live Balance: $${finalBalance} USD`);
//       } else {
//         alert(data.message || 'Failed to update amount');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Failed to update amount. Backend server check karein.');
//     } finally {
//       setSubmittingId(null);
//     }
//   };

//   // 4. Direct Live Balance Update Handler
//   const handleDirectBalanceUpdate = async () => {
//     if (!directBalanceInput || isNaN(Number(directBalanceInput)) || Number(directBalanceInput) < 0) {
//       alert('Kripya valid balance amount daaliye!');
//       return;
//     }

//     setUpdatingDirectBalance(true);
//     try {
//       const targetBalanceUSD = directCurrency === 'INR' 
//         ? Number((Number(directBalanceInput) / EXCHANGE_RATE).toFixed(2)) 
//         : Number(Number(directBalanceInput).toFixed(2));

//       const body = {
//         balanceUSD: targetBalanceUSD,
//         balanceINR: directCurrency === 'INR' ? Number(directBalanceInput) : Number((targetBalanceUSD * EXCHANGE_RATE).toFixed(2)),
//         userId: userData?._id,
//         email: userData?.email
//       };

//       const res = await fetch('http://localhost:5000/api/payments/set-user-balance', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(body)
//       });

//       const data = await res.json();
//       if (data.success) {
//         const finalBal = data.liveBalance !== undefined ? Number(data.liveBalance) : targetBalanceUSD;
//         setUserData(data.user || { ...(userData || {}), balance: finalBal });
//         setDirectBalanceInput('');

//         // Realtime broadcast
//         broadcastNewBalance(finalBal);

//         alert(`✅ Live Balance successfully set to $${finalBal} USD!`);
//       } else {
//         alert(data.message || 'Error updating balance');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Error updating live balance');
//     } finally {
//       setUpdatingDirectBalance(false);
//     }
//   };

//   const userBalanceUSD = userData ? Number(userData.balance || 0).toFixed(2) : '0.00';
//   const userBalanceINR = userData ? (Number(userData.balance || 0) * EXCHANGE_RATE).toFixed(2) : '0.00';

//   return (
//     <div className="min-h-screen bg-[#0d121d] text-white p-4 sm:p-6 select-none font-sans">
//       <div className="max-w-5xl mx-auto space-y-6">

//         {/* HEADER BAR */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-4 gap-4">
//           <div>
//             <h1 className="text-2xl font-bold flex items-center gap-2">
//               <span>Admin - Live Balance & Deposits</span>
//               <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
//                 Live Server
//               </span>
//             </h1>
//             <p className="text-xs text-gray-400 mt-1">
//               Enter amount in Rupees (₹) & click OK to automatically convert into USD ($) on Trading Terminal.
//             </p>
//           </div>

//           <button
//             onClick={refreshAll}
//             className="flex items-center gap-2 bg-[#1b2537] hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer border border-gray-700 shadow"
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh All
//           </button>
//         </div>

//         {/* CURRENT USER LIVE BALANCE BANNER */}
//         <div className="bg-gradient-to-r from-[#131d2e] via-[#162438] to-[#121c2b] border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
//                 <Wallet className="w-6 h-6" />
//               </div>
//               <div>
//                 <div className="flex items-center gap-2">
//                   <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Live Trader Account</span>
//                   <span className="bg-blue-600/30 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-500/30">
//                     Active
//                   </span>
//                 </div>
//                 <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
//                   <User className="w-3.5 h-3.5 text-gray-400" />
//                   <span>{userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email : 'Trading User'}</span>
//                   <span className="text-xs font-normal text-gray-400">({userData?.email || 'rehanimam624@gmail.com'})</span>
//                 </div>
//               </div>
//             </div>

//             {/* BALANCE DISPLAY */}
//             <div className="flex items-center gap-6 bg-[#0a0f18]/80 px-4 py-2.5 rounded-xl border border-gray-800">
//               <div className="text-right">
//                 <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">Terminal Live Balance</span>
//                 <span className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center justify-end">
//                   <DollarSign className="w-5 h-5 stroke-[2.5]" />
//                   {userBalanceUSD} USD
//                 </span>
//               </div>
//               <div className="h-8 w-px bg-gray-800"></div>
//               <div className="text-right">
//                 <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">Rupees Equivalent</span>
//                 <span className="text-sm sm:text-base font-bold text-gray-200 flex items-center justify-end">
//                   <IndianRupee className="w-3.5 h-3.5" />
//                   {userBalanceINR} INR
//                 </span>
//               </div>
//             </div>

//           </div>

//           {/* DIRECT ADJUSTMENT ACCORDION / QUICK SET */}
//           <div className="mt-4 pt-3 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
//             <div className="flex items-center gap-2 text-gray-400">
//               <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
//               <span>Conversion Rate: <strong>$1.00 USD = ₹{EXCHANGE_RATE} INR</strong></span>
//             </div>

//             <div className="flex items-center gap-2 w-full sm:w-auto">
//               <div className="flex bg-[#0a0f18] rounded-lg border border-gray-700 overflow-hidden text-xs">
//                 <button
//                   type="button"
//                   onClick={() => setDirectCurrency('INR')}
//                   className={`px-2.5 py-1 font-bold transition ${directCurrency === 'INR' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
//                 >
//                   ₹ INR
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setDirectCurrency('USD')}
//                   className={`px-2.5 py-1 font-bold transition ${directCurrency === 'USD' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
//                 >
//                   $ USD
//                 </button>
//               </div>

//               <input 
//                 type="number"
//                 placeholder={directCurrency === 'INR' ? "Direct ₹ e.g. 10000" : "Direct $ e.g. 100"}
//                 value={directBalanceInput}
//                 onChange={(e) => setDirectBalanceInput(e.target.value)}
//                 className="bg-[#0e1522] border border-gray-700 rounded-lg px-2.5 py-1 text-xs w-36 text-white focus:outline-none focus:border-emerald-500"
//               />

//               <button
//                 type="button"
//                 onClick={handleDirectBalanceUpdate}
//                 disabled={updatingDirectBalance}
//                 className="bg-[#1c2638] hover:bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer border border-gray-700 disabled:opacity-50"
//               >
//                 {updatingDirectBalance ? 'Setting...' : 'Set Direct Balance'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* SECTION TITLE */}
//         <div className="flex justify-between items-center pt-2">
//           <h2 className="text-lg font-bold text-gray-200">
//             Uploaded Deposit Requests ({payments.length})
//           </h2>
//           <span className="text-xs text-gray-400">
//             Click OK to credit converted USD to Trading Terminal
//           </span>
//         </div>

//         {/* DEPOSIT CARDS LIST */}
//         {loading ? (
//           <div className="p-8 text-center text-gray-400 bg-[#121927] rounded-xl border border-gray-800">
//             <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
//             <p>Loading deposits and live balances...</p>
//           </div>
//         ) : payments.length === 0 ? (
//           <div className="p-8 text-center text-gray-400 bg-[#121927] rounded-xl border border-gray-800">
//             <p>No deposit screenshots uploaded yet.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {payments.map((payment) => {
//               const currentInr = customAmounts[payment._id] || 0;
//               const convertedUsd = (Number(currentInr) / EXCHANGE_RATE).toFixed(2);
//               const isSubmitting = submittingId === payment._id;
//               const isApproved = payment.status === 'Approved' || payment.status === 'APPROVED';

//               return (
//                 <div 
//                   key={payment._id} 
//                   className="bg-[#121927] border border-gray-800 hover:border-gray-700 rounded-xl p-4 flex flex-col space-y-3 transition shadow-md"
//                 >
                  
//                   {/* Image Screenshot Preview */}
//                   <div className="h-48 bg-black rounded-lg overflow-hidden border border-gray-700 relative group">
//                     <img 
//                       src={payment.imageUrl} 
//                       alt="Deposit Screenshot" 
//                       className="w-full h-full object-cover transition duration-200 group-hover:scale-105" 
//                     />
//                     <a
//                       href={payment.imageUrl}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="absolute top-2 right-2 bg-black/75 hover:bg-black p-1.5 rounded-md text-white transition flex items-center gap-1 text-[11px]"
//                     >
//                       <ExternalLink className="w-3.5 h-3.5" />
//                       <span>Full View</span>
//                     </a>

//                     {/* Status Badge */}
//                     <div className="absolute top-2 left-2">
//                       {isApproved ? (
//                         <span className="bg-emerald-500/90 text-black text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow">
//                           <CheckCircle2 className="w-3 h-3" /> APPROVED
//                         </span>
//                       ) : (
//                         <span className="bg-amber-500/90 text-black text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow">
//                           <Clock className="w-3 h-3" /> PENDING
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Metadata */}
//                   <div className="text-[11px] text-gray-400 flex justify-between items-center">
//                     <span>Date: {new Date(payment.createdAt).toLocaleDateString()}</span>
//                     <span>Rate: $1 = ₹{EXCHANGE_RATE}</span>
//                   </div>

//                   {/* Current Stored Details if Approved */}
//                   {Number(payment.amountUSD || 0) > 0 && (
//                     <div className="bg-[#1c2638]/70 border border-gray-700/60 p-2 rounded-lg text-xs flex justify-between items-center">
//                       <span className="text-gray-400">Current Credited:</span>
//                       <span className="font-bold text-white">
//                         ₹{payment.amountINR || (payment.amountUSD * EXCHANGE_RATE).toFixed(0)} (~${payment.amountUSD} USD)
//                       </span>
//                     </div>
//                   )}

//                   {/* Enter Amount Field + OK Button */}
//                   <div className="space-y-2 pt-1">
//                     <label className="text-[11px] text-gray-300 font-semibold flex items-center justify-between">
//                       <span>Enter INR Amount (Rupees):</span>
//                       <span className="text-gray-400 text-[10px]">₹ INR</span>
//                     </label>

//                     <div className="flex gap-2">
//                       <div className="relative flex-1 flex items-center">
//                         <IndianRupee className="w-3.5 h-3.5 absolute left-2.5 text-gray-400" />
//                         <input
//                           type="number"
//                           placeholder="e.g. 1000"
//                           value={customAmounts[payment._id] ?? ''}
//                           onChange={(e) => handleAmountChange(payment._id, e.target.value)}
//                           className="w-full bg-[#1c2638] border border-gray-700 text-white rounded-lg pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-mono"
//                         />
//                       </div>

//                       <button
//                         onClick={() => handleAmountSubmit(payment._id)}
//                         disabled={isSubmitting}
//                         className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md disabled:opacity-50"
//                       >
//                         {isSubmitting ? (
//                           <RefreshCw className="w-3.5 h-3.5 animate-spin" />
//                         ) : (
//                           <Send className="w-3.5 h-3.5" />
//                         )}
//                         <span>OK</span>
//                       </button>
//                     </div>

//                     {/* Converted Live USD Box */}
//                     {Number(currentInr) > 0 && (
//                       <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg text-xs font-bold text-emerald-400 animate-fadeIn">
//                         <span>Converted Live USD:</span>
//                         <span className="flex items-center text-sm font-black">
//                           <DollarSign className="w-4 h-4" />
//                           {convertedUsd} USD
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                 </div>
//               );
//             })}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { 
  ExternalLink, RefreshCw, IndianRupee, Send, DollarSign, 
  User, Wallet, CheckCircle2, Clock, Sparkles, Landmark, ArrowUpRight 
} from 'lucide-react';

const EXCHANGE_RATE = 96;

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('deposits'); // 'deposits' | 'withdrawals'
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customAmounts, setCustomAmounts] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  // User Profile & Live Balance State
  const [userData, setUserData] = useState(null);
  const [directBalanceInput, setDirectBalanceInput] = useState('');
  const [directCurrency, setDirectCurrency] = useState('USD');
  const [updatingDirectBalance, setUpdatingDirectBalance] = useState(false);

  // Broadcast new balance to Trading Terminal across tabs
  const broadcastNewBalance = (newBal) => {
    try {
      const numBal = Number(newBal);
      localStorage.setItem('trading_live_balance', numBal.toString());
      window.dispatchEvent(new Event('storage'));
      const bc = new BroadcastChannel('trading_balance_sync');
      bc.postMessage({ balanceUSD: numBal });
      bc.close();
    } catch (e) {}
  };

  const fetchUserData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/payments/live-balance');
      const data = await res.json();
      if (data.success && data.user) {
        setUserData(data.user);
        if (data.user.balance !== undefined) broadcastNewBalance(Number(data.user.balance));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/payments/all');
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
        const initialAmounts = {};
        data.payments.forEach((p) => {
          initialAmounts[p._id] = p.amountINR || p.amount || '';
        });
        setCustomAmounts(initialAmounts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/payments/withdrawal/all');
      const data = await res.json();
      if (data.success) setWithdrawals(data.withdrawals);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshAll = () => {
    fetchPayments();
    fetchWithdrawals();
    fetchUserData();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const handleAmountChange = (id, value) => {
    setCustomAmounts((prev) => ({ ...prev, [id]: value }));
  };

  // Deposit OK Submit (₹1000 -> $10.42 Live Terminal Credit)
  const handleAmountSubmit = async (id) => {
    const enteredInr = customAmounts[id];
    if (!enteredInr || Number(enteredInr) <= 0) {
      alert('Kripya valid INR amount enter karein!');
      return;
    }

    const inrValue = Number(enteredInr);
    const usdConverted = Number((inrValue / EXCHANGE_RATE).toFixed(2));
    setSubmittingId(id);

    try {
      const res = await fetch(`http://localhost:5000/api/payments/amount/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountINR: inrValue, amountUSD: usdConverted, exchangeRate: EXCHANGE_RATE }),
      });

      const data = await res.json();
      if (data.success) {
        setPayments((prev) => prev.map((p) => p._id === id ? { ...p, ...data.payment, status: 'Approved' } : p));
        const finalBalance = data.liveBalance !== undefined ? Number(data.liveBalance) : usdConverted;

        if (data.user) setUserData(data.user);
        else setUserData((prev) => ({ ...(prev || {}), balance: finalBalance }));

        broadcastNewBalance(finalBalance);
        alert(`✅ SUCCESS!\n₹${inrValue} INR ($${usdConverted} USD) Trading Terminal ke LIVE balance me credit ho gaya!\n\nNaya Live Balance: $${finalBalance} USD`);
      } else {
        alert(data.message || 'Failed to update amount');
      }
    } catch (err) {
      alert('Failed to update amount. Backend check karein.');
    } finally {
      setSubmittingId(null);
    }
  };

  // Admin Transfer Withdrawal Button
  const handleTransferWithdrawal = async (id) => {
    if (!window.confirm('Kya aapne user ke account me paise transfer kar diye hain?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/payments/withdrawal/status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Transferred' })
      });
      const data = await res.json();
      if (data.success) {
        setWithdrawals(prev => prev.map(w => w._id === id ? { ...w, status: 'Transferred' } : w));
        alert('✅ Withdrawal marked as Transferred successfully!');
      }
    } catch (err) {
      alert('Error updating withdrawal');
    }
  };

  // Direct Balance Set
  const handleDirectBalanceUpdate = async () => {
    if (!directBalanceInput || isNaN(Number(directBalanceInput)) || Number(directBalanceInput) < 0) {
      alert('Kripya valid balance amount daaliye!');
      return;
    }

    setUpdatingDirectBalance(true);
    try {
      const targetUSD = directCurrency === 'INR' 
        ? Number((Number(directBalanceInput) / EXCHANGE_RATE).toFixed(2)) 
        : Number(Number(directBalanceInput).toFixed(2));

      const res = await fetch('http://localhost:5000/api/payments/set-user-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balanceUSD: targetUSD, email: userData?.email })
      });

      const data = await res.json();
      if (data.success) {
        setUserData(data.user || { ...(userData || {}), balance: targetUSD });
        setDirectBalanceInput('');
        broadcastNewBalance(targetUSD);
        alert(`✅ Live Balance successfully set to $${targetUSD} USD!`);
      }
    } catch (err) {
      alert('Error updating live balance');
    } finally {
      setUpdatingDirectBalance(false);
    }
  };

  const userBalanceUSD = userData ? Number(userData.balance || 0).toFixed(2) : '0.00';
  const userBalanceINR = userData ? (Number(userData.balance || 0) * EXCHANGE_RATE).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-[#0d121d] text-white p-4 sm:p-6 select-none font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <span>Admin Dashboard - Deposits & Withdrawals</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                Live Server
              </span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Credit deposits in INR ($ USD) and transfer requested user withdrawals.
            </p>
          </div>

          <button
            onClick={refreshAll}
            className="flex items-center gap-2 bg-[#1b2537] hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer border border-gray-700 shadow"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh All
          </button>
        </div>

        {/* LIVE TRADER BANNER */}
        <div className="bg-gradient-to-r from-[#131d2e] via-[#162438] to-[#121c2b] border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Trader Account</span>
                  <span className="bg-blue-600/30 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-blue-500/30">Active</span>
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span>{userData ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email : 'Trading User'}</span>
                  <span className="text-xs font-normal text-gray-400">({userData?.email || 'user@example.com'})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 bg-[#0a0f18]/80 px-4 py-2.5 rounded-xl border border-gray-800">
              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">Terminal Live Balance</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center justify-end">
                  <DollarSign className="w-5 h-5 stroke-[2.5]" />
                  {userBalanceUSD} USD
                </span>
              </div>
              <div className="h-8 w-px bg-gray-800"></div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-semibold">Rupees Equivalent</span>
                <span className="text-sm sm:text-base font-bold text-gray-200 flex items-center justify-end">
                  <IndianRupee className="w-3.5 h-3.5" />
                  {userBalanceINR} INR
                </span>
              </div>
            </div>

          </div>

          {/* QUICK DIRECT SET */}
          <div className="mt-4 pt-3 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Conversion Rate: <strong>$1.00 USD = ₹{EXCHANGE_RATE} INR</strong></span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex bg-[#0a0f18] rounded-lg border border-gray-700 overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setDirectCurrency('INR')}
                  className={`px-2.5 py-1 font-bold ${directCurrency === 'INR' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}
                >₹ INR</button>
                <button
                  type="button"
                  onClick={() => setDirectCurrency('USD')}
                  className={`px-2.5 py-1 font-bold ${directCurrency === 'USD' ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}
                >$ USD</button>
              </div>

              <input 
                type="number"
                placeholder={directCurrency === 'INR' ? "Direct ₹ e.g. 10000" : "Direct $ e.g. 100"}
                value={directBalanceInput}
                onChange={(e) => setDirectBalanceInput(e.target.value)}
                className="bg-[#0e1522] border border-gray-700 rounded-lg px-2.5 py-1 text-xs w-36 text-white outline-none"
              />

              <button
                type="button"
                onClick={handleDirectBalanceUpdate}
                disabled={updatingDirectBalance}
                className="bg-[#1c2638] hover:bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold text-xs transition border border-gray-700 cursor-pointer"
              >
                Set Balance
              </button>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex border-b border-gray-800 space-x-6">
          <button
            onClick={() => setActiveTab('deposits')}
            className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'deposits' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span>Deposit Requests</span>
            <span className="bg-emerald-600/30 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-bold">
              {payments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'withdrawals' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <span>Withdrawal Requests</span>
            <span className="bg-blue-600/30 text-blue-400 text-xs px-2 py-0.5 rounded-full font-bold">
              {withdrawals.length}
            </span>
          </button>
        </div>

        {/* TAB 1: DEPOSITS GRID */}
        {activeTab === 'deposits' && (
          <div>
            {loading ? (
              <div className="p-8 text-center text-gray-400 bg-[#121927] rounded-xl border border-gray-800">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
                <p>Loading deposits...</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-[#121927] rounded-xl border border-gray-800">
                No deposit screenshots uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {payments.map((payment) => {
                  const currentInr = customAmounts[payment._id] || 0;
                  const convertedUsd = (Number(currentInr) / EXCHANGE_RATE).toFixed(2);
                  const isSubmitting = submittingId === payment._id;
                  const isApproved = payment.status === 'Approved';

                  return (
                    <div key={payment._id} className="bg-[#121927] border border-gray-800 rounded-xl p-4 flex flex-col space-y-3 shadow-md">
                      
                      {/* Image Preview */}
                      <div className="h-48 bg-black rounded-lg overflow-hidden border border-gray-700 relative">
                        <img src={payment.imageUrl} alt="Deposit" className="w-full h-full object-cover" />
                        <a href={payment.imageUrl} target="_blank" rel="noreferrer" className="absolute top-2 right-2 bg-black/75 p-1.5 rounded-md text-white flex items-center gap-1 text-[11px]">
                          <ExternalLink className="w-3.5 h-3.5" /> Full View
                        </a>
                        <div className="absolute top-2 left-2">
                          {isApproved ? (
                            <span className="bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> APPROVED
                            </span>
                          ) : (
                            <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                              <Clock className="w-3 h-3" /> PENDING
                            </span>
                          )}
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="text-xs bg-[#1c2638] p-2 rounded-lg border border-gray-700/60">
                        <span className="text-gray-400 block text-[10px]">Uploaded By User:</span>
                        <span className="font-bold text-white break-all">{payment.userEmail || 'user@example.com'}</span>
                      </div>

                      {/* Enter Amount Field + OK */}
                      <div className="space-y-2 pt-1">
                        <label className="text-[11px] text-gray-300 font-semibold flex items-between justify-between">
                          <span>Enter INR Amount (Rupees):</span>
                          <span className="text-gray-400">₹ INR</span>
                        </label>

                        <div className="flex gap-2">
                          <div className="relative flex-1 flex items-center">
                            <IndianRupee className="w-3.5 h-3.5 absolute left-2.5 text-gray-400" />
                            <input
                              type="number"
                              placeholder="e.g. 1000"
                              value={customAmounts[payment._id] ?? ''}
                              onChange={(e) => handleAmountChange(payment._id, e.target.value)}
                              className="w-full bg-[#1c2638] border border-gray-700 text-white rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-emerald-500 font-mono"
                            />
                          </div>

                          <button
                            onClick={() => handleAmountSubmit(payment._id)}
                            disabled={isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md disabled:opacity-50"
                          >
                            {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            <span>OK</span>
                          </button>
                        </div>

                        {Number(currentInr) > 0 && (
                          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2 rounded-lg text-xs font-bold text-emerald-400">
                            <span>Converted Live USD:</span>
                            <span className="flex items-center text-sm font-black">
                              <DollarSign className="w-4 h-4" />
                              {convertedUsd} USD
                            </span>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WITHDRAWALS LIST */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-4">
            {withdrawals.length === 0 ? (
              <div className="p-8 text-center text-gray-400 bg-[#121927] rounded-xl border border-gray-800">
                No withdrawal requests submitted yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {withdrawals.map((w) => {
                  const isTransferred = w.status === 'Transferred';
                  return (
                    <div key={w._id} className="bg-[#121927] border border-gray-800 rounded-xl p-5 space-y-3 shadow-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-300">{w.userEmail}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              isTransferred ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                            }`}>
                              {w.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400 block mt-0.5">
                            Requested: {new Date(w.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-black text-emerald-400 flex items-center justify-end">
                            <IndianRupee className="w-4 h-4" /> ₹{w.amountINR} INR
                          </span>
                          <span className="text-xs text-gray-400 block font-semibold">(${w.amountUSD} USD)</span>
                        </div>
                      </div>

                      {/* Bank Details Box */}
                      <div className="bg-[#182335] p-3 rounded-lg border border-gray-700/60 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Account Holder:</span>
                          <span className="font-bold text-white">{w.accountHolderName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Bank Name:</span>
                          <span className="font-bold text-white">{w.bankName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Account Number:</span>
                          <span className="font-mono font-bold text-emerald-300">{w.accountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">IFSC Code:</span>
                          <span className="font-mono font-bold text-white">{w.ifscCode}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      {!isTransferred ? (
                        <button
                          onClick={() => handleTransferWithdrawal(w._id)}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                          <span>Transfer Now (Mark as Transferred)</span>
                        </button>
                      ) : (
                        <div className="text-center text-xs text-emerald-400 font-bold py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                          ✅ Amount Transferred to User
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}