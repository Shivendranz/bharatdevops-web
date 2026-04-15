"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // Bahar click karne par search band ho jaye
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 1) {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/?search=${query}`)
          .then(res => setResults(res.data))
          .catch(err => console.error(err));
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative w-full max-w-[300px]" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full bg-slate-100 border-none py-2 pl-4 pr-10 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
        />
        <span className="absolute right-3 top-2 text-slate-400">🔍</span>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-[350px] right-0 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden z-[100]">
          <div className="px-4 py-2 bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">Search Results</div>
          <div className="max-h-[400px] overflow-y-auto">
            {results.map((item: any) => (
              <button
                key={item.id}
                onClick={() => {
                  router.push(`/course/${item.course_id || item.id}`); 
                  setIsOpen(false);
                  setQuery("");
                }}
                className="w-full text-left px-4 py-3 hover:bg-green-50 flex flex-col border-b border-slate-50 last:border-none transition-colors"
              >
                <span className="text-sm font-bold text-slate-800">{item.title}</span>
                <span className="text-[10px] text-green-600 font-bold uppercase">View Lesson →</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}