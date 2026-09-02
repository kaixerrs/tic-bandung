"use client";
﻿
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MapPin, BookOpen, Image as ImageIcon, FileText, Settings, LogOut, Home, Camera, Plus, Calendar, Activity, Shield, User, FolderTree, Inbox } from 'lucide-react';
import { signoutAction } from '@/app/actions/auth';
import { updateLastSeen } from '@/app/actions/admin';
import { useEffect } from 'react';

export default function AdminLayoutWrapper({
  children,
  isSuperAdmin = false,
  userEmail = "",
}: {
  children: React.ReactNode;
  isSuperAdmin?: boolean;
  userEmail?: string;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Initial ping
    updateLastSeen();
    
    // Ping every 1 minute
    const interval = setInterval(() => {
      updateLastSeen();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [pathname]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    home: true,
    destinasi: true,
    event: true,
    pengaturan: true
  });

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) return pathname === path;
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const navLinkClass = (path: string, exact: boolean = false) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      isActive(path, exact)
        ? 'bg-[#3D7A5E] text-white shadow-md'
        : 'hover:bg-white/10 text-white/70 hover:text-white'
    }`;

  const NavGroup = ({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => (
    <div className="mb-2">
      <button 
        onClick={() => toggleGroup(id)}
        className="w-full flex items-center justify-between text-[11px] font-bold text-[#C9971E] uppercase tracking-widest mt-5 mb-2 px-4 hover:text-[#e8b536] transition-colors"
      >
        <span>{title}</span>
        <svg 
          className={`w-3 h-3 transition-transform ${openGroups[id] ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ${openGroups[id] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#fcf9f5] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1b1c1a] text-white flex flex-col h-full shrink-0 shadow-2xl z-20">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-12 h-12 relative flex items-center justify-center">
              <img 
                src="/logo/tictransparan.png" 
                alt="TIC Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wide">Admin Panel</h1>
              <p className="text-[10px] text-[#8a857e] tracking-wider uppercase font-medium">CMS Kota Bandung</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1 sidebar-scrollbar">
          <div className="text-[11px] font-bold text-[#C9971E] uppercase tracking-widest mb-2 px-4">Menu Utama</div>
          <Link href="/admin/panduan" className={navLinkClass('/admin/panduan')}>
              <BookOpen className="w-5 h-5" />
              <span className="font-medium text-sm">Panduan CMS</span>
            </Link>
          <Link href="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Dashboard Utama</span>
          </Link>
          
          <NavGroup title="CMS - Halaman Depan" id="home">
            <Link href="/admin/hero-slider" className={navLinkClass('/admin/hero-slider')}>
              <ImageIcon className="w-5 h-5" />
              <span className="font-medium text-sm">Hero Slider</span>
            </Link>
            <Link href="/admin/berita" className={navLinkClass('/admin/berita')}>
              <FileText className="w-5 h-5" />
              <span className="font-medium text-sm">Berita & Artikel</span>
            </Link>
            <Link href="/admin/galeri" className={navLinkClass('/admin/galeri')}>
              <Camera className="w-5 h-5" />
              <span className="font-medium text-sm">Galeri Visual</span>
            </Link>
          </NavGroup>

          <NavGroup title="CMS - Destinasi Wisata" id="destinasi">
            <Link href="/admin/destinasi" className={navLinkClass('/admin/destinasi')}>
              <MapPin className="w-5 h-5" />
              <span className="font-medium text-sm">Daftar Destinasi</span>
            </Link>
            <Link href="/admin/kategori" className={navLinkClass('/admin/kategori')}>
              <FolderTree className="w-5 h-5" />
              <span className="font-medium text-sm">Kategori Destinasi</span>
            </Link>
          </NavGroup>

          <NavGroup title="CMS - Kalender & Event" id="event">
            <Link href="/admin/event" className={navLinkClass('/admin/event', true)}>
              <Calendar className="w-5 h-5" />
              <span className="font-medium text-sm">Kalender Event (Data)</span>
            </Link>
            <Link href="/admin/event-submissions" className={navLinkClass('/admin/event-submissions')}>
              <Inbox className="w-5 h-5" />
              <span className="font-medium text-sm">Pendaftaran Masuk</span>
            </Link>
          </NavGroup>

          <NavGroup title="Pengaturan" id="pengaturan">
            <Link href="/admin/pengaturan" className={navLinkClass('/admin/pengaturan', true)}>
              <Settings className="w-5 h-5" />
              <span className="font-medium text-sm">Site Settings</span>
            </Link>
            {isSuperAdmin && (
              <Link href="/admin/pengaturan/admin" className={navLinkClass('/admin/pengaturan/admin')}>
                <Shield className="w-5 h-5" />
                <span className="font-medium text-sm">Manajemen Admin</span>
              </Link>
            )}
            <Link href="/admin/log" className={navLinkClass('/admin/log')}>
              <Activity className="w-5 h-5" />
              <span className="font-medium text-sm">Activity Log</span>
            </Link>
          </NavGroup>
        </nav>

        <div className="p-4 border-t border-white/10 bg-black/20 flex flex-col gap-2">
          {userEmail && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#3D7A5E]/20 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#3D7A5E]" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-white/50 font-medium mb-0.5">Sedang login sebagai:</p>
                <p className="text-sm font-semibold text-white/90 truncate" title={userEmail}>
                  {userEmail}
                </p>
              </div>
            </div>
          )}
          
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <Home className="w-5 h-5" />
            <span className="font-medium text-sm">Lihat Website</span>
          </Link>
          <form action={signoutAction}>
            <button type="submit" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors">
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#fcf9f5] relative">
        <div className="p-6 md:p-10 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}


