
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, Plus, Minus, ArrowUp, ArrowDown, 
  ShieldCheck, X, BarChart2, History, HelpCircle, User, Trophy, TrendingUp 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ASSETS, EXPIRY_TIMES } from './constants';
import Toast from './Toast';
import Header from './Header';
import Sidebar from './Sidebar';
import TradesDrawer from './TradesDrawer';

export default function TradingTerminal() {
  const navigate = useNavigate();

  // 1. Live Balance (Default 0 for new sessions unless logged in with balance)
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('trading_live_balance');
    return saved && !isNaN(Number(saved)) ? Number(saved) : 0;
  });

  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false);
  const [selectedExpiry, setSelectedExpiry] = useState(EXPIRY_TIMES[2]);
  const [investment, setInvestment] = useState(100);
  const [activeTab, setActiveTab] = useState('trade');

  const [activeTrades, setActiveTrades] = useState([]);

  // 2. Closed Trades Persistent State from LocalStorage
  const [closedTrades, setClosedTrades] = useState(() => {
    try {
      const saved = localStorage.getItem('trading_closed_trades');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [showTradesDrawer, setShowTradesDrawer] = useState(false);
  const [tradesDrawerTab, setTradesDrawerTab] = useState('active');

  const [toastNotification, setToastNotification] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0.69781);
  const [timerCountdown, setTimerCountdown] = useState(30);
  const [showBonus, setShowBonus] = useState(true);

  const processedTradeIdsRef = useRef(new Set());
  const canvasRef = useRef(null);
  
  // Real-looking candles data for canvas rendering
  const candlesRef = useRef([
    { open: 0.69830, high: 0.69920, low: 0.69800, close: 0.69880, timeLabel: '08:00' },
    { open: 0.69880, high: 0.69900, low: 0.69840, close: 0.69850, timeLabel: '09:00' },
    { open: 0.69850, high: 0.69890, low: 0.69810, close: 0.69860, timeLabel: '10:00' },
    { open: 0.69860, high: 0.69870, low: 0.69815, close: 0.69820, timeLabel: '11:00' },
    { open: 0.69820, high: 0.69910, low: 0.69780, close: 0.69800, timeLabel: '12:06' },
    { open: 0.69800, high: 0.69880, low: 0.69760, close: 0.69770, timeLabel: '13:15' },
    { open: 0.69770, high: 0.69950, low: 0.69760, close: 0.69940, timeLabel: '14:24' },
    { open: 0.69940, high: 0.70010, low: 0.69930, close: 0.70000, timeLabel: '15:30' },
    { open: 0.70000, high: 0.70071, low: 0.69950, close: 0.69970, timeLabel: '16:32' },
    { open: 0.69970, high: 0.69980, low: 0.69890, close: 0.69910, timeLabel: '17:40' },
    { open: 0.69910, high: 0.69930, low: 0.69860, close: 0.69880, timeLabel: '18:40' },
    { open: 0.69880, high: 0.69900, low: 0.69850, close: 0.69890, timeLabel: '19:44' },
    { open: 0.69890, high: 0.69940, low: 0.69760, close: 0.69781, timeLabel: '20:48' }
  ]);

  const currentPriceRef = useRef(currentPrice);
  useEffect(() => {
    currentPriceRef.current = currentPrice;
  }, [currentPrice]);

  const triggerToast = (msg, type = 'win') => {
    setToastNotification({ message: msg, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  const activeTradesRef = useRef(activeTrades);
  useEffect(() => {
    activeTradesRef.current = activeTrades;
  }, [activeTrades]);

  // Sync Live Balance to server with User Identification
  const syncBalanceToServer = async (newBal) => {
    try {
      const numBal = Number(newBal);
      localStorage.setItem('trading_live_balance', numBal.toString());
      try {
        const bc = new BroadcastChannel('trading_balance_sync');
        bc.postMessage({ balanceUSD: numBal });
        bc.close();
      } catch (e) {}

      const userId = localStorage.getItem('userId') || '';
      const email = localStorage.getItem('userEmail') || '';
      const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();

      // 1. Sync via Profile PUT (100% Isolated & Works on Vercel)
      if (userId) {
        await fetch(`${API_URL}/api/users/profile/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ balance: numBal })
        });
      }

      // 2. Also sync via payments endpoint
      await fetch(`${API_URL}/api/payments/set-user-balance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balanceUSD: numBal, userId, email })
      });
    } catch (err) {
      console.error('Error syncing balance to server:', err);
    }
  };

  // Fetch Live Balance specifically for the Logged-in User (Isolated)
  const fetchUserBalance = async () => {
    try {
      const userId = localStorage.getItem('userId') || '';
      const email = (localStorage.getItem('userEmail') || '').toLowerCase().trim();
      const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/['"]+/g, '').trim();

      if (activeTradesRef.current.length > 0) return;

      // Priority 1: User Profile Endpoint (Strictly Isolated by User ID)
      if (userId) {
        const profileRes = await fetch(`${API_URL}/api/users/profile/${userId}`);
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success && profileData.user && profileData.user.balance !== undefined) {
            const parsed = Number(profileData.user.balance);
            if (!isNaN(parsed) && activeTradesRef.current.length === 0) {
              setBalance(parsed);
              localStorage.setItem('trading_live_balance', parsed.toString());
              return;
            }
          }
        }
      }

      // Priority 2: Fallback to live-balance with User Guard
      const params = new URLSearchParams();
      if (userId) params.append('userId', userId);
      if (email) params.append('email', email);

      const res = await fetch(`${API_URL}/api/payments/live-balance?${params.toString()}`, {
        headers: { 'x-user-id': userId, 'x-user-email': email }
      });
      if (!res.ok) return;

      const data = await res.json();
      if (data.success) {
        // Balance Guard: If response email belongs to a different user, ignore it!
        const resEmail = (data.user?.email || '').toLowerCase().trim();
        if (email && resEmail && resEmail !== email) {
          return;
        }

        const rawBal = data.liveBalance ?? data.balance ?? data.user?.balance;
        if (rawBal !== undefined && rawBal !== null) {
          const parsed = Number(rawBal);
          if (!isNaN(parsed) && activeTradesRef.current.length === 0) {
            setBalance(parsed);
            localStorage.setItem('trading_live_balance', parsed.toString());
          }
        }
      }
    } catch (error) {
      console.error('Error fetching live balance:', error);
    }
  };

  useEffect(() => {
    fetchUserBalance();
    let channel;
    try {
      channel = new BroadcastChannel('trading_balance_sync');
      channel.onmessage = (event) => {
        if (event.data && typeof event.data.balanceUSD === 'number') {
          const newBal = Number(event.data.balanceUSD);
          setBalance(newBal);
          localStorage.setItem('trading_live_balance', newBal.toString());
        }
      };
    } catch (e) {}

    const handleStorage = (event) => {
      if (event.key === 'trading_live_balance' && event.newValue !== null) {
        const newBal = Number(event.newValue);
        if (!isNaN(newBal)) {
          setBalance(newBal);
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    const balanceInterval = setInterval(fetchUserBalance, 3000);
    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
      clearInterval(balanceInterval);
    };
  }, []);

  // Tick simulation for candlestick chart
  useEffect(() => {
    const interval = setInterval(() => {
      const delta = (Math.random() - 0.49) * 0.00012;

      candlesRef.current = candlesRef.current.map((candle, idx) => {
        if (idx === candlesRef.current.length - 1) {
          const newClose = +(candle.close + delta).toFixed(5);
          return {
            ...candle,
            close: newClose,
            high: Math.max(candle.high, newClose),
            low: Math.min(candle.low, newClose)
          };
        }
        return candle;
      });

      const latestCandle = candlesRef.current[candlesRef.current.length - 1];
      setCurrentPrice(latestCandle.close);

      setTimerCountdown((prev) => {
        if (prev <= 1) {
          const lastClose = candlesRef.current[candlesRef.current.length - 1].close;
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
          
          candlesRef.current.shift();
          candlesRef.current.push({
            open: lastClose,
            high: lastClose,
            low: lastClose,
            close: lastClose,
            timeLabel: timeStr
          });
          return 30;
        }
        return prev - 1;
      });

    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Trade Resolution Timer & Closed Trades Persistence
  useEffect(() => {
    const tradeInterval = setInterval(() => {
      setActiveTrades((prevTrades) => {
        if (prevTrades.length === 0) return prevTrades;

        const updatedTrades = [];

        prevTrades.forEach((trade) => {
          const newRemainingTime = trade.remainingTime - 1;

          if (newRemainingTime <= 0) {
            if (processedTradeIdsRef.current.has(trade.id)) return;
            processedTradeIdsRef.current.add(trade.id);

            const exitPrice = currentPriceRef.current;
            const isWin = 
              (trade.type === 'UP' && exitPrice > trade.entryPrice) ||
              (trade.type === 'DOWN' && exitPrice < trade.entryPrice);

            const returnAmount = isWin ? trade.amount + (trade.amount * (trade.payout / 100)) : 0;
            const profit = isWin ? trade.amount * (trade.payout / 100) : -trade.amount;

            if (isWin) {
              setBalance((b) => {
                const nextBal = +(b + returnAmount).toFixed(2);
                syncBalanceToServer(nextBal);
                return nextBal;
              });
              triggerToast(`+${returnAmount.toFixed(2)}$ Trade Won on ${trade.asset}!`, 'win');
            } else {
              triggerToast(`-${trade.amount}$ Trade Lost on ${trade.asset}`, 'loss');
            }

            const closedTrade = {
              ...trade,
              exitPrice,
              status: isWin ? 'WIN' : 'LOSS',
              profit: +profit.toFixed(2),
              returnAmount: +returnAmount.toFixed(2),
              closedAt: new Date().toLocaleTimeString()
            };

            // Save closed trade permanently to state and localStorage
            setClosedTrades((closed) => {
              const updated = [closedTrade, ...closed].slice(0, 50);
              try {
                localStorage.setItem('trading_closed_trades', JSON.stringify(updated));
              } catch (e) {}
              return updated;
            });
          } else {
            updatedTrades.push({
              ...trade,
              remainingTime: newRemainingTime
            });
          }
        });

        return updatedTrades;
      });
    }, 1000);

    return () => clearInterval(tradeInterval);
  }, []);

  // HTML5 Canvas Candlestick Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const renderChart = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const width = parent.clientWidth;
      const height = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      ctx.fillStyle = '#0d121d';
      ctx.fillRect(0, 0, width, height);

      const rightPadding = 60;
      const bottomPadding = 25;
      const chartHeight = height - bottomPadding;
      const chartWidth = width - rightPadding;

      ctx.strokeStyle = '#1d273a';
      ctx.lineWidth = 1;

      const minPrice = 0.69700;
      const maxPrice = 0.70050;
      const priceRange = maxPrice - minPrice;

      for (let p = 0.69750; p <= 0.70000; p += 0.00050) {
        const y = chartHeight - ((p - minPrice) / priceRange) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        ctx.fillStyle = '#616e85';
        ctx.font = '10px sans-serif';
        ctx.fillText(p.toFixed(5), width - 52, y - 4);
      }

      const candles = candlesRef.current;
      const candleWidth = Math.max(4, Math.floor((chartWidth - 20) / candles.length));

      candles.forEach((c, i) => {
        const x = i * candleWidth + 10;
        const openY = chartHeight - ((c.open - minPrice) / priceRange) * chartHeight;
        const closeY = chartHeight - ((c.close - minPrice) / priceRange) * chartHeight;
        const highY = chartHeight - ((c.high - minPrice) / priceRange) * chartHeight;
        const lowY = chartHeight - ((c.low - minPrice) / priceRange) * chartHeight;

        const isGreen = c.close >= c.open;
        const color = isGreen ? '#22c55e' : '#ef4444';

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, highY);
        ctx.lineTo(x + candleWidth / 2, lowY);
        ctx.stroke();

        ctx.fillStyle = color;
        const bodyY = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
        ctx.fillRect(x + 1, bodyY, Math.max(candleWidth - 2, 2), bodyHeight);

        if (c.timeLabel && (i % 2 === 0 || i === candles.length - 1)) {
          ctx.fillStyle = '#616e85';
          ctx.font = '9px sans-serif';
          ctx.fillText(c.timeLabel, x - 4, height - 8);
        }
      });

      const middleIndex = Math.floor(candles.length / 2);
      const verticalLineX = middleIndex * candleWidth + 10;

      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(verticalLineX, 0);
      ctx.lineTo(verticalLineX, chartHeight);
      ctx.stroke();
      ctx.setLineDash([]);

      activeTrades.forEach((trade) => {
        const tradeY = chartHeight - ((trade.entryPrice - minPrice) / priceRange) * chartHeight;
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = trade.type === 'UP' ? '#22c55e' : '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, tradeY);
        ctx.lineTo(chartWidth, tradeY);
        ctx.stroke();

        ctx.fillStyle = trade.type === 'UP' ? '#22c55e' : '#ef4444';
        ctx.fillRect(chartWidth - 55, tradeY - 10, 50, 18);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText(`${trade.type} $${trade.amount}`, chartWidth - 52, tradeY + 2);
      });

      const currentY = chartHeight - ((currentPrice - minPrice) / priceRange) * chartHeight;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, currentY);
      ctx.lineTo(chartWidth, currentY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#2563eb';
      ctx.fillRect(width - 58, currentY - 10, 56, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(currentPrice.toFixed(5), width - 54, currentY + 4);
    };

    renderChart();
    window.addEventListener('resize', renderChart);
    return () => window.removeEventListener('resize', renderChart);

  }, [currentPrice, timerCountdown, activeTrades]);

  const handleTrade = (type) => {
    const tradeAmt = Number(investment);
    if (!tradeAmt || tradeAmt <= 0) {
      triggerToast('Please enter a valid investment amount!', 'loss');
      return;
    }

    if (tradeAmt > balance) {
      triggerToast('Insufficient Live Balance!', 'loss');
      return;
    }

    const newTrade = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      asset: selectedAsset.symbol,
      payout: selectedAsset.payout,
      amount: tradeAmt,
      type: type,
      entryPrice: currentPrice,
      duration: selectedExpiry.seconds,
      remainingTime: selectedExpiry.seconds,
      time: new Date().toLocaleTimeString()
    };

    const newBal = +(balance - tradeAmt).toFixed(2);
    setBalance(newBal);
    syncBalanceToServer(newBal);

    setActiveTrades((prev) => [newTrade, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0d121d] text-gray-200 overflow-hidden font-sans select-none">
      
      {toastNotification && (
        <Toast 
          message={toastNotification.message} 
          type={toastNotification.type} 
          onClose={() => setToastNotification(null)} 
        />
      )}

      {/* Top Header */}
      <Header 
        balance={balance} 
        activeTradesCount={activeTrades.length}
        showTradesDrawer={showTradesDrawer}
        setShowTradesDrawer={setShowTradesDrawer}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          showTradesDrawer={showTradesDrawer}
          setShowTradesDrawer={setShowTradesDrawer}
          activeTradesCount={activeTrades.length}
        />

        {/* Center Chart */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0d121d]">
          {showBonus && (
            <div className="bg-[#22c55e] text-black text-xs font-bold py-1.5 px-4 flex justify-between items-center z-10">
              <div className="flex items-center space-x-2">
                <span>🚀 Get a <span className="underline cursor-pointer">50% bonus</span> on your deposit!</span>
              </div>
              <button onClick={() => setShowBonus(false)} className="hover:opacity-75">
                <X className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}

          {/* Asset Selector Header */}
          <div className="absolute top-8 left-4 z-20 flex items-center space-x-2">
            <button 
              onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
              className="flex items-center space-x-2 bg-[#121927]/90 backdrop-blur border border-gray-800 hover:border-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition shadow-lg cursor-pointer"
            >
              <span>{selectedAsset.flag}</span>
              <span>{selectedAsset.symbol}</span>
              <span className="text-emerald-400 text-[10px]">{selectedAsset.payout}%</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {isAssetDropdownOpen && (
              <div className="absolute top-10 left-0 bg-[#121927] border border-gray-800 rounded-lg shadow-2xl p-1 w-48 z-30 space-y-0.5">
                {ASSETS.map((asset) => (
                  <div
                    key={asset.symbol}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setIsAssetDropdownOpen(false);
                    }}
                    className="flex justify-between items-center px-3 py-2 hover:bg-[#182335] rounded-md cursor-pointer text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span>{asset.flag}</span>
                      <span className="font-semibold text-white">{asset.symbol}</span>
                    </div>
                    <span className="text-emerald-400 text-[10px] font-bold">{asset.payout}%</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 relative w-full h-full">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
          </div>

          {/* Mobile Bottom Control Sheet */}
          <div className="md:hidden bg-[#121927] border-t border-gray-800 p-2.5 space-y-2 z-20">
            <div className="grid grid-cols-5 gap-1">
              {EXPIRY_TIMES.slice(0, 5).map((t) => (
                <button
                  key={t.label}
                  onClick={() => setSelectedExpiry(t)}
                  className={`py-1 rounded text-[10px] font-bold transition ${
                    selectedExpiry.seconds === t.seconds
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1a2332] text-gray-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#1a2332] border border-gray-700/80 rounded-lg p-1.5 flex flex-col justify-center">
                <span className="text-[9px] text-gray-400">Duration</span>
                <span className="text-xs font-bold text-white">{selectedExpiry.label}</span>
              </div>

              {/* Mobile Investment Amount with Direct Typing */}
              <div className="bg-[#1a2332] border border-gray-700/80 rounded-lg p-1.5 relative">
                <span className="text-[9px] text-gray-400">Investment</span>
                <div className="flex justify-between items-center mt-0.5">
                  <button onClick={() => setInvestment(p => Math.max(1, p - 10))} className="w-5 h-5 bg-[#253247] rounded flex items-center justify-center text-gray-300">
                    <Minus className="w-3 h-3" />
                  </button>
                  <div className="flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-400 mr-0.5">$</span>
                    <input 
                      type="number"
                      min="1"
                      value={investment}
                      onChange={(e) => setInvestment(Math.max(1, Number(e.target.value) || 0))}
                      className="w-14 bg-transparent text-center font-mono text-xs font-bold text-white outline-none"
                    />
                  </div>
                  <button onClick={() => setInvestment(p => p + 10)} className="w-5 h-5 bg-[#253247] rounded flex items-center justify-center text-gray-300">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs px-1">
              <span className="text-gray-400 text-[10px]">Payout (+{selectedAsset.payout}%):</span>
              <span className="text-emerald-400 font-bold text-xs">${(investment + (investment * selectedAsset.payout / 100)).toFixed(0)}</span>
            </div>

            {/* Mobile Buy & Sell Buttons with Equal Arrow Alignment */}
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleTrade('UP')}
                className="bg-[#22c55e] active:scale-95 text-black font-extrabold py-2.5 rounded-lg flex items-center justify-between px-4 text-sm shadow transition"
              >
                <span>Buy</span>
                <ArrowUp className="w-4 h-4 stroke-[3] text-black" />
              </button>

              <button 
                onClick={() => handleTrade('DOWN')}
                className="bg-[#ef4444] active:scale-95 text-white font-extrabold py-2.5 rounded-lg flex items-center justify-between px-4 text-sm shadow transition"
              >
                <span>Sell</span>
                <ArrowDown className="w-4 h-4 stroke-[3] text-white" />
              </button>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <div className="flex justify-around items-center pt-1 border-t border-gray-800 text-gray-400">
              <button onClick={() => setActiveTab('trade')} className={`flex flex-col items-center ${activeTab === 'trade' ? 'text-emerald-400' : ''}`}>
                <BarChart2 className="w-4 h-4" />
                <span className="text-[8px]">Trade</span>
              </button>
              <button onClick={() => setShowTradesDrawer(!showTradesDrawer)} className={`flex flex-col items-center relative ${showTradesDrawer ? 'text-blue-400' : ''}`}>
                <History className="w-4 h-4" />
                {activeTrades.length > 0 && (
                  <span className="absolute -top-1 right-0 bg-emerald-500 text-black text-[7px] rounded-full px-1 font-bold">
                    {activeTrades.length}
                  </span>
                )}
                <span className="text-[8px]">Trades</span>
              </button>
              <button onClick={() => navigate('/support')} className="flex flex-col items-center">
                <HelpCircle className="w-4 h-4" />
                <span className="text-[8px]">Support</span>
              </button>
              <button onClick={() => navigate('/account')} className="flex flex-col items-center">
                <User className="w-4 h-4" />
                <span className="text-[8px]">Account</span>
              </button>
              <button onClick={() => navigate('/tournment/active')} className="flex flex-col items-center">
                <Trophy className="w-4 h-4" />
                <span className="text-[8px]">Tournaments</span>
              </button>
              <button onClick={() => navigate('/invest')} className="flex flex-col items-center">
                <TrendingUp className="w-4 h-4" />
                <span className="text-[8px]">Invest</span>
              </button>
            </div>
          </div>
        </main>

        {/* Right Trading Sidebar (Desktop) */}
        <aside className="w-72 bg-[#121927] border-l border-gray-800 p-4 hidden md:flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            
            {/* Asset Selector */}
            <div 
              onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
              className="flex justify-between items-center bg-[#182335] p-2.5 rounded-lg border border-gray-800 cursor-pointer hover:border-gray-700 transition"
            >
              <div className="flex items-center space-x-2">
                <span className="text-base">{selectedAsset.flag}</span>
                <div>
                  <div className="text-xs font-bold text-white">{selectedAsset.symbol}</div>
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center">
                    <ShieldCheck className="w-3 h-3 mr-0.5" /> Payout: {selectedAsset.payout}%
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>

            {/* Expiration Time */}
            <div>
              <div className="text-[11px] text-gray-400 mb-1.5">Expiration Time</div>
              <div className="grid grid-cols-3 gap-1.5">
                {EXPIRY_TIMES.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setSelectedExpiry(t)}
                    className={`py-1.5 rounded-md text-xs font-bold border transition cursor-pointer ${
                      selectedExpiry.seconds === t.seconds
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-[#182335] border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Investment Amount with Direct Typing Input */}
            <div>
              <div className="text-[11px] text-gray-400 mb-1">Investment Amount</div>
              <div className="flex items-center bg-[#182335] border border-gray-700 rounded-lg p-1.5 justify-between">
                <button onClick={() => setInvestment(p => Math.max(1, p - 10))} className="p-1 text-gray-300 hover:text-white cursor-pointer">
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-400 mr-0.5">$</span>
                  <input 
                    type="number"
                    min="1"
                    value={investment}
                    onChange={(e) => setInvestment(Math.max(1, Number(e.target.value) || 0))}
                    className="w-20 bg-transparent text-center font-mono text-sm font-bold text-white outline-none"
                  />
                </div>
                <button onClick={() => setInvestment(p => p + 10)} className="p-1 text-gray-300 hover:text-white cursor-pointer">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Select Presets */}
              <div className="grid grid-cols-4 gap-1 mt-2">
                {[10, 50, 100, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setInvestment(amt)}
                    className={`text-[10px] font-bold py-1 rounded transition border cursor-pointer ${
                      investment === amt ? 'bg-blue-600 border-blue-500 text-white' : 'bg-[#182335] text-gray-300 border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Payout Calculation */}
            <div className="flex justify-between items-center text-xs py-2 border-t border-b border-gray-800">
              <span className="text-gray-400">Payout (+{selectedAsset.payout}%):</span>
              <span className="text-emerald-400 font-bold text-base">
                ${(investment + (investment * selectedAsset.payout / 100)).toFixed(0)}
              </span>
            </div>

            {/* Buy and Sell Action Buttons (Right-aligned Arrows on Both) */}
            <div className="space-y-2 pt-1">
              <button 
                onClick={() => handleTrade('UP')}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-between px-5 transition shadow-lg cursor-pointer"
              >
                <span className="text-base font-bold">Buy</span>
                <ArrowUp className="w-5 h-5 stroke-[3]" />
              </button>

              <button 
                onClick={() => handleTrade('DOWN')}
                className="w-full bg-[#ef4444] hover:bg-red-600 active:scale-95 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-between px-5 transition shadow-lg cursor-pointer"
              >
                <span className="text-base font-bold">Sell</span>
                <ArrowDown className="w-5 h-5 stroke-[3]" />
              </button>
            </div>

          </div>
        </aside>

        {/* Persistent Trades Drawer (Active & Closed Trades History) */}
        <TradesDrawer 
          showTradesDrawer={showTradesDrawer}
          setShowTradesDrawer={setShowTradesDrawer}
          tradesDrawerTab={tradesDrawerTab}
          setTradesDrawerTab={setTradesDrawerTab}
          activeTrades={activeTrades}
          closedTrades={closedTrades}
        />

      </div>
    </div>
  );
}