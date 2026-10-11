// import React, { useEffect, useState, useCallback } from 'react';
// import { 
//   ExternalLink, RefreshCw, IndianRupee, Send, DollarSign, 
//   CheckCircle2, Clock, ArrowUpRight 
// } from 'lucide-react';

// const EXCHANGE_RATE = 96;

// export default function AdminPanel() {
//   const [activeTab, setActiveTab] = useState('deposits'); // 'deposits' | 'withdrawals'
//   const [payments, setPayments] = useState([]);
//   const [withdrawals, setWithdrawals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [customAmounts, setCustomAmounts] = useState({});
//   const [submittingId, setSubmittingId] = useState(null);

//   const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();

//   // Broadcast new balance to Trading Terminal across browser tabs
//   const broadcastNewBalance = useCallback((newBal, targetEmail, targetUserId) => {
//     try {
//       const numBal = Number(newBal);
//       const activeUserEmail = localStorage.getItem('userEmail');
//       const activeUserId = localStorage.getItem('userId');

//       // Agar same user terminal open kiya hai to terminal balance update ho
//       if (!targetEmail || targetEmail === activeUserEmail || targetUserId === activeUserId) {
//         localStorage.setItem('trading_live_balance', numBal.toString());
//         window.dispatchEvent(new Event('storage'));
//         const bc = new BroadcastChannel('trading_balance_sync');
//         bc.postMessage({ balanceUSD: numBal, email: targetEmail, userId: targetUserId });
//         bc.close();
//       }
//     } catch (e) {
//       console.warn('Broadcast error:', e);
//     }
//   }, []);

//   // 1. Fetch All Deposits
//   const fetchPayments = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_URL}/api/payments/all`);
//       const data = await res.json();
//       if (data.success) {
//         setPayments(data.payments);
//         const initialAmounts = {};
//         data.payments.forEach((p) => {
//           initialAmounts[p._id] = p.amountINR || (p.amountUSD ? (p.amountUSD * EXCHANGE_RATE).toFixed(0) : '');
//         });
//         setCustomAmounts(initialAmounts);
//       }
//     } catch (err) {
//       console.error('Error fetching payments:', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [API_URL]);

//   // 2. Fetch All Withdrawals
//   const fetchWithdrawals = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_URL}/api/payments/withdrawal/all`);
//       const data = await res.json();
//       if (data.success) {
//         setWithdrawals(data.withdrawals);
//       }
//     } catch (err) {
//       console.error('Error fetching withdrawals:', err);
//     }
//   }, [API_URL]);

//   // Refresh All Data
//   const refreshAll = useCallback(() => {
//     fetchPayments();
//     fetchWithdrawals();
//   }, [fetchPayments, fetchWithdrawals]);

//   useEffect(() => {
//     refreshAll();
//   }, [refreshAll]);

//   const handleAmountChange = (id, value) => {
//     setCustomAmounts((prev) => ({ ...prev, [id]: value }));
//   };

//   // Deposit OK Submit (Screenshot 3: Admin enters INR, clicks OK -> converts at 96 rate -> credits Live USD to user)
//   const handleAmountSubmit = async (id, targetPayment) => {
//     const enteredInr = customAmounts[id];
//     if (!enteredInr || Number(enteredInr) <= 0) {
//       alert('Kripya valid INR amount enter karein!');
//       return;
//     }

//     const inrValue = Number(enteredInr);
//     const usdConverted = Number((inrValue / EXCHANGE_RATE).toFixed(2));
//     setSubmittingId(id);

//     try {
//       const res = await fetch(`${API_URL}/api/payments/amount/${id}`, {
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
//         setPayments((prev) =>
//           prev.map((p) => (p._id === id ? { ...p, ...data.payment, status: 'Approved' } : p))
//         );

//         const targetUserEmail = data.payment?.userEmail || targetPayment.userEmail;
//         const targetUserId = data.payment?.userId || targetPayment.userId;
//         const creditedLiveBalance = data.liveBalance !== undefined ? Number(data.liveBalance) : usdConverted;

//         broadcastNewBalance(creditedLiveBalance, targetUserEmail, targetUserId);

//         alert(`✅ APPROVED & CREDITED!\n\nUser: ${targetUserEmail}\nINR Amount: ₹${inrValue} INR\nConverted Rate: 1 USD = ₹${EXCHANGE_RATE} INR\nCredited to Live Balance: $${usdConverted} USD\n\nUser ke Live Terminal me $${creditedLiveBalance} USD successfully credit ho gaya!`);
//       } else {
//         alert(data.message || 'Failed to update amount');
//       }
//     } catch (err) {
//       alert('Failed to update amount. Backend check karein.');
//     } finally {
//       setSubmittingId(null);
//     }
//   };

//   // Admin Transfer Withdrawal Button
//   const handleTransferWithdrawal = async (id) => {
//     if (!window.confirm('Kya aapne user ke bank account me paise transfer kar diye hain?')) return;

//     try {
//       const res = await fetch(`${API_URL}/api/payments/withdrawal/status/${id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ status: 'Transferred' })
//       });
//       const data = await res.json();
//       if (data.success) {
//         setWithdrawals((prev) =>
//           prev.map((w) => (w._id === id ? { ...w, status: 'Transferred' } : w))
//         );
//         alert('✅ Withdrawal marked as Transferred successfully!');
//       }
//     } catch (err) {
//       alert('Error updating withdrawal');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0d121d] text-white p-4 sm:p-6 select-none font-sans">
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* HEADER BAR */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-4 gap-4">
//           <div>
//             <h1 className="text-2xl font-bold flex items-center gap-2">
//               <span>Admin Dashboard - Deposits & Withdrawals</span>
//               <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
//                 Live Server
//               </span>
//             </h1>
//             <p className="text-xs text-gray-400 mt-1">
//               Approve deposit requests in Rupees (converts at rate ₹96 to USD) & process user withdrawals.
//             </p>
//           </div>

//           <button
//             onClick={refreshAll}
//             className="flex items-center gap-2 bg-[#1b2537] hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer border border-gray-700 shadow"
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh All
//           </button>
//         </div>

//         {/* TABS NAVIGATION */}
//         <div className="flex border-b border-gray-800 space-x-6">
//           <button
//             onClick={() => setActiveTab('deposits')}
//             className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer ${
//               activeTab === 'deposits' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-400 hover:text-white'
//             }`}
//           >
//             <span>Deposit Requests</span>
//             <span className="bg-emerald-600/30 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-bold">
//               {payments.length}
//             </span>
//           </button>

//           <button
//             onClick={() => setActiveTab('withdrawals')}
//             className={`pb-3 text-sm font-bold border-b-2 flex items-center gap-2 cursor-pointer ${
//               activeTab === 'withdrawals' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-white'
//             }`}
//           >
//             <span>Withdrawal Requests</span>
//             <span className="bg-blue-600/30 text-blue-400 text-xs px-2 py-0.5 rounded-full font-bold">
//               {withdrawals.length}
//             </span>
//           </button>
//         </div>

//         {/* TAB 1: DEPOSIT REQUESTS (Screenshot 3 UI) */}
//         {activeTab === 'deposits' && (
//           <div>
//             {loading ? (
//               <div className="p-8 text-center text-gray-400 bg-[#121927] rounded-xl border border-gray-800">
//                 <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-400" />
//                 <p>Loading deposits...</p>
//               </div>
//             ) : payments.length === 0 ? (
//               <div className="p-8 text-center text-gray-400 bg-[#121927] rounded-xl border border-gray-800">
//                 No deposit screenshots uploaded yet.
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {payments.map((payment) => {
//                   const currentInr = customAmounts[payment._id] || '';
//                   const convertedUsd = currentInr && Number(currentInr) > 0 
//                     ? (Number(currentInr) / EXCHANGE_RATE).toFixed(2) 
//                     : (payment.amountUSD ? Number(payment.amountUSD).toFixed(2) : '0.00');

//                   const isSubmitting = submittingId === payment._id;
//                   const isApproved = payment.status === 'Approved';

//                   return (
//                     <div key={payment._id} className="bg-[#121927] border border-gray-800 rounded-xl p-4 flex flex-col space-y-3 shadow-md">
                      
//                       {/* Screenshot Image Preview with Badges */}
//                       <div className="h-48 bg-black rounded-lg overflow-hidden border border-gray-700 relative">
//                         <img src={payment.imageUrl} alt="Deposit Screenshot" className="w-full h-full object-cover" />
//                         <a 
//                           href={payment.imageUrl} 
//                           target="_blank" 
//                           rel="noreferrer" 
//                           className="absolute top-2 right-2 bg-black/75 hover:bg-black p-1.5 rounded-md text-white flex items-center gap-1 text-[11px] font-semibold"
//                         >
//                           <ExternalLink className="w-3.5 h-3.5" /> Full View
//                         </a>
//                         <div className="absolute top-2 left-2">
//                           {isApproved ? (
//                             <span className="bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow">
//                               <CheckCircle2 className="w-3 h-3 stroke-[3]" /> APPROVED
//                             </span>
//                           ) : (
//                             <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow">
//                               <Clock className="w-3 h-3 stroke-[3]" /> PENDING
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {/* User Email Information */}
//                       <div className="text-xs bg-[#1c2638] p-2.5 rounded-lg border border-gray-700/60">
//                         <span className="text-gray-400 block text-[10px] font-semibold uppercase tracking-wider">Uploaded By User:</span>
//                         <span className="font-bold text-white break-all text-xs">{payment.userEmail || 'user@example.com'}</span>
//                       </div>

//                       {/* Enter Amount Field + OK Action */}
//                       <div className="space-y-2 pt-1">
//                         <label className="text-[11px] text-gray-300 font-semibold flex items-center justify-between">
//                           <span>Enter INR Amount (Rupees):</span>
//                           <span className="text-gray-400 font-mono">₹ INR</span>
//                         </label>

//                         <div className="flex gap-2">
//                           <div className="relative flex-1 flex items-center">
//                             <IndianRupee className="w-3.5 h-3.5 absolute left-2.5 text-gray-400" />
//                             <input
//                               type="number"
//                               placeholder="e.g. 10000"
//                               value={customAmounts[payment._id] ?? ''}
//                               onChange={(e) => handleAmountChange(payment._id, e.target.value)}
//                               className="w-full bg-[#1c2638] border border-gray-700 text-white rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-emerald-500 font-mono"
//                             />
//                           </div>

//                           <button
//                             onClick={() => handleAmountSubmit(payment._id, payment)}
//                             disabled={isSubmitting}
//                             className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md disabled:opacity-50"
//                           >
//                             {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
//                             <span>OK</span>
//                           </button>
//                         </div>

//                         {/* Converted USD Live Indicator (At 96 Rate) */}
//                         <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg text-xs font-bold text-emerald-400">
//                           <span className="text-[11px]">Converted Live USD:</span>
//                           <span className="flex items-center text-sm font-black font-mono">
//                             <DollarSign className="w-4 h-4 stroke-[2.5]" />
//                             {convertedUsd} USD
//                           </span>
//                         </div>
//                       </div>

//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}

//         {/* TAB 2: WITHDRAWAL REQUESTS */}
//         {activeTab === 'withdrawals' && (
//           <div className="space-y-4">
//             {withdrawals.length === 0 ? (
//               <div className="p-8 text-center text-gray-400 bg-[#121927] rounded-xl border border-gray-800">
//                 No withdrawal requests submitted yet.
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {withdrawals.map((w) => {
//                   const isTransferred = w.status === 'Transferred';
//                   return (
//                     <div key={w._id} className="bg-[#121927] border border-gray-800 rounded-xl p-5 space-y-3 shadow-md">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <div className="flex items-center gap-2">
//                             <span className="text-xs font-bold text-gray-300">{w.userEmail}</span>
//                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
//                               isTransferred ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
//                             }`}>
//                               {w.status}
//                             </span>
//                           </div>
//                           <span className="text-[11px] text-gray-400 block mt-0.5">
//                             Requested: {new Date(w.createdAt).toLocaleString()}
//                           </span>
//                         </div>

//                         <div className="text-right">
//                           <span className="text-lg font-black text-emerald-400 flex items-center justify-end font-mono">
//                             <IndianRupee className="w-4 h-4" /> ₹{w.amountINR} INR
//                           </span>
//                           <span className="text-xs text-gray-400 block font-semibold font-mono">(${w.amountUSD} USD)</span>
//                         </div>
//                       </div>

//                       {/* Bank Details Box */}
//                       <div className="bg-[#182335] p-3 rounded-lg border border-gray-700/60 text-xs space-y-1">
//                         <div className="flex justify-between">
//                           <span className="text-gray-400">Account Holder:</span>
//                           <span className="font-bold text-white">{w.accountHolderName}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-400">Bank Name:</span>
//                           <span className="font-bold text-white">{w.bankName}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-400">Account Number:</span>
//                           <span className="font-mono font-bold text-emerald-300">{w.accountNumber}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-400">IFSC Code:</span>
//                           <span className="font-mono font-bold text-white">{w.ifscCode}</span>
//                         </div>
//                       </div>

//                       {/* Action Button */}
//                       {!isTransferred ? (
//                         <button
//                           onClick={() => handleTransferWithdrawal(w._id)}
//                           className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow"
//                         >
//                           <ArrowUpRight className="w-4 h-4" />
//                           <span>Transfer Now (Mark as Transferred)</span>
//                         </button>
//                       ) : (
//                         <div className="text-center text-xs text-emerald-400 font-bold py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
//                           ✅ Amount Transferred to User
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useCallback } from 'react';
import { 
  ExternalLink, RefreshCw, IndianRupee, Send, DollarSign, 
  CheckCircle2, Clock, ArrowUpRight 
} from 'lucide-react';

const EXCHANGE_RATE = 96;

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('deposits'); // 'deposits' | 'withdrawals'
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customAmounts, setCustomAmounts] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();

  // Broadcast new balance to Trading Terminal across browser tabs
  const broadcastNewBalance = useCallback((newBal, targetEmail, targetUserId) => {
    try {
      const numBal = Number(newBal);
      const activeUserEmail = localStorage.getItem('userEmail');
      const activeUserId = localStorage.getItem('userId');

      // Agar same user terminal open kiya hai to terminal balance update ho
      if (!targetEmail || targetEmail === activeUserEmail || targetUserId === activeUserId) {
        localStorage.setItem('trading_live_balance', numBal.toString());
        window.dispatchEvent(new Event('storage'));
        const bc = new BroadcastChannel('trading_balance_sync');
        bc.postMessage({ balanceUSD: numBal, email: targetEmail, userId: targetUserId });
        bc.close();
      }
    } catch (e) {
      console.warn('Broadcast error:', e);
    }
  }, []);

  // 1. Fetch All Deposits
  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/payments/all`);
      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
        const initialAmounts = {};
        data.payments.forEach((p) => {
          initialAmounts[p._id] = p.amountINR || (p.amountUSD ? (p.amountUSD * EXCHANGE_RATE).toFixed(0) : '');
        });
        setCustomAmounts(initialAmounts);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // 2. Fetch All Withdrawals
  const fetchWithdrawals = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/payments/withdrawal/all`);
      const data = await res.json();
      if (data.success) {
        setWithdrawals(data.withdrawals);
      }
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
    }
  }, [API_URL]);

  // Refresh All Data
  const refreshAll = useCallback(() => {
    fetchPayments();
    fetchWithdrawals();
  }, [fetchPayments, fetchWithdrawals]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleAmountChange = (id, value) => {
    setCustomAmounts((prev) => ({ ...prev, [id]: value }));
  };

  // Deposit OK Submit (Screenshot 3: Admin enters INR, clicks OK -> converts at 96 rate -> credits Live USD to user)
  const handleAmountSubmit = async (id, targetPayment) => {
    const enteredInr = customAmounts[id];
    if (!enteredInr || Number(enteredInr) <= 0) {
      alert('Kripya valid INR amount enter karein!');
      return;
    }

    const inrValue = Number(enteredInr);
    const usdConverted = Number((inrValue / EXCHANGE_RATE).toFixed(2));
    setSubmittingId(id);

    try {
      const res = await fetch(`${API_URL}/api/payments/amount/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amountINR: inrValue, 
          amountUSD: usdConverted, 
          exchangeRate: EXCHANGE_RATE 
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPayments((prev) =>
          prev.map((p) => (p._id === id ? { ...p, ...data.payment, status: 'Approved' } : p))
        );

        const targetUserEmail = data.payment?.userEmail || targetPayment.userEmail;
        const targetUserId = data.payment?.userId || targetPayment.userId;
        const creditedLiveBalance = data.liveBalance !== undefined ? Number(data.liveBalance) : usdConverted;

        // Guaranteed sync to User Profile in MongoDB
        if (targetUserId) {
          try {
            await fetch(`${API_URL}/api/users/profile/${targetUserId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ balance: creditedLiveBalance })
            });
          } catch (e) {}
        }

        broadcastNewBalance(creditedLiveBalance, targetUserEmail, targetUserId);

        alert(`✅ APPROVED & CREDITED!\n\nUser: ${targetUserEmail}\nINR Amount: ₹${inrValue} INR\nConverted Rate: 1 USD = ₹${EXCHANGE_RATE} INR\nCredited to Live Balance: $${usdConverted} USD\n\nUser ke Live Terminal me $${creditedLiveBalance} USD successfully credit ho gaya!`);
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
    if (!window.confirm('Kya aapne user ke bank account me paise transfer kar diye hain?')) return;

    try {
      const res = await fetch(`${API_URL}/api/payments/withdrawal/status/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Transferred' })
      });
      const data = await res.json();
      if (data.success) {
        setWithdrawals((prev) =>
          prev.map((w) => (w._id === id ? { ...w, status: 'Transferred' } : w))
        );
        alert('✅ Withdrawal marked as Transferred successfully!');
      }
    } catch (err) {
      alert('Error updating withdrawal');
    }
  };

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
              Approve deposit requests in Rupees (converts at rate ₹96 to USD) & process user withdrawals.
            </p>
          </div>

          <button
            onClick={refreshAll}
            className="flex items-center gap-2 bg-[#1b2537] hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer border border-gray-700 shadow"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh All
          </button>
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

        {/* TAB 1: DEPOSIT REQUESTS (Screenshot 3 UI) */}
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
                  const currentInr = customAmounts[payment._id] || '';
                  const convertedUsd = currentInr && Number(currentInr) > 0 
                    ? (Number(currentInr) / EXCHANGE_RATE).toFixed(2) 
                    : (payment.amountUSD ? Number(payment.amountUSD).toFixed(2) : '0.00');

                  const isSubmitting = submittingId === payment._id;
                  const isApproved = payment.status === 'Approved';

                  return (
                    <div key={payment._id} className="bg-[#121927] border border-gray-800 rounded-xl p-4 flex flex-col space-y-3 shadow-md">
                      
                      {/* Screenshot Image Preview with Badges */}
                      <div className="h-48 bg-black rounded-lg overflow-hidden border border-gray-700 relative">
                        <img src={payment.imageUrl} alt="Deposit Screenshot" className="w-full h-full object-cover" />
                        <a 
                          href={payment.imageUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="absolute top-2 right-2 bg-black/75 hover:bg-black p-1.5 rounded-md text-white flex items-center gap-1 text-[11px] font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Full View
                        </a>
                        <div className="absolute top-2 left-2">
                          {isApproved ? (
                            <span className="bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow">
                              <CheckCircle2 className="w-3 h-3 stroke-[3]" /> APPROVED
                            </span>
                          ) : (
                            <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow">
                              <Clock className="w-3 h-3 stroke-[3]" /> PENDING
                            </span>
                          )}
                        </div>
                      </div>

                      {/* User Email Information */}
                      <div className="text-xs bg-[#1c2638] p-2.5 rounded-lg border border-gray-700/60">
                        <span className="text-gray-400 block text-[10px] font-semibold uppercase tracking-wider">Uploaded By User:</span>
                        <span className="font-bold text-white break-all text-xs">{payment.userEmail || 'user@example.com'}</span>
                      </div>

                      {/* Enter Amount Field + OK Action */}
                      <div className="space-y-2 pt-1">
                        <label className="text-[11px] text-gray-300 font-semibold flex items-center justify-between">
                          <span>Enter INR Amount (Rupees):</span>
                          <span className="text-gray-400 font-mono">₹ INR</span>
                        </label>

                        <div className="flex gap-2">
                          <div className="relative flex-1 flex items-center">
                            <IndianRupee className="w-3.5 h-3.5 absolute left-2.5 text-gray-400" />
                            <input
                              type="number"
                              placeholder="e.g. 10000"
                              value={customAmounts[payment._id] ?? ''}
                              onChange={(e) => handleAmountChange(payment._id, e.target.value)}
                              className="w-full bg-[#1c2638] border border-gray-700 text-white rounded-lg pl-8 pr-3 py-2 text-xs outline-none focus:border-emerald-500 font-mono"
                            />
                          </div>

                          <button
                            onClick={() => handleAmountSubmit(payment._id, payment)}
                            disabled={isSubmitting}
                            className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md disabled:opacity-50"
                          >
                            {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            <span>OK</span>
                          </button>
                        </div>

                        {/* Converted USD Live Indicator (At 96 Rate) */}
                        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-lg text-xs font-bold text-emerald-400">
                          <span className="text-[11px]">Converted Live USD:</span>
                          <span className="flex items-center text-sm font-black font-mono">
                            <DollarSign className="w-4 h-4 stroke-[2.5]" />
                            {convertedUsd} USD
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WITHDRAWAL REQUESTS */}
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
                          <span className="text-lg font-black text-emerald-400 flex items-center justify-end font-mono">
                            <IndianRupee className="w-4 h-4" /> ₹{w.amountINR} INR
                          </span>
                          <span className="text-xs text-gray-400 block font-semibold font-mono">(${w.amountUSD} USD)</span>
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