"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("${process.env.NEXT_PUBLIC_API_URL}/api/login/", {
        username,
        password,
      });
      // Tokens ko browser mein save karna
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      
      alert("Login Successful!");
      router.push("/"); // Home page par redirect
    } catch (err: any) {
      setError("Invalid username or password!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">🚀 BHARAT<span className="text-blue-600">DEVOPS</span></h2>
          <p className="text-slate-500 mt-2">Please login here</p>
        </div>

        {error && <p className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center font-medium">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900"
              placeholder="e.g. shivendra"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}