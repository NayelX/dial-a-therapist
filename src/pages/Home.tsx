import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, Heart, Brain, Users, Award, ShieldCheck, Activity, Stethoscope } from 'lucide-react';

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center bg-[#f6f2e8]">
        <div className="absolute inset-0">
          <picture>
            <source
              media="(min-width: 768px)"
              srcSet="https://images.unsplash.com/photo-1579600161224-cac5a2971069?w=1600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIyfHx8ZW58MHx8fHx8"
            />
            <img
              src="https://images.unsplash.com/photo-1541976844346-f18aeac57b06?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Therapy support session"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-r from-[#f6f2e8]/95 via-[#f6f2e8]/65 to-[#f6f2e8]/20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#fff8e2] border border-gold/40 text-gold-dark text-xs font-bold uppercase tracking-widest mb-6">
              Occupational Therapy Practice
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-charcoal tracking-tighter leading-[1.1] mb-6">
              Your care is <span className="text-gold">our care.</span>
            </h1>
            <p className="text-xl text-charcoal/80 mb-10 leading-relaxed">
              Empowering individuals to live their best lives through specialized occupational therapy services in Ghana. We provide professional, compassionate care tailored to your unique needs.
            </p>
            <div className="flex flex-col gap-4 max-w-xs mx-auto sm:mx-0 sm:flex-row sm:max-w-none">
              <Link 
                to="/appointment" 
                className="bg-gold hover:bg-gold-dark text-black px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                Request Appointment <ChevronRight size={20} />
              </Link>
              <Link 
                to="/services" 
                className="border border-charcoal/20 hover:border-gold/50 text-charcoal px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center bg-white/60"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-gold uppercase tracking-[0.3em] mb-4">Specialized Care</h2>
            <p className="text-4xl md:text-5xl font-bold tracking-tight text-black">Our Core Services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="group p-10 rounded-3xl bg-stone-50 border border-stone-100 hover:border-gold/20 transition-all"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center text-gold mb-8 group-hover:bg-gold group-hover:text-black transition-colors">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Pediatrics Occupational Therapy</h3>
              <p className="text-stone-600 mb-8 leading-relaxed">
                Helping children develop the skills they need for the job of living. We focus on sensory integration, motor skills, and developmental milestones.
              </p>
              <Link to="/services" className="text-gold font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Learn More <ChevronRight size={18} />
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="group p-10 rounded-3xl bg-charcoal text-white border border-white/5 hover:border-gold/20 transition-all"
            >
              <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-black mb-8">
                <Brain size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Mental Health Occupational Therapy</h3>
              <p className="text-white/75 mb-8 leading-relaxed">
                Supporting individuals in managing their mental well-being through cognitive skills training, behavioral management, and community integration.
              </p>
              <Link to="/services" className="text-gold font-bold flex items-center gap-2 hover:gap-4 transition-all">
                Learn More <ChevronRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Impact Highlight */}
      <section className="py-24 bg-stone-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 skew-x-12 transform translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-gold uppercase tracking-[0.3em] mb-4">Making a Difference</h2>
              <p className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-8">Community Impact Initiatives</p>
              <p className="text-lg text-stone-600 mb-10 leading-relaxed">
                We believe that quality therapy should be accessible to everyone. Our initiatives include sponsoring sessions for needy clients and supporting local special schools with essential supplies.
              </p>
              <div className="space-y-6 mb-10">
                {[
                  { icon: <Award size={20} />, text: "Sponsoring therapy for low-income families" },
                  { icon: <Users size={20} />, text: "Donating supplies to special schools" },
                  { icon: <ShieldCheck size={20} />, text: "Community awareness and education" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="text-gold">{item.icon}</div>
                    <span className="font-medium text-stone-800">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link 
                to="/impact" 
                className="inline-block bg-charcoal text-white px-8 py-4 rounded-full font-bold hover:bg-charcoal-deep transition-all"
              >
                View Our Initiatives
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=1000" 
                  alt="Community Impact" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-gold p-8 rounded-2xl shadow-xl hidden md:block">
                <p className="text-black font-bold text-4xl mb-1">100+</p>
                <p className="text-black/70 text-sm font-medium">Families Supported</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                <Stethoscope size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3">Professional Expertise</h4>
              <p className="text-stone-500 text-sm">Highly qualified and experienced therapists dedicated to your progress.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                <Activity size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3">Personalized Plans</h4>
              <p className="text-stone-500 text-sm">Every treatment plan is custom-built to match your specific goals and lifestyle.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                <ShieldCheck size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3">Trustworthy Care</h4>
              <p className="text-stone-500 text-sm">We maintain the highest standards of ethics, privacy, and clinical quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-28 bg-gold-light rounded-tr-[4rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-8 tracking-tight">Ready to start your journey?</h2>
          <p className="text-xl text-charcoal/70 mb-10 max-w-2xl mx-auto">
            Take the first step towards a more independent and fulfilling life. Book your initial consultation today.
          </p>
          <Link 
            to="/appointment" 
            className="inline-block bg-charcoal text-white px-10 py-5 rounded-full font-extrabold tracking-[0.04em] text-lg hover:bg-charcoal-deep transition-all shadow-xl"
          >
            Request Your Appointment Now
          </Link>
        </div>
      </section>
    </div>
  );
}
