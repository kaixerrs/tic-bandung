const fs = require('fs');
const path = 'apps/web/src/components/public/EventSubmissionForm.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add next/dynamic import if missing
const importDynamic = `import dynamic from 'next/dynamic';`;
if (!content.includes('next/dynamic')) {
  content = content.replace(`import { useState, useRef, useEffect } from 'react';`, `import { useState, useRef, useEffect } from 'react';\nimport dynamic from 'next/dynamic';`);
}

// 2. Replace static import with dynamic import
const staticImport = `import LocationPickerWrapper from './LocationPickerWrapper';`;
const dynamicImport = `const LocationPickerWrapper = dynamic(() => import('./LocationPickerWrapper'), { ssr: false, loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-sm border border-slate-200 flex items-center justify-center text-slate-400 font-medium">Memuat Peta...</div> });`;

if (content.includes(staticImport)) {
  content = content.replace(staticImport, dynamicImport);
  fs.writeFileSync(path, content, 'utf8');
  console.log("Dynamic import added for LocationPickerWrapper!");
} else {
  console.log("Static import not found, might already be dynamic.");
}
