
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, 
  Briefcase, 
  Radio, 
  Trophy, 
  Coins, 
  ChevronRight, 
  X 
} from 'lucide-react';

export default function MorePage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'analytics',
      title: 'Analytics',
      icon: PieChart,
      action: () => {}
    },
    {
      id: 'top',
      title: 'TOP',
      icon: Briefcase,
      action: () => {}
    },
    {
      id: 'signals',
      title: 'Signals',
      icon: Radio,
      action: () => {}
    },
    {
      id: 'tournaments',
      title: 'Tournaments',
      icon: Trophy,
      badge: '4',
      action: () => navigate('/tournment/active')
    },
    {
      id: 'market',
      title: 'Market',
      icon: Coins,
      badge: '4',
      action: () => navigate('/market')
    }
  ];

  return (
    <div className="min-h-screen h-[100dvh] w-full bg-[#121622] text-white flex flex-col p-4 sm:p-6 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 max-w-md w-full mx-auto">
        <h1 className="text-2xl font-bold tracking-tight text-white">More</h1>
        <button 
          onClick={() => navigate('/terminal')}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Menu Options List */}
      <div className="flex flex-col space-y-3 max-w-md w-full mx-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.action}
              className="flex items-center justify-between bg-[#1d2332] hover:bg-[#252d40] active:scale-[0.99] transition-all cursor-pointer rounded-xl px-4 py-3.5 border border-gray-800/60 shadow-md"
            >
              <div className="flex items-center space-x-3.5">
                <Icon className="w-5 h-5 text-gray-200" />
                <span className="font-semibold text-sm sm:text-base text-gray-100">
                  {item.title}
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                {item.badge && (
                  <span className="bg-[#1a73e8] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}