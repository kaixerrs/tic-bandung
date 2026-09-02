const fs = require('fs');
const file = 'apps/web/src/app/(public)/pusat-bantuan/page.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldContacts = `  const emergencyContacts = [
    {
      title: 'Polisi',
      number: settings?.emergency_police || '110',
      description: 'Keamanan & Kriminalitas',
      icon: <ShieldAlert className="w-8 h-8 text-blue-600" />,
      bgHover: 'hover:bg-blue-50',
      borderColor: 'border-blue-100',
      textColor: 'text-blue-700',
      shadowHover: 'hover:shadow-[0_10px_30px_rgba(37,99,235,0.15)]'
    },
    {
      title: 'Ambulans',
      number: settings?.emergency_ambulance || '119',
      description: 'Gawat Darurat Medis',
      icon: <HeartPulse className="w-8 h-8 text-red-600" />,
      bgHover: 'hover:bg-red-50',
      borderColor: 'border-red-100',
      textColor: 'text-red-700',
      shadowHover: 'hover:shadow-[0_10px_30px_rgba(220,38,38,0.15)]'
    },
    {
      title: 'Pemadam',
      number: settings?.emergency_fire || '113',
      description: 'Kebakaran & Penyelamatan',
      icon: <Flame className="w-8 h-8 text-orange-500" />,
      bgHover: 'hover:bg-orange-50',
      borderColor: 'border-orange-100',
      textColor: 'text-orange-600',
      shadowHover: 'hover:shadow-[0_10px_30px_rgba(249,115,22,0.15)]'
    },
    {
      title: 'Call Center',
      number: '112',
      description: 'Layanan Terpadu Bandung',
      icon: <Phone className="w-8 h-8 text-teal-600" />,
      bgHover: 'hover:bg-teal-50',
      borderColor: 'border-teal-100',
      textColor: 'text-teal-700',
      shadowHover: 'hover:shadow-[0_10px_30px_rgba(13,148,136,0.15)]'
    }
  ];`;

const newContacts = `  const emergencyContacts = [
    {
      title: 'Polisi',
      number: settings?.emergency_police || '110',
      description: 'Keamanan & Kriminalitas',
      icon: <ShieldAlert className="w-8 h-8 text-white" />,
      bgColor: 'bg-blue-500 hover:bg-blue-600',
      shadowHover: 'hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)]'
    },
    {
      title: 'Ambulans',
      number: settings?.emergency_ambulance || '119',
      description: 'Gawat Darurat Medis',
      icon: <HeartPulse className="w-8 h-8 text-white" />,
      bgColor: 'bg-red-500 hover:bg-red-600',
      shadowHover: 'hover:shadow-[0_10px_30px_rgba(239,68,68,0.4)]'
    },
    {
      title: 'Pemadam',
      number: settings?.emergency_fire || '113',
      description: 'Kebakaran & Penyelamatan',
      icon: <Flame className="w-8 h-8 text-white" />,
      bgColor: 'bg-orange-500 hover:bg-orange-600',
      shadowHover: 'hover:shadow-[0_10px_30px_rgba(249,115,22,0.4)]'
    },
    {
      title: 'Call Center',
      number: '112',
      description: 'Layanan Terpadu Bandung',
      icon: <Phone className="w-8 h-8 text-white" />,
      bgColor: 'bg-[#00C853] hover:bg-[#009e42]',
      shadowHover: 'hover:shadow-[0_10px_30px_rgba(0,200,83,0.4)]'
    }
  ];`;

c = c.replace(oldContacts, newContacts);

const oldCardHTML = `className={\`group bg-white border border-slate-100 rounded-[2px] p-8 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.03)] \${contact.shadowHover} \${contact.bgHover}\`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={\`p-4 rounded-full bg-slate-50 border \${contact.borderColor} group-hover:scale-110 transition-transform duration-300\`}>
                  {contact.icon}
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-slate-800 transition-colors" />
              </div>
              <h3 className="text-slate-500 font-label-caps text-xs tracking-widest uppercase mb-2">{contact.title}</h3>
              <p className={\`font-headline-lg text-4xl font-black mb-3 \${contact.textColor}\`}>{contact.number}</p>
              <p className="text-slate-600 font-body-sm text-sm border-t border-slate-100 pt-4 group-hover:border-transparent transition-colors">{contact.description}</p>`;

const newCardHTML = `className={\`group \${contact.bgColor} rounded-[2px] p-8 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer shadow-lg \${contact.shadowHover}\`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-full bg-white/20 group-hover:scale-110 transition-transform duration-300">
                  {contact.icon}
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-white/80 font-label-caps text-xs tracking-widest uppercase mb-2">{contact.title}</h3>
              <p className="font-headline-lg text-4xl font-black mb-3 text-white">{contact.number}</p>
              <p className="text-white/90 font-body-sm text-sm border-t border-white/20 pt-4">{contact.description}</p>`;

c = c.replace(oldCardHTML, newCardHTML);

fs.writeFileSync(file, c);
console.log('Reverted card colors');
