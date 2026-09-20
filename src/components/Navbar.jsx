
import React, { useState } from 'react';
import { ChevronDown, Menu, X, Globe } from 'lucide-react';
import { TradingMegaMenu, DiscoverMegaMenu, CompanyMenu } from './MegaMenus';
import { tradingMenu, discoverMenu, companyMenu } from '../data/navigationData';

export default function Navbar({ activeTab, setActiveTab }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSubMenu, setMobileSubMenu] = useState(null);

  const toggleMobileSubMenu = (menuName) => {
    setMobileSubMenu(mobileSubMenu === menuName ? null : menuName);
  };

  // Helper function to safely render array data in mobile menu
  const renderMenuList = (data) => {
    if (!data) return null;
    
    // If it's a simple array of strings/items
    if (Array.isArray(data)) {
      return data.map((item, idx) => (
        <div key={idx} className="py-1 hover:text-blue-600 cursor-pointer">
          {typeof item === 'string' ? item : item.title || item.name || JSON.stringify(item)}
        </div>
      ));
    }

    // If it's an object with section keys (e.g. { aboutUs: [...], regulation: [...] })
    if (typeof data === 'object') {
      return Object.entries(data).map(([key, value], idx) => (
        <div key={idx} className="mb-3">
          <div className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-1">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </div>
          {Array.isArray(value) ? (
            value.map((item, itemIdx) => (
              <div key={itemIdx} className="py-1 hover:text-blue-600 cursor-pointer">
                {typeof item === 'string' ? item : item.title || item.name}
              </div>
            ))
          ) : typeof value === 'string' ? (
            <div className="py-1 hover:text-blue-600 cursor-pointer">{value}</div>
          ) : null}
        </div>
      ));
    }

    return null;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Desktop Nav */}
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={() => { setActiveTab('home'); setMobileNavOpen(false); }}
            >
              <div className="bg-red-600 text-white font-black text-xl px-2.5 py-1 rounded tracking-tighter">
                XM
              </div>
            </div>

            <nav className="hidden md:flex space-x-6">
              <div className="relative" onMouseEnter={() => setOpenMenu('trading')} onMouseLeave={() => setOpenMenu(null)}>
                <button className={`flex items-center space-x-1 text-sm font-semibold py-5 ${openMenu === 'trading' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                  <span>Trading</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {openMenu === 'trading' && <TradingMegaMenu />}
              </div>

              <div className="relative" onMouseEnter={() => setOpenMenu('discover')} onMouseLeave={() => setOpenMenu(null)}>
                <button className={`flex items-center space-x-1 text-sm font-semibold py-5 ${openMenu === 'discover' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                  <span>Discover</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {openMenu === 'discover' && <DiscoverMegaMenu />}
              </div>

              <button 
                onClick={() => setActiveTab('promotions')}
                className={`text-sm font-semibold py-5 transition-colors ${activeTab === 'promotions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Promotions
              </button>

              <div className="relative" onMouseEnter={() => setOpenMenu('company')} onMouseLeave={() => setOpenMenu(null)}>
                <button className={`flex items-center space-x-1 text-sm font-semibold py-5 ${openMenu === 'company' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                  <span>Company</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {openMenu === 'company' && <CompanyMenu />}
              </div>
            </nav>
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-900">
              <Globe className="w-4 h-4" />
              <span>English</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            <button 
              onClick={() => setActiveTab('login')}
              className="text-sm font-semibold text-gray-700 hover:text-blue-600 px-3 py-2"
            >
              Login
            </button>
            <button 
              onClick={() => setActiveTab('register')} 
              className="bg-[#0c192c] hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded text-sm transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Icon Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileNavOpen(!mobileNavOpen)} 
              className="p-1.5 text-gray-800 border border-gray-400 rounded-lg hover:bg-gray-100 transition"
            >
              {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="flex flex-col space-y-1">
            
            {/* Trading Dropdown */}
            <div>
              <button onClick={() => toggleMobileSubMenu('trading')} className="w-full flex justify-between items-center py-2.5 text-base font-semibold text-gray-800 border-b border-gray-100">
                <span>Trading</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubMenu === 'trading' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubMenu === 'trading' && (
                <div className="pl-4 py-3 text-sm text-gray-600 bg-gray-50 rounded-md my-2">
                  {renderMenuList(tradingMenu)}
                </div>
              )}
            </div>

            {/* Discover Dropdown */}
            <div>
              <button onClick={() => toggleMobileSubMenu('discover')} className="w-full flex justify-between items-center py-2.5 text-base font-semibold text-gray-800 border-b border-gray-100">
                <span>Discover</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubMenu === 'discover' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubMenu === 'discover' && (
                <div className="pl-4 py-3 text-sm text-gray-600 bg-gray-50 rounded-md my-2">
                  {renderMenuList(discoverMenu)}
                </div>
              )}
            </div>

            {/* Promotions Link */}
            <button 
              onClick={() => { setActiveTab('promotions'); setMobileNavOpen(false); }}
              className={`w-full text-left py-2.5 text-base font-semibold border-b border-gray-100 ${activeTab === 'promotions' ? 'text-blue-600' : 'text-gray-800'}`}
            >
              Promotions
            </button>

            {/* Company Dropdown */}
            <div>
              <button onClick={() => toggleMobileSubMenu('company')} className="w-full flex justify-between items-center py-2.5 text-base font-semibold text-gray-800 border-b border-gray-100">
                <span>Company</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileSubMenu === 'company' ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubMenu === 'company' && (
                <div className="pl-4 py-3 text-sm text-gray-600 bg-gray-50 rounded-md my-2">
                  {renderMenuList(companyMenu)}
                </div>
              )}
            </div>

          </div>

          {/* Login & Get Started Buttons */}
          <div className="pt-4 space-y-2">
            <button 
              onClick={() => { setActiveTab('login'); setMobileNavOpen(false); }}
              className="w-full py-2.5 border border-gray-300 font-semibold rounded text-sm text-gray-800 hover:bg-gray-50"
            >
              Login
            </button>
            <button 
              onClick={() => { setActiveTab('register'); setMobileNavOpen(false); }}
              className="w-full py-2.5 bg-[#0c192c] text-white font-semibold rounded text-sm hover:bg-slate-800"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}