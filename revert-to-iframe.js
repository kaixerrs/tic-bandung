const fs = require('fs');
const file = 'apps/web/src/app/(public)/pusat-bantuan/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldMap = `<a 
                href="https://www.google.com/maps?q=-6.9217848810924565,107.60756931267107" 
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 group-hover:scale-105 transition-all duration-700 block cursor-pointer"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/ASET VISUAL/jalan-asia-afrika.jpg')" }}
                ></div>
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors duration-500"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="bg-white p-4 rounded-full shadow-2xl shadow-black/50 mb-4 animate-bounce">
                    <MapPin className="w-8 h-8 text-[#00C853]" />
                  </div>
                  <span className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full font-label-caps text-sm font-bold text-slate-800 shadow-xl">
                    Buka Peta Interaktif
                  </span>
                </div>
              </a>`;

const newMap = `<iframe 
                src="https://maps.google.com/maps?width=100%25&height=600&hl=id&q=-6.9217848810924565,107.60756931267107+(Tourist%20Information%20Center%20Bandung)&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
              ></iframe>`;

c = c.replace(oldMap, newMap);

fs.writeFileSync(file, c);
console.log('Reverted to iframe');
