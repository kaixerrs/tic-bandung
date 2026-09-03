const fs = require("fs");
let p = "apps/web/src/app/[locale]/(public)/page.tsx";
let c = fs.readFileSync(p, "utf8");

const jsonLd = `{
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  "name": "TIC Kota Bandung",
  "alternateName": "Tourist Information Center Kota Bandung",
  "url": "https://ticbandung.com",
  "logo": "https://ticbandung.com/logo/tictransparan.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+62-22-1234567",
    "contactType": "customer service",
    "areaServed": "ID",
    "availableLanguage": ["id", "en"]
  },
  "sameAs": [
    "https://twitter.com/DisbudparBdg",
    "https://instagram.com/disbudpar.bdg"
  ]
}`;

const insertString = `
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(${jsonLd}) }}
      />
      <HeroSlider`;

if (c.includes("<HeroSlider")) {
  c = c.replace("<HeroSlider", insertString);
  fs.writeFileSync(p, c, "utf8");
  console.log("JSON-LD added to Home page");
} else {
  console.log("Could not find <HeroSlider");
}
