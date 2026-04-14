"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0a0f16] text-white pt-24 pb-12 px-6 md:px-20 mt-0 relative overflow-hidden border-t border-white/5">
        
        {/* Background Glow Effect */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-600 blur-[150px] rounded-full opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[300px] h-[300px] bg-blue-600 blur-[120px] rounded-full opacity-20"></div>
        </div>

        <div className="max-w-[1450px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-1">
              <h2 className="text-3xl font-black tracking-tighter uppercase mb-6">
                Bharat<span className="text-orange-500">Devops</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                India's premium community for Cloud Engineers & DevOps Architects. 
                Learn. Build. Automate.
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-4 mt-8">
                {['TW', 'LI', 'YT', 'GH'].map((soc) => (
                  <div key={soc} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all cursor-pointer">
                    {soc}
                  </div>
                ))}
              </div>
            </div>

            {/* Ecosystem Links */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500 mb-8">Ecosystem</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-300">
                <li className="hover:text-white cursor-pointer transition-colors hover:translate-x-1 transform transition-all">Courses</li>
                <li className="hover:text-white cursor-pointer transition-colors hover:translate-x-1 transform transition-all">Projects</li>
                <li className="hover:text-white cursor-pointer transition-colors hover:translate-x-1 transform transition-all">Tools</li>
                <li className="hover:text-white cursor-pointer transition-colors hover:translate-x-1 transform transition-all">Problems</li>
              </ul>
            </div>

            {/* Community Links */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500 mb-8">Community</h4>
              <ul className="space-y-4 text-sm font-bold text-slate-300">
                <li className="hover:text-white cursor-pointer transition-colors hover:translate-x-1 transform transition-all">Discord Server</li>
                <li className="hover:text-white cursor-pointer transition-colors hover:translate-x-1 transform transition-all">WhatsApp Group</li>
                <li className="hover:text-white cursor-pointer transition-colors hover:translate-x-1 transform transition-all">DevOps Newsletter</li>
              </ul>
            </div>

            {/* Status Section */}
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500 mb-8">System Status</h4>
              <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500">All Nodes Active</span>
                </div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Version 2.0.4-stable</p>
                <p className="text-[9px] text-slate-600 font-bold uppercase mt-1">Uptime: 99.9%</p>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
              © 2026 BharatDevops Academy • Engineered in India
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-600">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
  );
}