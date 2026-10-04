

import React, { useState } from 'react';
import { 
  User, 
  Camera, 
  X,
  ArrowLeft,
  Save
} from 'lucide-react';

export default function AccountPage() {
  const [formData, setFormData] = useState({
    nickname: '#93724428',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    aadhaar: '',
    email: 'kamilamin909@gmail.com',
    country: 'India',
    address: ''
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Changes saved successfully!');
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    alert('Aapka account delete ho gaya hai.');
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#121622] text-gray-200 font-sans select-none flex flex-col">
      
      {/* TOP HEADER */}
      <header className="h-16 bg-[#121622] border-b border-gray-800/80 flex flex-wrap items-center justify-between px-4 sm:px-6 py-2 gap-3 shrink-0">
        {/* Back to trades option */}
        <button 
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 bg-[#1a2130] hover:bg-[#28344d] text-gray-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to trades</span>
        </button>

        <div className="flex items-center space-x-4 sm:space-x-8 text-xs ml-auto">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-gray-400">My current currency</span>
            <div className="flex items-center justify-end space-x-1 font-bold text-white">
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

      {/* MAIN CONTENT AREA */}
      <main className="p-4 sm:p-8 max-w-xl w-full mx-auto flex-1">
        
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
              <div className="text-xs font-bold text-white break-all">{formData.email}</div>
              <div className="text-[11px] text-gray-400">ID: 93724428</div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-400 border border-red-500/30 mt-1">
                <X className="w-3 h-3 mr-0.5" /> Not verified
              </span>
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
                  placeholder="Empty"
                  value={formData.firstName} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
                />
              </div>

              <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
                <label className="text-[10px] text-gray-400 block">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  placeholder="Empty"
                  value={formData.lastName} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
                <label className="text-[10px] text-gray-400 block">Date of birth</label>
                <input 
                  type="text" 
                  name="dateOfBirth"
                  placeholder="dd-mm-yyyy"
                  value={formData.dateOfBirth} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
                />
              </div>

              <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
                <label className="text-[10px] text-gray-400 block">Aadhaar</label>
                <input 
                  type="text" 
                  name="aadhaar"
                  placeholder="Empty"
                  value={formData.aadhaar} 
                  onChange={handleInputChange}
                  className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
                />
              </div>
            </div>

            <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 focus-within:border-blue-500">
              <label className="text-[10px] text-gray-400 block">Address</label>
              <input 
                type="text" 
                name="address"
                placeholder="Enter your address"
                value={formData.address} 
                onChange={handleInputChange}
                className="bg-transparent text-xs text-white placeholder-gray-500 outline-none w-full"
              />
            </div>

            <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5 opacity-80">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-gray-400">Email</label>
                <span className="text-[9px] text-emerald-400 font-semibold">Verified</span>
              </div>
              <input 
                type="text" 
                readOnly 
                value={formData.email} 
                className="bg-transparent text-xs text-gray-300 outline-none w-full cursor-not-allowed"
              />
            </div>

            <div className="border border-gray-800 rounded-lg bg-[#121622] px-3 py-1.5">
              <label className="text-[10px] text-gray-400 block">Country</label>
              <select 
                name="country"
                value={formData.country} 
                onChange={handleInputChange}
                className="bg-transparent text-xs text-white outline-none w-full cursor-pointer"
              >
                <option value="India" className="bg-[#121622]">India</option>
                <option value="USA" className="bg-[#121622]">USA</option>
                <option value="UK" className="bg-[#121622]">UK</option>
              </select>
            </div>

            {/* Blue Save Button */}
            <div className="pt-3">
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 shadow-md transition active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>Save changes</span>
              </button>
            </div>
          </form>

          {/* Delete Account Link */}
          <div className="pt-4 border-t border-gray-800 flex justify-center">
            <button 
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center text-xs font-semibold text-red-500 hover:text-red-400 transition"
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
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-xs font-bold text-white transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-xs font-bold text-white transition"
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