"use client";

import { useState } from "react";
import { Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/app/actions/auth";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-3xl p-8 md:p-10 w-full max-w-md">
      
      <div className="mb-8 text-center flex flex-col items-center">
        <img src="/logo/tictransparan.png" alt="TIC Kota Bandung" className="h-16 w-auto mb-4" />
        <h1 className="text-3xl font-bold font-display text-[#1b1c1a] mb-2 tracking-tight">Portal Admin</h1>
        <p className="text-slate-500 text-sm">Masuk untuk mengelola data TIC Kota Bandung</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="space-y-5 mb-8">
        <div>
          <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Alamat Email</label>
          <div className="relative">
            <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              name="email"
              type="email" 
              required
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#3D7A5E] focus:ring-2 focus:ring-[#3D7A5E]/20 outline-none transition-all text-[#1b1c1a]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1b1c1a] mb-2">Kata Sandi</label>
          <div className="relative">
            <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              name="password"
              type={showPassword ? "text" : "password"} 
              required
              className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#3D7A5E] focus:ring-2 focus:ring-[#3D7A5E]/20 outline-none transition-all text-[#1b1c1a]"
              placeholder="••••••••"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-4 bg-[#3D7A5E] hover:bg-[#2c5c45] text-white font-bold rounded-xl transition-all shadow-[0_4px_12px_rgba(61,122,94,0.2)] hover:shadow-[0_6px_16px_rgba(61,122,94,0.3)] hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isPending ? "Memverifikasi..." : "Masuk ke Dashboard"}
        {!isPending && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
      </button>
      
      <p className="mt-6 text-center text-xs text-slate-400">
        Sistem terenkripsi aman. Akses portal ini dibatasi secara ketat hanya untuk staf administrator yang memiliki izin resmi.
      </p>
    </form>
  );
}
