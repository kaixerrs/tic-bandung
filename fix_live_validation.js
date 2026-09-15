const fs = require('fs');
const path = 'apps/web/src/components/public/EventSubmissionForm.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add formUpdateTrigger state
const stateInsertionPoint = `const [galleryFiles, setGalleryFiles] = useState<File[]>([]);`;
if (content.includes(stateInsertionPoint) && !content.includes('formUpdateTrigger')) {
  content = content.replace(stateInsertionPoint, stateInsertionPoint + '\n  const [formUpdateTrigger, setFormUpdateTrigger] = useState(0);');
}

// 2. Update handleChange
const oldHandleChange = `  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const target = e.target as unknown as HTMLInputElement | HTMLTextAreaElement;
    if (target.value) {
      target.setAttribute('data-filled', 'true');
    } else {
      target.removeAttribute('data-filled');
    }
  };`;

const newHandleChange = `  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const target = e.target as unknown as HTMLInputElement | HTMLTextAreaElement;
    if (target.value) {
      target.setAttribute('data-filled', 'true');
    } else {
      target.removeAttribute('data-filled');
    }
    setFormUpdateTrigger(prev => prev + 1);
  };`;

if (content.includes(oldHandleChange)) {
  content = content.replace(oldHandleChange, newHandleChange);
}

// 3. Update useEffect validation logic and dependencies
const oldUseEffect = `  useEffect(() => {
    if (!formRef.current) return;
    const newValidity: Record<number, boolean> = { ...stepValidity };
    
    const checkStep = (stepNum: number) => {
      const stepContainer = formRef.current?.querySelector(\`[data-step="\${stepNum}"]\`);
      if (!stepContainer) return true;
      
      // Native validation (catches all standard inputs with 'required')
      const invalidFields = stepContainer.querySelectorAll(':invalid');
      if (invalidFields.length > 0) return false;
      
      // Custom states validation (for hidden inputs or files)
      if (stepNum === 1) {
        if (!eventScale || !eventCategory || !paymentType) return false;
        if (!thumbnailFile || galleryFiles.length === 0) return false;
      }
      if (stepNum === 3) {
        if (!eventType || !timezone) return false;
      }
      
      return true;
    };
    
    if (currentStep > 1) newValidity[1] = checkStep(1);
    if (currentStep > 2) newValidity[2] = checkStep(2);
    if (currentStep > 3) newValidity[3] = checkStep(3);
    if (currentStep > 4) newValidity[4] = checkStep(4);
    
    setStepValidity(newValidity);
  }, [currentStep, thumbnailFile, galleryFiles, eventScale, eventCategory, paymentType, eventType, timezone]);`;

const newUseEffect = `  useEffect(() => {
    if (!formRef.current) return;
    const newValidity: Record<number, boolean> = { ...stepValidity };
    
    const checkStep = (stepNum: number) => {
      const stepContainer = formRef.current?.querySelector(\`[data-step="\${stepNum}"]\`);
      if (!stepContainer) return true;
      
      // Native validation (catches all standard inputs with 'required')
      const invalidFields = stepContainer.querySelectorAll(':invalid');
      if (invalidFields.length > 0) return false;
      
      // Custom states validation (for hidden inputs or files)
      if (stepNum === 1) {
        if (!eventScale || !eventCategory || !paymentType) return false;
        if (!thumbnailFile || galleryFiles.length === 0) return false;
      }
      if (stepNum === 2) {
        if (!eventType) return false;
      }
      if (stepNum === 3) {
        if (!timezone) return false;
      }
      
      return true;
    };
    
    newValidity[1] = checkStep(1);
    newValidity[2] = checkStep(2);
    newValidity[3] = checkStep(3);
    newValidity[4] = checkStep(4);
    
    setStepValidity(newValidity);
  }, [currentStep, thumbnailFile, galleryFiles, eventScale, eventCategory, paymentType, eventType, timezone, formUpdateTrigger]);`;

if (content.includes(oldUseEffect)) {
  content = content.replace(oldUseEffect, newUseEffect);
} else {
  // Try to find a slightly different spacing just in case
  console.log("Could not find the exact old useEffect string.");
}

fs.writeFileSync(path, content, 'utf8');
console.log("Live validation fixes applied!");
