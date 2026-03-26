import { motion } from 'motion/react';
import { Award, Heart, Users, ShieldCheck, Star } from 'lucide-react';
import profileImage from '../assets/images/profile.jpg';

export default function Profile() {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
          {/* Sidebar / Photo */}
          <div className="xl:col-span-4 relative xl:sticky xl:top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative rounded-l-[3rem] rounded-tr-[1.75rem] rounded-br-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5]"
            >
              <img 
                src={profileImage}
                alt="Lead Therapist" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-charcoal/80 to-transparent text-white">
                <h2 className="text-2xl font-bold">OT Mildred A. Wiredu</h2>
                <p className="text-gold font-medium">Lead Occupational Therapist</p>
              </div>
            </motion.div>
            
            <div className="mt-10 space-y-4">
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-4">
                <Award className="text-gold" size={24} />
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Experience</p>
                  <p className="font-bold">Practicing Since 2016</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-4">
                <Star className="text-gold" size={24} />
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Specialization</p>
                  <p className="font-bold">Mental Health, Pediatrics & School-Based OT</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl font-bold tracking-tighter mb-8">Professional <span className="text-gold">Profile</span></h1>
              
              <div className="prose prose-lg text-stone-600 max-w-none space-y-8">
                <p className="text-xl leading-relaxed font-medium text-stone-800">
                  Mildred A. Wiredu is a registered and licensed Occupational Therapist trained at the University of the Witwatersrand, Johannesburg, South Africa, and actively practicing in Ghana since 2016.
                </p>
                
                <p>
                  She is registered with both the Health Professions Council of South Africa (HPCSA) and the Allied Health Professions Council of Ghana (AHPC), with work experience in both countries. She also holds a background in Biological Science from Kwame Nkrumah University of Science and Technology (KNUST), Kumasi.
                </p>

                <p>
                  Mildred currently serves at Pantang Hospital as Deputy Head of the Occupational Therapy Department, where she provides assessment and therapy for adults and children with diverse mental health and developmental needs.
                </p>

                <h3 className="text-2xl font-bold text-black mt-12 mb-6">Philosophy of Care</h3>
                <p>
                  "Everyone deserves a chance regardless of physical, emotional, or mental state. Occupational Therapy is my calling, and I am committed to helping people move forward in doing, being, and becoming."
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                  <div className="p-8 rounded-3xl bg-charcoal text-white">
                    <h4 className="text-gold font-bold mb-4 flex items-center gap-2">
                      <Heart size={20} /> Education
                    </h4>
                    <ul className="space-y-3 text-sm text-white/70">
                      <li>• Occupational Therapy Training - University of the Witwatersrand, South Africa</li>
                      <li>• Biological Science Background - KNUST, Ghana</li>
                      <li>• Ongoing Clinical Development in Mental Health and Pediatrics</li>
                    </ul>
                  </div>
                  <div className="p-8 rounded-3xl bg-stone-100">
                    <h4 className="text-black font-bold mb-4 flex items-center gap-2">
                      <ShieldCheck size={20} className="text-gold" /> Certifications
                    </h4>
                    <ul className="space-y-3 text-sm text-stone-600">
                      <li>• Registered with HPCSA (South Africa)</li>
                      <li>• Registered with AHPC (Ghana)</li>
                      <li>• Member, Pediatric Society of Ghana</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-black mt-12 mb-6">Professional Highlights</h3>
                <div className="space-y-6">
                  {[
                    "Deputy Head, Occupational Therapy Department at Pantang Hospital.",
                    "Former School-Based Occupational Therapist in an inclusive international school in Accra.",
                    "Founder of Dial-A-Therapist Ghana, providing individualized home-based therapy services.",
                    "Active advocate for inclusive education through media talks and public awareness initiatives."
                  ].map((achievement, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0"></div>
                      <p className="text-stone-700">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-16 p-10 rounded-[2.5rem] bg-gold-light flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Ready to work with OT Mildred?</h3>
                  <p className="text-charcoal/70">Schedule your initial consultation today.</p>
                </div>
                <a href="/appointment" className="bg-charcoal text-white px-8 py-4 rounded-full font-bold hover:bg-charcoal-deep transition-all whitespace-nowrap">
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
