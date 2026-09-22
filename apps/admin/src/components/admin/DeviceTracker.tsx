"use client";

import { useEffect } from 'react';
import { upsertAdminDevice } from '@/app/actions/admin';

export default function DeviceTracker() {
  useEffect(() => {
    const trackDevice = async () => {
      try {
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

        const deviceName = `${browser} on ${os}`;
        
        // Generate a hash based on OS and Browser to avoid duplicate entries for the same device
        const deviceHash = btoa(`${os}-${browser}`).substring(0, 32);

        // Fetch IP (Optional but good for tracking)
        let ip_address = "Unknown IP";
        try {
          const res = await fetch('https://api.ipify.org?format=json');
          const data = await res.json();
          ip_address = data.ip;
        } catch (e) {
          console.error("Could not fetch IP");
        }

        const result = await upsertAdminDevice({
          device_hash: deviceHash,
          device_name: deviceName,
          browser,
          os,
          ip_address
        });
        if (!result.success) {
          console.error("DeviceTracker upsert failed:", result.error);
        } else {
          console.log("DeviceTracker upsert success!");
        }
      } catch (err) {
        console.error("Failed to track device:", err);
      }
    };

    trackDevice();
    
    // Periodically update last_seen every 5 minutes
    const interval = setInterval(trackDevice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
