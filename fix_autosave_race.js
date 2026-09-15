const fs = require('fs');
const path = 'apps/web/src/components/public/EventSubmissionForm.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add isDraftLoaded state
const stateInsertionPoint = `const [formUpdateTrigger, setFormUpdateTrigger] = useState(0);`;
const newState = `const [formUpdateTrigger, setFormUpdateTrigger] = useState(0);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);`;

if (content.includes(stateInsertionPoint) && !content.includes('isDraftLoaded')) {
  content = content.replace(stateInsertionPoint, newState);
}

// 2. Set isDraftLoaded in LOAD effect
const loadTimeout = `          // Trigger a re-validation now that data is populated
          setFormUpdateTrigger(prev => prev + 1);
        }, 100);`;
const newLoadTimeout = `          // Trigger a re-validation now that data is populated
          setFormUpdateTrigger(prev => prev + 1);
          setIsDraftLoaded(true);
        }, 100);`;

if (content.includes(loadTimeout)) {
  content = content.replace(loadTimeout, newLoadTimeout);
}

const loadCatch = `} catch (e) {
        console.error("Failed to parse draft", e);
      }
    }`;
const newLoadCatch = `} catch (e) {
        console.error("Failed to parse draft", e);
        setIsDraftLoaded(true);
      }
    } else {
      setIsDraftLoaded(true);
    }`;

if (content.includes(loadCatch)) {
  content = content.replace(loadCatch, newLoadCatch);
}

// 3. Prevent save if not loaded
const saveStart = `  // AUTO-SAVE: Save draft on any change
  useEffect(() => {
    if (!formRef.current) return;`;
const newSaveStart = `  // AUTO-SAVE: Save draft on any change
  useEffect(() => {
    if (!formRef.current || !isDraftLoaded) return;`;

if (content.includes(saveStart)) {
  content = content.replace(saveStart, newSaveStart);
}

fs.writeFileSync(path, content, 'utf8');
console.log("Autosave race condition fixed!");
