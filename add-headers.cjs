const fs = require("fs");

const securityHeaders = `
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          }
        ],
      },
    ];
  },`;

function addHeaders(p) {
  let c = fs.readFileSync(p, "utf8");
  if (!c.includes("async headers()")) {
    c = c.replace("images: {", securityHeaders + "\n  images: {");
    fs.writeFileSync(p, c, "utf8");
    console.log("Headers added to " + p);
  }
}

addHeaders("apps/admin/next.config.ts");
addHeaders("apps/web/next.config.ts");
