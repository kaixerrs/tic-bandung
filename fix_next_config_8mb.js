const fs = require('fs');
const path = 'apps/web/next.config.ts';
let content = fs.readFileSync(path, 'utf8');

const oldConfig = `  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },`;

const newConfig = `  experimental: {
    serverActions: {
      bodySizeLimit: '8mb',
    },
  },`;

if (content.includes(oldConfig)) {
  content = content.replace(oldConfig, newConfig);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Updated next.config.ts to 8mb successfully!");
} else {
  console.log("Could not find the target string.");
}
