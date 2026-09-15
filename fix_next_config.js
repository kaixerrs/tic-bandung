const fs = require('fs');
const path = 'apps/web/next.config.ts';
let content = fs.readFileSync(path, 'utf8');

const oldConfig = `const nextConfig: NextConfig = {
  
  async headers() {`;

const newConfig = `const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  async headers() {`;

if (content.includes(oldConfig)) {
  content = content.replace(oldConfig, newConfig);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Updated next.config.ts successfully!");
} else {
  console.log("Could not find the target string.");
}
