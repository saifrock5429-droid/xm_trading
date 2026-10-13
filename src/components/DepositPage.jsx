
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft, Upload, Image as ImageIcon, CheckCircle2, Loader2, IndianRupee, ArrowRight, DollarSign, AlertCircle } from 'lucide-react';
// import qrImage from '../assets/qr.png';

// const EXCHANGE_RATE = 96;
// const MINIMUM_DEPOSIT_INR = 2500;

// export default function DepositPage() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState('amount'); // 'amount' | 'payment' | 'success'
//   const [amountINR, setAmountINR] = useState('2500');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [screenshot, setScreenshot] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const playNotificationSound = () => {
//     try {
//       const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//       const osc = audioCtx.createOscillator();
//       const gain = audioCtx.createGain();
//       osc.type = 'sine';
//       osc.frequency.setValueAtTime(880, audioCtx.currentTime);
//       gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
//       osc.connect(gain);
//       gain.connect(audioCtx.destination);
//       osc.start();
//       osc.stop(audioCtx.currentTime + 0.5);
//     } catch (e) {
//       console.log('Audio notification error', e);
//     }
//   };

//   const handleFileChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setScreenshot(e.target.files[0]);
//     }
//   };

//   const handleProceedToPayment = (e) => {
//     e.preventDefault();
//     const val = Number(amountINR);
//     if (!amountINR || isNaN(val) || val < MINIMUM_DEPOSIT_INR) {
//       setErrorMessage(`Minimum deposit amount is ₹${MINIMUM_DEPOSIT_INR} INR. You cannot proceed with less.`);
//       return;
//     }
//     setErrorMessage('');
//     setStep('payment');
//   };

//   const handleDepositSubmit = async () => {
//     if (!screenshot) {
//       alert('Please upload the payment screenshot before submitting.');
//       return;
//     }

//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append('screenshot', screenshot);
//       formData.append('amountINR', amountINR);
//       formData.append('amountUSD', (Number(amountINR) / EXCHANGE_RATE).toFixed(2));
      
//       const userId = localStorage.getItem('userId');
//       const userEmail = localStorage.getItem('userEmail');
//       if (userId) formData.append('userId', userId);
//       if (userEmail) formData.append('email', userEmail);

//       const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();

//       const res = await fetch(`${API_URL}/api/payments/upload`, {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();

//       if (!data.success) {
//         throw new Error(data.message || 'Upload failed');
//       }

//       // 2 seconds loading delay simulation as requested
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       playNotificationSound();
//       setStep('success');
//     } catch (error) {
//       alert(error.message || 'Error submitting deposit screenshot');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const convertedUSD = (Number(amountINR || 0) / EXCHANGE_RATE).toFixed(2);

//   return (
//     <div className="min-h-screen bg-[#0d121d] text-gray-100 flex flex-col font-sans select-none">
//       <header className="h-16 bg-[#121927] border-b border-gray-800 flex items-center justify-between px-4 sm:px-8 z-10">
//         <div className="flex items-center space-x-4">
//           <button 
//             onClick={() => {
//               if (step === 'payment') setStep('amount');
//               else navigate('/terminal');
//             }}
//             className="flex items-center space-x-2 text-gray-400 hover:text-white bg-[#1b2537] px-3 py-1.5 rounded-lg border border-gray-700 text-xs font-semibold transition cursor-pointer"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>{step === 'payment' ? 'Back' : 'Back to Terminal'}</span>
//           </button>
//           <div className="h-5 w-px bg-gray-800 hidden sm:block"></div>
//           <span className="font-bold text-white text-base">
//             {step === 'amount' ? 'Enter Deposit Amount' : step === 'payment' ? 'Scan QR & Pay' : 'Deposit Submitted'}
//           </span>
//         </div>
//       </header>

//       <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center items-center">
//         <div className="w-full bg-[#121927] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          
//           {/* STEP 1: ENTER AMOUNT */}
//           {step === 'amount' && (
//             <form onSubmit={handleProceedToPayment} className="space-y-5">
//               <div className="text-center space-y-1">
//                 <h2 className="text-lg font-bold text-white">Enter Deposit Amount</h2>
//                 <p className="text-xs text-gray-400">Specify how much you want to deposit in INR (Minimum ₹{MINIMUM_DEPOSIT_INR}).</p>
//               </div>

//               <div className="space-y-2">
//                 <label className="text-xs font-semibold text-gray-300 block">Amount in INR (₹):</label>
//                 <div className="relative flex items-center">
//                   <IndianRupee className="w-4 h-4 absolute left-3 text-gray-400" />
//                   <input
//                     type="number"
//                     min={MINIMUM_DEPOSIT_INR}
//                     value={amountINR}
//                     onChange={(e) => {
//                       setAmountINR(e.target.value);
//                       if (Number(e.target.value) >= MINIMUM_DEPOSIT_INR) {
//                         setErrorMessage('');
//                       }
//                     }}
//                     placeholder={`e.g. ${MINIMUM_DEPOSIT_INR}`}
//                     className="w-full bg-[#182335] border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-sm text-white font-mono outline-none focus:border-emerald-500"
//                   />
//                 </div>
//                 {errorMessage && (
//                   <div className="flex items-center space-x-1.5 text-red-400 text-xs mt-1">
//                     <AlertCircle className="w-3.5 h-3.5 shrink-0" />
//                     <span>{errorMessage}</span>
//                   </div>
//                 )}
//                 <p className="text-[11px] text-gray-400">
//                   Minimum deposit required: <span className="text-emerald-400 font-bold">₹{MINIMUM_DEPOSIT_INR} INR</span>
//                 </p>
//               </div>

//               <div className="bg-[#182335]/60 border border-gray-800 rounded-xl p-3 flex justify-between items-center text-xs">
//                 <span className="text-gray-400">Exchange Rate:</span>
//                 <span className="font-bold text-gray-200">1 USD = ₹{EXCHANGE_RATE} INR</span>
//               </div>

//               <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex justify-between items-center text-xs font-bold text-emerald-400">
//                 <span>Terminal Credit (~USD):</span>
//                 <span className="flex items-center text-sm">
//                   <DollarSign className="w-4 h-4" />
//                   {convertedUSD} USD
//                 </span>
//               </div>

//               <button
//                 type="submit"
//                 disabled={Number(amountINR) < MINIMUM_DEPOSIT_INR}
//                 className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg cursor-pointer"
//               >
//                 <span>Next (Proceed to Pay)</span>
//                 <ArrowRight className="w-4 h-4" />
//               </button>
//             </form>
//           )}

//           {/* STEP 2: QR & SCREENSHOT UPLOAD */}
//           {step === 'payment' && (
//             <div className="space-y-6 text-center">
//               <div>
//                 <h2 className="text-lg font-bold text-white">Scan QR & Upload Screenshot</h2>
//                 <p className="text-xs text-emerald-400 font-semibold mt-1">Amount to Pay: ₹{amountINR} (~${convertedUSD} USD)</p>
//               </div>

//               <div className="bg-white p-4 rounded-xl inline-block shadow-md border border-gray-700">
//                 <img src={qrImage} alt="Payment QR Code" className="w-52 h-52 object-contain mx-auto rounded-md" />
//               </div>

//               <div className="space-y-3 text-left">
//                 <label className="block text-xs font-semibold text-gray-300">
//                   Upload Payment Screenshot:
//                 </label>
//                 <label className="flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-emerald-500 bg-[#182335] p-4 rounded-xl cursor-pointer transition">
//                   <ImageIcon className="w-5 h-5 text-emerald-400 mr-2 shrink-0" />
//                   <span className="text-xs text-gray-300 truncate">
//                     {screenshot ? screenshot.name : 'Choose Screenshot Image'}
//                   </span>
//                   <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
//                 </label>
//               </div>

//               <button 
//                 onClick={handleDepositSubmit}
//                 disabled={loading || !screenshot}
//                 className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     <span>Submitting Payment...</span>
//                   </>
//                 ) : (
//                   <>
//                     <Upload className="w-4 h-4" />
//                     <span>Submit Payment</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           )}

//           {/* STEP 3: SUCCESS */}
//           {step === 'success' && (
//             <div className="py-8 space-y-4 flex flex-col items-center justify-center text-center">
//               <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
//               <h2 className="text-xl font-bold text-white">Your Payment Submitted!</h2>
//               <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
//                 Your payment screenshot has been uploaded and sent to Admin for verification.
//               </p>
//               <button
//                 onClick={() => navigate('/terminal')}
//                 className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer"
//               >
//                 Back to Terminal
//               </button>
//             </div>
//           )}

//         </div>
//       </main>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Image as ImageIcon, CheckCircle2, Loader2, IndianRupee, ArrowRight, DollarSign, AlertCircle, Gift } from 'lucide-react';
import qrImage from '../assets/qr.png';

const EXCHANGE_RATE = 96;
const MINIMUM_DEPOSIT_INR = 2500;

export default function DepositPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('amount'); // 'amount' | 'payment' | 'success'
  const [amountINR, setAmountINR] = useState('2500');
  const [errorMessage, setErrorMessage] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio notification error', e);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    const val = Number(amountINR);
    if (!amountINR || isNaN(val) || val < MINIMUM_DEPOSIT_INR) {
      setErrorMessage(`Minimum deposit amount is ₹${MINIMUM_DEPOSIT_INR} INR. You cannot proceed with less.`);
      return;
    }
    setErrorMessage('');
    setStep('payment');
  };

  const handleDepositSubmit = async () => {
    if (!screenshot) {
      alert('Please upload the payment screenshot before submitting.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      formData.append('amountINR', amountINR);
      
      const baseUSD = Number(amountINR) / EXCHANGE_RATE;
      const totalUSDWithBonus = baseUSD * 1.10; // Adding 10% Bonus
      formData.append('amountUSD', totalUSDWithBonus.toFixed(2));
      
      const userId = localStorage.getItem('userId');
      const userEmail = localStorage.getItem('userEmail');
      if (userId) formData.append('userId', userId);
      if (userEmail) formData.append('email', userEmail);

      const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();

      const res = await fetch(`${API_URL}/api/payments/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      // 2 seconds loading delay simulation as requested
      await new Promise((resolve) => setTimeout(resolve, 2000));

      playNotificationSound();
      setStep('success');
    } catch (error) {
      alert(error.message || 'Error submitting deposit screenshot');
    } finally {
      setLoading(false);
    }
  };

  const baseUSD = Number(amountINR || 0) / EXCHANGE_RATE;
  const bonusUSD = baseUSD * 0.10; // 10% Bonus
  const totalConvertedUSD = (baseUSD + bonusUSD).toFixed(2);

  return (
    <div className="min-h-screen bg-[#0d121d] text-gray-100 flex flex-col font-sans select-none">
      <header className="h-16 bg-[#121927] border-b border-gray-800 flex items-center justify-between px-4 sm:px-8 z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => {
              if (step === 'payment') setStep('amount');
              else navigate('/terminal');
            }}
            className="flex items-center space-x-2 text-gray-400 hover:text-white bg-[#1b2537] px-3 py-1.5 rounded-lg border border-gray-700 text-xs font-semibold transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 'payment' ? 'Back' : 'Back to Terminal'}</span>
          </button>
          <div className="h-5 w-px bg-gray-800 hidden sm:block"></div>
          <span className="font-bold text-white text-base">
            {step === 'amount' ? 'Enter Deposit Amount' : step === 'payment' ? 'Scan QR & Pay' : 'Deposit Submitted'}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center items-center">
        <div className="w-full bg-[#121927] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          {/* STEP 1: ENTER AMOUNT */}
          {step === 'amount' && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-white">Enter Deposit Amount</h2>
                <p className="text-xs text-gray-400">Specify how much you want to deposit in INR (Minimum ₹{MINIMUM_DEPOSIT_INR}).</p>
              </div>

              {/* 10% Bonus Promotional Banner */}
              <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/15 border border-emerald-500/30 rounded-xl p-3.5 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Gift className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-400">Special Promotion: +10% Deposit Bonus! 🎉</h4>
                  <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
                    Get an instant 10% extra bonus credited to your terminal balance on every deposit you make!
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 block">Amount in INR (₹):</label>
                <div className="relative flex items-center">
                  <IndianRupee className="w-4 h-4 absolute left-3 text-gray-400" />
                  <input
                    type="number"
                    min={MINIMUM_DEPOSIT_INR}
                    value={amountINR}
                    onChange={(e) => {
                      setAmountINR(e.target.value);
                      if (Number(e.target.value) >= MINIMUM_DEPOSIT_INR) {
                        setErrorMessage('');
                      }
                    }}
                    placeholder={`e.g. ${MINIMUM_DEPOSIT_INR}`}
                    className="w-full bg-[#182335] border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-sm text-white font-mono outline-none focus:border-emerald-500"
                  />
                </div>
                {errorMessage && (
                  <div className="flex items-center space-x-1.5 text-red-400 text-xs mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <p className="text-[11px] text-gray-400">
                  Minimum deposit required: <span className="text-emerald-400 font-bold">₹{MINIMUM_DEPOSIT_INR} INR</span>
                </p>
              </div>

              <div className="bg-[#182335]/60 border border-gray-800 rounded-xl p-3 flex justify-between items-center text-xs">
                <span className="text-gray-400">Exchange Rate:</span>
                <span className="font-bold text-gray-200">1 USD = ₹{EXCHANGE_RATE} INR</span>
              </div>

              {/* Breakdown including 10% Bonus */}
              <div className="bg-[#131b2a] border border-gray-800 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between text-gray-300">
                  <span>Base Amount:</span>
                  <span className="font-mono">${baseUSD.toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center space-x-1">
                    <span>🎁 10% Extra Deposit Bonus:</span>
                  </span>
                  <span className="font-mono">+${bonusUSD.toFixed(2)} USD</span>
                </div>
                <div className="border-t border-gray-800 pt-2 flex justify-between items-center font-bold text-white text-sm">
                  <span>Total Terminal Credit:</span>
                  <span className="flex items-center text-emerald-400 font-mono text-base">
                    <DollarSign className="w-4 h-4" />
                    {totalConvertedUSD} USD
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={Number(amountINR) < MINIMUM_DEPOSIT_INR}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg cursor-pointer"
              >
                <span>Next (Proceed to Pay)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: QR & SCREENSHOT UPLOAD */}
          {step === 'payment' && (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-lg font-bold text-white">Scan QR & Upload Screenshot</h2>
                <p className="text-xs text-emerald-400 font-semibold mt-1">
                  Amount to Pay: ₹{amountINR} (You will receive <span className="underline">${totalConvertedUSD} USD</span> including 10% bonus!)
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl inline-block shadow-md border border-gray-700">
                <img src={qrImage} alt="Payment QR Code" className="w-52 h-52 object-contain mx-auto rounded-md" />
              </div>

              <div className="space-y-3 text-left">
                <label className="block text-xs font-semibold text-gray-300">
                  Upload Payment Screenshot:
                </label>
                <label className="flex items-center justify-center border-2 border-dashed border-gray-600 hover:border-emerald-500 bg-[#182335] p-4 rounded-xl cursor-pointer transition">
                  <ImageIcon className="w-5 h-5 text-emerald-400 mr-2 shrink-0" />
                  <span className="text-xs text-gray-300 truncate">
                    {screenshot ? screenshot.name : 'Choose Screenshot Image'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <button 
                onClick={handleDepositSubmit}
                disabled={loading || !screenshot}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Payment...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Submit Payment</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <div className="py-8 space-y-4 flex flex-col items-center justify-center text-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
              <h2 className="text-xl font-bold text-white">Your Payment Submitted!</h2>
              <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                Your payment screenshot has been uploaded. Once verified by admin, your deposit along with the <strong className="text-emerald-400">10% bonus (${bonusUSD.toFixed(2)})</strong> will be credited to your live balance!
              </p>
              <button
                onClick={() => navigate('/terminal')}
                className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                Back to Terminal
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}