const fs = require("fs");
let p = "apps/admin/src/components/admin/EventSubmissionTable.tsx";
let c = fs.readFileSync(p, "utf8");

// Add a download button next to "Lihat Detail" in the table row
const oldActions = `<div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => showDetail(item)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors border border-blue-200 flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Lihat Detail
                      </button>`;

const newActions = `<div className="flex items-center justify-end gap-2">
                      {item.commitment_letter_link && (
                        <a 
                          href={item.commitment_letter_link}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors border border-emerald-200 flex items-center justify-center gap-1"
                          title="Download Surat Kesediaan"
                        >
                          <Download className="w-3 h-3" /> Surat
                        </a>
                      )}
                      <button 
                        onClick={() => showDetail(item)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors border border-blue-200 flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Lihat Detail
                      </button>`;

c = c.replace(oldActions, newActions);

fs.writeFileSync(p, c, "utf8");
console.log("Download button added to table rows");
