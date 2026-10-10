
// import React, { useState, useEffect } from 'react';
// import { 
//   User, 
//   Camera, 
//   X,
//   ArrowLeft,
//   Save,
//   Loader2
// } from 'lucide-react';

// export default function AccountPage() {
//   const [formData, setFormData] = useState({
//     nickname: '',
//     firstName: '',
//     lastName: '',
//     dateOfBirth: '',
//     aadhaar: '',
//     email: '',
//     country: 'India',
//     address: '',
//     balance: 0
//   });

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   // User ID local storage ya fallback mock ID
//   const userId = localStorage.getItem('userId') || '650001';

//   // Fetch initial profile data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
        
//         if (!response.ok) {
//           throw new Error(`Server status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (data.success && data.user) {
//           setFormData({
//             nickname: data.user.nickname || '',
//             firstName: data.user.firstName || '',
//             lastName: data.user.lastName || '',
//             dateOfBirth: data.user.dateOfBirth || '',
//             aadhaar: data.user.aadhaar || '',
//             email: data.user.email || '',
//             country: data.user.country || 'India',
//             address: data.user.address || '',
//             balance: data.user.balance || 0
//           });
//         }
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [userId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   // Handle Save Profile Changes (MongoDB Save Call)
//   const handleSave = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         throw new Error(`Server status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         alert('Changes saved successfully in MongoDB!');
//       } else {
//         alert(data.message || 'Failed to save changes.');
//       }
//     } catch (err) {
//       console.error('Save error:', err);
//       alert('Backend server se connect nahi ho paya.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Handle Delete Account
//   const handleDeleteAccount = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`, {
//         method: 'DELETE'
//       });

//       if (!response.ok) {
//         throw new Error(`Server status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success) {
//         localStorage.clear();
//         alert('Aapka account delete ho gaya hai.');
//         window.location.href = '/login';
//       } else {
//         alert(data.message || 'Delete operation failed.');
//       }
//     } catch (err) {
//       console.error('Delete error:', err);
//       alert('Error deleting account.');
//     } finally {
//       setShowDeleteModal(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#121622] text-white flex items-center justify-center">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-full bg-[#121622] text-gray-200 font-sans select-none flex flex-col">
      
//       {/* TOP HEADER */}
//       <header className="h-16 bg-[#121622] border-b border-gray-800/80 flex flex-wrap items-center justify-between px-4 sm:px-6 py-2 gap-3 shrink-0">
//         <button 
//           onClick={() => window.history.back()}
//           className="flex items-center space-x-2 bg-[#1a2130] hover:bg-[#28344d] text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           <span>Back to trades</span>
//         </button>

//         <div className="flex items-center space-x-4 sm:space-x-8 text-xs ml-auto">
//           <div className="flex flex-col text-right">
//             <span className="text-[10px] text-gray-400">My current currency</span>
//             <div className="flex items-center justify-end space-x-1 font-bold text-white">
//               <span>₹ INR</span>
//             </div>
//           </div>

//           <div className="flex flex-col text-right">
//             <span className="text-[10px] text-gray-400">Available for withdrawal</span>
//             <span className="font-bold text-white text-sm">₹{formData.balance.toFixed(2)}</span>
//           </div>

//           <div className="flex flex-col text-right">
//             <span className="text-[10px] text-gray-400">In the account</span>
//             <span className="font-bold text-white text-sm">₹{formData.balance.toFixed(2)}</span>
//           </div>
//         </div>
//       </header>

//       {/* MAIN CONTENT AREA */}
//       <main className="p-4 sm:p-8 max-w-xl w-full mx-auto flex-1">
        
//         {/* PERSONAL DATA CONTAINER */}
//         <div className="bg-[#171d2b]/60 border border-gray-800 rounded-xl p-5 sm:p-6 space-y-5">
//           <h2 className="text-sm font-bold text-white tracking-wide border-b border-gray-800 pb-2">Personal data</h2>

//           {/* Profile Header */}
//           <div className="flex items-center space-x-4">
//             <div className="relative shrink-0">
//               <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
//                 <User className="w-7 h-7" />
//               </div>
//               <button className="absolute -top-1 -right-1 p-1 bg-gray-800 rounded-full text-gray-300 hover:text-white border border-gray-700">
//                 <Camera className="w-3.5 h-3.5" />
//               </button>
//             </div>
//             <div>
//               <div className="text-xs font-bold text-white break-all">{formData.email || 'No email provided'}</div>
//               <div className="text-[11px] text-gray-400">ID: {userId.slice(-8)}</div>
//             </div>
//           </div>

//           {/* Inputs Form */}
//           <form onSubmit={handleSave} className="space-y-3">
//             <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
//               <label className="text-[10px] text-gray-400 block">Nickname</label>
//               <input 
//                 type="text" 
//                 name="nickname"
//                 value={formData.nickname} 
//                 onChange={handleInputChange}
//                 className="bg-transparent text-xs text-white outline-none w-full font-medium"
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
//                 <label className="text-[10px] text-gray-400 block">First Name</label>
//                 <input 
//                   type="text" 
//                   name="firstName"
//                   placeholder="Empty"
//                   value={formData.firstName} 
//                   onChange={handleInputChange}
//                   className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
//                 />
//               </div>

//               <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
//                 <label className="text-[10px] text-gray-400 block">Last Name</label>
//                 <input 
//                   type="text" 
//                   name="lastName"
//                   placeholder="Empty"
//                   value={formData.lastName} 
//                   onChange={handleInputChange}
//                   className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
//                 />
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
//                 <label className="text-[10px] text-gray-400 block">Date of birth</label>
//                 <input 
//                   type="text" 
//                   name="dateOfBirth"
//                   placeholder="dd-mm-yyyy"
//                   value={formData.dateOfBirth} 
//                   onChange={handleInputChange}
//                   className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
//                 />
//               </div>

//               <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
//                 <label className="text-[10px] text-gray-400 block">Aadhaar</label>
//                 <input 
//                   type="text" 
//                   name="aadhaar"
//                   placeholder="Empty"
//                   value={formData.aadhaar} 
//                   onChange={handleInputChange}
//                   className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
//                 />
//               </div>
//             </div>

//             {/* Address Field */}
//             <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
//               <label className="text-[10px] text-gray-400 block">Address</label>
//               <input 
//                 type="text" 
//                 name="address"
//                 placeholder="Enter your address"
//                 value={formData.address} 
//                 onChange={handleInputChange}
//                 className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
//               />
//             </div>

//             {/* Editable Email Field */}
//             <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
//               <label className="text-[10px] text-gray-400 block">Email</label>
//               <input 
//                 type="email" 
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email} 
//                 onChange={handleInputChange}
//                 className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
//               />
//             </div>

//             <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5">
//               <label className="text-[10px] text-gray-400 block">Country</label>
//               <select 
//                 name="country"
//                 value={formData.country} 
//                 onChange={handleInputChange}
//                 className="bg-transparent text-xs text-white outline-none w-full cursor-pointer"
//               >
//                 <option value="India" className="bg-[#121622]">India</option>
//                 <option value="USA" className="bg-[#121622]">USA</option>
//                 <option value="UK" className="bg-[#121622]">UK</option>
//               </select>
//             </div>

//             {/* Save Button */}
//             <div className="pt-3">
//               <button 
//                 type="submit"
//                 disabled={saving}
//                 className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-md transition active:scale-[0.98] cursor-pointer"
//               >
//                 {saving ? (
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <>
//                     <Save className="w-4 h-4" />
//                     <span>Save changes</span>
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>

//           {/* Delete Account Link */}
//           <div className="pt-4 border-t border-gray-800 flex justify-center">
//             <button 
//               type="button"
//               onClick={() => setShowDeleteModal(true)}
//               className="flex items-center text-xs font-semibold text-red-500 hover:text-red-400 transition cursor-pointer"
//             >
//               <X className="w-4 h-4 mr-1 stroke-[2.5]" /> Delete My account
//             </button>
//           </div>
//         </div>

//       </main>

//       {/* DELETE ACCOUNT CONFIRMATION MODAL */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-[#1a2130] border border-gray-700 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl">
//             <h3 className="text-base font-bold text-white">Delete Account?</h3>
//             <p className="text-xs text-gray-300">
//               Kya aap sure hain ki aap apna account permanent delete karna chahte hain?
//             </p>
//             <div className="flex space-x-3 justify-end pt-2">
//               <button 
//                 onClick={() => setShowDeleteModal(false)}
//                 className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs font-bold text-white transition cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button 
//                 onClick={handleDeleteAccount}
//                 className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition cursor-pointer"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Camera, 
  X,
  ArrowLeft,
  Save,
  Loader2,
  Lock
} from 'lucide-react';

export default function AccountPage() {
  const [formData, setFormData] = useState({
    nickname: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    aadhaar: '',
    email: '',
    country: 'India',
    address: '',
    balance: 0
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  const userId = localStorage.getItem('userId') || '650001';

  // Fetch initial profile data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
        const data = await response.json();

        if (data.success && data.user) {
          setFormData({
            nickname: data.user.nickname || '',
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            dateOfBirth: data.user.dateOfBirth || '',
            aadhaar: data.user.aadhaar || '',
            email: data.user.email || localStorage.getItem('userEmail') || '',
            country: data.user.country || 'India',
            address: data.user.address || '',
            balance: Number(data.user.balance || 0)
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save Profile Changes
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Changes saved successfully in MongoDB!');
      } else {
        alert(data.message || 'Failed to save changes.');
      }
    } catch (err) {
      alert('Backend server se connect nahi ho paya.');
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
      const res = await fetch('http://localhost:5000/api/users/change-password', {
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

  // Delete Account
  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        localStorage.clear();
        alert('Aapka account MongoDB se delete ho gaya hai.');
        window.location.href = '/login';
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
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 bg-[#1a2130] hover:bg-[#28344d] text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to trades</span>
        </button>

        <div className="flex items-center space-x-4 sm:space-x-8 text-xs ml-auto">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-gray-400">Available USD</span>
            <span className="font-bold text-emerald-400 text-sm">${formData.balance.toFixed(2)}</span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-[10px] text-gray-400">Rupees Equivalent</span>
            <span className="font-bold text-white text-sm">₹{(formData.balance * 96).toFixed(2)}</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="p-4 sm:p-8 max-w-xl w-full mx-auto flex-1 space-y-6">
        
        {/* PERSONAL DATA CONTAINER */}
        <div className="bg-[#171d2b]/60 border border-gray-800 rounded-xl p-5 sm:p-6 space-y-5">
          <h2 className="text-sm font-bold text-white tracking-wide border-b border-gray-800 pb-2">Personal data</h2>

          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                <User className="w-7 h-7" />
              </div>
              <button className="absolute -top-1 -right-1 p-1 bg-gray-800 rounded-full text-gray-300 hover:text-white border border-gray-700">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <div className="text-xs font-bold text-white break-all">{formData.email || 'No email provided'}</div>
              <div className="text-[11px] text-gray-400">User ID: {userId.slice(-8)}</div>
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
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /><span>Save changes</span></>}
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

          {/* Delete Account Link */}
          <div className="pt-3 border-t border-gray-800 flex justify-center">
            <button 
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center text-xs font-semibold text-red-500 hover:text-red-400 transition cursor-pointer"
            >
              <X className="w-4 h-4 mr-1 stroke-[2.5]" /> Delete My account
            </button>
          </div>
        </div>

      </main>

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