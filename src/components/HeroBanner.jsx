

import React, { useState } from 'react';
import { 
  BarChart3, 
  Zap, 
  Wallet, 
  CheckCircle2, 
  TrendingUp, 
  Gift, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export default function HeroBanner({ onStartTrading }) {
  // Testimonials Slider State
  const testimonials = [
    {
      quote: "What I love most about XM is its stability as a broker. Whether it's trading or customer support, they always provide excellent service. Plus, their consistent and exciting promotions make the experience even better. I can definitely recommend them!",
      author: "Trader from Singapore"
    },
    {
      quote: "XM provides lightning fast execution with zero rejections. The withdrawal process is smooth and instant. Best trading platform I have used so far!",
      author: "Trader from Malaysia"
    },
    {
      quote: "The 100% bonus and low spreads on Gold and Forex gave my portfolio a huge boost. Customer support is always ready to help 24/7.",
      author: "Trader from India"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="w-full bg-white text-gray-900 font-sans">
      
      {/* 1. HERO MAIN BANNER SECTION */}
      <section className="border-b border-gray-100 py-12 md:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 max-w-xl">
            <p className="text-[#3b82f6] font-bold text-sm tracking-wide uppercase">
              SAIF HAS INVITED YOU TO JOIN XM
            </p>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0f172a] leading-[1.1] tracking-tight">
              Trade More With a <br className="hidden sm:inline" />
              100% Bonus
            </h1>
            
            <p className="text-gray-600 text-base sm:text-lg font-normal leading-relaxed">
              Increase your trading power with a 100% bonus up to $100 on your deposits!*
            </p>
            
            <div className="pt-2">
              <button
                onClick={onStartTrading}
                className="bg-[#0c192c] hover:bg-slate-800 text-white font-bold text-base px-8 py-3.5 rounded-md shadow-md transition duration-200"
              >
                Start Trading
              </button>
            </div>
            
            <p className="text-[11px] text-gray-400 font-normal">
              Limited-time offer. Bonus isn't withdrawable, only profits are. T&Cs apply.
            </p>
          </div>

          {/* Right Image Visual */}
          <div className="flex justify-center md:justify-end items-center w-full">
            <img
              src="https://cloud.xm-cdn.com/web/xmbz/ng-public/assets/img/referral/raf-hero-1246w.webp"
              alt="XM Referral Program"
              className="w-full max-w-lg md:max-w-none h-auto object-contain drop-shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* 2. GET STARTED EASILY SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a]">
              Get Started Easily
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              Make the most of your bonus and unlock all your opportunities and benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-4">
            {/* Step 01 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="relative text-7xl sm:text-8xl font-black text-blue-600 tracking-tighter transition-transform duration-300 group-hover:-translate-y-1">
                01
                <div className="w-full h-2 bg-gradient-to-t from-gray-200/60 to-transparent absolute bottom-1 left-0 rounded-full"></div>
              </div>
              <p className="font-bold text-gray-900 text-base sm:text-lg max-w-xs leading-snug">
                Open and verify your XM Real Account.
              </p>
            </div>

            {/* Step 02 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="relative text-7xl sm:text-8xl font-black text-blue-600 tracking-tighter transition-transform duration-300 group-hover:-translate-y-1">
                02
                <div className="w-full h-2 bg-gradient-to-t from-gray-200/60 to-transparent absolute bottom-1 left-0 rounded-full"></div>
              </div>
              <p className="font-bold text-gray-900 text-base sm:text-lg max-w-xs leading-snug">
                Make a deposit into your account.
              </p>
            </div>

            {/* Step 03 */}
            <div className="flex flex-col items-center text-center space-y-4 group">
              <div className="relative text-7xl sm:text-8xl font-black text-blue-600 tracking-tighter transition-transform duration-300 group-hover:-translate-y-1">
                03
                <div className="w-full h-2 bg-gradient-to-t from-gray-200/60 to-transparent absolute bottom-1 left-0 rounded-full"></div>
              </div>
              <p className="font-bold text-gray-900 text-base sm:text-lg max-w-xs leading-snug">
                Start trading forex, gold, silver, and more.*
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 pt-6">
            Limited-time offer. Bonus isn't withdrawable, only profits are. T&Cs apply.
          </p>
        </div>
      </section>

      {/* 3. WHY TRADE WITH US? (DARK THEME CARDS) SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#030712] text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why Trade With Us?
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              We have just what you need to maximise your trading potential. Join over 20 million XM traders worldwide!
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-[#0b1329] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-slate-700 transition duration-300">
              <div className="w-12 h-12 rounded-full bg-slate-800/70 border border-slate-700 flex items-center justify-center text-blue-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Leverage up to 1000:1</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Take advantage of trading opportunities with flexible leverage up to 1000:1.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0b1329] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-slate-700 transition duration-300">
              <div className="w-12 h-12 rounded-full bg-slate-800/70 border border-slate-700 flex items-center justify-center text-blue-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Ultra-Fast Execution</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Execute trades in milliseconds and open trades at the price you want.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0b1329] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-slate-700 transition duration-300">
              <div className="w-12 h-12 rounded-full bg-slate-800/70 border border-slate-700 flex items-center justify-center text-blue-400">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Instant Withdrawals</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Withdraw your funds instantly, securely, and with 0 fees — 24/7, even on weekends.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0b1329] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-slate-700 transition duration-300">
              <div className="w-12 h-12 rounded-full bg-slate-800/70 border border-slate-700 flex items-center justify-center text-blue-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">No Rejections</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Trade with the advantage of no rejections and increase your chances of profiting.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-[#0b1329] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-slate-700 transition duration-300">
              <div className="w-12 h-12 rounded-full bg-slate-800/70 border border-slate-700 flex items-center justify-center text-blue-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Low Spreads</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Get low spreads with 0 swaps, 0 commission, and no hidden fees.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-[#0b1329] border border-slate-800/80 rounded-2xl p-6 sm:p-8 space-y-4 hover:border-slate-700 transition duration-300">
              <div className="w-12 h-12 rounded-full bg-slate-800/70 border border-slate-700 flex items-center justify-center text-blue-400">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Year-Round Bonuses</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Use XM bonuses to increase your capital, open larger trades, and seize more opportunities.
              </p>
            </div>
          </div>

          <div className="text-center pt-6">
            <button
              onClick={onStartTrading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-base px-8 py-3.5 rounded-lg transition duration-200 shadow-lg shadow-blue-600/30"
            >
              Start Trading
            </button>
          </div>
        </div>
      </section>

      {/* 4. REAL FEEDBACK, REAL ADVANTAGES SLIDER SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a]">
              Real Feedback, Real Advantages
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              Discover what traders think about their journey with XM.
            </p>
          </div>

          {/* Testimonial Box */}
          <div className="bg-[#f8fafc] rounded-3xl p-8 sm:p-14 text-center space-y-8 border border-slate-100 shadow-sm relative">
            <p className="text-lg sm:text-2xl font-semibold text-gray-800 leading-relaxed max-w-3xl mx-auto">
              "{testimonials[currentSlide].quote}"
            </p>

            <div className="text-xs sm:text-sm font-medium text-gray-500">
              {testimonials[currentSlide].author}
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center items-center space-x-3 pt-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-200/60 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-200/60 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}