const fs = require("fs");
let p = "apps/admin/src/components/admin/EventSubmissionTable.tsx";
let c = fs.readFileSync(p, "utf8");

const oldExport = `      'Artis': item.artist_performance,
      'Status': item.status`;

const newExport = `      'Artis': item.artist_performance,
      'Deskripsi': item.description,
      'USP': item.usp,
      'Target Pengunjung': item.target_visitors,
      'Pelaksanaan Ke': item.execution_count,
      'Link Media Promosi (GDrive)': item.promotion_media || '-',
      'Link Proposal/Poster': item.attachment_link || '-',
      'Link Surat Kesediaan': item.commitment_letter_link || '-',
      'Status': item.status`;

c = c.replace(oldExport, newExport);

fs.writeFileSync(p, c, "utf8");
console.log("Excel export updated with GDrive links");
