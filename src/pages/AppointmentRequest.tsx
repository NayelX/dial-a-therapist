import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
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
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function AppointmentRequest() {
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

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.consent) {
      alert("Please provide your consent to proceed.");
      return;
    }
    setStatus('loading');

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
          <button 
            onClick={() => setStatus('idle')}
            className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-stone-900 transition-all"
          >
            Return to Form
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-stone-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tighter mb-6">Book an <span className="text-gold">Appointment</span></h1>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Please complete the intake information and select your preferred appointment slot below.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-stone-100"
        >
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* SECTION 1: INTAKE & CONSENT */}
            <section className="space-y-10">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <ShieldCheck size={24} className="text-gold" />
                <h2 className="text-2xl font-bold">1. Intake & Consent</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Full Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Date of Birth</label>
                  <input 
                    required
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Gender</label>
                  <select 
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Phone Number</label>
                  <input 
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Email Address</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Residential Address</label>
                  <input 
                    required
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Emergency Contact Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({...formData, emergencyContactName: e.target.value})}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Emergency Contact Phone</label>
                  <input 
                    required
                    type="tel"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({...formData, emergencyContactPhone: e.target.value})}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Relevant Medical History</label>
                  <textarea 
                    required
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                    placeholder="List any diagnoses, allergies, or current medications..."
                    rows={3}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Reason for Seeking Therapy</label>
                  <textarea 
                    required
                    value={formData.reasonForVisit}
                    onChange={(e) => setFormData({...formData, reasonForVisit: e.target.value})}
                    placeholder="What are your primary goals for therapy?"
                    rows={3}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  ></textarea>
                </div>
              </div>

              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <h3 className="font-bold mb-3">Consent Agreement</h3>
                <p className="text-sm text-stone-500 mb-4">
                  I consent to receive occupational therapy services from Dial a Therapist GH. I understand that all information shared is confidential, except as required by law.
                </p>
                <div className="flex items-center gap-3">
                  <input 
                    required
                    type="checkbox"
                    id="consent-check"
                    checked={formData.consent}
                    onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                    className="w-5 h-5 accent-gold cursor-pointer"
                  />
                  <label htmlFor="consent-check" className="text-sm font-bold cursor-pointer">
                    I agree to the terms and consent to treatment.
                  </label>
                </div>
              </div>
            </section>

            {/* SECTION 2: APPOINTMENT DETAILS */}
            <section className="space-y-10 pt-10 border-t border-stone-100">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <Calendar size={24} className="text-gold" />
                <h2 className="text-2xl font-bold">2. Appointment Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Service Type</label>
                  <select 
                    required
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  >
                    <option value="">Select a service</option>
                    <option value="Pediatrics OT">Pediatrics Occupational Therapy</option>
                    <option value="Mental Health OT">Mental Health Occupational Therapy</option>
                    <option value="General Consultation">General Consultation</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Preferred Date</label>
                  <input 
                    required
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Preferred Time</label>
                  <input 
                    required
                    type="time"
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({...formData, preferredTime: e.target.value})}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Additional Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any specific concerns or information..."
                  rows={3}
                  className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                ></textarea>
              </div>
            </section>

            <button 
              disabled={status === 'loading'}
              type="submit"
              className="w-full bg-gold text-black py-6 rounded-2xl font-bold text-xl hover:bg-gold-dark transition-all shadow-xl disabled:opacity-50"
            >
              {status === 'loading' ? 'Processing...' : 'Submit Booking Request'}
            </button>
            
            {status === 'error' && (
              <p className="text-red-500 text-center font-bold">Something went wrong. Please try again.</p>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
}
