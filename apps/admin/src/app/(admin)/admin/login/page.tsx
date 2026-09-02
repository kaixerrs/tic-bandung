import LoginForm from "@/components/admin/LoginForm";
import { Montserrat } from 'next/font/google';
import Link from 'next/link';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata = {
  title: "Login Admin | TIC Kota Bandung",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Full Background Image */}
      <img 
        src="/gedung-sate.webp" 
        alt="Gedung Sate Bandung" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0a0a]/90 via-[#0a0a0a]/75 to-[#0a0a0a]/40"></div>
      
      {/* Abstract pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 p-6 sm:p-12">
        
        {/* Left Side: Text Content */}
        <div className="w-full lg:w-1/2 max-w-2xl text-center lg:text-left pt-12 lg:pt-0">
          <div className="w-16 h-1.5 bg-[#C9971E] rounded-full mb-6 mx-auto lg:mx-0"></div>
          <h1 className={`${montserrat.className} text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight`}>
            Tourist Information Center <br/>Kota Bandung
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed mb-10">
            Pusat kendali dan manajemen data pariwisata. Memberikan informasi destinasi terbaik, event kebudayaan, dan kekayaan kuliner khas bumi Pasundan.
          </p>
          
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full backdrop-blur-sm border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Kembali ke Beranda
          </Link>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end pb-12 lg:pb-0">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>

      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 left-0 w-full text-center z-10 pointer-events-none">
        <p className="text-xs text-slate-400/60">
          &copy; {new Date().getFullYear()} Dinas Kebudayaan dan Pariwisata Kota Bandung.
        </p>
      </div>
    </main>
  );
}
