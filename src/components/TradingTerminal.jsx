

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, Plus, Minus, ArrowUp, ArrowDown, 
  ShieldCheck, X 
} from 'lucide-react';

import { ASSETS, EXPIRY_TIMES } from './constants';
import Toast from './Toast';
import Header from './Header';
import Sidebar from './Sidebar';
import TradesDrawer from './TradesDrawer';

export default function TradingTerminal() {
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
  const [closedTrades, setClosedTrades] = useState([]);
  const [showTradesDrawer, setShowTradesDrawer] = useState(false);
  const [tradesDrawerTab, setTradesDrawerTab] = useState('active');

  const [toastNotification, setToastNotification] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0.69781);
  const [timerCountdown, setTimerCountdown] = useState(30);
  const [showBonus, setShowBonus] = useState(true);

  const processedTradeIdsRef = useRef(new Set());
  const canvasRef = useRef(null);
  
  // Candles with timestamps for 08:00, 10:00, 12:06 style axis
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

  const syncBalanceToServer = async (newBal) => {
    try {
      const numBal = Number(newBal);
      localStorage.setItem('trading_live_balance', numBal.toString());
      try {
        const bc = new BroadcastChannel('trading_balance_sync');
        bc.postMessage({ balanceUSD: numBal });
        bc.close();
      } catch (e) {}

      await fetch(`${process.env.REACT_APP_API_URL}/api/payments/set-user-balance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balanceUSD: numBal })
      });
    } catch (err) {
      console.error('Error syncing balance to server:', err);
    }
  };

  const fetchUserBalance = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/payments/live-balance`);
      if (!res.ok) return;

      const data = await res.json();
      if (data.success) {
        const rawBal = data.liveBalance ?? data.balance ?? data.user?.balance;
        if (rawBal !== undefined && rawBal !== null) {
          const parsed = Number(rawBal);
          if (!isNaN(parsed)) {
            if (activeTradesRef.current.length === 0) {
              setBalance(parsed);
              localStorage.setItem('trading_live_balance', parsed.toString());
            }
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

    const balanceInterval = setInterval(fetchUserBalance, 1000);
    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
      clearInterval(balanceInterval);
    };
  }, []);

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

            setClosedTrades((closed) => [closedTrade, ...closed]);
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

  // Canvas rendering with vertical lines, timeframe labels, and mobile responsiveness
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

      // Horizontal Grid Lines & Price Axis
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

      // Draw Candlesticks & Time Labels at Bottom
      candles.forEach((c, i) => {
        const x = i * candleWidth + 10;
        const openY = chartHeight - ((c.open - minPrice) / priceRange) * chartHeight;
        const closeY = chartHeight - ((c.close - minPrice) / priceRange) * chartHeight;
        const highY = chartHeight - ((c.high - minPrice) / priceRange) * chartHeight;
        const lowY = chartHeight - ((c.low - minPrice) / priceRange) * chartHeight;

        const isGreen = c.close >= c.open;
        const color = isGreen ? '#22c55e' : '#ef4444';

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + candleWidth / 2, highY);
        ctx.lineTo(x + candleWidth / 2, lowY);
        ctx.stroke();

        ctx.fillStyle = color;
        const bodyY = Math.min(openY, closeY);
        const bodyHeight = Math.max(Math.abs(closeY - openY), 3);
        ctx.fillRect(x + 1, bodyY, Math.max(candleWidth - 2, 2), bodyHeight);

        // Bottom Time Axis Labels (e.g., 08:00, 10:00, 12:06)
        if (c.timeLabel && (i % 2 === 0 || i === candles.length - 1)) {
          ctx.fillStyle = '#616e85';
          ctx.font = '9px sans-serif';
          ctx.fillText(c.timeLabel, x - 4, height - 8);
        }
      });

      // --- VERTICAL TIMELINE LINE (Without Text Labels) ---
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

      // Active Trades Entry Lines
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

      // Current Price Line
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
    if (investment > balance) {
      triggerToast('Insufficient Balance!', 'loss');
      return;
    }

    const newTrade = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      asset: selectedAsset.symbol,
      payout: selectedAsset.payout,
      amount: investment,
      type: type,
      entryPrice: currentPrice,
      duration: selectedExpiry.seconds,
      remainingTime: selectedExpiry.seconds,
      time: new Date().toLocaleTimeString()
    };

    const newBal = +(balance - investment).toFixed(2);
    setBalance(newBal);
    syncBalanceToServer(newBal);
    setActiveTrades((prev) => [newTrade, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full max-w-full bg-[#0d121d] text-gray-200 overflow-hidden font-sans select-none relative">

      <Toast toastNotification={toastNotification} />

      <Header 
        balance={balance} 
        showTradesDrawer={showTradesDrawer} 
        setShowTradesDrawer={setShowTradesDrawer} 
        activeTradesCount={activeTrades.length} 
      />

      {showBonus && (
        <div className="bg-[#1bb954] text-white text-xs py-1 px-3 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span>🚀</span>
            <span className="font-semibold text-[10px] sm:text-xs truncate">
              Get a <strong className="underline">50% bonus</strong> on your deposit!
            </span>
            <span className="bg-[#14863c] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0">50%</span>
          </div>
          <button onClick={() => setShowBonus(false)} className="text-white hover:opacity-80 ml-2 shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative">

        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          showTradesDrawer={showTradesDrawer} 
          setShowTradesDrawer={setShowTradesDrawer} 
          activeTradesCount={activeTrades.length} 
        />

        <main className="flex-1 flex flex-col relative bg-[#0d121d] overflow-hidden">
           
          <div className="absolute top-3 left-3 z-20 flex items-center space-x-2">
            <div className="relative">
              <button 
                onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
                className="flex items-center space-x-2 bg-[#182335]/90 backdrop-blur px-3 py-1.5 rounded-lg border border-gray-700 hover:border-gray-500 transition cursor-pointer"
              >
                <span className="text-base">{selectedAsset.flag}</span>
                <span className="text-xs font-bold text-white">{selectedAsset.symbol}</span>
                <span className="text-xs text-emerald-400 font-bold">{selectedAsset.payout}%</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {isAssetDropdownOpen && (
                <div className="absolute top-10 left-0 w-56 bg-[#121927] border border-gray-700 rounded-lg shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 border-b border-gray-800">
                    SELECT ASSET PAIR
                  </div>
                  {ASSETS.map((asset) => (
                    <button
                      key={asset.symbol}
                      onClick={() => {
                        setSelectedAsset(asset);
                        setIsAssetDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-[#1c2638] transition cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <span>{asset.flag}</span>
                        <span className="font-bold text-white">{asset.symbol}</span>
                      </div>
                      <span className="text-emerald-400 font-bold">{asset.payout}%</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 relative w-full h-full min-h-[160px]">
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Mobile bottom controls optimized for all phone sizes */}
          <div className="bg-[#121927] border-t border-gray-800 p-2 sm:p-3 space-y-2 md:hidden shrink-0">
            <div className="flex justify-between items-center space-x-1">
              {EXPIRY_TIMES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => setSelectedExpiry(t)}
                  className={`flex-1 py-1 rounded text-[10px] font-bold ${
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

              <div className="bg-[#1a2332] border border-gray-700/80 rounded-lg p-1.5 relative">
                <span className="text-[9px] text-gray-400">Investment</span>
                <div className="flex justify-between items-center mt-0.5">
                  <button onClick={() => setInvestment(p => Math.max(10, p - 10))} className="w-5 h-5 bg-[#253247] rounded flex items-center justify-center text-gray-300">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-white">${investment}</span>
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
          </div>
        </main>

        <aside className="w-72 bg-[#121927] border-l border-gray-800 p-4 hidden md:flex flex-col justify-between shrink-0">
          <div className="space-y-4">
            <div 
              onClick={() => setIsAssetDropdownOpen(!isAssetDropdownOpen)}
              className="flex justify-between items-center bg-[#182335] p-2.5 rounded-lg border border-gray-800 cursor-pointer"
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

            <div>
              <div className="text-[11px] text-gray-400 mb-1.5">Expiration Time</div>
              <div className="grid grid-cols-3 gap-1.5">
                {EXPIRY_TIMES.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setSelectedExpiry(t)}
                    className={`py-1.5 rounded-md text-xs font-bold border transition ${
                      selectedExpiry.seconds === t.seconds
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-[#182335] border-gray-800 text-gray-400'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-gray-400 mb-1">Investment Amount</div>
              <div className="flex items-center bg-[#182335] border border-gray-700 rounded-lg p-1.5 justify-between">
                <button onClick={() => setInvestment(p => Math.max(10, p - 10))} className="p-1 text-gray-300"><Minus className="w-4 h-4" /></button>
                <div className="font-mono text-sm font-bold text-white">${investment}</div>
                <button onClick={() => setInvestment(p => p + 10)} className="p-1 text-gray-300"><Plus className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-4 gap-1 mt-2">
                {[10, 50, 100, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setInvestment(amt)}
                    className="bg-[#182335] text-[10px] font-bold py-1 rounded text-gray-300 border border-gray-800"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs py-2 border-t border-b border-gray-800">
              <span className="text-gray-400">Payout (+{selectedAsset.payout}%):</span>
              <span className="text-emerald-400 font-bold text-base">
                ${(investment + (investment * selectedAsset.payout / 100)).toFixed(0)}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <button 
                onClick={() => handleTrade('UP')}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold py-3.5 rounded-xl flex items-center justify-between px-5 transition shadow-lg"
              >
                <span className="text-base">Buy</span>
                <ArrowUp className="w-5 h-5 stroke-[3]" />
              </button>

              <button 
                onClick={() => handleTrade('DOWN')}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-between px-5 transition shadow-lg"
              >
                <span className="text-base">Sell</span>
                <ArrowDown className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>
        </aside>

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