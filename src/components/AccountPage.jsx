import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  HelpCircle, 
  User, 
  Trophy, 
  ShoppingBag, 
  MoreHorizontal, 
  Camera, 
  CheckCircle2, 
  AlertCircle, 
  Edit2, 
  Lock, 
  Globe, 
  Clock, 
  X,
  Maximize2, 
  Volume2, 
  Settings
} from 'lucide-react';

export default function AccountPage() {
  const navigate = useNavigate();

  // User details state
  const [formData, setFormData] = useState({
    nickname: '#93724428',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    aadhaar: '',
    email: 'kamilamin909@gmail.com',
    country: 'India',
    address: '',
    language: 'English',
    timezone: '(UTC+00:00)'
  });

  // Security toggles
  const [twoFactorPlatform, setTwoFactorPlatform] = useState(true);
  const [twoFactorWithdraw, setTwoFactorWithdraw] = useState(true);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    alert('Aapka account safaltapoorvak delete ho gaya hai.');
    navigate('/register');
  };

  return (
    <div className="flex h-screen w-full bg-[#171d29] text-gray-200 overflow-hidden font-sans select-none">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-16 bg-[#121722] border-r border-gray-800 flex flex-col items-center justify-between py-2 z-10">
        <div className="flex flex-col items-center space-y-4 w-full">
          <button className="text-gray-400 hover:text-white p-2">
            <div className="w-5 h-0.5 bg-gray-400 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-400 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-400"></div>
          </button>

          <button 
            onClick={() => navigate('/terminal')}
            className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-white"
          >
            <BarChart2 className="w-5 h-5" />
            <span className="text-[9px] font-semibold mt-1">TRADE</span>
          </button>

          <button className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-white">
            <HelpCircle className="w-5 h-5" />
            <span className="text-[9px] font-semibold mt-1">SUPPORT</span>
          </button>

          {/* Active Account Tab */}
          <button className="flex flex-col items-center justify-center w-full py-2 text-blue-500 bg-[#1e2738] border-l-2 border-blue-500">
            <User className="w-5 h-5" />
            <span className="text-[9px] font-semibold mt-1">ACCOUNT</span>
          </button>

          <button 
            onClick={() => navigate('/tournment/active')}
            className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-white relative"
          >
            <Trophy className="w-5 h-5" />
            <span className="absolute top-1 right-2 bg-blue-500 text-white text-[9px] rounded-full px-1 font-bold">3</span>
            <span className="text-[9px] font-semibold mt-1 text-center leading-tight">TOURNAMENTS</span>
          </button>

          <button className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-white relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-2 bg-blue-500 text-white text-[9px] rounded-full px-1 font-bold">4</span>
            <span className="text-[9px] font-semibold mt-1">MARKET</span>
          </button>

          <button className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-white">
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[9px] font-semibold mt-1">MORE</span>
          </button>
        </div>

        <div className="flex flex-col items-center space-y-3 w-full pb-2">
          <button className="text-gray-500 hover:text-white"><Maximize2 className="w-4 h-4" /></button>
          <button className="text-gray-500 hover:text-white"><Volume2 className="w-4 h-4" /></button>
          <button className="text-gray-500 hover:text-white"><Settings className="w-4 h-4" /></button>
          
          <button className="bg-blue-600 text-white text-[10px] font-bold py-1 px-2 rounded w-12 text-center mt-2">
            JOIN US
          </button>
          <button className="bg-emerald-500 text-black text-[10px] font-bold py-1 px-2 rounded w-12 text-center flex items-center justify-center">
            Help
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        
        {/* TOP HEADER */}
        <header className="h-14 bg-[#121722] border-b border-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center space-x-1 bg-[#1c2434] p-1 rounded-lg">
            <button className="px-4 py-1.5 text-xs font-semibold text-gray-300 hover:text-white">Withdrawal</button>
            <button className="px-4 py-1.5 text-xs font-semibold text-gray-300 hover:text-white">Payments</button>
            <button className="px-4 py-1.5 text-xs font-semibold text-gray-300 hover:text-white">Trades</button>
            <button className="px-4 py-1.5 text-xs font-semibold text-white bg-[#28344d] rounded shadow">My account</button>
            <button className="px-4 py-1.5 text-xs font-semibold text-gray-300 hover:text-white">Market</button>
            <button className="px-4 py-1.5 text-xs font-semibold text-gray-300 hover:text-white">Tournaments</button>
            <button className="px-4 py-1.5 text-xs font-semibold text-gray-300 hover:text-white">Analytics</button>
          </div>

          <div className="flex items-center space-x-8 text-xs">
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-gray-400">My current currency</span>
              <div className="flex items-center space-x-1 font-bold text-white">
                <span>$ USD</span>
                <span className="bg-blue-600 text-[9px] px-1 rounded cursor-pointer">CHANGE</span>
              </div>
            </div>

            <div className="flex flex-col text-right">
              <span className="text-[10px] text-gray-400">Available for withdrawal</span>
              <span className="font-bold text-white text-sm">0.00$</span>
            </div>

            <div className="flex flex-col text-right">
              <span className="text-[10px] text-gray-400">In the account</span>
              <span className="font-bold text-white text-sm">0.00$</span>
            </div>
          </div>
        </header>

        {/* ACCOUNT CONTENT GRID */}
        <main className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* COLUMN 1: PERSONAL DATA */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white tracking-wide">Personal data:</h2>

            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white">
                  <User className="w-8 h-8" />
                </div>
                <button className="absolute top-0 right-0 p-1 bg-gray-800/80 rounded-full text-gray-300 hover:text-white">
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div>
                <div className="text-xs font-bold text-white">{formData.email}</div>
                <div className="text-[11px] text-gray-400">ID: 93724428</div>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 mt-1">
                  <X className="w-3 h-3 mr-0.5" /> Not verified
                </span>
              </div>
            </div>

            {/* Inputs Form */}
            <div className="space-y-3">
              <div className="relative border border-gray-700/80 rounded bg-[#121722]/60 px-3 py-1.5 focus-within:border-blue-500">
                <label className="text-[10px] text-gray-400 block -mb-0.5">Nickname</label>
                <input 
                  type="text" 
                  name="nickname"
                  value={formData.nickname} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white outline-none w-full font-medium"
                />
              </div>

              <div className="relative border border-gray-700/80 rounded bg-[#121722]/60 px-3 py-1.5 focus-within:border-blue-500">
                <label className="text-[10px] text-gray-400 block -mb-0.5">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  placeholder="Empty"
                  value={formData.firstName} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
                />
              </div>

              <div className="relative border border-gray-700/80 rounded bg-[#121722]/60 px-3 py-1.5 focus-within:border-blue-500">
                <label className="text-[10px] text-gray-400 block -mb-0.5">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  placeholder="Empty"
                  value={formData.lastName} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
                />
              </div>

              <div className="relative border border-gray-700/80 rounded bg-[#121722]/60 px-3 py-1.5 focus-within:border-blue-500">
                <label className="text-[10px] text-gray-400 block -mb-0.5">Date of birth</label>
                <input 
                  type="text" 
                  name="dateOfBirth"
                  placeholder="dd-mm-yyyy"
                  value={formData.dateOfBirth} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
                />
              </div>

              <div className="relative border border-gray-700/80 rounded bg-[#121722]/60 px-3 py-1.5 focus-within:border-blue-500">
                <label className="text-[10px] text-gray-400 block -mb-0.5">Aadhaar</label>
                <input 
                  type="text" 
                  name="aadhaar"
                  placeholder="Empty"
                  value={formData.aadhaar} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
                />
              </div>

              {/* Address Field */}
              <div className="relative border border-gray-700/80 rounded bg-[#121722]/60 px-3 py-1.5 focus-within:border-blue-500">
                <label className="text-[10px] text-gray-400 block -mb-0.5">Address</label>
                <input 
                  type="text" 
                  name="address"
                  placeholder="Enter your address"
                  value={formData.address} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
                />
              </div>

              <div className="relative border border-gray-700/80 rounded bg-[#121722]/60 px-3 py-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-gray-400">Email</label>
                  <span className="text-[9px] text-emerald-400">Verified</span>
                </div>
                <input 
                  type="text" 
                  readOnly 
                  value={formData.email} 
                  className="bg-transparent text-xs text-gray-300 outline-none w-full cursor-not-allowed"
                />
              </div>

              <div className="relative border border-gray-700/80 rounded bg-[#121722]/60 px-3 py-1.5">
                <label className="text-[10px] text-gray-400 block -mb-0.5">Country</label>
                <select 
                  name="country"
                  value={formData.country} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white outline-none w-full cursor-pointer"
                >
                  <option value="India" className="bg-[#121722]">India</option>
                  <option value="USA" className="bg-[#121722]">USA</option>
                  <option value="UK" className="bg-[#121722]">UK</option>
                </select>
              </div>
            </div>
          </div>

          {/* COLUMN 2: DOCUMENTS VERIFICATION */}
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide mb-4">Documents verification:</h2>
            <div className="border border-red-500/30 bg-red-500/5 rounded-md p-4 flex items-start space-x-3">
              <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                You need fill identity information before verification your account.
              </p>
            </div>
          </div>

          {/* COLUMN 3: SECURITY */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-white tracking-wide">Security:</h2>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Two-step verification</div>
                  <div className="text-[11px] text-gray-400 flex items-center">
                    Receiving codes via Email <Edit2 className="w-3 h-3 ml-1 text-blue-400 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <button 
                  onClick={() => setTwoFactorPlatform(!twoFactorPlatform)}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition ${twoFactorPlatform ? 'bg-blue-600 justify-end' : 'bg-gray-700 justify-start'}`}
                >
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </button>
                <span className="text-xs font-semibold text-white">To enter the platform</span>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setTwoFactorWithdraw(!twoFactorWithdraw)}
                  className={`w-9 h-5 flex items-center rounded-full p-0.5 transition ${twoFactorWithdraw ? 'bg-blue-600 justify-end' : 'bg-gray-700 justify-start'}`}
                >
                  <div className="w-4 h-4 rounded-full bg-white"></div>
                </button>
                <span className="text-xs font-semibold text-white">To withdraw funds</span>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-5 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-white">
                <Lock className="w-4 h-4 text-gray-400" />
                <span>Password</span>
              </div>
              <p className="text-[11px] text-gray-400">Change your account password</p>
              <button className="text-xs text-blue-400 hover:underline font-semibold block">Change</button>
            </div>
          </div>

          {/* COLUMN 4: LANGUAGE, TIMEZONE & DELETE */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="relative border border-gray-700/80 rounded bg-[#121722]/60 px-3 py-2">
                <label className="text-[10px] text-gray-400 block -mb-0.5">Language</label>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <select 
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="bg-transparent text-xs text-white outline-none w-full cursor-pointer"
                  >
                    <option value="English" className="bg-[#121722]">English</option>
                    <option value="Hindi" className="bg-[#121722]">Hindi</option>
                  </select>
                </div>
              </div>

              <div className="relative border border-gray-700/80 rounded bg-[#121722]/60 px-3 py-2">
                <label className="text-[10px] text-gray-400 block -mb-0.5">Timezone</label>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <select 
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                    className="bg-transparent text-xs text-white outline-none w-full cursor-pointer"
                  >
                    <option value="(UTC+00:00)" className="bg-[#121722]">(UTC+00:00)</option>
                    <option value="(UTC+05:30)" className="bg-[#121722]">(UTC+05:30) IST</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center text-xs font-semibold text-red-500 hover:text-red-400 transition"
              >
                <X className="w-4 h-4 mr-1 stroke-[3]" /> Delete My account
              </button>
            </div>
          </div>

        </main>
      </div>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1c2434] border border-gray-700 rounded-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-base font-bold text-white">Delete Account?</h3>
            <p className="text-xs text-gray-300">
              Kya aap sure hain ki aap apna account permanent delete karna chahte hain? Ye process rollback nahi ho sakti.
            </p>
            <div className="flex space-x-3 justify-end pt-2">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs font-bold text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}