
import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import Promos from './components/Promos';
import TradingTerminal from './components/TradingTerminal';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Footer from './components/Footer';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to sync with Navbar props
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/promotions') return 'promotions';
    if (path === '/terminal') return 'terminal';
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    return 'home';
  };

  const setActiveTab = (tab) => {
    switch (tab) {
      case 'home': navigate('/'); break;
      case 'promotions': navigate('/promotions'); break;
      case 'terminal': navigate('/terminal'); break;
      case 'login': navigate('/login'); break;
      case 'register': navigate('/register'); break;
      default: navigate('/'); break;
    }
  };

  const showFooter = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans antialiased">
      
      {/* Top Navbar */}
      <Navbar activeTab={getActiveTab()} setActiveTab={setActiveTab} />

      {/* Main Views via Routes */}
      <Routes>
        <Route 
          path="/" 
          element={
            <main className="flex-1">
              <HeroBanner onStartTrading={() => navigate('/register')} />
            </main>
          } 
        />
        
        <Route 
          path="/promotions" 
          element={
            <main className="flex-1 py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">All XM Promotions</h1>
                <p className="text-gray-600 mt-2">Explore our exclusive rewards, deposit bonuses, and trading competitions.</p>
              </div>
              <Promos onStartTrading={() => navigate('/register')} />
            </main>
          } 
        />

        <Route 
          path="/terminal" 
          element={
            <main className="flex-1 bg-slate-900">
              <div className="bg-slate-800 text-slate-300 px-6 py-3 border-b border-slate-700 flex justify-between items-center text-xs">
                <span className="font-semibold text-emerald-400 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LIVE DEMO TRADING TERMINAL ACTIVE</span>
                </span>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-white underline font-medium"
                >
                  ← Back to Main Website
                </button>
              </div>
              <TradingTerminal />
            </main>
          } 
        />

        <Route 
          path="/login" 
          element={
            <main className="flex-1">
              <LoginPage onNavigate={(page) => setActiveTab(page)} />
            </main>
          } 
        />

        <Route 
          path="/register" 
          element={
            <main className="flex-1">
              <RegisterPage onNavigate={(page) => setActiveTab(page)} />
            </main>
          } 
        />
      </Routes>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}