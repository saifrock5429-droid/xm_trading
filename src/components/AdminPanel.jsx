import React, { useEffect, useState, useCallback, useRef } from 'react';
import { 
  ExternalLink, RefreshCw, IndianRupee, Send, DollarSign, 
  CheckCircle2, Clock, ArrowUpRight, Gift, Bell, MessageSquare 
} from 'lucide-react';

const EXCHANGE_RATE = 96;
const ADMIN_PHONE = '919217150796'; // Admin notification target (Visible only in AdminPanel)

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('deposits'); // 'deposits' | 'withdrawals'
  const [payments, setPayments] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customAmounts, setCustomAmounts] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const [newDepositAlert, setNewDepositAlert] = useState(null);

  const previousPendingIdsRef = useRef(new Set());
  const isFirstLoadRef = useRef(true);

  const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();

  // Play crisp Admin Alert sound when a user submits a deposit
  const playAdminAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      const playTone = (freq, start, duration) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
        gain.gain.setValueAtTime(0, audioCtx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + start);
        osc.stop(audioCtx.currentTime + start + duration);
      };

      // Crisp ringing bell alert (E5 -> G5 -> B5 -> E6)
      playTone(659.25, 0, 0.25);
      playTone(783.99, 0.12, 0.25);
      playTone(987.77, 0.24, 0.30);
      playTone(1318.51, 0.38, 0.60);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  };

  // Broadcast new balance to Trading Terminal across browser tabs
  const broadcastNewBalance = useCallback((newBal, targetEmail, targetUserId) => {
    try {
      const numBal = Number(newBal);
      const activeUserEmail = localStorage.getItem('userEmail');
      const activeUserId = localStorage.getItem('userId');

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

  // 1. Fetch All Deposits (with sound alert on new deposits)
  const fetchPayments = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/payments/all`);
      const data = await res.json();
      if (data.success && Array.isArray(data.payments)) {
        setPayments(data.payments);

        const initialAmounts = {};
        const currentPendingIds = new Set();
        let newPendingFound = null;

        data.payments.forEach((p) => {
          initialAmounts[p._id] = p.amountINR || (p.amountUSD ? (p.amountUSD * EXCHANGE_RATE).toFixed(0) : '');
          if (p.status === 'Pending') {
            currentPendingIds.add(p._id);
            if (!isFirstLoadRef.current && !previousPendingIdsRef.current.has(p._id)) {
              newPendingFound = p;
            }
          }
        });

        setCustomAmounts((prev) => ({ ...initialAmounts, ...prev }));

        // If new deposit arrived after initial load, play sound chime & show alert
        if (newPendingFound) {
          playAdminAlertSound();
          setNewDepositAlert({
            userEmail: newPendingFound.userEmail,
            amountINR: newPendingFound.amountINR,
            amountUSD: newPendingFound.amountUSD
          });

          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('🔔 New Deposit Alert!', {
                body: `User ${newPendingFound.userEmail} ne ₹${newPendingFound.amountINR || 2500} deposit kiya hai. OK karein!`,
                icon: '/favicon.ico'
              });
            } catch (e) {}
          }

          setTimeout(() => setNewDepositAlert(null), 8000);
        }

        previousPendingIdsRef.current = currentPendingIds;
        isFirstLoadRef.current = false;
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

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
    fetchPayments(false);
    fetchWithdrawals();
  }, [fetchPayments, fetchWithdrawals]);

  useEffect(() => {
    refreshAll();
    // Auto polling every 4 seconds to notify admin immediately when a deposit arrives
    const interval = setInterval(() => {
      fetchPayments(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [refreshAll, fetchPayments]);

  const handleAmountChange = (id, value) => {
    setCustomAmounts((prev) => ({ ...prev, [id]: value }));
  };

  // Deposit OK Submit (Converts INR at 96 rate + Calculates 10% Bonus -> Credits Live USD to user)
  const handleAmountSubmit = async (id, targetPayment) => {
    const enteredInr = customAmounts[id];
    if (!enteredInr || Number(enteredInr) <= 0) {
      alert('Kripya valid INR amount enter karein!');
      return;
    }

    const inrValue = Number(enteredInr);
    const baseUSD = Number((inrValue / EXCHANGE_RATE).toFixed(2));
    const bonusUSD = Number((baseUSD * 0.10).toFixed(2)); // 10% Bonus
    const totalUSDWithBonus = Number((baseUSD + bonusUSD).toFixed(2)); // Total with 10% bonus

    setSubmittingId(id);

    try {
      const res = await fetch(`${API_URL}/api/payments/amount/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amountINR: inrValue, 
          amountUSD: totalUSDWithBonus, 
          bonusUSD: bonusUSD,
          exchangeRate: EXCHANGE_RATE 
        }),
      });

      const data = await res.json();
      if (data.success) {
        setPayments((prev) =>
          prev.map((p) => (p._id === id ? { 
            ...p, 
            ...data.payment, 
            status: 'Approved',
            amountINR: inrValue,
            amountUSD: totalUSDWithBonus
          } : p))
        );

        const targetUserEmail = data.payment?.userEmail || targetPayment.userEmail;
        const targetUserId = data.payment?.userId || targetPayment.userId;
        const creditedLiveBalance = data.liveBalance !== undefined ? Number(data.liveBalance) : totalUSDWithBonus;

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

        alert(`✅ APPROVED & CREDITED!\n\nUser: ${targetUserEmail}\nDeposit Amount: ₹${inrValue} INR\nBase Converted: $${baseUSD} USD\n🎁 10% Bonus Added: +$${bonusUSD} USD\nTotal Credited to Live Balance: $${totalUSDWithBonus} USD\n\nUser ke terminal live balance me successfully $${creditedLiveBalance} USD add ho gaya hai!`);
      } else {
        alert(data.message || 'Failed to update amount');
      }
    } catch (err) {
      alert('Failed to update amount. Backend check karein.');
    } finally {
      setSubmittingId(null);
    }
  };

  // WhatsApp Alert Link generator for Admin
  const openWhatsAppAlert = (payment) => {
    const inr = payment.amountINR || 2500;
    const base = (inr / EXCHANGE_RATE).toFixed(2);
    const bonus = (base * 0.10).toFixed(2);
    const total = (Number(base) + Number(bonus)).toFixed(2);
    const text = encodeURIComponent(`🔔 *New Deposit Request - XM Trading*\n\nUser: ${payment.userEmail}\nAmount: ₹${inr} INR\nBase: $${base} USD\n🎁 10% Bonus: +$${bonus} USD\nTotal Credit: $${total} USD\nScreenshot: ${payment.imageUrl}`);
    window.open(`https://wa.me/${ADMIN_PHONE}?text=${text}`, '_blank');
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
      
      {/* REAL-TIME DEPOSIT ALERT TOAST */}
      {newDepositAlert && (
        <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-emerald-600 to-teal-600 border border-emerald-400 p-4 rounded-xl shadow-2xl text-white flex items-center space-x-3 animate-bounce">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold">🔔 Naya Deposit Request Aaya Hai!</h4>
            <p className="text-xs text-white/90">
              User: <span className="font-bold underline">{newDepositAlert.userEmail}</span> ne ₹{newDepositAlert.amountINR} INR deposit kiya hai.
            </p>
          </div>
        </div>
      )}

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
            <p className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-2">
              <span>Deposit request me automatic 10% bonus calculate hota hai (Rate: ₹{EXCHANGE_RATE}). OK karne par user ko full amount with bonus credit hota hai.</span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={refreshAll}
              className="flex items-center gap-2 bg-[#1b2537] hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer border border-gray-700 shadow"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh All
            </button>
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

        {/* TAB 1: DEPOSIT REQUESTS */}
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
                  const currentInr = customAmounts[payment._id] !== undefined ? customAmounts[payment._id] : (payment.amountINR || '');
                  const inrNum = Number(currentInr) || 0;
                  
                  // Base USD + 10% Bonus Calculation
                  const baseUsd = inrNum > 0 ? Number((inrNum / EXCHANGE_RATE).toFixed(2)) : 0;
                  const bonusUsd = Number((baseUsd * 0.10).toFixed(2));
                  const totalUsdWithBonus = Number((baseUsd + bonusUsd).toFixed(2));

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
                      <div className="text-xs bg-[#1c2638] p-2.5 rounded-lg border border-gray-700/60 flex justify-between items-center">
                        <div>
                          <span className="text-gray-400 block text-[10px] font-semibold uppercase tracking-wider">Uploaded By User:</span>
                          <span className="font-bold text-white break-all text-xs">{payment.userEmail || 'user@example.com'}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold shrink-0">
                          +10% Bonus
                        </span>
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
                              placeholder="e.g. 2500"
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

                        {/* Breakdown: Base USD + 10% Bonus */}
                        <div className="bg-[#182335] border border-gray-700/60 p-2.5 rounded-lg space-y-1 text-xs">
                          <div className="flex justify-between text-gray-400 text-[11px]">
                            <span>Base Amount:</span>
                            <span className="font-mono text-gray-200">${baseUsd.toFixed(2)} USD</span>
                          </div>
                          <div className="flex justify-between text-emerald-400 font-semibold text-[11px]">
                            <span className="flex items-center gap-1">
                              <Gift className="w-3 h-3" />
                              <span>10% Extra Bonus:</span>
                            </span>
                            <span className="font-mono">+${bonusUsd.toFixed(2)} USD</span>
                          </div>
                          <div className="border-t border-gray-700/80 pt-1 flex justify-between items-center text-xs font-bold text-white">
                            <span>Total Credit to User:</span>
                            <span className="flex items-center text-emerald-400 font-mono font-black text-sm">
                              <DollarSign className="w-3.5 h-3.5 stroke-[3]" />
                              {totalUsdWithBonus.toFixed(2)} USD
                            </span>
                          </div>
                        </div>

                        {/* WhatsApp Alert Button for Admin */}
                        <button
                          type="button"
                          onClick={() => openWhatsAppAlert(payment)}
                          className="w-full bg-[#182335] hover:bg-[#223147] border border-gray-700 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Send WhatsApp Alert (Admin Phone: {ADMIN_PHONE})</span>
                        </button>
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