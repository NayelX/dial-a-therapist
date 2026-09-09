import { motion } from 'motion/react';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock, Facebook, Instagram } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { api } from '../services/api';
import { SITE_CONFIG } from '../config/site';
import { Button } from '../components/common/Button';
import { usePageSEO } from '../hooks/usePageSEO';

export default function Contact() {
  usePageSEO({
    title: 'Contact Us & Clinic Locations',
    description: 'Get in touch with Dial-A-Therapist Ghana in Accra and Kumasi. Call +233 55 298 9900, message on WhatsApp, or send an inquiry online.',
    canonicalPath: '/contact',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Honeypot check: If bot filled the hidden field, silently return success UI without DB write
    if (honeypot) {
      setTimeout(() => {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setHoneypot('');
      }, 500);
      return;
    }

    try {
      await api.createContact(formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">Get in <span className="text-gold">Touch</span></h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Have questions about our services or community initiatives? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="p-8 rounded-[2rem] bg-charcoal text-white">
              <h3 className="text-2xl font-bold mb-8 text-gold">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center text-gold shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Call Us</p>
                    <a href={`tel:${SITE_CONFIG.phone.e164}`} className="font-bold hover:text-gold transition-colors">{SITE_CONFIG.phone.display}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center text-gold shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Email Us</p>
                    <a href={`mailto:${SITE_CONFIG.email}`} className="font-bold hover:text-gold transition-colors">{SITE_CONFIG.email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center text-gold shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-1">Visit Us</p>
                    <p className="font-bold">{SITE_CONFIG.address}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Follow Us</p>
                <div className="flex gap-4">
                  <a 
                    href={SITE_CONFIG.facebookUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
                  >
                    <Facebook size={20} />
                  </a>
                  <a 
                    href={SITE_CONFIG.instagramUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-stone-50 border border-stone-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock size={20} className="text-gold" /> Working Hours
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Monday - Friday</span>
                  <span className="font-bold">{SITE_CONFIG.businessHours.monToFri}</span>
                </li>
                <li className="flex justify-between border-b border-stone-200 pb-2">
                  <span className="text-stone-500">Saturday</span>
                  <span className="font-bold">{SITE_CONFIG.businessHours.saturday}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-stone-500">Sunday</span>
                  <span className="font-bold text-gold">{SITE_CONFIG.businessHours.sunday}</span>
                </li>
              </ul>
            </div>

            <a 
              href={SITE_CONFIG.whatsappBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-charcoal text-canvas border border-gold/40 py-5 rounded-2xl font-bold hover:bg-gold hover:text-charcoal transition-all shadow-lg"
            >
              <MessageCircle size={24} /> Chat on WhatsApp
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-stone-50 p-10 md:p-12 rounded-[3rem] border border-stone-100"
            >
              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 text-black">
                    <Send size={32} />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Message Sent!</h3>
                  <p className="text-stone-600 mb-8">Thank you for contacting us. We will get back to you as soon as possible.</p>
                  <Button 
                    variant="dark"
                    onClick={() => setStatus('idle')}
                    className="rounded-full px-8 py-4"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field for bot deterrence */}
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="contact-website">Leave this field blank</label>
                    <input
                      type="text"
                      id="contact-website"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-400 ml-1">Your Name</label>
                      <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-6 py-4 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-400 ml-1">Email Address</label>
                      <input 
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-6 py-4 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400 ml-1">Subject</label>
                    <input 
                      required
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-6 py-4 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-400 ml-1">Message</label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={6}
                      className="w-full px-6 py-4 bg-white border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>
                  <div className="flex justify-center">
                    <Button 
                      type="submit"
                      variant="dark"
                      isLoading={status === 'loading'}
                      loadingText="Sending..."
                      className="max-w-sm w-full py-5 text-lg"
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
