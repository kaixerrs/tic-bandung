import React from 'react';
import { getAdminLogs } from '@/app/actions/log';
import { Clock, User, Activity, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { checkIsSuperAdmin } from '@/app/actions/admin';
import ClearLogsButton from '@/components/admin/cms/ClearLogsButton';
import { id } from 'date-fns/locale';

export default async function AdminLogsPage() {
  const { data: logs, error } = await getAdminLogs();
  const isSuperAdmin = await checkIsSuperAdmin();

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Dibuat</span>;
      case 'UPDATE':
        return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Diperbarui</span>;
      case 'DELETE':
        return <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Dihapus</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{action}</span>;
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'DESTINATION':
        return 'Destinasi';
      case 'EVENT':
        return 'Event/Kalender';
      case 'NEWS':
        return 'Berita';
      case 'HERO_SLIDER':
        return 'Hero Slider';
      case 'GALLERY':
        return 'Galeri';
      case 'SETTINGS':
        return 'Pengaturan';
      default:
        return entity;
    }
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto py-4">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-medium text-[#2d2a26] tracking-tight">Riwayat Aktivitas Admin</h1>
            <p className="text-[#8a857e] mt-1 text-sm md:text-base">Pantau semua perubahan data yang dilakukan oleh administrator di sistem.</p>
          </div>
          {isSuperAdmin && <ClearLogsButton />}
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {error ? (
            <div className="p-8 text-center text-red-500">
              <p>Gagal memuat log aktivitas.</p>
              <p className="text-sm mt-1 opacity-70">{error.message}</p>
            </div>
          ) : !logs || logs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Belum ada riwayat aktivitas</p>
              <p className="text-sm mt-1">Data log akan muncul saat admin melakukan perubahan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold tracking-wider">Waktu</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Administrator</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Aksi</th>
                    <th className="px-6 py-4 font-semibold tracking-wider">Entitas (Objek)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>
                            {format(new Date(log.created_at), 'dd MMM yyyy, HH:mm', { locale: id }) + ' WIB'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#3D7A5E]/10 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-[#3D7A5E]" />
                          </div>
                          <span className="font-medium text-gray-700">{log.admin_email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getActionBadge(log.action)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-start flex-col justify-center">
                          <span className="text-xs font-semibold text-[#C9971E] uppercase tracking-wider mb-1">
                            {getEntityIcon(log.entity)}
                          </span>
                          <span className="text-gray-800 font-medium line-clamp-1" title={log.entity_name}>
                            {log.entity_name}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

