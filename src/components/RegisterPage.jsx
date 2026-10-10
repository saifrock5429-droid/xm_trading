// import React, { useState } from 'react';
// import { Eye, EyeOff, Headphones, ChevronDown } from 'lucide-react';

// const countryList = [
//   { code: 'IN', name: 'India', flag: '🇮🇳' },
//   { code: 'US', name: 'United States', flag: '🇺🇸' },
//   { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
//   { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
//   { code: 'AU', name: 'Australia', flag: '🇦🇺' },
//   { code: 'CA', name: 'Canada', flag: '🇨🇦' },
//   { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
//   { code: 'DE', name: 'Germany', flag: '🇩🇪' },
//   { code: 'FR', name: 'France', flag: '🇫🇷' },
//   { code: 'JP', name: 'Japan', flag: '🇯🇵' },
//   { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
//   { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
//   { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
//   { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
//   { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
//   { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
//   { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
//   { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
//   { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
//   { code: 'IT', name: 'Italy', flag: '🇮🇹' },
//   { code: 'ES', name: 'Spain', flag: '🇪🇸' },
// ];

// export default function RegisterPage({ onNavigate }) {
//   const [selectedCountry, setSelectedCountry] = useState(countryList[0]);
//   const [showCountryDropdown, setShowCountryDropdown] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [consent, setConsent] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmitted(true);
//   };

//   return (
//     <div className="min-h-screen bg-[#f3f6f9] flex flex-col justify-center items-center p-4">
//       <div className="w-full max-w-[440px] bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        
//         {/* Header */}
//         <div className="flex justify-between items-center mb-5">
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

//         {/* Promo Banner */}
//         <div className="bg-[#0b172a] text-white p-4 rounded-lg flex justify-between items-center mb-6">
//           <div>
//             <p className="text-xs font-semibold leading-tight">Trade with Ultra Low</p>
//             <p className="text-sm font-bold text-gray-100">spreads</p>
//           </div>
//           <div className="flex items-center space-x-1">
//             <div className="w-3 h-7 bg-slate-500 rounded-xs transform rotate-12"></div>
//             <div className="w-3 h-9 bg-blue-500 rounded-xs transform -rotate-6"></div>
//           </div>
//         </div>

//         {/* Title */}
//         <h1 className="text-xl font-bold text-gray-900 mb-1">Let’s get you registered!</h1>
//         <p className="text-xs text-gray-500 mb-5">
//           Already have an account?{' '}
//           <button 
//             type="button"
//             onClick={() => onNavigate('login')}
//             className="text-blue-600 font-semibold hover:underline"
//           >
//             Login
//           </button>
//         </p>

//         <form className="space-y-3.5" onSubmit={handleSubmit} autoComplete="off">
          
//           {/* Country Selector with Flag */}
//           <div className="relative">
//             <div 
//               onClick={() => setShowCountryDropdown(!showCountryDropdown)}
//               className="border border-gray-200 rounded-lg px-3.5 py-2.5 cursor-pointer flex justify-between items-center bg-white hover:border-gray-300"
//             >
//               <div className="flex items-center space-x-2.5">
//                 <span className="text-xl">{selectedCountry.flag}</span>
//                 <div>
//                   <div className="text-[10px] text-gray-400 font-medium leading-none">Country of residence</div>
//                   <div className="text-sm font-semibold text-gray-800 leading-tight mt-0.5">{selectedCountry.name}</div>
//                 </div>
//               </div>
//               <ChevronDown className="w-4 h-4 text-gray-500" />
//             </div>

//             {/* Country Dropdown */}
//             {showCountryDropdown && (
//               <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto z-20">
//                 {countryList.map((country) => (
//                   <div
//                     key={country.code}
//                     onClick={() => {
//                       setSelectedCountry(country);
//                       setShowCountryDropdown(false);
//                     }}
//                     className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm"
//                   >
//                     <span className="text-lg">{country.flag}</span>
//                     <span className="text-gray-700 font-medium">{country.name}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Email */}
//           <div>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               autoComplete="off"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className={`w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition ${
//                 submitted && !email ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-blue-600'
//               }`}
//             />
//             {submitted && !email && (
//               <p className="text-[11px] text-red-500 mt-1">The Email field is required</p>
//             )}
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Enter your password"
//               autoComplete="new-password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className={`w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition pr-10 ${
//                 submitted && !password ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-200 focus:border-blue-600'
//               }`}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
//             >
//               {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//             </button>
//             {submitted && !password && (
//               <p className="text-[11px] text-red-500 mt-1">The Password field is required</p>
//             )}
//           </div>

//           {/* Partner Referral Code */}
//           <p className="text-xs text-gray-600 pt-1">
//             Have a partner or referral code?{' '}
//             <button type="button" className="text-blue-600 font-semibold hover:underline">
//               Enter here
//             </button>
//           </p>

//           {/* Marketing Consent */}
//           <div className="flex items-start space-x-2.5 pt-1">
//             <input
//               type="checkbox"
//               id="consent"
//               checked={consent}
//               onChange={(e) => setConsent(e.target.checked)}
//               className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//             />
//             <label htmlFor="consent" className="text-[11px] text-gray-500 leading-tight cursor-pointer">
//               I consent to receiving marketing communications and to the use of my data for marketing optimization and ad personalization purposes. My consent may be withdrawn at any time.
//             </label>
//           </div>

//           {/* Register Button */}
//           <button
//             type="submit"
//             className={`w-full py-3 rounded-lg text-sm font-semibold transition mt-3 ${
//               email && password
//                 ? 'bg-blue-600 hover:bg-blue-700 text-white'
//                 : 'bg-[#eef2f6] text-gray-400 cursor-not-allowed'
//             }`}
//           >
//             Register
//           </button>
//         </form>

//       </div>
//     </div>
//   );
// }



import React, { useState } from 'react';
import { Eye, EyeOff, Headphones, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

const countryList = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
];

export default function RegisterPage({ onNavigate }) {
  const [selectedCountry, setSelectedCountry] = useState(countryList[0]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToastMsg = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!email || !password) {
      showToastMsg('Please enter email and password!', 'error');
      return;
    }

    if (!consent) {
      showToastMsg('Please click the consent checkbox to register!', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, country: selectedCountry.name })
      });

      const data = await res.json();

      if (data.success) {
        showToastMsg('✅ Registration successful! Please login.', 'success');
        localStorage.setItem('userEmail', email);
        if (data.user?._id) localStorage.setItem('userId', data.user._id);
        
        setTimeout(() => {
          if (onNavigate) onNavigate('login');
          else window.location.href = '/login';
        }, 1500);
      } else {
        showToastMsg(data.message || 'Registration failed!', 'error');
      }
    } catch (err) {
      console.error(err);
      showToastMsg('Backend server check karein (Port 5000)!', 'error');
    } finally {
      setLoading(false);
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
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
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

        {/* Promo Banner */}
        <div className="bg-[#0b172a] text-white p-4 rounded-lg flex justify-between items-center mb-6">
          <div>
            <p className="text-xs font-semibold leading-tight">Trade with Ultra Low</p>
            <p className="text-sm font-bold text-gray-100">spreads</p>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-7 bg-slate-500 rounded-xs transform rotate-12"></div>
            <div className="w-3 h-9 bg-blue-500 rounded-xs transform -rotate-6"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-1">Let’s get you registered!</h1>
        <p className="text-xs text-gray-500 mb-5">
          Already have an account?{' '}
          <button 
            type="button"
            onClick={() => onNavigate ? onNavigate('login') : (window.location.href = '/login')}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Login
          </button>
        </p>

        <form className="space-y-3.5" onSubmit={handleSubmit} autoComplete="off">
          
          {/* Country Selector */}
          <div className="relative">
            <div 
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="border border-gray-200 rounded-lg px-3.5 py-2.5 cursor-pointer flex justify-between items-center bg-white hover:border-gray-300"
            >
              <div className="flex items-center space-x-2.5">
                <span className="text-xl">{selectedCountry.flag}</span>
                <div>
                  <div className="text-[10px] text-gray-400 font-medium leading-none">Country of residence</div>
                  <div className="text-sm font-semibold text-gray-800 leading-tight mt-0.5">{selectedCountry.name}</div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>

            {showCountryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto z-20">
                {countryList.map((country) => (
                  <div
                    key={country.code}
                    onClick={() => {
                      setSelectedCountry(country);
                      setShowCountryDropdown(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-gray-700 font-medium">{country.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition ${
                submitted && !email ? 'border-red-500' : 'border-gray-200 focus:border-blue-600'
              }`}
            />
            {submitted && !email && (
              <p className="text-[11px] text-red-500 mt-1">The Email field is required</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3.5 py-3 rounded-lg border text-sm outline-none transition pr-10 ${
                submitted && !password ? 'border-red-500' : 'border-gray-200 focus:border-blue-600'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            {submitted && !password && (
              <p className="text-[11px] text-red-500 mt-1">The Password field is required</p>
            )}
          </div>

          {/* Marketing Consent */}
          <div className="flex items-start space-x-2.5 pt-1">
            <input
              type="checkbox"
              id="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="consent" className="text-[11px] text-gray-500 leading-tight cursor-pointer">
              I consent to receiving marketing communications and to the use of my data for account registration.
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-sm font-semibold transition mt-3 cursor-pointer ${
              email && password && consent
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                : 'bg-[#eef2f6] text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

      </div>
    </div>
  );
}