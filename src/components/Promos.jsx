import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Promos({ onStartTrading }) {
  const cards = [
    {
      badge: '$80 per referral (unlimited)',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      title: 'Refer a Friend',
      description: 'Refer your friends and earn up to $80 for every successful referral. There\'s no limit on how much you can earn.',
      linkText: 'Start Earning Now',
      color: 'from-slate-900 to-slate-800'
    },
    {
      badge: 'Trade and win',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      title: 'XM Traders Club',
      description: 'Join now and earn XM Coins. Redeem them for bonuses, cash, trading tools, and exclusive rewards.',
      linkText: 'Start Getting Rewards',
      color: 'from-blue-900 to-slate-900'
    },
    {
      badge: '$100k prizes every month',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      title: 'Competitions',
      description: 'Trade and grab your share of big cash prizes. There\'s no entry fee, and they\'re open to all experience levels.',
      linkText: 'Join Now',
      color: 'from-amber-950 to-slate-900'
    }
  ];

  return (
    <section className="py-16 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between">
              <div>
                <div className={`h-48 bg-gradient-to-tr ${card.color} p-6 flex flex-col justify-between text-white relative`}>
                  <span className={`self-start text-xs font-bold px-3 py-1 rounded-full ${card.badgeBg}`}>
                    {card.badge}
                  </span>
                  <h3 className="text-2xl font-bold tracking-tight">{card.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6">
                <button
                  onClick={onStartTrading}
                  className="inline-flex items-center space-x-1 text-sm font-bold text-blue-600 hover:text-blue-700 group"
                >
                  <span>{card.linkText}</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}