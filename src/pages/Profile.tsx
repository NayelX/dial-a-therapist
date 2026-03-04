import { motion } from 'motion/react';
import { Award, Heart, Users, ShieldCheck, Star } from 'lucide-react';
import profileImage from '../assets/images/profile.jpg';

export default function Profile() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Sidebar / Photo */}
          <div className="lg:col-span-4 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-[3rem] overflow-hidden shadow-2xl aspect-[4/5]"
            >
              <img 
                src={profileImage}
                alt="Lead Therapist" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h2 className="text-2xl font-bold">OT. Midred Abrefi Wiredu</h2>
                <p className="text-gold font-medium">Lead Occupational Therapist</p>
              </div>
            </motion.div>
            
            <div className="mt-10 space-y-4">
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-4">
                <Award className="text-gold" size={24} />
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Experience</p>
                  <p className="font-bold">12+ Years Clinical Practice</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-4">
                <Star className="text-gold" size={24} />
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Specialization</p>
                  <p className="font-bold">Pediatrics & Mental Health</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold tracking-tighter mb-8">Professional <span className="text-gold">Profile</span></h1>
              
              <div className="prose prose-lg text-stone-600 max-w-none space-y-8">
                <p className="text-xl leading-relaxed font-medium text-stone-800">
                  OT Mildred Abrefi Wiredu is a dedicated Occupational Therapist with over a decade of experience in providing transformative care to individuals and families across Ghana.
                </p>
                
                <p>
                  Her journey in occupational therapy began with a deep-seated desire to help people overcome barriers to their independence. She holds advanced certifications in Sensory Integration and Cognitive Behavioral Therapy, allowing her to offer a holistic approach to both pediatric and adult mental health.
                </p>

                <h3 className="text-2xl font-bold text-black mt-12 mb-6">Philosophy of Care</h3>
                <p>
                  "I believe that every individual has the right to participate in the activities that bring meaning to their lives. My role is to partner with my clients and their families, providing the tools and strategies needed to navigate life's challenges with confidence and dignity."
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="p-8 rounded-3xl bg-black text-white">
                    <h4 className="text-gold font-bold mb-4 flex items-center gap-2">
                      <Heart size={20} /> Education
                    </h4>
                    <ul className="space-y-3 text-sm text-white/70">
                      <li>• MSc. Occupational Therapy - University of Ghana</li>
                      <li>• BSc. Health Sciences - KNUST</li>
                      <li>• Advanced Diploma in Pediatric OT</li>
                    </ul>
                  </div>
                  <div className="p-8 rounded-3xl bg-stone-100">
                    <h4 className="text-black font-bold mb-4 flex items-center gap-2">
                      <ShieldCheck size={20} className="text-gold" /> Certifications
                    </h4>
                    <ul className="space-y-3 text-sm text-stone-600">
                      <li>• Registered with Allied Health Professions Council</li>
                      <li>• Certified Sensory Integration Specialist</li>
                      <li>• Member of Ghana Society of Occupational Therapists</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-black mt-12 mb-6">Professional Achievements</h3>
                <div className="space-y-6">
                  {[
                    "Established the first community-based OT outreach program in Accra.",
                    "Keynote speaker at the 2022 National Healthcare Symposium.",
                    "Published research on 'Sensory Integration in Urban Ghanaian Schools'.",
                    "Mentored over 50 junior therapists across West Africa."
                  ].map((achievement, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0"></div>
                      <p className="text-stone-700">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-16 p-10 rounded-[2.5rem] bg-gold flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ready to work with Dr. Mensah?</h3>
                  <p className="text-black/70">Schedule your initial consultation today.</p>
                </div>
                <a href="/appointment" className="bg-black text-white px-8 py-4 rounded-full font-bold hover:bg-stone-900 transition-all whitespace-nowrap">
                  Book a Consultation
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
