const fs = require('fs');
const path = 'apps/web/src/components/public/EventSubmissionForm.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(`Maks. 2MB per file`, `Maks. 1MB per file`);
content = content.replace(`f.size <= 2 * 1024 * 1024`, `f.size <= 1 * 1024 * 1024`);
content = content.replace(`lebih dari 2 MB`, `lebih dari 1 MB`);

fs.writeFileSync(path, content, 'utf8');
console.log("Gallery limit reduced to 1MB per file");
