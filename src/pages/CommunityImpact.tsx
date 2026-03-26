import { motion, AnimatePresence } from 'motion/react';
import { Heart, Users, Gift, Info, ExternalLink, Quote, Facebook, ChevronRight, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ImpactStory } from '../types';

const fallbackImpactStories: ImpactStory[] = [
  {
    id: '1',
    title: "A New Beginning for Kofi",
    image: "https://picsum.photos/seed/child-therapy/800/600",
    images: [
      "https://picsum.photos/seed/child-therapy/800/600",
      "https://picsum.photos/seed/child-therapy-2/800/600",
      "https://picsum.photos/seed/child-therapy-3/800/600",
    ],
    summary: "Kofi, a 6-year-old with cerebral palsy, received 6 months of fully sponsored occupational therapy. His progress in motor skills has allowed him to start attending school for the first time.",
    quote: "Seeing Kofi hold a pencil for the first time was a miracle we never thought possible.",
    testimonialAuthor: "Kofi's Mother",
    date: "October 2025 • Sponsored Care",
    fullStoryUrl: "https://facebook.com/dialatherapistgh",
    published: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: "Sensory Room for Grace Special School",
    image: "https://picsum.photos/seed/sensory-room/800/600",
    images: [
      "https://picsum.photos/seed/sensory-room/800/600",
      "https://picsum.photos/seed/sensory-room-2/800/600",
    ],
    summary: "We donated a complete set of sensory integration materials to Grace Special School, benefiting over 40 children with autism. The new equipment helps students regulate their sensory input and improve focus.",
    quote: "The sensory tools have transformed our classroom into a calm, productive space for our students.",
    testimonialAuthor: "Head Teacher, Grace Special School",
    date: "January 2026 • School Support",
    fullStoryUrl: "https://facebook.com/dialatherapistgh",
    published: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: "Mental Health Awareness in Kumasi",
    image: "https://picsum.photos/seed/community-outreach/800/600",
    summary: "Our team conducted a free community workshop in Kumasi, reaching over 150 parents and educators. We focused on early identification of developmental delays and reducing the stigma around mental health.",
    date: "March 2026 • Community Outreach",
    fullStoryUrl: "https://facebook.com/dialatherapistgh",
    published: true,
    createdAt: new Date().toISOString(),
  }
];

export default function CommunityImpact() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});
  const [impactStories, setImpactStories] = useState<ImpactStory[]>(fallbackImpactStories);

  useEffect(() => {
    (async () => {
      try {
        const stories = await api.getImpactStoriesPublic();
        if (stories.length > 0) {
          setImpactStories(stories);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 bg-charcoal text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://picsum.photos/seed/community/1920/1080?grayscale" 
            alt="Community Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-6 border border-gold/30">
              Our Mission in Action
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-none">
              Making a Difference <br />
              <span className="text-gold">Beyond Therapy</span>
            </h1>
            <p className="text-xl text-white/70 leading-relaxed font-light">
              At Dial-A-Therapist Ghana, our commitment to "Your care is our care" extends deep into the communities we serve. We believe that professional healthcare should be accessible to all, especially the most vulnerable among us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Overview */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Our Outreach Initiatives</h2>
              <p className="text-lg text-stone-600 leading-relaxed mb-8">
                We dedicate a portion of our resources and expertise to support those who might otherwise be left behind. Our outreach programs are built on the foundation of sincerity, transparency, and a genuine desire to uplift.
              </p>
              <div className="space-y-6">
                {[
                  { icon: <Heart className="text-gold" />, title: "Sponsored Therapy", desc: "Funding essential sessions for children from low-income families." },
                  { icon: <Users className="text-gold" />, title: "Orphanage Support", desc: "Providing regular developmental screenings and care for children in homes." },
                  { icon: <Gift className="text-gold" />, title: "Special School Supplies", desc: "Donating sensory tools and adaptive equipment to special education centers." },
                  { icon: <ShieldCheck className="text-gold" />, title: "Awareness Programs", desc: "Conducting community workshops to reduce stigma and educate on mental health." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-stone-100">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900">{item.title}</h4>
                      <p className="text-sm text-stone-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/outreach-1/800/800" 
                  alt="Outreach Activity" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-gold-light text-charcoal p-8 rounded-3xl shadow-xl max-w-xs hidden md:block">
                <p className="text-4xl font-bold mb-1 tracking-tighter">100%</p>
                <p className="text-sm font-bold uppercase tracking-wider opacity-80">Direct Impact</p>
                <p className="text-xs mt-2 leading-relaxed">Every initiative is personally managed by our clinical team to ensure maximum benefit.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Impact Stories */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Featured Impact Stories</h2>
            <p className="text-stone-500 max-w-2xl mx-auto">Real stories of change and progress from the communities we support.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {impactStories.map((story) => {
                const storyImages = story.images?.length ? story.images.slice(0, 3) : [story.image];
                const activeIndex = Math.min(activeImageIndexes[story.id] || 0, storyImages.length - 1);
                const activeImage = storyImages[activeIndex];

                return (
              <motion.div 
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={activeImage} 
                    alt={story.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-charcoal/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                      {story.date}
                    </span>
                  </div>
                </div>

                {storyImages.length > 1 && (
                  <div className="px-4 pt-4">
                    <div className="flex gap-2">
                      {storyImages.map((image, index) => (
                        <button
                          key={`${story.id}-thumb-${index}`}
                          type="button"
                          onClick={() => setActiveImageIndexes((prev) => ({ ...prev, [story.id]: index }))}
                          className={`h-12 w-12 rounded-lg overflow-hidden border-2 transition-all ${activeIndex === index ? 'border-charcoal' : 'border-stone-200'}`}
                          title={`View image ${index + 1}`}
                        >
                          <img
                            src={image}
                            alt={`${story.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-4 leading-tight">{story.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-grow">
                    {story.summary}
                  </p>

                  {story.quote && (
                    <div className="mb-6 p-4 bg-gold/5 rounded-xl border-l-2 border-gold italic">
                      <Quote size={16} className="text-gold mb-2" />
                      <p className="text-xs text-stone-700 mb-2">"{story.quote}"</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">— {story.testimonialAuthor}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button 
                      onClick={() => setExpandedId(expandedId === story.id ? null : story.id)}
                      className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-gold transition-colors group"
                    >
                      {expandedId === story.id ? "Show Less" : "Read More"}
                      <ChevronRight size={14} className={`transition-transform ${expandedId === story.id ? 'rotate-90' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {expandedId === story.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 pb-2">
                            <a 
                              href={story.fullStoryUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs font-bold text-gold hover:underline"
                            >
                              View full story on Facebook <ExternalLink size={12} />
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <a 
                      href="/contact"
                      className="w-full py-4 bg-charcoal text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-charcoal-deep transition-all text-center block"
                    >
                      Support This Initiative
                    </a>
                  </div>
                </div>
              </motion.div>
                );
              })}
          </div>

          {/* Transparency Disclaimer */}
          <div className="mt-20 p-8 rounded-3xl bg-stone-50 border border-stone-200 flex items-start gap-4 max-w-4xl mx-auto">
            <Info className="text-gold shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-bold text-stone-900 mb-1">Transparency Disclaimer</h4>
              <p className="text-sm text-stone-500 leading-relaxed italic">
                All community outreach and impact initiatives are managed manually by the Dial a Therapist GH administrative team. Participation and support are subject to current availability, identified community needs, and resource allocation. We operate with full transparency and direct oversight of all sponsored care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facebook CTA Section */}
      <section className="py-24 bg-charcoal-soft text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <Facebook size={48} className="text-gold mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-6">Follow Our Journey</h2>
          <p className="text-xl text-white/60 mb-10 font-light leading-relaxed">
            We regularly share updates, success stories, and upcoming outreach events on our social media. Join our community to stay informed and see the impact of your support.
          </p>
          <a 
            href="https://facebook.com/DATGhana" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gold text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-gold-dark transition-all shadow-2xl transform hover:scale-105"
          >
            Follow us on Facebook <ExternalLink size={20} />
          </a>
        </div>
      </section>
    </div>
  );
}
