import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Camera, 
  X, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  LogOut, 
  DollarSign 
} from 'lucide-react';

export default function AccountPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickname: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    aadhaar: '',
    email: '',
    country: 'India',
    address: '',
    balance: 0,
    avatarEmoji: localStorage.getItem('user_avatar_emoji') || '👨‍💻'
  });

  const [isVerified, setIsVerified] = useState(() => {
    return localStorage.getItem('user_is_verified') === 'true';
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');

  // Available avatars/emojis
  const avatarOptions = ['👨‍💻', '👩‍💻', '👨‍💼', '👩‍💼', '🧑‍🚀', '👨‍🎓', '👩‍🎓', '🧑‍🎤', '👦', '👧'];

  // 1. Fetch initial profile data (Redirect to login if not authenticated)
  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();
        const response = await fetch(`${API_URL}/api/users/profile/${userId}`);
        const data = await response.json();

        if (data.success && data.user) {
          const userBal = Number(data.user.balance || 0);
          setFormData(prev => ({
            ...prev,
            nickname: data.user.nickname || '',
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            dateOfBirth: data.user.dateOfBirth || '',
            aadhaar: data.user.aadhaar || '',
            email: data.user.email || userEmail || '',
            country: data.user.country || 'India',
            address: data.user.address || '',
            balance: userBal,
            avatarEmoji: data.user.avatarEmoji || localStorage.getItem('user_avatar_emoji') || '👨‍💻'
          }));

          // Keep localStorage live balance in sync with MongoDB
          localStorage.setItem('trading_live_balance', userBal.toString());

          if (data.user.isVerified) {
            setIsVerified(true);
            localStorage.setItem('user_is_verified', 'true');
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, userEmail, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Avatar select handler
  const handleSelectEmoji = async (emoji) => {
    setFormData(prev => ({ ...prev, avatarEmoji: emoji }));
    localStorage.setItem('user_avatar_emoji', emoji);
    setShowEmojiModal(false);

    try {
      const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();
      await fetch(`${API_URL}/api/users/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, avatarEmoji: emoji })
      });
    } catch (err) {
      console.warn('Avatar saved locally');
    }
  };

  // Save Profile Changes
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();
      const response = await fetch(`${API_URL}/api/users/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isVerified: true })
      });

      await response.json();
      setIsVerified(true);
      localStorage.setItem('user_is_verified', 'true');
      alert('✅ Changes saved successfully! Your account is now permanently Verified.');
    } catch (err) {
      setIsVerified(true);
      localStorage.setItem('user_is_verified', 'true');
      alert('✅ Changes saved locally! Account is now Verified.');
    } finally {
      setSaving(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      alert('Dono passwords bharein!');
      return;
    }

    setChangingPass(true);
    try {
      const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();
      const res = await fetch(`${API_URL}/api/users/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, oldPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        alert('✅ Password changed successfully!');
        setOldPassword('');
        setNewPassword('');
      } else {
        alert(data.message || 'Error changing password');
      }
    } catch (err) {
      alert('Server error changing password');
    } finally {
      setChangingPass(false);
    }
  };

  // Log Out Handler (Preserves MongoDB Live Balance safely & Clears Browser Session)
  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('trading_live_balance');
    localStorage.removeItem('user_avatar_emoji');
    localStorage.removeItem('user_is_verified');
    localStorage.removeItem('trading_closed_trades');

    try {
      const bc = new BroadcastChannel('trading_balance_sync');
      bc.postMessage({ logout: true, balanceUSD: 0 });
      bc.close();
    } catch (e) {}

    window.dispatchEvent(new Event('storage'));

    setShowLogoutModal(false);
    navigate('/login');
  };

  // Delete Account Permanently
  const handleDeleteAccount = async () => {
    try {
      const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();
      const response = await fetch(`${API_URL}/api/users/profile/${userId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        localStorage.clear();
        alert('Aapka account delete ho gaya hai.');
        navigate('/login');
      } else {
        alert(data.message || 'Delete operation failed.');
      }
    } catch (err) {
      alert('Error deleting account.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121622] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#121622] text-gray-200 font-sans select-none flex flex-col">
      
      {/* TOP HEADER */}
      <header className="h-16 bg-[#121622] border-b border-gray-800/80 flex flex-wrap items-center justify-between px-4 sm:px-6 py-2 gap-3 shrink-0">
        <button 
          onClick={() => navigate('/terminal')}
          className="flex items-center space-x-2 bg-[#1a2130] hover:bg-[#28344d] text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to trades</span>
        </button>

        <div className="flex items-center space-x-3 sm:space-x-6 text-xs ml-auto">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-gray-400">Available USD</span>
            <span className="font-bold text-emerald-400 text-sm flex items-center justify-end">
              <DollarSign className="w-3.5 h-3.5" />
              {formData.balance.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col text-right hidden xs:flex">
            <span className="text-[10px] text-gray-400">Rupees Equivalent</span>
            <span className="font-bold text-white text-sm">₹{(formData.balance * 96).toFixed(2)}</span>
          </div>

          {/* TOP HEADER LOGOUT BUTTON */}
          <button
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm ml-2"
            title="Logout of your account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="p-4 sm:p-8 max-w-xl w-full mx-auto flex-1 space-y-6">
        
        {/* PERSONAL DATA CONTAINER */}
        <div className="bg-[#171d2b]/60 border border-gray-800 rounded-xl p-5 sm:p-6 space-y-5">
          <h2 className="text-sm font-bold text-white tracking-wide border-b border-gray-800 pb-2 flex items-center justify-between">
            <span>Personal data</span>
            <span className="text-[10px] font-normal text-gray-400">ID: {userId ? userId.slice(-8) : '---'}</span>
          </h2>

          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-2xl shadow-md">
                {formData.avatarEmoji || <User className="w-7 h-7 text-white" />}
              </div>
              <button 
                type="button"
                onClick={() => setShowEmojiModal(true)}
                className="absolute -top-1 -right-1 p-1 bg-gray-800 hover:bg-gray-700 rounded-full text-gray-300 hover:text-white border border-gray-700 cursor-pointer shadow"
                title="Change Avatar"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <div className="text-xs font-bold text-white break-all">{formData.email || userEmail || 'No email provided'}</div>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-[11px] text-gray-400">User ID: {userId ? userId.slice(-8) : '---'}</span>
              </div>
              <div className="mt-1">
                {isVerified ? (
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/30">
                    <AlertCircle className="w-3 h-3 mr-1" /> Unverified
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Inputs Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
              <label className="text-[10px] text-gray-400 block">Nickname</label>
              <input 
                type="text" 
                name="nickname"
                value={formData.nickname} 
                onChange={handleInputChange}
                className="bg-transparent text-xs text-white outline-none w-full font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
                <label className="text-[10px] text-gray-400 block">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white outline-none w-full"
                />
              </div>

              <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
                <label className="text-[10px] text-gray-400 block">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white outline-none w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
                <label className="text-[10px] text-gray-400 block">Date of birth</label>
                <input 
                  type="text" 
                  name="dateOfBirth"
                  value={formData.dateOfBirth} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white outline-none w-full"
                />
              </div>

              <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
                <label className="text-[10px] text-gray-400 block">Aadhaar</label>
                <input 
                  type="text" 
                  name="aadhaar"
                  value={formData.aadhaar} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white outline-none w-full"
                />
              </div>
            </div>

            <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
              <label className="text-[10px] text-gray-400 block">Address</label>
              <input 
                type="text" 
                name="address"
                value={formData.address} 
                onChange={handleInputChange}
                className="bg-transparent text-xs text-white outline-none w-full"
              />
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-md transition cursor-pointer mt-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /><span>Save Profile</span></>}
            </button>
          </form>
        </div>

        {/* CHANGE PASSWORD BOX */}
        <div className="bg-[#171d2b]/60 border border-gray-800 rounded-xl p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold text-white tracking-wide border-b border-gray-800 pb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-400" />
            <span>Change Password</span>
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5">
              <label className="text-[10px] text-gray-400 block">Old Password</label>
              <input 
                type="password"
                placeholder="Current password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="bg-transparent text-xs text-white outline-none w-full"
              />
            </div>
            <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5">
              <label className="text-[10px] text-gray-400 block">New Password</label>
              <input 
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-transparent text-xs text-white outline-none w-full"
              />
            </div>
            <button 
              type="submit"
              disabled={changingPass}
              className="w-full bg-[#1c2638] hover:bg-blue-600 text-white font-semibold text-xs py-2 rounded-lg transition cursor-pointer"
            >
              {changingPass ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* SESSION & LOGOUT BOX */}
        <div className="bg-[#171d2b]/60 border border-gray-800 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Session & Logout</span>
            </h2>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center">
              Active Session
            </span>
          </div>

          {/* <p className="text-xs text-gray-400 leading-relaxed">
            Aapka live balance (<span className="text-emerald-400 font-bold">${formData.balance.toFixed(2)}</span>) MongoDB database me surakshit (safe) hai. Logout karne par aapka browser session clear ho jayega aur jab aap dobara login karenge, to aapka sara live balance waise hi milega.
          </p> */}

          <button 
            type="button"
            onClick={() => setShowLogoutModal(true)}
            className="w-full bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-400 hover:text-red-300 font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout from Account</span>
          </button>

          {/* Delete Account Link */}
          <div className="pt-2 border-t border-gray-800 flex justify-center">
            <button 
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center text-xs font-semibold text-gray-500 hover:text-red-400 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5 mr-1 stroke-[2.5]" /> Delete My account permanently
            </button>
          </div>
        </div>

      </main>

      {/* LOGOUT CONFIRMATION MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a2130] border border-gray-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-red-400 border-b border-gray-800 pb-3">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center border border-red-500/30 shrink-0">
                <LogOut className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Log Out of Account?</h3>
                
              </div>
            </div>

            <div className="bg-[#121622] border border-gray-800 rounded-xl p-3.5 text-xs space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span>Account Email:</span>
                <span className="text-white font-medium break-all">{formData.email || userEmail}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400 border-t border-gray-800/80 pt-2">
                <span>Your Live Balance:</span>
                <span className="font-extrabold text-emerald-400 text-sm flex items-center">
                  <DollarSign className="w-3.5 h-3.5" />
                  {formData.balance.toFixed(2)}
                </span>
              </div>
              
            </div>

            <div className="flex space-x-3 justify-end pt-2">
              <button 
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition cursor-pointer flex items-center space-x-1.5 shadow-md"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Yes, Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMOJI / AVATAR SELECTOR MODAL */}
      {showEmojiModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a2130] border border-gray-700 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white">Choose Profile Avatar</h3>
              <button onClick={() => setShowEmojiModal(false)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-300">Select your preferred avatar emoji below:</p>
            
            <div className="grid grid-cols-5 gap-3 py-2">
              {avatarOptions.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectEmoji(emoji)}
                  className={`text-2xl p-3 bg-[#121622] hover:bg-blue-600/20 rounded-xl border transition cursor-pointer flex items-center justify-center ${
                    formData.avatarEmoji === emoji ? 'border-blue-500 bg-blue-600/30' : 'border-gray-800'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setShowEmojiModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs font-bold text-white transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a2130] border border-gray-700 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Delete Account?</h3>
            <p className="text-xs text-gray-300">
              Kya aap sure hain ki aap apna account permanent delete karna chahte hain?
            </p>
            <div className="flex space-x-3 justify-end pt-2">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs font-bold text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition cursor-pointer"
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