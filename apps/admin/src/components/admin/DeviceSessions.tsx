"use client";

import { useEffect, useState, useTransition } from 'react';
import { getAdminDevices, deleteAdminDevice, deleteAllOtherAdminDevices, upsertAdminDevice } from '@/app/actions/admin';
import { Laptop, Smartphone, Monitor } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

interface DeviceSession {
  id: string;
  device_hash: string;
  device_name: string;
  browser: string;
  os: string;
  ip_address: string;
  last_seen: string;
  is_online: boolean;
}

export default function DeviceSessions() {
  const [devices, setDevices] = useState<DeviceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentHash, setCurrentHash] = useState("");
  const [isPending, startTransition] = useTransition();

  const fetchDevices = async () => {
    const { data, error } = await getAdminDevices();
    if (!error && data) {
      setDevices(data as DeviceSession[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Determine current device hash
    const userAgent = window.navigator.userAgent;
    let os = "Unknown OS";
    if (userAgent.indexOf("Win") !== -1) os = "Windows";
    if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
    if (userAgent.indexOf("X11") !== -1) os = "UNIX";
    if (userAgent.indexOf("Linux") !== -1) os = "Linux";
    if (/Android/.test(userAgent)) os = "Android";
    if (/iPhone|iPad|iPod/.test(userAgent)) os = "iOS";

    let browser = "Unknown Browser";
    if (userAgent.indexOf("Chrome") !== -1) browser = "Chrome";
    if (userAgent.indexOf("Safari") !== -1 && userAgent.indexOf("Chrome") === -1) browser = "Safari";
    if (userAgent.indexOf("Firefox") !== -1) browser = "Firefox";
    if (userAgent.indexOf("Edge") !== -1 || userAgent.indexOf("Edg") !== -1) browser = "Edge";
    if (userAgent.indexOf("OPR") !== -1 || userAgent.indexOf("Opera") !== -1) browser = "Opera";

    const hash = btoa(`${os}-${browser}`).substring(0, 32);
    setCurrentHash(hash);
    
    // Fallback tracker: Ensure current device is logged when viewing this page
    const ensureTracked = async () => {
      let ip_address = "Unknown IP";
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip_address = data.ip;
      } catch (e) {
        // ignore
      }
      
      await upsertAdminDevice({
        device_hash: hash,
        device_name: `${browser} on ${os}`,
        browser,
        os,
        ip_address
      });
      
      fetchDevices();
    };
    
    ensureTracked();
  }, []);

  const handleDisconnect = (deviceId: string) => {
    startTransition(async () => {
      const { error } = await deleteAdminDevice(deviceId);
      if (error) {
        toast.error("Gagal memutuskan sesi perangkat");
      } else {
        toast.success("Sesi perangkat diputuskan");
        fetchDevices();
      }
    });
  };

  const handleDisconnectAll = () => {
    if (!confirm("Apakah Anda yakin ingin keluar dari semua perangkat lain?")) return;
    
    startTransition(async () => {
      const { error } = await deleteAllOtherAdminDevices(currentHash);
      if (error) {
        toast.error("Gagal memutuskan semua sesi");
      } else {
        toast.success("Semua sesi lain berhasil diputuskan");
        fetchDevices();
      }
    });
  };

  const getIcon = (os: string, isCurrent: boolean) => {
    const IconComponent = (os === "iOS" || os === "Android") ? Smartphone : Monitor;
    return <IconComponent className={`w-5 h-5 ${isCurrent ? 'text-emerald-600' : 'text-slate-500'}`} />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-gray-100 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Perangkat Anda</h2>
          <p className="text-sm text-gray-500 mt-1">Daftar browser dan perangkat yang sedang terhubung ke akun ini.</p>
        </div>
        {devices.length > 1 && (
          <button 
            onClick={handleDisconnectAll}
            disabled={isPending}
            className="text-red-500 hover:text-red-600 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50"
          >
            Keluar dari Semua Sesi Lain
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-8 flex items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
      ) : devices.length === 0 ? (
        <div className="py-8 flex items-center justify-center text-gray-400 text-sm">
          Belum ada perangkat
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {devices.map((device) => {
            const isCurrent = device.device_hash === currentHash;
            
            return (
              <div 
                key={device.id} 
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  isCurrent ? 'bg-emerald-50/30 border-emerald-200' : 'bg-white border-gray-200 hover:bg-slate-50'
                } transition-colors`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent ? 'bg-emerald-100/80' : 'bg-slate-100'
                  }`}>
                    {getIcon(device.os, isCurrent)}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-bold text-gray-900 text-sm">{device.device_name}</h4>
                      {isCurrent && (
                        <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">
                          Perangkat Ini
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      {isCurrent ? (
                        <>
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Aktif sekarang
                          </span>
                          <span className="text-gray-300">&bull;</span>
                          <span>{device.ip_address !== "Unknown IP" ? `Jakarta, Indonesia (${device.ip_address})` : 'IP Tidak Diketahui'}</span>
                        </>
                      ) : (
                        <>
                          <span>Aktif {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true, locale: id })}</span>
                          <span className="text-gray-300">&bull;</span>
                          <span>{device.ip_address !== "Unknown IP" ? `Jakarta, Indonesia (${device.ip_address})` : 'IP Tidak Diketahui'}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="shrink-0 ml-4">
                  {isCurrent ? (
                    <div className="px-4 py-1.5 border border-gray-200 bg-white rounded-lg text-xs font-medium text-gray-400 select-none">
                      Utama
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleDisconnect(device.id)}
                      disabled={isPending}
                      className="px-4 py-1.5 border border-gray-200 bg-white hover:bg-gray-50 rounded-lg text-xs font-medium text-gray-600 transition-colors disabled:opacity-50"
                    >
                      Putuskan
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
