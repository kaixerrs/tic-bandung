"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { clearAdminLogs } from "@/app/actions/log";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

export default function ClearLogsButton() {
  const [isPending, startTransition] = useTransition();

  const handleClearLogs = async () => {
    const confirmResult = await Swal.fire({
      title: 'Bersihkan Semua Log?',
      text: 'Peringatan: Semua riwayat aktivitas akan dihapus permanen dari database!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#858796',
      confirmButtonText: 'Ya, Bersihkan',
      cancelButtonText: 'Batal'
    });

    if (confirmResult.isConfirmed) {
      startTransition(async () => {
        const result = await clearAdminLogs();
        if (result.error) {
          toast.error("Gagal membersihkan log: " + result.error);
        } else {
          toast.success("Semua log berhasil dibersihkan!");
        }
      });
    }
  };

  return (
    <button 
      onClick={handleClearLogs}
      disabled={isPending}
      className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      Bersihkan Semua Log
    </button>
  );
}
