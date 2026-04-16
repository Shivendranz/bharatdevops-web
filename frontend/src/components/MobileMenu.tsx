"use client";
import { useState } from "react";

// ⚠️ Yahan se wo import line hata di hai kyunki ye file khud MobileMenu hai!

export default function MobileMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 🍔 Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-[60] bg-slate-900 text-white p-4 rounded-full shadow-2xl border-2 border-white flex items-center gap-2 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform"
      >
        <span>Menu</span>
      </button>

      {/* 🌑 Overlay (Background shadow when menu is open) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* 📁 Sliding Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[80] shadow-2xl transform transition-transform duration-300 lg:hidden overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">Navigation</span>
          <button onClick={() => setIsOpen(false)} className="text-slate-900 font-bold text-xl p-2">✕</button>
        </div>
        
        {/* Iske andar humara sidebar wala content aayega */}
        <div onClick={() => setIsOpen(false)}>
          {children}
        </div>
      </div>
    </>
  );
}