"use client";
import dynamic from 'next/dynamic';
import { Toaster, toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, AlertCircle, Calendar, MapPin, User, Phone, Mail, AtSign, Star, FileText, Send, Building, Target, Download, ChevronRight, ChevronLeft, Upload, Plus, X, ImageIcon, Search, Clock, ChevronDown } from 'lucide-react';
import { submitEventFormAction } from '@/app/actions/eventSubmission';
import { compressImageToWebp } from '@/utils/imageCompression';
const LocationPickerWrapper = dynamic(() => import('./LocationPickerWrapper'), { ssr: false, loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-sm border border-slate-200 flex items-center justify-center text-slate-400 font-medium">Memuat Peta...</div> });

const STEPS = [
  "INFORMASI EVENT",
  "LOKASI EVENT",
  "WAKTU & TANGGAL",
  "PENYELENGGARA & SPONSOR",
  "DOKUMEN LAMPIRAN"
];

const STEP_DESCS = [
  "Data dasar mengenai identitas acara",
  "Titik lokasi pelaksanaan",
  "Jadwal pelaksanaan acara",
  "Profil pengampu & target",
  "Media promosi & surat kesediaan"
];

export default function EventSubmissionForm() { 
  const t = useTranslations('EventForm');
  const formRef = useRef<HTMLFormElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [stepValidity, setStepValidity] = useState<Record<number, boolean>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");



  // New fields state
  const [eventScale, setEventScale] = useState('');
  const [eventCategory, setEventCategory] = useState('');
  const [scaleDropdownOpen, setScaleDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  
  const [ticketLinks, setTicketLinks] = useState<string[]>(['']);
  const [mapLocation, setMapLocation] = useState<any>({
    country: 'Indonesia',
    province: 'Jawa Barat',
    city: 'Kota Bandung',
    district: '',
    village: '',
    lat: null,
    lng: null
  });

  const handleMapLocationChange = React.useCallback((loc: any) => {
    const cityStr = (loc.city || '').toLowerCase();
    
    // OpenStreetMap/Nominatim sering mengembalikan "Bandung" untuk Kota Bandung, 
    // dan "Kabupaten Bandung" atau "Kabupaten Bandung Barat" untuk area kabupaten.
    const isKotaBandung = cityStr.includes('bandung') && !cityStr.includes('kabupaten') && !cityStr.includes('barat');
    
    // Side effects (like toast.error) MUST be outside the setMapLocation updater function
    if (loc.city && !isKotaBandung) {
      toast.error("Lokasi di luar jangkauan. Pengajuan event ini khusus untuk wilayah Kota Bandung.", { id: 'out-of-bounds', duration: 4000 });
      return; // Stop here, do not update the location state!
    }
    
    // Only validate if it's a completely new geocoded location with a different lat/lng
    setMapLocation((prev: any) => {
      if (prev.lat === loc.lat && prev.lng === loc.lng && prev.city === loc.city) return prev;
      return loc;
    });
  }, []);
  const [paymentType, setPaymentType] = useState('Gratis');
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);
  const [eventType, setEventType] = useState('');
  const [eventTypeDropdownOpen, setEventTypeDropdownOpen] = useState(false);
  const [timezone, setTimezone] = useState('WIB');
  const [timezoneDropdownOpen, setTimezoneDropdownOpen] = useState(false);
  const [hasRegistration, setHasRegistration] = useState('Tidak');
  const [sponsors, setSponsors] = useState<{name: string, file: File | null}[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [formUpdateTrigger, setFormUpdateTrigger] = useState(0);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  
  // AUTO-SAVE: Load draft on mount
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
          const currentForm = formRef.current;
          if (!currentForm || !draft.nativeData) return;
          Object.entries(draft.nativeData).forEach(([name, value]) => {
            // Skip custom state fields that are already restored
            if (['event_scale', 'event_category', 'payment_type', 'event_type', 'timezone', 'latitude', 'longitude', 'has_registration_radio'].includes(name)) return;
            
            const input = currentForm.querySelector(`[name="${name}"]`) as HTMLInputElement;
            if (input) {
              input.value = value as string;
              if (value) input.setAttribute('data-filled', 'true');
            }
          });
          // Trigger a re-validation now that data is populated
          setFormUpdateTrigger(prev => prev + 1);
          setIsDraftLoaded(true);
        }, 100);
      } catch (e) {
        console.error("Failed to parse draft", e);
        setIsDraftLoaded(true);
      }
    } else {
      setIsDraftLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!formRef.current) return;
    const newValidity: Record<number, boolean> = { ...stepValidity };
    
    const checkStep = (stepNum: number) => {
      const stepContainer = formRef.current?.querySelector(`[data-step="${stepNum}"]`);
      if (!stepContainer) return true;
      
      const reqs = Array.from(stepContainer.querySelectorAll('[required]')) as HTMLInputElement[];
      const invalidFields = reqs.filter(f => !f.value || f.value.trim() === '');
      if (invalidFields.length > 0) return false;
      
      return true;
    };
    
    newValidity[1] = checkStep(1);
    newValidity[2] = checkStep(2);
    newValidity[3] = checkStep(3);
    newValidity[4] = checkStep(4);
    
    setStepValidity(newValidity);
  }, [currentStep, thumbnailFile, galleryFiles, eventScale, eventCategory, paymentType, eventType, timezone, formUpdateTrigger]);
  // AUTO-SAVE: Save draft on any change
  useEffect(() => {
    if (!formRef.current || !isDraftLoaded) return;
    
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


  const handleAddTicket = () => setTicketLinks([...ticketLinks, '']);
  const handleRemoveTicket = (index: number) => setTicketLinks(ticketLinks.filter((_, i) => i !== index));
  const handleTicketChange = (index: number, value: string) => {
    const newLinks = [...ticketLinks];
    newLinks[index] = value;
    setTicketLinks(newLinks);
  };
  
  const handleAddSponsor = () => setSponsors([...sponsors, { name: '', file: null }]);
  const handleRemoveSponsor = (index: number) => setSponsors(sponsors.filter((_, i) => i !== index));
  const handleSponsorNameChange = (index: number, value: string) => {
    const newSponsors = [...sponsors];
    newSponsors[index].name = value;
    setSponsors(newSponsors);
  };
  const handleSponsorFileChange = (index: number, file: File | null) => {
    const newSponsors = [...sponsors];
    newSponsors[index].file = file;
    setSponsors(newSponsors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const target = e.target as unknown as HTMLInputElement | HTMLTextAreaElement;
    if (target.value) {
      target.setAttribute('data-filled', 'true');
    } else {
      target.removeAttribute('data-filled');
    }
    setFormUpdateTrigger(prev => prev + 1);
  };

  // Close dropdowns on outside click
  const closeDropdowns = (e: React.MouseEvent) => {
    // Basic logic: if clicking happens inside the form but not on the buttons, close.
    // For simplicity, we just add this to the form's onClick handler
  };

  const validateStep = (step: number) => {
    if (!formRef.current) return false;
    
    // We get all required inputs in the current step by using a data-step attribute 
    // or by checking visibility.
    const stepContainer = formRef.current.querySelector(`[data-step="${step}"]`);
    if (!stepContainer) return true;

    const requiredFields = stepContainer.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField: any = null;
    
    requiredFields.forEach((field: any) => {
      const parent = field.closest('div');
      
      if (!field.value || field.value.trim() === '') {
        field.classList.add('!border-red-500');
        if (field.type === 'hidden' && field.nextElementSibling?.tagName === 'BUTTON') {
          field.nextElementSibling.classList.add('!border-red-500');
        }
        if (parent) {
          parent.classList.add('field-has-error');
          parent.classList.remove('animate-shake');
          void parent.offsetWidth; // trigger reflow to restart animation
          parent.classList.add('animate-shake');
        }
        isValid = false;
        if (!firstInvalidField) firstInvalidField = field;
      } else {
        field.classList.remove('!border-red-500');
        if (field.type === 'hidden' && field.nextElementSibling?.tagName === 'BUTTON') {
          field.nextElementSibling.classList.remove('!border-red-500');
        }
        if (parent) {
          parent.classList.remove('field-has-error');
          parent.classList.remove('animate-shake');
        }
      }
    });

    if (!isValid) {
      setErrorMsg("Harap lengkapi isian yang bergaris merah.");
      if (firstInvalidField) {
        const scrollToTarget = firstInvalidField.closest('div') || firstInvalidField;
        scrollToTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (firstInvalidField.type !== 'hidden') {
          setTimeout(() => firstInvalidField.focus(), 300);
        }
      }
      return false;
    }

    // Special File Size Validation on Step 5
    if (step === 5) {
      const fileInput = formRef.current.querySelector('input[name="commitment_letter_file"]') as HTMLInputElement;
      if (fileInput?.files && fileInput.files[0]) {
        if (fileInput.files[0].size > 2 * 1024 * 1024) {
          setErrorMsg("Ukuran file Surat Kesediaan maksimal 2 MB.");
          return false;
        }
      } else {
         setErrorMsg("Harap unggah Surat Kesediaan.");
         return false;
      }
    }

    setErrorMsg("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    setErrorMsg(""); // Clear errors when navigating
    document.getElementById('form-stepper-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrorMsg("");
    document.getElementById('form-stepper-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };



  const validateAllSteps = () => {
    if (!formRef.current) return true;
    let incompleteSteps = [];
    
    // Check steps 1 to 5
    for (let i = 1; i <= 5; i++) {
      const stepContainer = formRef.current.querySelector(`[data-step="${i}"]`);
      if (!stepContainer) continue;
      
      const requiredFields = stepContainer.querySelectorAll('[required]');
      let isStepValid = true;
      
      requiredFields.forEach((field: any) => {
        if (!field.value || field.value.trim() === '') {
          field.classList.add('border-red-500');
          isStepValid = false;
        } else {
          field.classList.remove('border-red-500');
        }
      });
      
      if (!isStepValid) {
        incompleteSteps.push(i);
      }
    }
    
    if (incompleteSteps.length > 0) {
        const stepNames = incompleteSteps.map(stepNum => `Langkah ${stepNum} (${STEPS[stepNum-1]})`);
        
        Swal.fire({
          icon: 'warning',
          title: 'Data Belum Lengkap!',
          html: `Mohon lengkapi isian wajib pada tahap berikut:<br/><br/><b>${stepNames.join('<br/>')}</b>`,
          confirmButtonText: 'Lengkapi Sekarang',
          confirmButtonColor: '#f59e0b',
        }).then(() => {
          setCurrentStep(incompleteSteps[0]);
        });
        
        return false;
      }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateAllSteps()) return;

    setIsSubmitting(true);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    
    // Append Ticket Links
    const validTickets = ticketLinks.filter(l => l.trim() !== '');
    formData.append('ticket_links', JSON.stringify(validTickets));
    
    // Append Registration Status
    formData.append('has_registration', hasRegistration === 'Ya' ? 'true' : 'false');
    
    // Append Files
    if (thumbnailFile) {
      formData.append('thumbnail_file', thumbnailFile);
    }
    
    formData.append('gallery_count', galleryFiles.length.toString());
    galleryFiles.forEach((file, idx) => {
      formData.append(`gallery_file_${idx}`, file);
    });
    
    // Append Sponsors
    const sponsorsData = sponsors.map(s => ({ name: s.name }));
    formData.append('sponsors_data', JSON.stringify(sponsorsData));
    sponsors.forEach((s, idx) => {
      if (s.file) formData.append(`sponsor_file_${idx}`, s.file);
    });

    const result = await submitEventFormAction(formData);

    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      setIsSuccess(true);
      localStorage.removeItem('event_form_draft');
    }
  };

  if (isSuccess) {
    return (
      <div className="py-12 px-4 text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Pendaftaran Berhasil!</h3>
        <p className="text-gray-700 text-base leading-relaxed mb-8 max-w-md">
          Terima kasih telah mendaftarkan event Anda di kalender TIC Kota Bandung. Tim kurator kami akan mereviu data secara komprehensif dan menghubungi Anda melalui WhatsApp atau Email.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-sm transition-all shadow-lg active:scale-95"
        >
          Kirim Form Lainnya
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{ 
          style: { 
            zIndex: 99999, 
            fontSize: '16px', 
            padding: '16px 24px',
            maxWidth: '600px',
            marginTop: '30vh',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          } 
        }} 
      />
      {/* Stepper UI */}
      <div id="form-stepper-top" className="mb-10 px-4 sm:px-8 scroll-mt-32">
        <div className="flex justify-between items-center relative">
          {/* Connecting Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-200 z-0"></div>
          
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-amber-500 z-0 transition-all duration-500" style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}></div>

          {STEPS.map((stepName, idx) => {
            const stepNumber = idx + 1;
            const isActive = currentStep === stepNumber;
            const isPassed = currentStep > stepNumber;
            const isValid = isPassed ? (stepValidity[stepNumber] === true) : true;
            
            return (
              <div key={stepName} className="relative z-10 flex flex-col items-center gap-3">
                <div 
                  className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-lg border-2 sm:border-4 transition-colors ${
                    isActive
                      ? 'bg-yellow-50 border-yellow-500 text-yellow-500' 
                      : isPassed 
                        ? (isValid ? 'bg-emerald-50 border-emerald-500 text-emerald-500' : 'bg-yellow-50 border-yellow-500 text-yellow-500')
                        : 'bg-white border-gray-200 text-gray-400'
                  }`}
                >
                  {isPassed ? (isValid ? <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" /> : <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6" />) : stepNumber}
                </div>
                <div className="absolute top-10 sm:top-14 left-1/2 -translate-x-1/2 w-36 text-center flex flex-col gap-0.5">
                  <span className={`text-[10px] sm:text-xs font-bold transition-colors ${
                    isActive ? 'text-yellow-500 block' : isPassed ? (isValid ? 'text-emerald-600 hidden sm:block' : 'text-yellow-500 block') : 'text-gray-400 hidden sm:block'
                  }`}>
                    {stepName}
                  </span>
                  <span className={`hidden sm:block text-[9px] leading-tight transition-colors ${
                    isActive ? 'text-yellow-600/80 font-medium' : isPassed && !isValid ? 'text-yellow-500 font-medium' : 'text-gray-400'
                  }`}>
                    {isValid ? STEP_DESCS[idx] : "Belum Lengkap"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-8"></div> {/* Spacer for the stepper text */}

      <style dangerouslySetInnerHTML={{__html: `
        .field-has-error::after {
          content: 'Wajib diisi';
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 0.375rem;
          display: flex;
          align-items: center;
          line-height: 1;
          font-weight: 500;
          padding-left: 18px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23ef4444' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='8' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='12' y1='16' x2='12.01' y2='16'%3E%3C/line%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: left center;
          background-size: 14px;
          animation: fade-in-up 0.2s ease-out;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}} />
      <form ref={formRef} onClick={() => { setScaleDropdownOpen(false); setCategoryDropdownOpen(false); setPaymentDropdownOpen(false); setEventTypeDropdownOpen(false); setTimezoneDropdownOpen(false); }} onSubmit={handleSubmit} onChange={handleChange} className="space-y-10 relative mt-8">
        {/* Decorative Blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4 text-red-400 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* STEP 1: INFORMASI EVENT */}
        <div data-step="1" className={currentStep === 1 ? 'block animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-3">
            <Star className="w-5 h-5 text-amber-500" />
            {STEPS[0]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Acara <span className="text-red-500">*</span></label>
              <input type="text" name="title" required placeholder={t('eventNamePlaceholder')} className="w-full px-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Acara <span className="text-red-500">*</span></label>
              <textarea name="description" required rows={4} placeholder={t('descPlaceholder')} className="w-full px-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors resize-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Event (Skala) <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="hidden" name="event_scale" value={eventScale} required />
                <button type="button" onClick={(e) => { e.stopPropagation(); setScaleDropdownOpen(!scaleDropdownOpen); setCategoryDropdownOpen(false); }} className={`w-full px-4 py-3 bg-gray-50 border ${scaleDropdownOpen || eventScale ? 'border-amber-500 bg-white' : 'border-gray-200'} rounded-sm text-left flex items-center justify-between text-gray-900 transition-colors`}>
                  <span className={eventScale ? 'text-gray-900' : 'text-slate-500'}>{eventScale || 'Pilih tipe event'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${scaleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {scaleDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                    {['Internasional', 'Nasional', 'Regional', 'Lokal', 'MICE'].map(opt => (
                      <div key={opt} onClick={() => { setEventScale(opt); setScaleDropdownOpen(false); }} className="px-4 py-3 hover:bg-amber-50 cursor-pointer text-gray-800 text-sm border-b border-gray-100 last:border-0 transition-colors">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori Event <span className="text-red-500">*</span></label>
              <div className="relative">
                <input type="hidden" name="event_category" value={eventCategory} required />
                <button type="button" onClick={(e) => { e.stopPropagation(); setCategoryDropdownOpen(!categoryDropdownOpen); setScaleDropdownOpen(false); }} className={`w-full px-4 py-3 bg-gray-50 border ${categoryDropdownOpen || eventCategory ? 'border-amber-500 bg-white' : 'border-gray-200'} rounded-sm text-left flex items-center justify-between text-gray-900 transition-colors`}>
                  <span className={eventCategory ? 'text-gray-900' : 'text-slate-500'}>{eventCategory || 'Pilih kategori event'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {categoryDropdownOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                    {['Music', 'Sport & Wellness', 'Culinary', 'Creative', 'Carnaval', 'Art & Culture', 'MICE'].map(opt => (
                      <div key={opt} onClick={() => { setEventCategory(opt); setCategoryDropdownOpen(false); }} className="px-4 py-3 hover:bg-amber-50 cursor-pointer text-gray-800 text-sm border-b border-gray-100 last:border-0 transition-colors">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nilai Jual Unik (Unique Selling Point) <span className="text-red-500">*</span></label>
              <textarea name="usp" required rows={3} placeholder={t('uspPlaceholder')} className="w-full px-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors resize-none"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Jumlah Pengunjung <span className="text-red-500">*</span></label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="number" name="target_visitors" required placeholder={t('targetPlaceholder')} className="w-full pl-12 pr-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pelaksanaan Ke-berapa Tahun Ini? <span className="text-red-500">*</span></label>
              <input type="number" name="execution_count" required placeholder={t('editionPlaceholder')} className="w-full px-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
            
            {/* New Step 1 Fields */}
            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <ImageIcon className="w-4 h-4" /> Thumbnail Event <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Gambar utama yang ditampilkan di card event pada landing page. Rekomendasi: 1200x800px (rasio 3:2). Format: JPG, PNG, WebP. Maks. 2MB</p>
              <div className="border-2 border-dashed border-gray-300 rounded-sm p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
                <input type="file" accept="image/png, image/jpeg, image/webp" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran thumbnail maksimal 2 MB');
      e.target.value = '';
      setThumbnailFile(null);
    } else {
      setThumbnailFile(file || null);
    }
  }} />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <Upload className="w-8 h-8 text-gray-400" />
                  {thumbnailFile ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-full max-w-[200px] aspect-[3/2] mb-2 rounded-sm overflow-hidden border border-gray-200 shadow-sm">
                        <img src={URL.createObjectURL(thumbnailFile)} alt="Thumbnail Preview" className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                      <p className="font-semibold text-amber-600 text-sm truncate max-w-[200px]">{thumbnailFile.name}</p>
                    </div>
                  ) : <>
                    <p className="text-sm font-medium text-gray-700">Klik untuk upload atau drag and drop</p>
                    <p className="text-xs text-gray-500">JPG, PNG, atau WebP (Maks. 2MB) - Rekomendasi 1200x800px</p>
                  </>}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <ImageIcon className="w-4 h-4" /> Galeri Event <span className="text-red-500">*</span> <span className="text-xs text-gray-400 font-normal">(Min. 1 gambar)</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Rekomendasi minimal 1200x800px per gambar. Format: JPG, PNG, WebP, GIF. Maks. 1MB per file</p>
              <div className="border-2 border-dashed border-amber-200 rounded-sm p-8 text-center bg-amber-50/30 hover:bg-amber-50 transition-colors relative">
                <input type="file" accept="image/*" multiple required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => f.size <= 1 * 1024 * 1024);
    if (files.length > validFiles.length) {
      toast.error('Beberapa gambar diabaikan karena lebih dari 1 MB');
    }
    if (validFiles.length > 5) {
      toast.error('Maksimal 5 gambar diperbolehkan');
    }
    setGalleryFiles(validFiles.slice(0, 5));
    if (validFiles.length === 0) e.target.value = '';
  }} />
                <div className="flex flex-col items-center gap-2 pointer-events-none">
                  <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white"><Upload className="w-6 h-6" /></div>
                  <p className="text-sm font-medium text-gray-700">Drag & drop gambar di sini, atau <span className="text-amber-500">pilih file</span></p>
                  <p className="text-xs text-gray-500">Format: JPG, PNG, WebP, GIF. Rekomendasi: 1200x800px. (Maks. 1MB per file, Max 5 file)</p>
                  {galleryFiles.length > 0 && (
                    <div className="flex flex-wrap gap-3 justify-center mt-4">
                      {galleryFiles.map((file, idx) => (
                        <div key={idx} className="relative w-24 h-24 rounded-sm overflow-hidden border border-gray-200 shadow-sm group">
                          <img src={URL.createObjectURL(file)} alt={`Gallery ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                            <span className="text-[10px] text-white truncate px-1 w-full text-center">{file.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link Instagram</label>
                <input type="url" name="instagram" placeholder="https://instagram.com/..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-gray-900 outline-none focus:border-amber-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link Info Selengkapnya</label>
                <input type="url" name="additional_info_link" placeholder="https://website-event.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-gray-900 outline-none focus:border-amber-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Pembayaran <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="hidden" name="payment_type" value={paymentType} required />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setPaymentDropdownOpen(!paymentDropdownOpen); setScaleDropdownOpen(false); setCategoryDropdownOpen(false); setEventTypeDropdownOpen(false); setTimezoneDropdownOpen(false); }} className={`w-full px-4 py-3 bg-gray-50 border ${paymentDropdownOpen ? 'border-amber-500 bg-white' : 'border-gray-200'} rounded-sm text-left flex items-center justify-between text-gray-900 transition-colors`}>
                    <span className="text-gray-900">{paymentType}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${paymentDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {paymentDropdownOpen && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                      {['Gratis', 'Berbayar'].map(opt => (
                        <div key={opt} onClick={() => { setPaymentType(opt); setPaymentDropdownOpen(false); }} className="px-4 py-3 hover:bg-amber-50 cursor-pointer text-gray-800 text-sm border-b border-gray-100 last:border-0 transition-colors">
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {paymentType === 'Berbayar' && (
              <div className="md:col-span-2 mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Link Pembelian Tiket</label>
                <div className="space-y-3">
                  {ticketLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <input type="url" value={link} onChange={(e) => handleTicketChange(idx, e.target.value)} placeholder="https://tiket.com/..." className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm text-gray-900 outline-none focus:border-amber-500 transition-colors" />
                      {ticketLinks.length > 1 && (
                        <button type="button" onClick={() => handleRemoveTicket(idx)} className="p-3 text-red-500 hover:bg-red-50 rounded-sm transition-colors"><X className="w-5 h-5" /></button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={handleAddTicket} className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 mt-2 px-4 py-2 border border-dashed border-amber-300 rounded-sm hover:bg-amber-50 transition-colors">
                    <Plus className="w-4 h-4" /> Tambah link tiket
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STEP 2: LOKASI EVENT */}
        <div data-step="2" className={currentStep === 2 ? 'block animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-3">
            <MapPin className="w-5 h-5 text-amber-500" />
            {STEPS[1]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Acara <span className="text-red-500">*</span></label>
              <div className="relative mb-4 z-[1000]">
                <input type="hidden" name="event_type" value={eventType} required />
                <button type="button" onClick={(e) => { e.stopPropagation(); setEventTypeDropdownOpen(!eventTypeDropdownOpen); setScaleDropdownOpen(false); setCategoryDropdownOpen(false); setPaymentDropdownOpen(false); setTimezoneDropdownOpen(false); }} className={`w-full px-4 py-3 bg-gray-50 border ${eventTypeDropdownOpen || eventType ? 'border-amber-500 bg-white' : 'border-gray-200'} rounded-sm text-left flex items-center justify-between text-gray-900 transition-colors`}>
                  <span className={eventType ? 'text-gray-900' : 'text-slate-500'}>{eventType === 'OFFLINE' ? 'Offline (Luring)' : eventType === 'ONLINE' ? 'Online (Daring)' : eventType === 'HYBRID' ? 'Hybrid' : 'Pilih Tipe Acara'}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${eventTypeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {eventTypeDropdownOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                    {[{val: 'OFFLINE', label: 'Offline (Luring)'}, {val: 'ONLINE', label: 'Online (Daring)'}, {val: 'HYBRID', label: 'Hybrid'}].map(opt => (
                      <div key={opt.val} onClick={() => { setEventType(opt.val); setEventTypeDropdownOpen(false); }} className="px-4 py-3 hover:bg-amber-50 cursor-pointer text-gray-800 text-sm border-b border-gray-100 last:border-0 transition-colors">
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi pada Peta (Opsional)</label>
              <LocationPickerWrapper onLocationChange={handleMapLocationChange} isActive={currentStep === 2} />
              
              {/* Hidden inputs for coordinates only */}
              <input type="hidden" name="latitude" value={mapLocation?.lat || ''} />
              <input type="hidden" name="longitude" value={mapLocation?.lng || ''} />
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Negara <span className="text-red-500">*</span></label>
                <input type="text" required name="country" value={mapLocation?.country || ''} onChange={(e) => setMapLocation((prev: any) => ({...prev, country: e.target.value}))} placeholder="Contoh: Indonesia" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-sm text-gray-900 outline-none focus:border-amber-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provinsi <span className="text-red-500">*</span></label>
                <input type="text" required name="province" value={mapLocation?.province || ''} onChange={(e) => setMapLocation((prev: any) => ({...prev, province: e.target.value}))} placeholder="Contoh: Jawa Barat" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-sm text-gray-900 outline-none focus:border-amber-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kabupaten/Kota <span className="text-red-500">*</span></label>
                <input type="text" required name="city" value={mapLocation?.city || ''} onChange={(e) => setMapLocation((prev: any) => ({...prev, city: e.target.value}))} placeholder="Contoh: Kota Bandung" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-sm text-gray-900 outline-none focus:border-amber-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan <span className="text-red-500">*</span></label>
                <input type="text" required name="district" value={mapLocation?.district || ''} onChange={(e) => setMapLocation((prev: any) => ({...prev, district: e.target.value}))} placeholder="Contoh: Sumur Bandung" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-sm text-gray-900 outline-none focus:border-amber-500 text-sm" />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Detail Alamat / Patokan <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" name="location" required placeholder="Contoh: Gedung Sate, sebelah barat lapangan" className="w-full pl-12 pr-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* STEP 3: WAKTU & TANGGAL */}
        <div data-step="3" className={currentStep === 3 ? 'block animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-3">
            <Calendar className="w-5 h-5 text-amber-500" />
            {STEPS[2]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Kolom Kiri: Periode Event */}
            <div>
              <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-500" /> Periode Event
              </h4>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai <span className="text-red-500">*</span></label>
                  <div className="relative">
                    
                    <input type="date" name="start_date" required style={{ colorScheme: 'light' }} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-gray-900 outline-none focus:border-amber-500 transition-colors appearance-none text-sm" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Mulai <span className="text-red-500">*</span></label>
                  <div className="relative">
                    
                    <input type="time" name="start_time" required style={{ colorScheme: 'light' }} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-gray-900 outline-none focus:border-amber-500 transition-colors appearance-none text-sm" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir <span className="text-red-500">*</span></label>
                  <div className="relative">
                    
                    <input type="date" name="end_date" required style={{ colorScheme: 'light' }} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-gray-900 outline-none focus:border-amber-500 transition-colors appearance-none text-sm" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Waktu Akhir <span className="text-red-500">*</span></label>
                  <div className="relative">
                    
                    <input type="time" name="end_time" required style={{ colorScheme: 'light' }} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-sm text-gray-900 outline-none focus:border-amber-500 transition-colors appearance-none text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zona Waktu (Timezone) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input type="hidden" name="timezone" value={timezone} required />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setTimezoneDropdownOpen(!timezoneDropdownOpen); setScaleDropdownOpen(false); setCategoryDropdownOpen(false); setPaymentDropdownOpen(false); setEventTypeDropdownOpen(false); }} className={`w-full px-4 py-3 bg-gray-50 border ${timezoneDropdownOpen ? 'border-amber-500 bg-white' : 'border-gray-200'} rounded-sm text-left flex items-center justify-between text-gray-900 transition-colors`}>
                    <span className="text-gray-900">{timezone}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${timezoneDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {timezoneDropdownOpen && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                      {['WIB', 'WITA', 'WIT'].map(opt => (
                        <div key={opt} onClick={() => { setTimezone(opt); setTimezoneDropdownOpen(false); }} className="px-4 py-3 hover:bg-amber-50 cursor-pointer text-gray-800 text-sm border-b border-gray-100 last:border-0 transition-colors">
                          {opt === 'WIB' ? 'WIB (Waktu Indonesia Barat)' : opt === 'WITA' ? 'WITA (Waktu Indonesia Tengah)' : 'WIT (Waktu Indonesia Timur)'}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Kolom Kanan: Registrasi Peserta */}
            <div>
              <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-500" /> Registrasi Peserta
              </h4>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">Apakah ada registrasi peserta?</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="has_registration_radio" value="Ya" checked={hasRegistration === 'Ya'} onChange={(e) => setHasRegistration(e.target.value)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Ya</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="has_registration_radio" value="Tidak" checked={hasRegistration === 'Tidak'} onChange={(e) => setHasRegistration(e.target.value)} className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Tidak</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 4: PENYELENGGARA & SPONSOR */}
        <div data-step="4" className={currentStep === 4 ? 'block animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-3">
            <User className="w-5 h-5 text-amber-500" />
            {STEPS[3]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-8">
              {/* Penyelenggara */}
              <div>
                <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-4">Penyelenggara</h4>
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input type="text" name="eo_name" required placeholder="Cari penyelenggara (min. 2 karakter)" className="w-full px-4 py-3 pr-12 bg-white border border-gray-200 rounded-sm text-gray-900 outline-none focus:border-amber-500 transition-colors shadow-sm" />
                </div>
              </div>

              {/* Sponsor Event */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">Sponsor Event</h4>
                  <button type="button" onClick={handleAddSponsor} className="flex items-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-sm hover:bg-amber-100 transition-colors">
                    <Plus className="w-4 h-4" /> Tambah Sponsor
                  </button>
                </div>
                
                <div className="space-y-6">
                  {sponsors.map((sponsor, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-sm p-5 bg-white relative">
                      <button type="button" onClick={() => handleRemoveSponsor(idx)} className="absolute -top-3 -right-3 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm">
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Sponsor {idx + 1}</label>
                        <input type="text" value={sponsor.name} onChange={(e) => handleSponsorNameChange(idx, e.target.value)} placeholder="Masukkan nama sponsor" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-sm text-gray-900 outline-none focus:border-amber-500 transition-colors" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo/Gambar</label>
                        <div className="border-2 border-dashed border-amber-200 rounded-sm p-6 text-center bg-amber-50/20 hover:bg-amber-50 transition-colors relative">
                          <input type="file" accept="image/png, image/jpeg, image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 1 * 1024 * 1024) {
      toast.error('Ukuran logo sponsor maksimal 1 MB');
      e.target.value = '';
      handleSponsorFileChange(idx, null);
    } else {
      handleSponsorFileChange(idx, file || null);
    }
  }} />
                          <div className="flex flex-col items-center gap-2 pointer-events-none">
                            <Upload className="w-6 h-6 text-gray-400" />
                            {sponsor.file ? (
                              <div className="flex flex-col items-center">
                                <div className="relative w-16 h-16 mb-2 rounded-sm overflow-hidden border border-gray-200 bg-white">
                                  <img src={URL.createObjectURL(sponsor.file)} alt="Sponsor Logo" className="absolute inset-0 w-full h-full object-contain" />
                                </div>
                                <p className="font-semibold text-amber-600 text-xs truncate max-w-[120px]">{sponsor.file.name}</p>
                              </div>
                            ) : <p className="text-sm text-gray-600">Maks. 1MB per logo</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {sponsors.length === 0 && (
                    <div className="text-center p-6 border border-dashed border-gray-300 rounded-sm bg-gray-50 text-gray-500 text-sm">
                      Belum ada sponsor yang ditambahkan
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Penanggung Jawab Acara <span className="text-red-500">*</span></label>
              <input type="text" name="pic_name" required placeholder={t('picNamePlaceholder')} className="w-full px-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor WhatsApp PIC <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="tel" name="whatsapp" required placeholder={t('picPhonePlaceholder')} className="w-full pl-12 pr-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email PIC <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" name="email" required placeholder="email@contoh.com" className="w-full pl-12 pr-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Akun Instagram Acara <span className="text-red-500">*</span></label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" name="instagram" required placeholder="@namainstagram" className="w-full pl-12 pr-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('kol')}</label>
              <input type="text" name="kol_partner" placeholder={t('kolPlaceholder')} className="w-full px-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('lineup')}</label>
              <input type="text" name="artist_performance" placeholder={t('lineupPlaceholder')} className="w-full px-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* STEP 5: DOKUMEN LAMPIRAN */}
        <div data-step="5" className={currentStep === 5 ? 'block animate-in fade-in slide-in-from-right-4 duration-300' : 'hidden'}>
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-200 pb-3">
            <FileText className="w-5 h-5 text-amber-500" />
            {STEPS[4]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Promosi (Google Drive Link) <span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-3">{t('mediaDesc')}</p>
              <input type="url" name="promotion_media" required placeholder="https://drive.google.com/..." className="w-full px-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div className="bg-gray-50 p-5 rounded-sm border border-gray-200 border-dashed hover:border-amber-500/50 transition-colors">
              <label className="block text-sm font-medium text-gray-700 mb-2">Proposal, Poster, atau Berkas Penunjang <span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-4">{t('proposalDesc')}</p>
              <input type="url" name="attachment_link" required placeholder="https://..." className="w-full px-4 py-3 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div className="bg-gray-50 p-5 rounded-sm border border-gray-200 border-dashed hover:border-amber-500/50 transition-colors">
              <label className="block text-sm font-medium text-gray-700 mb-2">Surat Kesediaan Laporan Pasca Event <span className="text-red-500">*</span></label>
              <p className="text-xs text-gray-500 mb-4">{t('letterDesc')}</p>
              <input type="file" name="commitment_letter_file" accept=".pdf,.doc,.docx" required onChange={(e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran surat maksimal 2 MB');
      e.target.value = '';
    }
  }} className="w-full px-4 py-2.5 bg-gray-50 data-[filled]:bg-white data-[filled]:text-gray-900 border border-gray-200 data-[filled]:valid:border-amber-500 data-[filled]:invalid:border-red-500 data-[filled]:invalid:text-red-900 data-[filled]:invalid:bg-red-50 focus:invalid:border-red-500 rounded-sm text-gray-900 placeholder-slate-500 outline-none focus:border-amber-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-amber-500 file:text-white hover:file:bg-amber-600 cursor-pointer" />
              <a href="/ASET%20VISUAL/surat/FORMAT%20SURAT%20PERNYATAAN%20KESANGGUPAN%20COE.docx" download className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 rounded-sm text-xs text-white font-bold transition-colors shadow-sm w-fit">
                <Download className="w-4 h-4" /> Unduh Template Surat
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-6 mt-6 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
          {currentStep > 1 ? (
            <button 
              type="button" 
              onClick={handlePrev}
              className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-900 font-bold rounded-sm transition-all flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              Kembali
            </button>
          ) : <div></div>}

          {currentStep < STEPS.length ? (
            <button 
              type="button" 
              onClick={handleNext}
              className="w-full sm:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold rounded-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Selanjutnya
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-[#00C853] hover:bg-[#00b047] active:scale-95 text-gray-900 font-bold rounded-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isCompressing ? 'Mengompresi aset...' : 'Memproses...'}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Kirim Pengajuan
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
