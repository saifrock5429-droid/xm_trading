import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CreditCard, ShieldCheck, CheckCircle2, 
  HelpCircle, Gift, ArrowRight, Wallet,
} from 'lucide-react';

export default function DepositPage() {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('crypto');
  const [promoCode, setPromoCode] = useState('');
  const [bonusApplied, setBonusApplied] = useState(false);

  const paymentMethods = [
    { id: 'crypto', name: 'USDT / Crypto', icon: '⚡', desc: 'Instant deposit, Zero fee' },
    { id: 'upi', name: 'UPI / NetBanking', icon: '🇮🇳', desc: 'Fast local bank transfer' },
    { id: 'card', name: 'Visa / Mastercard', icon: '💳', desc: 'Standard card payment' },
    { id: 'wallet', name: 'E-Wallets', icon: '👛', desc: 'Skrill, Neteller, Perfect Money' },
  ];

  const presetAmounts = [20, 50, 100, 250, 500, 1000];

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  const bonusPercentage = bonusApplied ? 50 : 0;
  const bonusAmount = (finalAmount * bonusPercentage) / 100;
  const totalBalance = finalAmount + bonusAmount;

  return (
    <div className="min-h-screen bg-[#0d121d] text-gray-100 flex flex-col font-sans select-none">
      
      {/* Top Header */}
      <header className="h-16 bg-[#121927] border-b border-gray-800 flex items-center justify-between px-4 sm:px-8 z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/terminal')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white bg-[#1b2537] px-3 py-1.5 rounded-lg border border-gray-700 text-xs font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Terminal</span>
          </button>
          <div className="h-5 w-px bg-gray-800 hidden sm:block"></div>
          <span className="font-bold text-white text-base">Deposit Funds</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 hidden sm:inline">Need help?</span>
          <button className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center space-x-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <HelpCircle className="w-4 h-4" />
            <span>Support</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Columns: Payment Options & Amount */}
        <div className="lg:col-span-2 space-y-6">

          {/* Banner Promo */}
          <div className="bg-gradient-to-r from-emerald-900/40 via-[#182335] to-[#121927] border border-emerald-500/30 rounded-2xl p-4 sm:p-6 flex items-center justify-between shadow-xl">
            <div className="space-y-1">
              <span className="bg-emerald-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Special Offer</span>
              <h3 className="text-lg font-bold text-white">50% First Deposit Bonus</h3>
              <p className="text-xs text-gray-400">Get up to $500 extra bonus trading capital on your deposit.</p>
            </div>
            <button 
              onClick={() => setBonusApplied(!bonusApplied)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${bonusApplied ? 'bg-emerald-500 text-black' : 'bg-[#1b2537] text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'}`}
            >
              <Gift className="w-4 h-4" />
              <span>{bonusApplied ? 'Bonus Activated!' : 'Apply 50% Bonus'}</span>
            </button>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-[#121927] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>1. Select Payment Method</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center space-x-3 ${selectedMethod === method.id ? 'bg-[#1b2537] border-emerald-500 shadow-lg shadow-emerald-500/10' : 'bg-[#182335] border-gray-800 hover:border-gray-700'}`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{method.name}</div>
                    <div className="text-[10px] text-gray-400">{method.desc}</div>
                  </div>
                  {selectedMethod === method.id && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
              ))}
            </div>
          </div>

          {/* Deposit Amount Selection */}
          <div className="bg-[#121927] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>2. Select Deposit Amount</span>
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition border ${selectedAmount === amt && !customAmount ? 'bg-emerald-500 text-black border-emerald-500' : 'bg-[#182335] text-gray-300 border-gray-800 hover:border-gray-700'}`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            {/* Custom Amount Field */}
            <div className="pt-2">
              <label className="text-[11px] text-gray-400 block mb-1">Or enter custom amount ($)</label>
              <input 
                type="number"
                placeholder="Custom amount (Min $10)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full bg-[#182335] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

        </div>

        {/* Right 1 Column: Summary & Checkout Button */}
        <div className="space-y-6">
          <div className="bg-[#121927] border border-gray-800 rounded-2xl p-5 shadow-lg space-y-5 sticky top-6">
            <h2 className="text-sm font-bold text-white border-b border-gray-800 pb-3">
              Payment Summary
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Selected Method:</span>
                <span className="text-white font-semibold uppercase">{selectedMethod}</span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Deposit Amount:</span>
                <span className="text-white font-bold">${finalAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-emerald-400">
                <span>Bonus (+{bonusPercentage}%):</span>
                <span className="font-bold">+${bonusAmount.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-gray-800 flex justify-between items-center text-sm">
                <span className="font-bold text-white">Total Live Credit:</span>
                <span className="font-black text-emerald-400 text-lg">${totalBalance.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-2 border-t border-gray-800">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Promo Code" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-[#182335] border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button 
                  onClick={() => setBonusApplied(true)}
                  className="bg-[#1b2537] hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Proceed Button */}
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 active:scale-95">
              <span>Deposit ${finalAmount.toFixed(0)} Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-Bit SSL Encrypted & Secure Payment</span>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}