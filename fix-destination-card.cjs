const fs = require("fs");
let p = "apps/web/src/components/public/DestinationCard.tsx";
let c = fs.readFileSync(p, "utf8");

// Update DestinationProps
c = c.replace(
  "operating_hours: string | null;",
  "operating_hours: string | null;\n  leaflet_url?: string | null;"
);

// Remove unused NFR metadata from card body since we don't fetch it anymore
const metadataToRemove = `
          {destination.district && (
            <div className="flex items-start gap-1 mb-3 text-[#4f4635] text-xs">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#C9971E]" />
              <span className="line-clamp-2">{destination.district}</span>
            </div>
          )}
          
          {destination.description && (
            <p className="text-[#4f4635] text-sm line-clamp-3 mb-4 flex-grow">
              {destination.description}
            </p>
          )}

          {/* Footer Metadata (FR-05 & NFR-09) */}
          <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#f6f3f0]">
            
            {/* Logic NFR-09: Tiga state harga */}
            {destination.ticket_type !== 'UNCONFIRMED' ? (
              <span className="font-bold text-sm text-[#3D7A5E]">
                {destination.ticket_type === 'FREE' ? t('free') : 
                 destination.ticket_nominal ? new Intl.NumberFormat(locale === 'id' ? 'id-ID' : 'en-US', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(destination.ticket_nominal) : 
                 t('paid')}
              </span>
            ) : (
              <span></span> /* Empty span to keep flex-between layout if no price */
            )}
            
            {/* If operating_hours exists, show it */}
            {destination.operating_hours && (
              <div className="flex items-center gap-1.5 text-[#4f4635] text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{t('available')}</span> {/* Or parse JSON to show open status */}
              </div>
            )}
          </div>`;

c = c.replace(metadataToRemove, "");

// Update Link
c = c.replace(
  `<Link href={\`/destinasi/\${destination.slug}\`} className="block group h-full">`,
  `{destination.leaflet_url ? (
    <a href={destination.leaflet_url} target="_blank" rel="noopener noreferrer" className="block group h-full cursor-pointer">
  ) : (
    <div className="block group h-full opacity-70">
  )}`
);

c = c.replace(
  `    </Link>\n  );\n}\n`,
  `    {destination.leaflet_url ? </a> : </div>}\n  );\n}\n`
);

fs.writeFileSync(p, c, "utf8");
console.log("DestinationCard updated");
