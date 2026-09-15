const fs = require('fs');
const path = 'apps/web/src/components/public/EventSubmissionForm.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace all instances of `data-[filled]:border-amber-500` with `data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-600`
// This will give immediate visual feedback if a field has a value but fails HTML5 validation (like type="email" or type="url").
const oldClass = 'data-[filled]:border-amber-500';
const newClass = 'data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500';

content = content.split(oldClass).join(newClass);

fs.writeFileSync(path, content, 'utf8');
console.log("Added visual invalid state feedback to all filled inputs!");
