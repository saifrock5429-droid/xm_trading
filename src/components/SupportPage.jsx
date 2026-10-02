import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, GraduationCap, Headphones, HelpCircle, X } from 'lucide-react';

export default function SupportPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0d121d] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121927] rounded-xl border border-gray-800 shadow-2xl p-6 relative">
        
        {/* Header with Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800/60 mb-6">
          <h1 className="text-2xl font-bold text-white">Help</h1>
          <button 
            onClick={() => navigate('/terminal')} 
            className="text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Options List */}
        <div className="space-y-6">
          
          {/* FAQ */}
          <div className="flex flex-col items-center text-center cursor-pointer group p-3 rounded-lg hover:bg-[#1c2638] transition">
            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mb-2 group-hover:scale-105 transition">
              <LayoutGrid className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition">FAQ</h2>
            <p className="text-sm text-gray-400">Open the database</p>
          </div>

          <div className="border-t border-gray-800/80 my-2"></div>

          {/* Tutorials */}
          <div className="flex flex-col items-center text-center cursor-pointer group p-3 rounded-lg hover:bg-[#1c2638] transition">
            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mb-2 group-hover:scale-105 transition">
              <GraduationCap className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition">Tutorials</h2>
            <p className="text-sm text-gray-400">Use the hints</p>
          </div>

          <div className="border-t border-gray-800/80 my-2"></div>

          {/* Support */}
          <div className="flex flex-col items-center text-center cursor-pointer group p-3 rounded-lg hover:bg-[#1c2638] transition">
            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mb-2 group-hover:scale-105 transition">
              <Headphones className="w-8 h-8 stroke-[2.5]" />
            </div>
            <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition">Support</h2>
            <p className="text-sm text-gray-400">Submit a ticket</p>
          </div>

        </div>

        {/* Footer Contact Box */}
        <div className="mt-8 pt-6 border-t border-gray-800/80 text-center flex flex-col items-center">
          <div className="w-10 h-10 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mb-3">
            <HelpCircle className="w-6 h-6 fill-red-600/30 text-red-500" />
          </div>
          <p className="text-sm font-semibold text-gray-200">
            Didn't find an answer to your question?
          </p>
          <button className="mt-1 text-blue-500 hover:text-blue-400 text-sm font-bold hover:underline">
            Contact support
          </button>
        </div>

      </div>
    </div>
  );
}