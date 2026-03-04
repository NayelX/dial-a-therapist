import { motion } from 'motion/react';
import { ShieldCheck, Heart, Users, Award, Target, Eye } from 'lucide-react';

export default function About() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8">About <span className="text-gold">Dial-a-Therapist Ghana</span></h1>
            <p className="text-xl text-stone-600 leading-relaxed mb-8">
              Founded on the principle that quality healthcare should be accessible and compassionate, Dial-a-Therapist Ghana has grown into a leading provider of Occupational Therapy in Ghana.
            </p>
            <p className="text-lg text-stone-500 leading-relaxed mb-10">
              We specialize in helping individuals of all ages overcome physical, sensory, or cognitive challenges that prevent them from participating in daily life activities. Our team of registered therapists uses evidence-based practices to deliver results that matter.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-bold text-gold mb-2">12+</p>
                <p className="text-sm font-bold uppercase tracking-wider text-stone-400">Years Experience</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-gold mb-2">1k+</p>
                <p className="text-sm font-bold uppercase tracking-wider text-stone-400">Lives Impacted</p>
              </div>
            </div>
          </motion.div>
          <div className="relative">
            <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-video lg:aspect-square">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000" 
                alt="Our Clinic" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 bg-black text-white p-8 rounded-3xl shadow-xl hidden md:block border border-gold/20">
              <p className="text-gold font-bold text-lg mb-2 italic">"Your care is our care."</p>
              <p className="text-white/60 text-sm">Our founding philosophy</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          <div className="p-12 rounded-[3rem] bg-stone-50 border border-stone-100">
            <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-black mb-8">
              <Target size={32} />
            </div>
            <h3 className="text-3xl font-bold mb-6">Our Mission</h3>
            <p className="text-lg text-stone-600 leading-relaxed">
              To provide exceptional, person-centered occupational therapy services that empower our clients to achieve their highest level of independence and quality of life through meaningful engagement in daily occupations.
            </p>
          </div>
          <div className="p-12 rounded-[3rem] bg-black text-white border border-white/5">
            <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center text-black mb-8">
              <Eye size={32} />
            </div>
            <h3 className="text-3xl font-bold mb-6 text-gold">Our Vision</h3>
            <p className="text-lg text-white/60 leading-relaxed">
              To be the premier occupational therapy practice in West Africa, recognized for our clinical excellence, innovative approaches, and unwavering commitment to community well-being and social impact.
            </p>
          </div>
        </div>

        <div className="text-center mb-20">
          <h2 className="text-sm font-bold text-gold uppercase tracking-[0.3em] mb-4">Our Core Values</h2>
          <p className="text-4xl font-bold tracking-tight text-black">What Drives Us Every Day</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Heart size={24} />, title: "Compassion", desc: "We treat every client with the same care we would give our own family." },
            { icon: <ShieldCheck size={24} />, title: "Integrity", desc: "We uphold the highest ethical standards in all our professional interactions." },
            { icon: <Award size={24} />, title: "Excellence", desc: "We are committed to continuous learning and clinical best practices." },
            { icon: <Users size={24} />, title: "Inclusivity", desc: "We believe everyone deserves access to quality care, regardless of background." }
          ].map((value, i) => (
            <div key={i} className="text-center p-8 rounded-3xl hover:bg-stone-50 transition-colors">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
                {value.icon}
              </div>
              <h4 className="text-xl font-bold mb-3">{value.title}</h4>
              <p className="text-stone-500 text-sm leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
