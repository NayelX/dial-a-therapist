import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Heart,
  ShieldCheck,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  FileText,
  Activity,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { SelectDropdown } from '../components/common/SelectDropdown';
import { usePageSEO } from '../hooks/usePageSEO';

const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Prefer not to say' },
];

const SERVICE_TYPE_OPTIONS = [
  { value: 'Pediatrics OT', label: 'Pediatrics Occupational Therapy', description: 'Specialized therapy for children and adolescents' },
  { value: 'Mental Health OT', label: 'Mental Health Occupational Therapy', description: 'Holistic support for psychological & emotional wellness' },
  { value: 'General Consultation', label: 'General Consultation', description: 'Initial intake and personalized therapy assessment' },
];

export default function AppointmentRequest() {
  usePageSEO({
    title: 'Book an Appointment & Client Intake Form',
    description: 'Request your specialized occupational therapy consultation with Dial-A-Therapist Ghana. Fast 3-step intake for pediatric or adult therapy.',
    canonicalPath: '/appointment',
  });

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    dob: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    // Medical Info
    medicalHistory: '',
    reasonForVisit: '',
    // Appointment Details
    serviceType: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    consent: false
  });

  const [honeypot, setHoneypot] = useState('');
  const [stepError, setStepError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const steps = [
    { number: 1, title: 'Personal & Contact', icon: User },
    { number: 2, title: 'Medical & Details', icon: Activity },
    { number: 3, title: 'Review & Confirm', icon: ShieldCheck },
  ];

  const validateStep1 = () => {
    if (!formData.fullName.trim()) return 'Please enter your full name.';
    if (!formData.dob.trim()) return 'Please select your date of birth.';
    if (!formData.gender.trim()) return 'Please select your gender.';
    if (!formData.phone.trim()) return 'Please enter your phone number.';
    if (!formData.email.trim()) return 'Please enter your email address.';
    if (!formData.address.trim()) return 'Please enter your residential address.';
    if (!formData.emergencyContactName.trim()) return 'Please enter an emergency contact name.';
    if (!formData.emergencyContactPhone.trim()) return 'Please enter an emergency contact phone number.';
    return null;
  };

  const validateStep2 = () => {
    if (!formData.medicalHistory.trim()) return 'Please provide relevant medical history.';
    if (!formData.reasonForVisit.trim()) return 'Please enter your reason for seeking therapy.';
    if (!formData.serviceType.trim()) return 'Please select a service type.';
    if (!formData.preferredDate.trim()) return 'Please select a preferred date.';
    if (!formData.preferredTime.trim()) return 'Please select a preferred time.';
    return null;
  };

  const handleNext = () => {
    setStepError(null);
    if (currentStep === 1) {
      const error = validateStep1();
      if (error) {
        setStepError(error);
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else if (currentStep === 2) {
      const error = validateStep2();
      if (error) {
        setStepError(error);
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStepError(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStepError(null);

    const step1Err = validateStep1();
    if (step1Err) {
      setCurrentStep(1);
      setStepError(step1Err);
      return;
    }

    const step2Err = validateStep2();
    if (step2Err) {
      setCurrentStep(2);
      setStepError(step2Err);
      return;
    }

    if (!formData.consent) {
      setStepError('Please provide your consent to proceed.');
      return;
    }

    setStatus('loading');

    // Honeypot check: If bot filled the hidden field, silently return success UI without DB write
    if (honeypot) {
      setTimeout(() => {
        setStatus('success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
      return;
    }

    try {
      await api.createAppointment(formData);
      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-24">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-2xl w-full text-center p-12 rounded-[3rem] bg-stone-50 border border-gold/20 shadow-xl"
        >
          <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-8 text-black">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Request Submitted!</h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Thank you for reaching out. We have received your combined intake and appointment request. A confirmation email has been simulated to your inbox. Our team will review your information and contact you shortly to finalize the booking.
          </p>
          <Button 
            variant="dark"
            onClick={() => {
              setStatus('idle');
              setCurrentStep(1);
            }}
            className="max-w-sm mx-auto block rounded-full"
          >
            Return to Form
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-stone-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-4">
            Book an <span className="text-gold">Appointment</span>
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-sm sm:text-base">
            Complete our 3-step intake form to request your personalized therapy consultation.
          </p>
        </div>

        {/* 3-Step Wizard Indicator */}
        <div className="mb-10 bg-white p-4 sm:p-6 rounded-3xl border border-stone-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between relative">
            {/* Step Line Connector */}
            <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 bg-stone-200 -z-0 hidden sm:block" />
            <div 
              className="absolute top-1/2 left-8 -translate-y-1/2 h-0.5 bg-gold transition-all duration-300 -z-0 hidden sm:block"
              style={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : 'calc(100% - 4rem)'
              }}
            />

            {steps.map((step) => {
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              const StepIcon = step.icon;

              return (
                <div key={step.number} className="flex flex-col items-center relative z-10 flex-1">
                  <div 
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-gold text-black shadow-md' 
                        : isCurrent 
                        ? 'bg-charcoal text-white ring-4 ring-gold/20 shadow-lg' 
                        : 'bg-stone-100 text-stone-400 border border-stone-200'
                    }`}
                  >
                    {isCompleted ? <Check size={18} className="stroke-[3]" /> : <StepIcon size={18} />}
                  </div>
                  <span className={`mt-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-center ${
                    isCurrent ? 'text-charcoal' : isCompleted ? 'text-gold-dark' : 'text-stone-400'
                  }`}>
                    Step {step.number}: {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-10 md:p-12 rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-stone-200/80"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Honeypot field for bot deterrence */}
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="appointment-website">Leave this field blank</label>
              <input
                type="text"
                id="appointment-website"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {stepError && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-sm">
                <AlertCircle size={18} className="shrink-0 text-amber-600" />
                <span>{stepError}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {/* STEP 1: Personal Info + Emergency Contact */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div className="border-b border-stone-100 pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                      <User className="text-gold" size={24} />
                      Personal Information & Emergency Contact
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">Please provide the patient details and a reliable contact.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-stone-400">Full Name *</label>
                      <input 
                        required
                        id="fullName"
                        type="text"
                        title="Full Name"
                        placeholder="e.g. Ama Mensah"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="dob" className="text-xs font-bold uppercase tracking-wider text-stone-400">Date of Birth *</label>
                      <input 
                        required
                        id="dob"
                        type="date"
                        title="Date of Birth"
                        value={formData.dob}
                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                        className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <SelectDropdown
                        id="gender"
                        label="Gender"
                        required
                        placeholder="Select Gender"
                        options={GENDER_OPTIONS}
                        value={formData.gender}
                        onChange={(val) => setFormData({ ...formData, gender: val })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-stone-400">Phone Number *</label>
                      <input 
                        required
                        id="phone"
                        type="tel"
                        title="Phone Number"
                        placeholder="e.g. +233 55 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-stone-400">Email Address *</label>
                      <input 
                        required
                        id="email"
                        type="email"
                        title="Email Address"
                        placeholder="e.g. ama@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-stone-400">Residential Address *</label>
                      <input 
                        required
                        id="address"
                        type="text"
                        title="Residential Address"
                        placeholder="e.g. East Legon, Accra"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="emergencyContactName" className="text-xs font-bold uppercase tracking-wider text-stone-400">Contact Name *</label>
                        <input 
                          required
                          id="emergencyContactName"
                          type="text"
                          title="Emergency Contact Name"
                          placeholder="e.g. Kwame Mensah"
                          value={formData.emergencyContactName}
                          onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                          className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="emergencyContactPhone" className="text-xs font-bold uppercase tracking-wider text-stone-400">Contact Phone *</label>
                        <input 
                          required
                          id="emergencyContactPhone"
                          type="tel"
                          title="Emergency Contact Phone"
                          placeholder="e.g. +233 24 000 0000"
                          value={formData.emergencyContactPhone}
                          onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
                          className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Medical History + Reason for Visit + Appointment Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div className="border-b border-stone-100 pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                      <Activity className="text-gold" size={24} />
                      Medical Information & Appointment Details
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">Specify clinical background and choose your preferred session slot.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="medicalHistory" className="text-xs font-bold uppercase tracking-wider text-stone-400">Relevant Medical History *</label>
                      <textarea 
                        required
                        id="medicalHistory"
                        value={formData.medicalHistory}
                        onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                        placeholder="List any diagnoses, allergies, or current medications..."
                        rows={3}
                        className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reasonForVisit" className="text-xs font-bold uppercase tracking-wider text-stone-400">Reason for Seeking Therapy *</label>
                      <textarea 
                        required
                        id="reasonForVisit"
                        value={formData.reasonForVisit}
                        onChange={(e) => setFormData({...formData, reasonForVisit: e.target.value})}
                        placeholder="What are your primary goals for therapy?"
                        rows={3}
                        className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100 space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700">Preferred Appointment Slot</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <SelectDropdown
                          id="serviceType"
                          label="Service Type"
                          required
                          placeholder="Select a service"
                          options={SERVICE_TYPE_OPTIONS}
                          value={formData.serviceType}
                          onChange={(val) => setFormData({ ...formData, serviceType: val })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="preferredDate" className="text-xs font-bold uppercase tracking-wider text-stone-400">Preferred Date *</label>
                        <input 
                          required
                          id="preferredDate"
                          type="date"
                          title="Preferred Date"
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                          className="w-full px-4 py-3 sm:py-4 text-base bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all appearance-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="preferredTime" className="text-xs font-bold uppercase tracking-wider text-stone-400">Preferred Time *</label>
                        <input 
                          required
                          id="preferredTime"
                          type="time"
                          title="Preferred Time"
                          value={formData.preferredTime}
                          onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                          className="w-full px-4 py-3 sm:py-4 text-base bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all appearance-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-stone-400">Additional Notes (Optional)</label>
                      <textarea 
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Any specific concerns, accessibility requirements, or questions..."
                        rows={3}
                        className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Review summary + Consent + Submit */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8"
                >
                  <div className="border-b border-stone-100 pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                      <ShieldCheck className="text-gold" size={24} />
                      Review Summary & Consent
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1">Please review your submitted details before finalizing your request.</p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200/80 space-y-6">
                    {/* Patient & Contact Details */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">1. Personal & Contact</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-stone-500">Name:</span> <strong className="text-charcoal">{formData.fullName || '—'}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500">DOB / Gender:</span> <strong className="text-charcoal">{formData.dob || '—'} ({formData.gender || '—'})</strong>
                        </div>
                        <div>
                          <span className="text-stone-500">Phone:</span> <strong className="text-charcoal">{formData.phone || '—'}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500">Email:</span> <strong className="text-charcoal">{formData.email || '—'}</strong>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-stone-500">Address:</span> <strong className="text-charcoal">{formData.address || '—'}</strong>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-stone-500">Emergency Contact:</span> <strong className="text-charcoal">{formData.emergencyContactName || '—'} ({formData.emergencyContactPhone || '—'})</strong>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-stone-200/60 pt-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">2. Medical & Appointment Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-stone-500">Service:</span> <strong className="text-charcoal">{formData.serviceType || '—'}</strong>
                        </div>
                        <div>
                          <span className="text-stone-500">Slot:</span> <strong className="text-charcoal">{formData.preferredDate || '—'} at {formData.preferredTime || '—'}</strong>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-stone-500">Medical History:</span> <p className="text-stone-800 mt-1 text-xs bg-white p-3 rounded-xl border border-stone-200/60">{formData.medicalHistory || '—'}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-stone-500">Reason for Visit:</span> <p className="text-stone-800 mt-1 text-xs bg-white p-3 rounded-xl border border-stone-200/60">{formData.reasonForVisit || '—'}</p>
                        </div>
                        {formData.notes && (
                          <div className="sm:col-span-2">
                            <span className="text-stone-500">Notes:</span> <p className="text-stone-800 mt-1 text-xs bg-white p-3 rounded-xl border border-stone-200/60">{formData.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Consent Agreement */}
                  <div className="bg-canvas/60 p-6 rounded-2xl border border-stone-200/80">
                    <h3 className="font-bold mb-2 text-charcoal">Consent Agreement</h3>
                    <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
                      I consent to receive occupational therapy services from Dial a Therapist GH. I understand that all information shared is confidential, except as required by law.
                    </p>
                    <div className="flex items-center gap-3">
                      <input 
                        required
                        type="checkbox"
                        id="consent-check"
                        checked={formData.consent}
                        onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                        className="w-5 h-5 accent-gold cursor-pointer rounded"
                      />
                      <label htmlFor="consent-check" className="text-sm font-bold cursor-pointer text-charcoal">
                        I agree to the terms and consent to treatment. *
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} />
                  Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNext}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl flex items-center justify-center gap-2"
                >
                  Continue to Step {currentStep + 1}
                  <ArrowRight size={18} />
                </Button>
              ) : (
                <Button 
                  type="submit"
                  variant="primary"
                  isLoading={status === 'loading'}
                  loadingText="Submitting..."
                  className="w-full sm:w-auto px-10 py-4 text-base rounded-xl"
                >
                  Submit Booking Request
                </Button>
              )}
            </div>
            
            {status === 'error' && (
              <p className="text-red-500 text-center font-bold text-sm">Something went wrong. Please try again.</p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}

