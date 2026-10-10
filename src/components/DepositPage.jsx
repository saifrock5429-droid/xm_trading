
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';
import qrImage from '../assets/qr.png';

export default function DepositPage() {
  const navigate = useNavigate();
  const [screenshot, setScreenshot] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const targetWhatsAppNumber = '919217150796';

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // Sound frequency (A5 tone)
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

  const handleDepositSubmit = async () => {
    if (!screenshot) {
      alert('Please upload the payment screenshot before submitting.');
      return;
    }

    setLoading(true);

    try {
      // 1. Send image to Backend (Cloudinary Upload)
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      const userId = localStorage.getItem('userId');
      if (userId) formData.append('userId', userId);

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      const imageUrl = data.payment.imageUrl;

      // 2. Play Notification Ring
      playNotificationSound();

      // 3. WhatsApp Redirect
      const message = encodeURIComponent(
        `Hello Admin,\n\nNew Payment Deposit Uploaded!\n\nScreenshot URL:\n${imageUrl}\n\nPlease check admin panel.`
      );
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetWhatsAppNumber}&text=${message}`;
      
      window.open(whatsappUrl, '_blank');
      setIsSubmitted(true);
    } catch (error) {
      alert(error.message || 'Error submitting deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d121d] text-gray-100 flex flex-col font-sans select-none">
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
          <span className="font-bold text-white text-base">Deposit Payment</span>
        </div>
      </header>

      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center items-center">
        <div className="w-full bg-[#121927] border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6 text-center">
          {isSubmitted ? (
            <div className="py-8 space-y-4 flex flex-col items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
              <h2 className="text-xl font-bold text-white">Your Payment Submitted!</h2>
              <p className="text-sm text-gray-400 max-w-xs">
                Your payment screenshot has been uploaded to Cloudinary & sent to Admin for verification.
              </p>
              <button
                onClick={() => navigate('/terminal')}
                className="mt-4 bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-6 py-2.5 rounded-xl text-xs transition"
              >
                Back to Terminal
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-bold text-white">Scan QR & Upload Screenshot</h2>
              <div className="bg-white p-4 rounded-xl inline-block shadow-md border border-gray-700">
                <img src={qrImage} alt="Payment QR Code" className="w-56 h-56 object-contain mx-auto rounded-md" />
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
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading to Cloudinary...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Submit Payment</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}