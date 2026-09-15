const fs = require('fs');
const path = 'apps/web/src/components/public/EventSubmissionForm.tsx';
let content = fs.readFileSync(path, 'utf8');

// We need to inject the Autosave logic.

// 1. Find a place to put the load draft useEffect (after other useEffects)
const insertionPoint = `  useEffect(() => {
    if (!formRef.current) return;
    const newValidity: Record<number, boolean> = { ...stepValidity };`;

const loadDraftLogic = `  // AUTO-SAVE: Load draft on mount
  useEffect(() => {
    const draftStr = localStorage.getItem('event_form_draft');
    if (draftStr && formRef.current) {
      try {
        const draft = JSON.parse(draftStr);
        if (draft.customState) {
          if (draft.customState.currentStep) setCurrentStep(draft.customState.currentStep);
          if (draft.customState.eventScale) setEventScale(draft.customState.eventScale);
          if (draft.customState.eventCategory) setEventCategory(draft.customState.eventCategory);
          if (draft.customState.paymentType) setPaymentType(draft.customState.paymentType);
          if (draft.customState.eventType) setEventType(draft.customState.eventType);
          if (draft.customState.timezone) setTimezone(draft.customState.timezone);
          if (draft.customState.hasRegistration) setHasRegistration(draft.customState.hasRegistration);
          if (draft.customState.mapLocation) setMapLocation(draft.customState.mapLocation);
          if (draft.customState.ticketLinks) setTicketLinks(draft.customState.ticketLinks);
          if (draft.customState.sponsors) {
            setSponsors(draft.customState.sponsors.map((s: any) => ({ name: s.name, file: null })));
          }
        }
        
        // Give React a tick to render dynamic fields (like ticket links) before restoring native inputs
        setTimeout(() => {
          if (!formRef.current || !draft.nativeData) return;
          Object.entries(draft.nativeData).forEach(([name, value]) => {
            // Skip custom state fields that are already restored
            if (['event_scale', 'event_category', 'payment_type', 'event_type', 'timezone', 'latitude', 'longitude', 'has_registration_radio'].includes(name)) return;
            
            const input = formRef.current.querySelector(\`[name="\${name}"]\`);
            if (input) {
              input.value = value;
              if (value) input.setAttribute('data-filled', 'true');
            }
          });
          // Trigger a re-validation now that data is populated
          setFormUpdateTrigger(prev => prev + 1);
        }, 100);
      } catch (e) {
        console.error("Failed to parse draft", e);
      }
    }
  }, []);

`;

if (!content.includes('event_form_draft')) {
  content = content.replace(insertionPoint, loadDraftLogic + insertionPoint);
}

// 2. We need to save the draft whenever formUpdateTrigger changes
const saveDraftLogic = `
  // AUTO-SAVE: Save draft on any change
  useEffect(() => {
    if (!formRef.current) return;
    
    // We don't save files as they can't be stored in localStorage easily
    const formData = new FormData(formRef.current);
    const nativeData: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (typeof value === 'string') nativeData[key] = value;
    });

    const draft = {
      nativeData,
      customState: {
        currentStep,
        eventScale,
        eventCategory,
        paymentType,
        eventType,
        timezone,
        hasRegistration,
        mapLocation,
        ticketLinks,
        sponsors: sponsors.map(s => ({ name: s.name }))
      }
    };
    
    localStorage.setItem('event_form_draft', JSON.stringify(draft));
  }, [formUpdateTrigger, currentStep, eventScale, eventCategory, paymentType, eventType, timezone, hasRegistration, mapLocation, ticketLinks, sponsors]);
`;

const validationUseEffectEnd = `setStepValidity(newValidity);
  }, [currentStep, thumbnailFile, galleryFiles, eventScale, eventCategory, paymentType, eventType, timezone, formUpdateTrigger]);`;

if (!content.includes('localStorage.setItem')) {
  content = content.replace(validationUseEffectEnd, validationUseEffectEnd + saveDraftLogic);
}

// 3. Clear draft on successful submission
const submitLogic = `setIsSuccess(true);`;
const clearDraftLogic = `setIsSuccess(true);
      localStorage.removeItem('event_form_draft');`;

content = content.replace(submitLogic, clearDraftLogic);


fs.writeFileSync(path, content, 'utf8');
console.log("Autosave via localStorage injected!");
