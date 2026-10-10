import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Landmark, DollarSign, IndianRupee, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const EXCHANGE_RATE = 96;

export default function WithdrawalPage() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [amountUSD, setAmountUSD] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/live-balance`);
        const data = await res.json();
        if (data.success && data.user) {
          setBalance(Number(data.user.balance || 0));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchBalance();
  }, []);

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
      showToast(`Insufficient balance! Aapke paas sirf $${balance} USD hai.`, 'error');
      return;
    }

    if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
      showToast('Saari Bank details bharna zaroori hai!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('http://:5000/api/payments/withdrawal/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userEmail,
          accountHolderName,
          bankName,
          accountNumber,
          ifscCode,
          amountUSD: Number(amountUSD)
        })
      });

      const data = await res.json();

      if (data.success) {
        setBalance(data.liveBalance);
        localStorage.setItem('trading_live_balance', data.liveBalance.toString());

        // Instant broadcast to Trading Terminal
        try {
          const bc = new BroadcastChannel('trading_balance_sync');
          bc.postMessage({ balanceUSD: data.liveBalance });
          bc.close();
        } catch (e) {}

        showToast(`✅ Withdrawal request submitted! ₹${convertedINR} INR Admin ke paas transfer request me chala gaya.`, 'success');
        setAmountUSD('');
        setAccountHolderName('');
        setBankName('');
        setAccountNumber('');
        setIfscCode('');
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
      <header className="h-16 bg-[#121927] border-b border-gray-800 flex items-center justify-between px-4 sm:px-8 z-10">
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

      {/* Main Content */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center items-center">
        <div className="w-full bg-[#121927] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          <div className="flex items-center space-x-3 border-b border-gray-800 pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bank Transfer (INR)</h2>
              <p className="text-xs text-gray-400">Rate: $1.00 USD = ₹{EXCHANGE_RATE} INR</p>
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
                  placeholder="e.g. 50"
                  value={amountUSD}
                  onChange={(e) => setAmountUSD(e.target.value)}
                  className="w-full bg-[#1c2638] border border-gray-700 text-white rounded-lg pl-9 pr-3 py-2.5 text-xs outline-none focus:border-emerald-500"
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

            {/* Account Holder Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Account Holder Name:
              </label>
              <input 
                type="text"
                placeholder="e.g. Rehan Imam"
                value={accountHolderName}
                onChange={(e) => setAccountHolderName(e.target.value)}
                className="w-full bg-[#1c2638] border border-gray-700 text-white rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Bank Name:
              </label>
              <input 
                type="text"
                placeholder="e.g. State Bank of India / HDFC"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-[#1c2638] border border-gray-700 text-white rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Bank Account Number:
              </label>
              <input 
                type="text"
                placeholder="e.g. 123456789012"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-[#1c2638] border border-gray-700 text-white rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                IFSC Code:
              </label>
              <input 
                type="text"
                placeholder="e.g. SBIN0001234"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
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
              <span>{submitting ? 'Submitting...' : 'Request Withdrawal'}</span>
            </button>
          </form>

        </div>
      </main>
    </div>
  );
}