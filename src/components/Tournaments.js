import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  BarChart2, HelpCircle, User, Trophy, Store, MoreHorizontal, 
  Maximize2, Volume2, Settings, Info, Clock, 
} from 'lucide-react';

export default function Tournaments() {
  const navigate = useNavigate();
  const { tab } = useParams(); // 'active' or 'completed'
  const currentTab = tab === 'completed' ? 'completed' : 'active';

  // Sample Tournament Data matching UI
  const activeTournaments = [
    {
      id: 'crazy-wednesday',
      title: 'Crazy Wednesday',
      status: 'UNTIL START: 09:22:52',
      prizePool: '9000 $',
      entryFee: '10 $',
      duration: '1 day',
      bgGradient: 'from-gray-900 to-slate-800'
    },
    {
      id: 'free-friday',
      title: 'Free Friday',
      status: 'UNTIL START: 2 DAY(S)',
      prizePool: '1000 $',
      entryFee: '0 $',
      duration: '1 day',
      hasTrophyGraphic: true
    },
    {
      id: 'weekend-battle',
      title: 'Weekend Battle',
      status: 'UNTIL START: 3 DAY(S)',
      prizePool: '5000 $',
      entryFee: '1 $',
      duration: '2 days',
      bgGradient: 'from-gray-900 to-slate-800'
    }
  ];

  const completedTournaments = [
    {
      id: 'weekend-battle-completed',
      title: 'Weekend Battle',
      status: 'FINISHED',
      prizePool: '5000 $',
      entryFee: '1 $',
      duration: '2 days'
    },
    {
      id: 'free-friday-completed',
      title: 'Free Friday',
      status: 'FINISHED',
      prizePool: '1000 $',
      entryFee: '0 $',
      duration: '1 day'
    },
    {
      id: 'crazy-wednesday-completed',
      title: 'Crazy Wednesday',
      status: 'FINISHED',
      prizePool: '7500 $',
      entryFee: '10 $',
      duration: '1 day'
    },
    {
      id: 'weekend-battle-2-completed',
      title: 'Weekend Battle',
      status: 'FINISHED',
      prizePool: '5000 $',
      entryFee: '1 $',
      duration: '2 days'
    }
  ];

  return (
    <div className="flex h-screen w-full bg-[#121824] text-gray-200 font-sans select-none overflow-hidden">
      
      {/* LEFT NAVIGATION SIDEBAR (Same as Trading Terminal) */}
      <aside className="w-16 bg-[#0d121d] border-r border-gray-800 flex flex-col items-center justify-between py-3 z-10 hidden sm:flex shrink-0">
        <div className="flex flex-col items-center space-y-5 w-full">
          
          <button 
            onClick={() => navigate('/terminal')} 
            className="flex flex-col items-center justify-center w-full py-2 border-l-2 border-transparent text-gray-400 hover:text-gray-200 transition"
          >
            <BarChart2 className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1">TRADE</span>
          </button>

          <button 
            onClick={() => navigate('/support')} 
            className="flex flex-col items-center justify-center w-full py-2 border-l-2 border-transparent text-gray-400 hover:text-gray-200 transition"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1">SUPPORT</span>
          </button>

          <button 
            onClick={() => navigate('/account')} 
            className="flex flex-col items-center justify-center w-full py-2 border-l-2 border-transparent text-gray-400 hover:text-gray-200 transition"
          >
            <User className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1">ACCOUNT</span>
          </button>

          <button 
            onClick={() => navigate('/tournment/active')} 
            className="flex flex-col items-center justify-center w-full py-2 border-l-2 border-blue-500 text-blue-400 bg-blue-500/10 transition"
          >
            <div className="relative">
              <Trophy className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full px-1 font-bold">3</span>
            </div>
            <span className="text-[9px] font-medium mt-1">TOURNAMENTS</span>
          </button>

          <button 
            onClick={() => navigate('/market')} 
            className="flex flex-col items-center justify-center w-full py-2 border-l-2 border-transparent text-gray-400 hover:text-gray-200 transition"
          >
            <div className="relative">
              <Store className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] rounded-full px-1 font-bold">4</span>
            </div>
            <span className="text-[9px] font-medium mt-1">MARKET</span>
          </button>

          <button className="flex flex-col items-center justify-center w-full py-2 text-gray-400 hover:text-gray-200">
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[9px] font-medium mt-1">MORE</span>
          </button>
        </div>

        <div className="flex flex-col items-center space-y-4 w-full">
          <button className="text-gray-400 hover:text-white p-1"><Maximize2 className="w-4 h-4" /></button>
          <button className="text-gray-400 hover:text-white p-1"><Volume2 className="w-4 h-4" /></button>
          <button className="text-gray-400 hover:text-white p-1"><Settings className="w-4 h-4" /></button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#121824] px-6 py-4">
        
        {/* Header Title */}
        <h1 className="text-sm font-bold text-gray-200 mb-4 tracking-wide">Tournaments</h1>

        {/* Tab Navigation links: /tournment/active & /tournment/completed */}
        <div className="flex border-b border-gray-800 mb-6">
          <Link
            to="/tournment/active"
            className={`pb-2 px-6 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 ${
              currentTab === 'active'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>ACTIVE</span>
            <span className="bg-blue-600 text-white text-[10px] rounded-full px-1.5 py-0.2 font-black">3</span>
          </Link>

          <Link
            to="/tournment/completed"
            className={`pb-2 px-6 text-xs font-bold transition-all border-b-2 ${
              currentTab === 'completed'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
          >
            COMPLETED
          </Link>
        </div>

        {/* ACTIVE TOURNAMENTS VIEW */}
        {currentTab === 'active' && (
          <div>
            <div className="text-center text-xs font-semibold text-gray-300 mb-5">
              Available for participation ({activeTournaments.length})
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-6xl mx-auto">
              {activeTournaments.map((t) => (
                <div 
                  key={t.id} 
                  className={`relative rounded-lg overflow-hidden border border-gray-800/80 bg-[#171e2c] flex flex-col justify-between p-5 min-h-[200px] shadow-lg ${
                    t.hasTrophyGraphic ? 'bg-gradient-to-r from-blue-600/90 via-blue-500/80 to-purple-900/90' : ''
                  }`}
                >
                  {/* Top Badge & Prize Pool */}
                  <div className="flex justify-between items-start z-10">
                    <span className="bg-blue-600/90 text-white text-[9px] font-bold px-2 py-1 rounded flex items-center space-x-1 uppercase tracking-wider">
                      <Clock className="w-3 h-3 mr-1" />
                      {t.status}
                    </span>

                    <div className="text-right">
                      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">PRIZE POOL</div>
                      <div className="text-emerald-400 font-extrabold text-lg">{t.prizePool}</div>
                    </div>
                  </div>

                  {/* Title & Graphic */}
                  <div className="my-3 z-10 relative">
                    <h2 className="text-xl font-bold text-white tracking-wide">{t.title}</h2>
                    {t.hasTrophyGraphic && (
                      <div className="absolute -right-2 -top-6 w-28 h-28 opacity-90 pointer-events-none">
                        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-blue-200/80 drop-shadow-xl" stroke="currentColor" strokeWidth="1">
                          <path d="M6 9C6 11.2091 7.79086 13 10 13H14C16.2091 13 18 11.2091 18 9V3H6V9Z" fill="currentColor" fillOpacity="0.2"/>
                          <path d="M6 9V3H18V9C18 11.2091 16.2091 13 14 13H10C7.79086 13 6 11.2091 6 9Z" stroke="currentColor"/>
                          <path d="M18 5H20C21.1046 5 22 5.89543 22 7C22 8.10457 21.1046 9 20 9H18" stroke="currentColor"/>
                          <path d="M6 5H4C2.89543 5 2 5.89543 2 7C2 8.10457 2.89543 9 4 9H6" stroke="currentColor"/>
                          <path d="M12 13V17" stroke="currentColor"/>
                          <path d="M8 21H16" stroke="currentColor"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info Row: Entry Fee, Duration & Details Button */}
                  <div className="z-10">
                    <div className="flex space-x-10 mb-4">
                      <div>
                        <div className="text-base font-extrabold text-white">{t.entryFee}</div>
                        <div className="text-[10px] text-gray-400">Entry fee</div>
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-white">{t.duration}</div>
                        <div className="text-[10px] text-gray-400">Duration</div>
                      </div>
                    </div>

                    <button className="w-full bg-[#20293a] hover:bg-[#283449] text-gray-200 text-xs font-semibold py-2 rounded-md flex items-center justify-center space-x-1.5 transition border border-gray-700/50">
                      <span>Details</span>
                      <Info className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* COMPLETED TOURNAMENTS VIEW */}
        {currentTab === 'completed' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-6xl mx-auto w-full">
            {completedTournaments.map((t, idx) => (
              <div 
                key={idx} 
                className="relative rounded-lg border border-gray-800/80 bg-[#171e2c] flex flex-col justify-between p-5 min-h-[190px] shadow-lg"
              >
                {/* Top Badge & Prize Pool */}
                <div className="flex justify-between items-start">
                  <span className="bg-blue-600/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                    {t.status}
                  </span>

                  <div className="text-right">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">PRIZE POOL</div>
                    <div className="text-emerald-400 font-extrabold text-lg">{t.prizePool}</div>
                  </div>
                </div>

                {/* Title */}
                <div className="my-2">
                  <h2 className="text-xl font-bold text-white tracking-wide">{t.title}</h2>
                </div>

                {/* Details Footer */}
                <div>
                  <div className="flex space-x-10 mb-4">
                    <div>
                      <div className="text-base font-extrabold text-white">{t.entryFee}</div>
                      <div className="text-[10px] text-gray-400">Entry fee</div>
                    </div>
                    <div>
                      <div className="text-base font-extrabold text-white">{t.duration}</div>
                      <div className="text-[10px] text-gray-400">Duration</div>
                    </div>
                  </div>

                  <button className="w-full bg-[#20293a] hover:bg-[#283449] text-gray-200 text-xs font-semibold py-2 rounded-md flex items-center justify-center space-x-1.5 transition border border-gray-700/50">
                    <span>Details</span>
                    <Info className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

    </div>
  );
}