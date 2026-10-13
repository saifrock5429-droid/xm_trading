// import React, { useState } from 'react';
// import { Eye, EyeOff, Headphones, CheckCircle2, AlertCircle, X } from 'lucide-react';
// import navlogo from '../assets/navlogo.png';

// export default function LoginPage({ onNavigate }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState(null);

//   // Forgot Password Modal State
//   const [showForgotModal, setShowForgotModal] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [resetting, setResetting] = useState(false);

//   const showToastMsg = (msg, type = 'success') => {
//     setToast({ message: msg, type });
//     setTimeout(() => setToast(null), 3500);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitted(true);

//     if (!email || !password) {
//       showToastMsg('Please enter both email and password!', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();
//       const res = await fetch(`${API_URL}/api/users/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: email.trim().toLowerCase(), password })
//       });

//       const data = await res.json();

//       if (data.success && data.user) {
//         showToastMsg('✅ Login successful! Redirecting to Terminal...', 'success');
        
//         // Save user info & live balance accurately from MongoDB
//         const userBal = Number(data.user.balance || 0);
//         localStorage.setItem('userId', data.user._id);
//         localStorage.setItem('userEmail', data.user.email);
//         localStorage.setItem('trading_live_balance', userBal.toString());

//         if (data.user.avatarEmoji) {
//           localStorage.setItem('user_avatar_emoji', data.user.avatarEmoji);
//         }
//         if (data.user.isVerified) {
//           localStorage.setItem('user_is_verified', 'true');
//         }

//         // Broadcast balance to sync across tabs immediately
//         try {
//           const bc = new BroadcastChannel('trading_balance_sync');
//           bc.postMessage({ balanceUSD: userBal });
//           bc.close();
//         } catch (e) {}

//         window.dispatchEvent(new Event('storage'));

//         setTimeout(() => {
//           if (onNavigate) onNavigate('terminal');
//           else window.location.href = '/terminal';
//         }, 1000);
//       } else {
//         showToastMsg(data.message || 'Login failed', 'error');
//       }
//     } catch (err) {
//       console.error(err);
//       showToastMsg('Backend server check karein (Port 5000)!', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     if (!forgotEmail || !newPassword) {
//       alert('Email aur naya password dono enter karein!');
//       return;
//     }

//     setResetting(true);
//     try {
//       const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();
//       const res = await fetch(`${API_URL}/api/users/forgot-password`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: forgotEmail.trim().toLowerCase(), newPassword })
//       });

//       const data = await res.json();
//       if (data.success) {
//         alert('✅ Password reset successful! Ab login karein.');
//         setShowForgotModal(false);
//         setPassword('');
//       } else {
//         alert(data.message || 'Password reset failed');
//       }
//     } catch (err) {
//       alert('Server error resetting password');
//     } finally {
//       setResetting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f3f6f9] flex flex-col justify-center items-center p-4 relative font-sans">
      
//       {/* Toast Notification */}
//       {toast && (
//         <div className={`fixed top-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-2xl text-white font-bold text-xs ${
//           toast.type === 'success' ? 'bg-emerald-600 border border-emerald-400' : 'bg-red-600 border border-red-400'
//         }`}>
//           {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
//           <span>{toast.message}</span>
//         </div>
//       )}

//       <div className="w-full max-w-[440px] bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        
//         {/* Header inside Form Card */}
//         <div className="flex justify-between items-center mb-6">
//           <div 
//             onClick={() => onNavigate ? onNavigate('home') : (window.location.href = '/')}
//             className="cursor-pointer flex items-center"
//           >
//             <img 
//               src={navlogo} 
//               alt="Logo" 
//               className="h-12 w-auto object-contain max-w-[160px]" 
//             />
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
//           New to Trading?{' '}
//           <button 
//             type="button"
//             onClick={() => onNavigate ? onNavigate('register') : (window.location.href = '/register')}
//             className="text-blue-600 font-semibold hover:underline cursor-pointer"
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
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className={`w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition ${
//                 submitted && !email ? 'border-red-500' : 'border-gray-300 focus:border-blue-600'
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
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className={`w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition pr-10 ${
//                 submitted && !password ? 'border-red-500' : 'border-gray-300 focus:border-blue-600'
//               }`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 cursor-pointer"
//             >
//               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//             {submitted && !password && (
//               <p className="text-[11px] text-red-500 mt-1">The Password field is required</p>
//             )}
//           </div>

//           <div className="text-left">
//             <button 
//               type="button"
//               onClick={() => setShowForgotModal(true)} 
//               className="text-xs text-blue-600 font-medium hover:underline cursor-pointer"
//             >
//               Forgot your password?
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#1877f2] hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition mt-2 cursor-pointer shadow-md"
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//       </div>

//       {/* FORGOT PASSWORD MODAL */}
//       {showForgotModal && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
//             <button 
//               onClick={() => setShowForgotModal(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
//             >
//               <X className="w-5 h-5" />
//             </button>

//             <h3 className="text-lg font-bold text-gray-900">Reset Password</h3>
//             <p className="text-xs text-gray-500">Apna registered email aur naya password enter karein:</p>

//             <form onSubmit={handleForgotPassword} className="space-y-3">
//               <input 
//                 type="email"
//                 placeholder="Registered Email"
//                 value={forgotEmail}
//                 onChange={(e) => setForgotEmail(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:border-blue-500"
//                 required
//               />
//               <input 
//                 type="password"
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="w-full px-3 py-2 border rounded-lg text-xs outline-none focus:border-blue-500"
//                 required
//               />
//               <button 
//                 type="submit"
//                 disabled={resetting}
//                 className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition"
//               >
//                 {resetting ? 'Resetting...' : 'Save New Password'}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }



import React, { useState } from 'react';
import { Eye, EyeOff, Headphones, CheckCircle2, AlertCircle, X } from 'lucide-react';
import navlogo from '../assets/navlogo.png';

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
      const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });

      const data = await res.json();

      if (data.success && data.user) {
        showToastMsg('✅ Login successful! Redirecting to Terminal...', 'success');
        
        // Save user info & live balance accurately from MongoDB
        const userBal = Number(data.user.balance || 0);
        localStorage.setItem('userId', data.user._id);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('trading_live_balance', userBal.toString());

        if (data.user.avatarEmoji) {
          localStorage.setItem('user_avatar_emoji', data.user.avatarEmoji);
        }
        if (data.user.isVerified) {
          localStorage.setItem('user_is_verified', 'true');
        }

        // Broadcast balance to sync across tabs immediately
        try {
          const bc = new BroadcastChannel('trading_balance_sync');
          bc.postMessage({ balanceUSD: userBal });
          bc.close();
        } catch (e) {}

        window.dispatchEvent(new Event('storage'));

        setTimeout(() => {
          if (onNavigate) onNavigate('terminal');
          else window.location.href = '/terminal';
        }, 1000);
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
      const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();
      const res = await fetch(`${API_URL}/api/users/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim().toLowerCase(), newPassword })
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
            className="cursor-pointer flex items-center"
          >
            <img 
              src={navlogo} 
              alt="Logo" 
              className="h-12 w-auto object-contain max-w-[160px]" 
            />
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
          New to Trading?{' '}
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