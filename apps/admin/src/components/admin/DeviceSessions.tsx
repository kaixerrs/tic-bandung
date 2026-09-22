"use client";

import { useEffect, useState } from 'react';
import { getAdminDevices } from '@/app/actions/admin';
import { Laptop, Smartphone, Monitor } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

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

  useEffect(() => {
    const fetchDevices = async () => {
      const { data, error } = await getAdminDevices();
      if (!error && data) {
        setDevices(data as DeviceSession[]);
      }
      setLoading(false);
    };

    fetchDevices();
  }, []);

  const getIcon = (os: string) => {
    if (os === "iOS" || os === "Android") return <Smartphone className="w-5 h-5 text-gray-500" />;
    return <Laptop className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
        Perangkat Anda
      </h2>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full"></div>
        </div>
      ) : devices.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
          Belum ada perangkat
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {devices.map((device) => {
            const isOnline = new Date().getTime() - new Date(device.last_seen).getTime() < 10 * 60 * 1000; // 10 mins
            
            return (
              <div key={device.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getIcon(device.os)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{device.device_name}</h4>
                    <p className="text-xs text-gray-500">{device.ip_address}</p>
                  </div>
                </div>
                <div className="text-right">
                  {isOnline ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Online
                    </span>
                  ) : (
                    <div className="flex flex-col items-end">
                      <span className="text-gray-400 font-medium text-xs">Offline</span>
                      <span className="text-gray-400 text-[10px]">
                        {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true, locale: id })}
                      </span>
                    </div>
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
