const fs = require('fs');
const path = 'apps/web/src/components/public/EventSubmissionForm.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /import dynamic from 'next\/dynamic';[\r\n]+"use client";/;
const replacement = `"use client";\nimport dynamic from 'next/dynamic';`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed use client order');
} else {
  console.log('Regex did not match');
}
