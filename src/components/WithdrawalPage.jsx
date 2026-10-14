import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Landmark, 
  DollarSign, 
  IndianRupee, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  XCircle, 
  History, 
  RefreshCw, 
  Calendar, 
  ShieldCheck 
} from 'lucide-react';

const EXCHANGE_RATE = 96;

// Helper to get user-specific storage key for saving bank details
const getBankStorageKey = () => {
  try {
    const email = (localStorage.getItem('userEmail') || '').toLowerCase().trim();
    const userId = (localStorage.getItem('userId') || '').trim();
    const identifier = email || userId;
    return identifier ? `trading_saved_bank_${identifier}` : 'trading_saved_bank_guest';
  } catch (e) {
    return 'trading_saved_bank_guest';
  }
};

// Helper to get user-specific storage key for withdrawal history caching
const getWithdrawalHistoryKey = () => {
  try {
    const email = (localStorage.getItem('userEmail') || '').toLowerCase().trim();
    const userId = (localStorage.getItem('userId') || '').trim();
    const identifier = email || userId;
    return identifier ? `trading_withdrawal_history_${identifier}` : 'trading_withdrawal_history_guest';
  } catch (e) {
    return 'trading_withdrawal_history_guest';
  }
};

export default function WithdrawalPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('trading_live_balance');
    return saved && !isNaN(Number(saved)) ? Number(saved) : 0;
  });

  const [amountUSD, setAmountUSD] = useState('');

  // Auto-load previously saved bank details for the logged-in user
  const [accountHolderName, setAccountHolderName] = useState(() => {
    try {
      const saved = localStorage.getItem(getBankStorageKey());
      if (saved) return JSON.parse(saved).accountHolderName || '';
    } catch (e) {}
    return '';
  });

  const [bankName, setBankName] = useState(() => {
    try {
      const saved = localStorage.getItem(getBankStorageKey());
      if (saved) return JSON.parse(saved).bankName || '';
    } catch (e) {}
    return '';
  });

  const [accountNumber, setAccountNumber] = useState(() => {
    try {
      const saved = localStorage.getItem(getBankStorageKey());
      if (saved) return JSON.parse(saved).accountNumber || '';
    } catch (e) {}
    return '';
  });

  const [ifscCode, setIfscCode] = useState(() => {
    try {
      const saved = localStorage.getItem(getBankStorageKey());
      if (saved) return JSON.parse(saved).ifscCode || '';
    } catch (e) {}
    return '';
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // User's Withdrawal History State
  const [withdrawalHistory, setWithdrawalHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(getWithdrawalHistoryKey());
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [refreshing, setRefreshing] = useState(false);

  const userId = localStorage.getItem('userId');
  const userEmail = (localStorage.getItem('userEmail') || '').toLowerCase().trim() || 'user@example.com';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper to persist bank details automatically in localStorage
  const persistBankDetails = (holder, bank, acc, ifsc) => {
    try {
      const payload = {
        accountHolderName: holder !== undefined ? holder : accountHolderName,
        bankName: bank !== undefined ? bank : bankName,
        accountNumber: acc !== undefined ? acc : accountNumber,
        ifscCode: ifsc !== undefined ? ifsc : ifscCode
      };
      localStorage.setItem(getBankStorageKey(), JSON.stringify(payload));
    } catch (e) {}
  };

  // Fetch Live Balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();

        if (userId) {
          const profileRes = await fetch(`${API_URL}/api/users/profile/${userId}`);
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            if (profileData.success && profileData.user && profileData.user.balance !== undefined) {
              const bal = Number(profileData.user.balance || 0);
              setBalance(bal);
              localStorage.setItem('trading_live_balance', bal.toString());
              return;
            }
          }
        }

        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (userEmail) params.append('email', userEmail);
        const res = await fetch(`${API_URL}/api/payments/live-balance?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            const bal = Number(data.user.balance || 0);
            setBalance(bal);
            localStorage.setItem('trading_live_balance', bal.toString());
          }
        }
      } catch (err) {
        console.error('Error fetching withdrawal live balance:', err);
      }
    };
    fetchBalance();
  }, [userId, userEmail]);

  // Fetch Current User's Withdrawal History from Server
  const fetchWithdrawalHistory = useCallback(async () => {
    try {
      setRefreshing(true);
      const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (userEmail) params.append('email', userEmail);

      const res = await fetch(`${API_URL}/api/payments/withdrawal/all?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.withdrawals)) {
          // Strictly filter for current logged-in user
          const myWithdrawals = data.withdrawals.filter((w) => {
            if (userId && w.userId && String(w.userId) === String(userId)) return true;
            if (userEmail && w.userEmail && w.userEmail.toLowerCase() === userEmail.toLowerCase()) return true;
            return false;
          });

          setWithdrawalHistory(myWithdrawals);
          try {
            localStorage.setItem(getWithdrawalHistoryKey(), JSON.stringify(myWithdrawals));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error('Error fetching withdrawal history:', err);
    } finally {
      setRefreshing(false);
    }
  }, [userId, userEmail]);

  // Auto-poll history every 4 seconds so when Admin marks as Transferred, status updates to "Successful" live!
  useEffect(() => {
    fetchWithdrawalHistory();
    const interval = setInterval(fetchWithdrawalHistory, 4000);
    return () => clearInterval(interval);
  }, [fetchWithdrawalHistory]);

  const convertedINR = amountUSD && !isNaN(Number(amountUSD))
    ? (Number(amountUSD) * EXCHANGE_RATE).toFixed(2)
    : '0.00';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amountUSD || Number(amountUSD) <= 0) {
      showToast('Kripya valid withdrawal amount daalein!', 'error');
      return;
    }

    if (Number(amountUSD) > balance) {
      showToast(`Insufficient balance! Aapke paas sirf $${balance.toFixed(2)} USD hai.`, 'error');
      return;
    }

    if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
      showToast('Saari Bank details bharna zaroori hai!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Auto-save bank details so user never has to re-enter them again!
      persistBankDetails(accountHolderName, bankName, accountNumber, ifscCode);

      const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();
      const res = await fetch(`${API_URL}/api/payments/withdrawal/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userEmail,
          accountHolderName: accountHolderName.trim(),
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          ifscCode: ifscCode.trim().toUpperCase(),
          amountUSD: Number(amountUSD)
        })
      });

      const data = await res.json();

      if (data.success) {
        const newBal = Number(data.liveBalance !== undefined ? data.liveBalance : (balance - Number(amountUSD)).toFixed(2));
        setBalance(newBal);
        localStorage.setItem('trading_live_balance', newBal.toString());

        // Instant broadcast to Trading Terminal
        try {
          const bc = new BroadcastChannel('trading_balance_sync');
          bc.postMessage({ balanceUSD: newBal });
          bc.close();
        } catch (e) {}

        window.dispatchEvent(new Event('storage'));

        // Instant local update to Withdrawal History with 'Pending' (Processing)
        if (data.withdrawal) {
          setWithdrawalHistory((prev) => {
            const updated = [data.withdrawal, ...prev.filter(w => w._id !== data.withdrawal._id)];
            try {
              localStorage.setItem(getWithdrawalHistoryKey(), JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        } else {
          fetchWithdrawalHistory();
        }

        showToast(`✅ Withdrawal request submitted! ₹${convertedINR} `, 'success');
        
        // Reset ONLY amountUSD - preserve bank details for 1-click future withdrawals!
        setAmountUSD('');
      } else {
        showToast(data.message || 'Withdrawal failed!', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Backend server error during withdrawal!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d121d] text-gray-100 flex flex-col font-sans select-none">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-2xl text-white font-bold text-xs ${
          toast.type === 'success' ? 'bg-emerald-600 border border-emerald-400' : 'bg-red-600 border border-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="h-16 bg-[#121927] border-b border-gray-800 flex items-center justify-between px-4 sm:px-8 z-10 shrink-0">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/terminal')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white bg-[#1b2537] px-3 py-1.5 rounded-lg border border-gray-700 text-xs font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Terminal</span>
          </button>
          <div className="h-5 w-px bg-gray-800 hidden sm:block"></div>
          <span className="font-bold text-white text-base">Withdrawal to Bank Account</span>
        </div>

        {/* Live Balance Banner */}
        <div className="flex items-center space-x-2 bg-[#1b2537] border border-gray-700 px-3 py-1.5 rounded-lg text-xs">
          <span className="text-gray-400">Available:</span>
          <span className="text-emerald-400 font-extrabold flex items-center">
            <DollarSign className="w-3.5 h-3.5" />
            {balance.toFixed(2)} USD
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center justify-start space-y-6">
        
        {/* WITHDRAWAL FORM CARD */}
        <div className="w-full bg-[#121927] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5">
          
          <div className="flex items-center space-x-3 border-b border-gray-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bank Transfer (INR)</h2>
              <p className="text-xs text-gray-400">Exchange Rate: $1.00 USD = ₹{EXCHANGE_RATE} INR</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Amount USD */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Withdrawal Amount ($ USD):
              </label>
              <div className="relative flex items-center">
                <DollarSign className="w-4 h-4 absolute left-3 text-gray-400" />
                <input 
                  type="number"
                  min="1"
                  step="any"
                  placeholder="e.g. 50"
                  value={amountUSD}
                  onChange={(e) => setAmountUSD(e.target.value)}
                  className="w-full bg-[#1c2638] border border-gray-700 text-white rounded-lg pl-9 pr-3 py-2.5 text-xs outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>

              {Number(amountUSD) > 0 && (
                <div className="mt-2 p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex justify-between items-center text-xs font-bold text-emerald-400">
                  <span>Equivalent INR in Bank:</span>
                  <span className="flex items-center text-sm font-black">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {convertedINR} INR
                  </span>
                </div>
              )}
            </div>

            {/* Bank Details Header with Auto-Saved Badge */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-800">
              <span className="text-xs font-bold text-gray-300">Bank Account Details</span>
              {(accountHolderName || accountNumber) && (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Auto-Saved for Quick Payout
                </span>
              )}
            </div>

            {/* Account Holder Name */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                Account Holder Name:
              </label>
              <input 
                type="text"
                placeholder="Enter Your Name As Per Bank Records"
                value={accountHolderName}
                onChange={(e) => {
                  setAccountHolderName(e.target.value);
                  persistBankDetails(e.target.value, bankName, accountNumber, ifscCode);
                }}
                className="w-full bg-[#1c2638] border border-gray-700 text-white rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                Bank Name:
              </label>
              <input 
                type="text"
                placeholder="e.g. State Bank of India / HDFC"
                value={bankName}
                onChange={(e) => {
                  setBankName(e.target.value);
                  persistBankDetails(accountHolderName, e.target.value, accountNumber, ifscCode);
                }}
                className="w-full bg-[#1c2638] border border-gray-700 text-white rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                Bank Account Number:
              </label>
              <input 
                type="text"
                placeholder="e.g. 123456789012"
                value={accountNumber}
                onChange={(e) => {
                  setAccountNumber(e.target.value);
                  persistBankDetails(accountHolderName, bankName, e.target.value, ifscCode);
                }}
                className="w-full bg-[#1c2638] border border-gray-700 text-white rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 font-mono"
                required
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                IFSC Code:
              </label>
              <input 
                type="text"
                placeholder="e.g. SBIN0001234"
                value={ifscCode}
                onChange={(e) => {
                  const upper = e.target.value.toUpperCase();
                  setIfscCode(upper);
                  persistBankDetails(accountHolderName, bankName, accountNumber, upper);
                }}
                className="w-full bg-[#1c2638] border border-gray-700 text-white rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 uppercase font-mono"
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50 mt-4"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Request...' : 'Request Withdrawal'}</span>
            </button>
          </form>

        </div>

        {/* WITHDRAWAL HISTORY SECTION (Below Form) */}
        <div className="w-full bg-[#121927] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          
          <div className="flex justify-between items-center border-b border-gray-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <History className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Withdrawal History</span>
                  <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full font-mono">
                    {withdrawalHistory.length}
                  </span>
                </h3>
                <p className="text-[11px] text-gray-400">Past & active payout transactions</p>
              </div>
            </div>

            <button
              onClick={fetchWithdrawalHistory}
              className="p-1.5 text-gray-400 hover:text-white bg-[#1c2638] hover:bg-[#253247] rounded-lg border border-gray-700 transition cursor-pointer"
              title="Refresh status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>

          {withdrawalHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              <History className="w-8 h-8 mx-auto mb-2 text-gray-600 opacity-60" />
              <span>Aapne abhi tak koi withdrawal request nahi ki hai.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawalHistory.map((w) => {
                const isTransferred = ['Transferred', 'Approved', 'Completed', 'Successful'].includes(w.status);
                const isPending = w.status === 'Pending' || !w.status;
                const isRejected = w.status === 'Rejected';

                const formattedDate = w.createdAt 
                  ? new Date(w.createdAt).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })
                  : 'Just now';

                return (
                  <div 
                    key={w._id || `${w.amountUSD}-${w.createdAt}`}
                    className="bg-[#182335] border border-gray-800 hover:border-gray-700 rounded-xl p-4 space-y-2.5 transition"
                  >
                    {/* Amount & Status Badge */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-base font-extrabold text-white font-mono">
                            ${w.amountUSD} USD
                          </span>
                          <span className="text-xs font-bold text-emerald-400 font-mono">
                            (₹{w.amountINR || (Number(w.amountUSD) * EXCHANGE_RATE).toFixed(2)} INR)
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400 text-[11px] mt-0.5">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div>
                        {isTransferred && (
                          <span className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Successful</span>
                          </span>
                        )}

                        {isPending && (
                          <span className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">
                            <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                            <span>Processing</span>
                          </span>
                        )}

                        {isRejected && (
                          <span className="inline-flex items-center space-x-1.5 bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-extrabold shadow-sm">
                            <XCircle className="w-3.5 h-3.5 text-red-400" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bank Info Summary */}
                    <div className="bg-[#111827] rounded-lg p-2.5 border border-gray-800/80 text-[11px] text-gray-300 grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-500">Bank:</span>{' '}
                        <span className="font-semibold text-white">{w.bankName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">A/C:</span>{' '}
                        <span className="font-mono text-emerald-300">
                          ••••{String(w.accountNumber || '').slice(-4) || w.accountNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Holder:</span>{' '}
                        <span className="text-white">{w.accountHolderName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">IFSC:</span>{' '}
                        <span className="font-mono text-white">{w.ifscCode}</span>
                      </div>
                    </div>

                    {/* Status Description Footer */}
                    <div className="pt-1 text-[11px]">
                      {isTransferred && (
                        <p className="text-emerald-400 font-semibold flex items-center gap-1">
                          ✅ Amount successfully transferred to your bank account!
                        </p>
                      )}
                      {isPending && (
                        <p className="text-amber-400/90 font-medium flex items-center gap-1">
                          ⏳ Admin is processing your transfer. Amount will be credited to your bank shortly.
                        </p>
                      )}
                      {isRejected && (
                        <p className="text-red-400 font-medium flex items-center gap-1">
                          ❌ Withdrawal request was rejected by admin.
                        </p>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </main>
    </div>
  );
}