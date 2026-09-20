import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function Footer() {
  const [showRiskBanner, setShowRiskBanner] = useState(true);

  return (
    <footer className="bg-[#ebedf0] text-[#333333] font-sans pt-10 pb-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. Top Section - Social Links */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 pb-8 gap-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Feel connected anytime, anywhere.
          </h3>
          {/* <div className="flex items-center space-x-2">
            {['f', 'i', 'x', 'yt', 'in', 'tk', 'tg'].map((item, idx) => (
              <a
                key={idx}
                href="#social"
                className="w-9 h-9 rounded-lg bg-gray-200/80 hover:bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-bold transition"
              >
                {item.toUpperCase()}
              </a>
            ))}
          </div> */}
        </div>

        {/* 2. Navigation Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs pt-2">
          {/* Column 1 */}
          <div>
            <h4 className="text-gray-400 font-bold tracking-wider uppercase mb-4 text-[11px]">
              WHY TRADE WITH US
            </h4>
            <ul className="space-y-2.5 font-medium text-gray-800">
              <li className="hover:text-blue-600 cursor-pointer">Our Key Advantages</li>
              <li className="hover:text-blue-600 cursor-pointer">Bonus</li>
              <li className="hover:text-blue-600 cursor-pointer">Tight Spreads</li>
              <li className="hover:text-blue-600 cursor-pointer">Execution Policy</li>
              <li className="hover:text-blue-600 cursor-pointer">Margin and Leverage</li>
              <li className="hover:text-blue-600 cursor-pointer">XM Reviews</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-gray-400 font-bold tracking-wider uppercase mb-4 text-[11px]">
              ACCOUNTS
            </h4>
            <ul className="space-y-2.5 font-medium text-gray-800">
              <li className="hover:text-blue-600 cursor-pointer">Account Types</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-gray-400 font-bold tracking-wider uppercase mb-4 text-[11px]">
              OUR OFFERING
            </h4>
            <ul className="space-y-2.5 font-medium text-gray-800">
              <li className="hover:text-blue-600 cursor-pointer">XM Copy Trading</li>
              <li className="hover:text-blue-600 cursor-pointer">XM Competitions</li>
              <li className="hover:text-blue-600 cursor-pointer">XM Traders Club</li>
              <li className="hover:text-blue-600 cursor-pointer">Refer a Friend</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="text-gray-400 font-bold tracking-wider uppercase mb-4 text-[11px]">
              PLATFORMS
            </h4>
            <ul className="space-y-2.5 font-medium text-gray-800">
              <li className="hover:text-blue-600 cursor-pointer">MT4 Platform</li>
              <li className="hover:text-blue-600 cursor-pointer">MT5 Platform</li>
              <li className="hover:text-blue-600 cursor-pointer">XM App</li>
              <li className="hover:text-blue-600 cursor-pointer">APK</li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h4 className="text-gray-400 font-bold tracking-wider uppercase mb-4 text-[11px]">
              COMPANY
            </h4>
            <ul className="space-y-2.5 font-medium text-gray-800">
              <li className="hover:text-blue-600 cursor-pointer">Who is XM Group?</li>
              <li className="hover:text-blue-600 cursor-pointer">Careers</li>
              <li className="hover:text-blue-600 cursor-pointer">Regulation</li>
              <li className="hover:text-blue-600 cursor-pointer">Legal Documents</li>
              <li className="hover:text-blue-600 cursor-pointer">XM Awards</li>
              <li className="hover:text-blue-600 cursor-pointer">CSR</li>
              <li className="hover:text-blue-600 cursor-pointer">Contact Us</li>
              <li className="hover:text-blue-600 cursor-pointer">Help Center</li>
            </ul>
          </div>
        </div>

        {/* 3. Logo & Store Downloads Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-t border-b border-gray-300 py-6 gap-4">
          <div className="text-2xl font-black tracking-tighter text-gray-900">
            XM
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center space-x-2">
              <span>Download on the</span>
              <strong className="block text-sm leading-none">App Store</strong>
            </button>
            <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-gray-50 flex items-center space-x-2">
              <span>DOWNLOAD OUR</span>
              <strong className="block text-sm leading-none">Android App</strong>
            </button>
          </div>
        </div>

        {/* 4. Policy Links */}
        <div className="flex flex-wrap gap-6 text-xs text-blue-600 font-semibold pt-2">
          <a href="#privacy" className="hover:underline">Privacy Policy</a>
          <a href="#cookie" className="hover:underline">Cookie Policy</a>
          <a href="#vulnerability" className="hover:underline">Vulnerability Policy</a>
          <a href="#legal" className="hover:underline">Legal Documents</a>
        </div>

        {/* 5. Legal Disclaimers */}
        <div className="text-[11px] text-gray-600 leading-relaxed space-y-3 pt-2">
          <p>
            XM Global Limited is regulated by the Financial Services Commission (FSC) of Belize under the Securities Industry Act 2021 (license number 8557558).
          </p>
          <p>
            Risk Warning: Our services involve a significant risk and can result in the loss of your invested capital. Please read and ensure you fully understand our <a href="#risk" className="text-blue-600 underline">Risk Disclosures (XM Global)</a>.
          </p>
          <p>
            <strong>Restricted Regions:</strong> We do not provide our service to citizens of the United States of America, Canada, Israel and the Islamic Republic of Iran (and other sanctioned countries).
          </p>
          <p>
            XM does not direct its website and services to any individual in any country in which the use of its website and services are prohibited by local laws or regulations. When accessing this website from a country in which its use may or may not be prohibited, it is the user's responsibility to ensure that any use of the website or services adhere to local laws or regulations. XM does not affirm that the information on its website is suitable to all jurisdictions.
          </p>
        </div>

        {/* 6. Platform & Certifications Row */}
        <div className="flex flex-wrap justify-between items-center border-t border-gray-300 pt-6 gap-4 text-xs font-bold text-gray-500">
          <div className="flex items-center space-x-6">
            <span>MetaTrader 4</span>
            <span>MetaTrader 5</span>
            <span>VERISIGN</span>
            <span>unicef Champion for Children</span>
          </div>
          <div className="flex items-center space-x-2 text-[10px] text-gray-400">
            <span className="bg-gray-200 px-2 py-1 rounded">Great Place To Work</span>
            <span className="bg-gray-200 px-2 py-1 rounded">Best Workplaces 2024</span>
            <span className="bg-gray-200 px-2 py-1 rounded">Best Workplaces 2025</span>
          </div>
        </div>

      </div>

      {/* 7. Bottom Fixed Risk Warning Bar */}
      {showRiskBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md py-3 px-4 z-50 flex justify-between items-center text-xs text-gray-700">
          <div>
            <strong>Risk Warning:</strong> Your capital is at risk. Leveraged products may not be suitable for everyone. Please consider our <a href="#risk" className="text-blue-600 underline">Risk Disclosure</a>.
          </div>
          <button 
            onClick={() => setShowRiskBanner(false)}
            className="text-gray-400 hover:text-gray-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </footer>
  );
}