// import React, { useState } from 'react';
// import { Eye, EyeOff, Headphones } from 'lucide-react';

// export default function LoginPage({ onNavigate }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmitted(true);
//   };

//   return (
//     <div className="min-h-screen bg-[#f3f6f9] flex flex-col justify-center items-center p-4">
//       <div className="w-full max-w-[440px] bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        
//         {/* Header inside Form Card */}
//         <div className="flex justify-between items-center mb-6">
//           <div 
//             onClick={() => onNavigate('home')}
//             className="bg-red-600 text-white font-black text-xl px-2 py-0.5 rounded tracking-tighter cursor-pointer"
//           >
//             XM
//           </div>
//           <div className="flex items-center space-x-3 text-gray-700">
//             <button type="button" className="hover:opacity-80">
//               <Headphones className="w-5 h-5 text-gray-700" />
//             </button>
//             <span className="text-xl">🇬🇧</span>
//           </div>
//         </div>

//         {/* Title & Subtitle */}
//         <h1 className="text-2xl font-bold text-gray-900 mb-1">Login</h1>
//         <p className="text-xs text-gray-500 mb-6">
//           New to XM?{' '}
//           <button 
//             type="button"
//             onClick={() => onNavigate('register')}
//             className="text-blue-600 font-semibold hover:underline"
//           >
//             Open an account
//           </button>
//         </p>

//         {/* Login Form */}
//         <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
//           <div>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               autoComplete="off"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className={`w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition ${
//                 submitted && !email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-blue-600'
//               }`}
//             />
//             {submitted && !email && (
//               <p className="text-[11px] text-red-500 mt-1">The Email field is required</p>
//             )}
//           </div>

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter your password"
//               autoComplete="new-password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className={`w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition pr-10 ${
//                 submitted && !password ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:border-blue-600'
//               }`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
//             >
//               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//             {submitted && !password && (
//               <p className="text-[11px] text-red-500 mt-1">The Password field is required</p>
//             )}
//           </div>

//           <div className="text-left">
//             <a href="#forgot" className="text-xs text-blue-600 font-medium hover:underline">
//               Forgot your password?
//             </a>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-[#1877f2] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition mt-2"
//           >
//             Login
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="relative my-6 text-center">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-200"></div>
//           </div>
//           <span className="relative bg-white px-3 text-xs text-gray-400">or login with</span>
//         </div>

//         {/* Google Login Button */}
//         <button type="button" className="w-full flex items-center justify-center space-x-2 border border-gray-200 bg-[#ebf0f5] hover:bg-gray-200 py-3 rounded-lg text-xs font-semibold text-gray-700 transition">
//           <svg className="w-4 h-4" viewBox="0 0 24 24">
//             <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
//             <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
//             <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
//             <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
//           </svg>
//           <span>Google</span>
//         </button>

//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { Eye, EyeOff, Headphones, CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function LoginPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  const showToastMsg = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!email || !password) {
      showToastMsg('Please enter both email and password!', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        showToastMsg('✅ Login successful! Redirecting to Terminal...', 'success');
        
        // Save user info to localStorage
        localStorage.setItem('userId', data.user._id);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('trading_live_balance', Number(data.user.balance || 0).toString());

        setTimeout(() => {
          if (onNavigate) onNavigate('terminal');
          else window.location.href = '/terminal';
        }, 1200);
      } else {
        showToastMsg(data.message || 'Login failed', 'error');
      }
    } catch (err) {
      console.error(err);
      showToastMsg('Backend server check karein (Port 5000)!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !newPassword) {
      alert('Email aur naya password dono enter karein!');
      return;
    }

    setResetting(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, newPassword })
      });

      const data = await res.json();
      if (data.success) {
        alert('✅ Password reset successful! Ab login karein.');
        setShowForgotModal(false);
        setPassword('');
      } else {
        alert(data.message || 'Password reset failed');
      }
    } catch (err) {
      alert('Server error resetting password');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f9] flex flex-col justify-center items-center p-4 relative font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-2xl text-white font-bold text-xs ${
          toast.type === 'success' ? 'bg-emerald-600 border border-emerald-400' : 'bg-red-600 border border-red-400'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="w-full max-w-[440px] bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        
        {/* Header inside Form Card */}
        <div className="flex justify-between items-center mb-6">
          <div 
            onClick={() => onNavigate ? onNavigate('home') : (window.location.href = '/')}
            className="bg-red-600 text-white font-black text-xl px-2 py-0.5 rounded tracking-tighter cursor-pointer"
          >
            XM
          </div>
          <div className="flex items-center space-x-3 text-gray-700">
            <button type="button" className="hover:opacity-80">
              <Headphones className="w-5 h-5 text-gray-700" />
            </button>
            <span className="text-xl">🇬🇧</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Login</h1>
        <p className="text-xs text-gray-500 mb-6">
          New to XM?{' '}
          <button 
            type="button"
            onClick={() => onNavigate ? onNavigate('register') : (window.location.href = '/register')}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Open an account
          </button>
        </p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition ${
                submitted && !email ? 'border-red-500' : 'border-gray-300 focus:border-blue-600'
              }`}
            />
            {submitted && !email && (
              <p className="text-[11px] text-red-500 mt-1">The Email field is required</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition pr-10 ${
                submitted && !password ? 'border-red-500' : 'border-gray-300 focus:border-blue-600'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {submitted && !password && (
              <p className="text-[11px] text-red-500 mt-1">The Password field is required</p>
            )}
          </div>

          <div className="text-left">
            <button 
              type="button"
              onClick={() => setShowForgotModal(true)} 
              className="text-xs text-blue-600 font-medium hover:underline cursor-pointer"
            >
              Forgot your password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1877f2] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition mt-2 cursor-pointer shadow-md"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900">Reset Password</h3>
            <p className="text-xs text-gray-500">Apna registered email aur naya password enter karein:</p>

            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input 
                type="email"
                placeholder="Registered Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:border-blue-500"
                required
              />
              <input 
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:border-blue-500"
                required
              />
              <button 
                type="submit"
                disabled={resetting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition"
              >
                {resetting ? 'Resetting...' : 'Save New Password'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}