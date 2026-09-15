const fs = require('fs');
const path = 'apps/web/src/components/public/EventSubmissionForm.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldCode = `        setTimeout(() => {
          if (!formRef.current || !draft.nativeData) return;
          Object.entries(draft.nativeData).forEach(([name, value]) => {
            // Skip custom state fields that are already restored
            if (['event_scale', 'event_category', 'payment_type', 'event_type', 'timezone', 'latitude', 'longitude', 'has_registration_radio'].includes(name)) return;
            
            const input = formRef.current.querySelector(\`[name="\${name}"]\`);
            if (input) {
              input.value = value;
              if (value) input.setAttribute('data-filled', 'true');
            }
          });`;

const newCode = `        setTimeout(() => {
          const currentForm = formRef.current;
          if (!currentForm || !draft.nativeData) return;
          Object.entries(draft.nativeData).forEach(([name, value]) => {
            // Skip custom state fields that are already restored
            if (['event_scale', 'event_category', 'payment_type', 'event_type', 'timezone', 'latitude', 'longitude', 'has_registration_radio'].includes(name)) return;
            
            const input = currentForm.querySelector(\`[name="\${name}"]\`) as HTMLInputElement;
            if (input) {
              input.value = value as string;
              if (value) input.setAttribute('data-filled', 'true');
            }
          });`;

if (content.includes(oldCode)) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(path, content, 'utf8');
  console.log("TS errors fixed!");
} else {
  console.log("Could not find the target string.");
}
