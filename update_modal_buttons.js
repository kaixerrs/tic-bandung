const fs = require('fs');
const path = 'apps/admin/src/components/admin/EventSubmissionDetailModal.tsx';
let content = fs.readFileSync(path, 'utf8');

const targetButtons = `<div className="flex gap-3">
            <button 
              onClick={() => { onClose(); onReject(data.id); }}
              disabled={data.status !== 'PENDING'}
              className="px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Tolak Event
            </button>
            <button 
              onClick={() => { onClose(); onApprove(data.id); }}
              disabled={data.status !== 'PENDING'}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Terima & Terbitkan
            </button>
          </div>`;

const newButtons = `<div className="flex gap-3">
            <button 
              onClick={() => { onClose(); onReject(data.id); }}
              disabled={data.status === 'REJECTED'}
              className="px-6 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {data.status === 'APPROVED' ? 'Batalkan (Tolak Event)' : 'Tolak Event'}
            </button>
            <button 
              onClick={() => { onClose(); onApprove(data.id); }}
              disabled={data.status === 'APPROVED'}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> {data.status === 'REJECTED' ? 'Terima & Terbitkan Ulang' : 'Terima & Terbitkan'}
            </button>
          </div>`;

// Since formatting might differ, let's just replace based on regex
const regex = /<div className="flex gap-3">[\s\S]*?<\/div>/;
if (regex.test(content)) {
  content = content.replace(regex, newButtons);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Modal buttons updated successfully.");
} else {
  console.log("Could not find buttons to replace.");
}
