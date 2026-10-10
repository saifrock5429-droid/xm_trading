

// import React from 'react';
// import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import HeroBanner from './components/HeroBanner';
// import Promos from './components/Promos';
// import TradingTerminal from './components/TradingTerminal';
// import DepositPage from './components/DepositPage';
// import LoginPage from './components/LoginPage';
// import RegisterPage from './components/RegisterPage';
// import Tournaments from './components/Tournaments';
// import AccountPage from './components/AccountPage';
// import Market from './components/Market';
// import SupportPage from './components/SupportPage';
// import MorePage from './components/MorePage';
// import Footer from './components/Footer';
// import AdminPanel from './components/AdminPanel'; // Admin Component Added

// export default function App() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const getActiveTab = () => {
//     const path = location.pathname;
//     if (path === '/') return 'home';
//     if (path === '/promotions') return 'promotions';
//     if (path === '/terminal' || path.startsWith('/terminal/')) return 'terminal';
//     if (path.startsWith('/tournment')) return 'tournment';
//     if (path === '/account') return 'account';
//     if (path === '/market') return 'market';
//     if (path === '/support') return 'support';
//     if (path === '/more') return 'more';
//     if (path === '/login') return 'login';
//     if (path === '/register') return 'register';
//     return 'home';
//   };

//   const setActiveTab = (tab) => {
//     switch (tab) {
//       case 'home': navigate('/'); break;
//       case 'promotions': navigate('/promotions'); break;
//       case 'terminal': navigate('/terminal'); break;
//       case 'tournment': navigate('/tournment/active'); break;
//       case 'account': navigate('/account'); break;
//       case 'market': navigate('/market'); break;
//       case 'support': navigate('/support'); break;
//       case 'more': navigate('/more'); break;
//       case 'login': navigate('/login'); break;
//       case 'register': navigate('/register'); break;
//       default: navigate('/'); break;
//     }
//   };

//   // Full-screen layout check (Admin Panel added to prevent header/footer collision)
//   const isFullScreenApp = 
//     location.pathname.startsWith('/terminal') || 
//     location.pathname.startsWith('/tournment') || 
//     location.pathname === '/deposit' ||
//     location.pathname === '/account' ||
//     location.pathname === '/market' ||
//     location.pathname === '/support' ||
//     location.pathname === '/more' ||
//     location.pathname.startsWith('/admin');

//   const showNavbarAndFooter = location.pathname !== '/login' && location.pathname !== '/register' && !isFullScreenApp;

//   return (
//     <div className="min-h-screen flex flex-col bg-[#0d121d] text-gray-100 font-sans antialiased">

//       {/* Top Navbar */}
//       {showNavbarAndFooter && <Navbar activeTab={getActiveTab()} setActiveTab={setActiveTab} />}

//       {/* Routes */}
//       <Routes>
//         <Route 
//           path="/" 
//           element={
//             <main className="flex-1 bg-white text-gray-900">
//               <HeroBanner onStartTrading={() => navigate('/register')} />
//             </main>
//           } 
//         />

//         <Route 
//           path="/promotions" 
//           element={
//             <main className="flex-1 py-8 bg-white text-gray-900">
//               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
//                 <h1 className="text-3xl font-extrabold text-gray-900">All XM Promotions</h1>
//                 <p className="text-gray-600 mt-2">Explore our exclusive rewards, deposit bonuses, and trading competitions.</p>
//               </div>
//               <Promos onStartTrading={() => navigate('/register')} />
//             </main>
//           } 
//         />

//         {/* TRADING TERMINAL */}
//         <Route 
//           path="/terminal" 
//           element={
//             <main className="flex-1 w-full h-screen overflow-hidden">
//               <TradingTerminal />
//             </main>
//           } 
//         />

//         {/* SUPPORT ROUTE */}
//         <Route path="/support" element={<SupportPage />} />

//         {/* MORE PAGE ROUTE */}
//         <Route path="/more" element={<MorePage />} />

//         {/* MARKET ROUTE */}
//         <Route path="/market" element={<Market />} />

//         {/* ACCOUNT ROUTE */}
//         <Route path="/account" element={<AccountPage />} />

//         {/* TOURNAMENT ROUTES */}
//         <Route path="/tournment" element={<Navigate to="/tournment/active" replace />} />
//         <Route path="/tournment/:tab" element={<Tournaments />} />

//         {/* DEPOSIT ROUTES */}
//         <Route path="/terminal/deposit" element={<DepositPage />} />
//         <Route path="/deposit" element={<DepositPage />} />

//         {/* ADMIN ROUTE */}
//         <Route path="/admin/payments" element={<AdminPanel />} />

//         {/* AUTH ROUTES */}
//         <Route path="/login" element={<main className="flex-1"><LoginPage onNavigate={(page) => setActiveTab(page)} /></main>} />
//         <Route path="/register" element={<main className="flex-1"><RegisterPage onNavigate={(page) => setActiveTab(page)} /></main>} />
//       </Routes>

//       {/* Footer */}
//       {showNavbarAndFooter && <Footer />}
//     </div>
//   );
// }

import React from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import Promos from './components/Promos';
import TradingTerminal from './components/TradingTerminal';
import DepositPage from './components/DepositPage';
import WithdrawalPage from './components/WithdrawalPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Tournaments from './components/Tournaments';
import AccountPage from './components/AccountPage';
import Market from './components/Market';
import SupportPage from './components/SupportPage';
import MorePage from './components/MorePage';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/promotions') return 'promotions';
    if (path === '/terminal' || path.startsWith('/terminal/')) return 'terminal';
    if (path.startsWith('/tournment')) return 'tournment';
    if (path === '/account') return 'account';
    if (path === '/market') return 'market';
    if (path === '/support') return 'support';
    if (path === '/more') return 'more';
    if (path === '/login') return 'login';
    if (path === '/register') return 'register';
    return 'home';
  };

  const setActiveTab = (tab) => {
    switch (tab) {
      case 'home': navigate('/'); break;
      case 'promotions': navigate('/promotions'); break;
      case 'terminal': navigate('/terminal'); break;
      case 'tournment': navigate('/tournment/active'); break;
      case 'account': navigate('/account'); break;
      case 'market': navigate('/market'); break;
      case 'support': navigate('/support'); break;
      case 'more': navigate('/more'); break;
      case 'login': navigate('/login'); break;
      case 'register': navigate('/register'); break;
      default: navigate('/'); break;
    }
  };

  const isFullScreenApp = 
    location.pathname.startsWith('/terminal') || 
    location.pathname.startsWith('/tournment') || 
    location.pathname === '/deposit' ||
    location.pathname === '/account' ||
    location.pathname === '/market' ||
    location.pathname === '/support' ||
    location.pathname === '/more' ||
    location.pathname.startsWith('/admin');

  const showNavbarAndFooter = location.pathname !== '/login' && location.pathname !== '/register' && !isFullScreenApp;

  return (
    <div className="min-h-screen flex flex-col bg-[#0d121d] text-gray-100 font-sans antialiased">

      {showNavbarAndFooter && <Navbar activeTab={getActiveTab()} setActiveTab={setActiveTab} />}

      <Routes>
        <Route 
          path="/" 
          element={
            <main className="flex-1 bg-white text-gray-900">
              <HeroBanner onStartTrading={() => navigate('/register')} />
            </main>
          } 
        />

        <Route 
          path="/promotions" 
          element={
            <main className="flex-1 py-8 bg-white text-gray-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">All XM Promotions</h1>
                <p className="text-gray-600 mt-2">Explore our exclusive rewards, deposit bonuses, and trading competitions.</p>
              </div>
              <Promos onStartTrading={() => navigate('/register')} />
            </main>
          } 
        />

        {/* TRADING TERMINAL */}
        <Route 
          path="/terminal" 
          element={
            <main className="flex-1 w-full h-screen overflow-hidden">
              <TradingTerminal />
            </main>
          } 
        />

        {/* SUPPORT ROUTE */}
        <Route path="/support" element={<SupportPage />} />

        {/* MORE PAGE ROUTE */}
        <Route path="/more" element={<MorePage />} />

        {/* MARKET ROUTE */}
        <Route path="/market" element={<Market />} />

        {/* ACCOUNT ROUTE */}
        <Route path="/account" element={<AccountPage />} />

        {/* TOURNAMENT ROUTES */}
        <Route path="/tournment" element={<Navigate to="/tournment/active" replace />} />
        <Route path="/tournment/:tab" element={<Tournaments />} />

        {/* DEPOSIT ROUTES */}
        <Route path="/terminal/deposit" element={<DepositPage />} />
        <Route path="/deposit" element={<DepositPage />} />

        {/* WITHDRAWAL ROUTES */}
        <Route path="/terminal/withdrawal" element={<WithdrawalPage />} />
        <Route path="/withdrawal" element={<WithdrawalPage />} />

        {/* ADMIN ROUTE */}
        <Route path="/admin/payments" element={<AdminPanel />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<main className="flex-1"><LoginPage onNavigate={(page) => setActiveTab(page)} /></main>} />
        <Route path="/register" element={<main className="flex-1"><RegisterPage onNavigate={(page) => setActiveTab(page)} /></main>} />
      </Routes>

      {showNavbarAndFooter && <Footer />}
    </div>
  );
}