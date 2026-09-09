import { motion } from 'motion/react';
import { Heart, Brain, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../config/site';
import { fadeUpVariant } from '../lib/motion';
import { ReactNode } from 'react';
import pediatricImg from '../assets/images/pediatric_therapy.jpeg';
import mentalHealthImg from '../assets/images/mental_therapy.jpeg';

interface ServiceSectionProps {
  title: string;
  icon: ReactNode;
  color: string;
  items: string[];
  description: string;
}

const ServiceSection = ({ title, icon, color, items, description }: ServiceSectionProps) => {
  const isPediatrics = title.includes('Pediatrics');
  const serviceImage = isPediatrics ? pediatricImg : mentalHealthImg;

  return (
    <motion.div 
      variants={fadeUpVariant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="mb-20"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-4 rounded-2xl ${color} text-white shadow-lg`}>
          {icon}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="order-2 lg:order-1 bg-stone-50 p-8 sm:p-10 rounded-3xl border border-stone-200/80 hover:border-gold/40 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-center">
          <div>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed mb-8">
              {description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {items.map((item: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-gold shrink-0" />
                  <span className="text-stone-800 font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-stone-200/80 aspect-[4/3] max-h-[380px] w-full">
          <img 
            src={serviceImage} 
            alt={title} 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </motion.div>
  );
};

import { usePageSEO } from '../hooks/usePageSEO';

export default function Services() {
  usePageSEO({
    title: 'Occupational Therapy Services & Care Specialties',
    description: 'Explore our specialized occupational therapy programs: Pediatric OT (sensory, motor, milestones) and Mental Health OT (cognitive rehabilitation, vocational skills).',
    canonicalPath: '/services',
  });

  const pediatrics = [
    "Developmental Milestones",
    "Motor Skills Training",
    "Sensory Integration",
    "Cognitive Skills",
    "Self-Care (ADLs)",
    "Caregiver Training",
    "Social Skills",
    "Behavioral Management"
  ];

  const mentalHealth = [
    "Transition to Work Programs",
    "Community Integration",
    "Cognitive Rehabilitation",
    "Job-Seeking Skills",
    "Stress Management",
    "Social Interaction Training",
    "Independent Living Skills",
    "Emotional Regulation"
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-20">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">Our <span className="text-gold">Services</span></h1>
          <p className="text-xl text-stone-600 leading-relaxed">
            We provide comprehensive occupational therapy services across the lifespan, focusing on meaningful activities that promote health and well-being.
          </p>
        </div>

        <ServiceSection 
          title="Pediatrics Occupational Therapy"
          icon={<Heart size={32} />}
          color="bg-gold"
          items={pediatrics}
          description="Our pediatric services are designed to help children achieve their full potential. We work with children facing various developmental, physical, or sensory challenges, using play-based interventions to build essential life skills."
        />

        <ServiceSection 
          title="Mental Health Occupational Therapy"
          icon={<Brain size={32} />}
          color="bg-charcoal"
          items={mentalHealth}
          description="We support individuals with mental health conditions in reclaiming their roles and routines. Our approach focuses on practical strategies for daily living, vocational readiness, and social participation."
        />

        <div className="mt-24 p-12 rounded-[3rem] bg-stone-900 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[200%] bg-gold rotate-45"></div>
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-6">Not sure which service you need?</h3>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">
              Contact us for a brief consultation. We'll help you understand how occupational therapy can benefit you or your loved one.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href={`tel:${SITE_CONFIG.phone.e164}`} className="bg-gold text-black px-8 py-4 rounded-full font-bold hover:bg-gold-dark transition-all">
                Call Us Now
              </a>
              <Link to="/contact" className="border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
