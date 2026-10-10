import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function Toast({ toastNotification }) {
  if (!toastNotification) return null;

  return (
    <div className={`fixed top-16 right-4 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-2xl text-white border font-bold animate-bounce ${
      toastNotification.type === 'win' 
        ? 'bg-emerald-600/90 border-emerald-400' 
        : 'bg-red-600/90 border-red-400'
    }`}>
      {toastNotification.type === 'win' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
      <span className="text-sm">{toastNotification.message}</span>
    </div>
  );
}