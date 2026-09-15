const fs = require('fs');
const path = 'apps/admin/src/components/admin/EventSubmissionTable.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update Imports
const importInsertionPoint = `import * as XLSX from 'xlsx';`;
const newImports = `import * as XLSX from 'xlsx';\nimport EventSubmissionDetailModal from './EventSubmissionDetailModal';`;
if (content.includes(importInsertionPoint) && !content.includes('EventSubmissionDetailModal')) {
  content = content.replace(importInsertionPoint, newImports);
}

// 2. Update SubmissionData Type
const oldType = `type SubmissionData = {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  pic_name: string;
  eo_name: string;
  email: string;
  whatsapp: string;
  location: string;
  description: string;
  instagram: string;
  kol_partner: string;
  artist_performance: string;
  usp: string;
  target_visitors: number;
  execution_count: number;
  promotion_media: string;
  attachment_link: string;
  commitment_letter_link: string;
  status: string;
  created_at: string;
  event_scale: string;
  event_category: string;
  country: string;
  province: string;
  city: string;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
};`;
const newType = `type SubmissionData = {
  id: string; title: string; start_date: string; end_date: string;
  pic_name: string; eo_name: string; email: string; whatsapp: string;
  location: string; description: string; instagram: string; kol_partner: string;
  artist_performance: string; usp: string; target_visitors: number;
  execution_count: number; promotion_media: string; attachment_link: string;
  commitment_letter_link: string; status: string; created_at: string;
  event_scale: string; event_category: string; country: string; province: string;
  city: string; district: string; village: string; latitude: number; longitude: number;
  timezone: string; has_registration: boolean; event_type: string;
  payment_type: string; additional_info_link: string; ticket_links: string[];
  thumbnail_link: string; gallery_links: string[]; sponsors: { name: string; logo_url: string }[];
};`;
if (content.includes('type SubmissionData = {')) {
  content = content.replace(oldType, newType);
}

// 3. Add Modal State
const stateInsertionPoint = `const [isPending, startTransition] = useTransition();`;
const modalState = `const [isPending, startTransition] = useTransition();\n  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);\n  const [isModalOpen, setIsModalOpen] = useState(false);`;
if (content.includes(stateInsertionPoint) && !content.includes('selectedSubmission')) {
  content = content.replace(stateInsertionPoint, modalState);
}

// 4. Update showDetail
const oldShowDetail = `const showDetail = (item: SubmissionData) => {
    Swal.fire({
      title: '<span style="font-size: 1.25rem; font-weight: 700; color: #111827;">Detail Pengajuan Event</span>',`;
const newShowDetail = `const showDetail = (item: SubmissionData) => {
    setSelectedSubmission(item);
    setIsModalOpen(true);
  };
  
  /* Removed old SweetAlert modal */
  const __oldShowDetail = () => {`;
if (content.includes(oldShowDetail)) {
  content = content.replace(oldShowDetail, newShowDetail);
}
// Strip out the old Swal.fire completely by finding its end. Actually it's easier to just do it via regex
content = content.replace(/const __oldShowDetail = \(\) => {[\s\S]*?}\);[\s\S]*?};/, '');


// 5. Update Excel Export
const oldExport = `'Lokasi (Patokan)': item.location,`;
const newExport = `'Lokasi (Patokan)': item.location,
      'Tipe Acara': item.event_type || '-',
      'Tipe Pembayaran': item.payment_type || '-',
      'Ada Registrasi?': item.has_registration ? 'Ya' : 'Tidak',
      'Zona Waktu': item.timezone || '-',
      'Link Tiket': (item.ticket_links || []).join(', '),
      'Link Thumbnail': item.thumbnail_link || '-',
      'Jumlah Sponsor': (item.sponsors || []).length,`;
if (content.includes(oldExport)) {
  content = content.replace(oldExport, newExport);
}

// 6. Mount the Modal at the end of return
const oldReturnEnd = `        </table>
      </div>
    </div>
    </div>
  );
}`;
const newReturnEnd = `        </table>
      </div>
    </div>
      <EventSubmissionDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedSubmission}
        onApprove={(id) => handleUpdateStatus(id, "APPROVED")}
        onReject={(id) => handleUpdateStatus(id, "REJECTED")}
      />
    </div>
  );
}`;
if (content.includes(oldReturnEnd)) {
  content = content.replace(oldReturnEnd, newReturnEnd);
}

fs.writeFileSync(path, content, 'utf8');
console.log("EventSubmissionTable updated!");
