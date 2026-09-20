import React from 'react';
import { tradingMenu, discoverMenu, companyMenu } from '../data/navigationData';

export function TradingMegaMenu() {
  return (
    <div className="absolute left-0 top-full w-[850px] bg-white border border-gray-200 shadow-xl rounded-2xl p-6 grid grid-cols-4 gap-6 z-50">
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">WHY TRADE WITH US</h4>
        <ul className="space-y-2 text-sm text-gray-700 font-medium">
          {tradingMenu.whyTrade.map((item, idx) => (
            <li key={idx} className="hover:text-blue-600 cursor-pointer">{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">ACCOUNTS</h4>
        <ul className="space-y-2 text-sm text-gray-700 font-medium mb-6">
          {tradingMenu.accounts.map((item, idx) => (
            <li key={idx} className="hover:text-blue-600 cursor-pointer">{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">MARKETS</h4>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700 font-medium">
          {tradingMenu.markets.map((item, idx) => (
            <div key={idx} className="hover:text-blue-600 cursor-pointer">{item}</div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">PLATFORMS</h4>
        <ul className="space-y-2 text-sm text-gray-700 font-medium">
          {tradingMenu.platforms.map((item, idx) => (
            <li key={idx} className="hover:text-blue-600 cursor-pointer">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function DiscoverMegaMenu() {
  return (
    <div className="absolute left-0 top-full w-[700px] bg-white border border-gray-200 shadow-xl rounded-2xl p-6 grid grid-cols-3 gap-6 z-50">
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">OUR OFFERING</h4>
        <ul className="space-y-2 text-sm text-gray-700 font-medium">
          {discoverMenu.offering.map((item, idx) => (
            <li key={idx} className="hover:text-blue-600 cursor-pointer">{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">EDUCATION</h4>
        <ul className="space-y-2 text-sm text-gray-700 font-medium">
          {discoverMenu.education.map((item, idx) => (
            <li key={idx} className="hover:text-blue-600 cursor-pointer">{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">TRADING TOOLS</h4>
        <ul className="space-y-2 text-sm text-gray-700 font-medium">
          {discoverMenu.tools.map((item, idx) => (
            <li key={idx} className="hover:text-blue-600 cursor-pointer">{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CompanyMenu() {
  return (
    <div className="absolute left-0 top-full w-[240px] bg-white border border-gray-200 shadow-xl rounded-2xl p-4 z-50">
      <ul className="space-y-2 text-sm text-gray-700 font-medium">
        {companyMenu.map((item, idx) => (
          <li key={idx} className="hover:text-blue-600 cursor-pointer py-1 border-b border-gray-50 last:border-none">{item}</li>
        ))}
      </ul>
    </div>
  );
}