"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Search from "./Search"; // Ye aapka original global search component hai
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [menuLinks, setMenuLinks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Backend se Navbar Menu fetch karna
    axios.get("${process.env.NEXT_PUBLIC_API_URL}/api/navbar-menu/")
      .then(res => setMenuLinks(res.data))
      .catch(err => console.error("Menu error:", err));

    const token = typeof window !== "undefined" ? localStorage.getItem("access") : null;
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsLoggedIn(false);
    router.push("/login");
    setTimeout(() => {
      if (typeof window !== "undefined") window.location.reload(); 
    }, 100);
  };

  return (
    <nav className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center px-6 fixed top-0 z-[100] w-full">
      
      {/* 1. LOGO SECTION */}
      <div className="shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
          <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            BHARAT<span className="text-orange-600">DEVOPS</span>
          </h1>
        </Link>
      </div>

      <div className="flex-1"></div>

      {/* 2. NAVIGATION & SEARCH */}
      <div className="flex items-center gap-8">
        
        {/* DYNAMIC LINKS (Backend se aane wale) */}
        <div className="hidden md:flex gap-6 text-[12px] font-bold text-slate-500 uppercase tracking-tight">
          <Link 
            href="/" 
            className={`hover:text-orange-600 transition-colors ${pathname === '/' ? 'text-orange-600' : ''}`}
          >
            Home
          </Link>
          
          {menuLinks.map((link: any) => {
            const finalHref = link.url.startsWith('/') || link.url.startsWith('http')
              ? link.url 
              : `/course/${link.url}`;

            return (
              <Link 
                key={link.id} 
                href={finalHref} 
                className={`transition-colors hover:text-orange-600 ${
                  pathname === finalHref ? "text-orange-600" : ""
                }`}
              >
                {link.title}
              </Link>
            );
          })}
        </div>

        {/* 🔍 GLOBAL SEARCH BOX (Original Component) */}
        <div className="flex items-center">
          <Search /> 
        </div>

        {/* AUTH SECTION */}
        <div className="flex items-center gap-4 border-l border-slate-100 pl-6">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout}
              className="text-red-500 border border-red-100 bg-red-50 px-4 py-1.5 rounded-lg text-[11px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-5">
              <Link 
                href="/login" 
                className="text-slate-400 font-bold text-[12px] uppercase hover:text-slate-900 transition"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-slate-900 text-white px-5 py-2 rounded-lg text-[11px] font-black uppercase hover:bg-orange-600 shadow-lg shadow-slate-100 transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}