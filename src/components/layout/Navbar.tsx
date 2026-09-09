import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';
import datLogo from '../../assets/images/dat_logo.jpeg';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;

      if (currentScrollY <= 24) {
        setIsVisible(true);
      } else {
        setIsVisible(isScrollingUp);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Automatic dismissal on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Profile', path: '/profile' },
    { name: 'Impact', path: '/impact' },
    { name: 'Contact', path: '/contact' },
  ];

  const drawerVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };

  const linkItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-gold/20 bg-charcoal/95 text-white backdrop-blur-md transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-11 h-11 rounded-full overflow-hidden border border-gold/40 shadow-sm shrink-0 bg-charcoal-deep">
                  <img
                    src={datLogo}
                    alt="Dial-a-Therapist Ghana Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold tracking-tighter text-gold group-hover:text-gold-light transition-colors">DIAL-A-THERAPIST GHANA</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gold-light/80">Your care is our care</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-gold ${
                    location.pathname === link.path ? 'text-gold' : 'text-white/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                to="/appointment" 
                className="bg-gold hover:bg-gold-dark text-black px-5 py-2.5 rounded-full text-sm font-bold transition-all transform hover:scale-105"
              >
                Book Appointment
              </Link>
            </div>

            {/* Mobile Menu Animated Hamburger Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-nav-drawer"
                className="text-gold p-3 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl hover:bg-white/5 active:scale-95 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
              >
                <div className="w-6 h-5 relative flex flex-col justify-between" aria-hidden="true">
                  <span
                    className={`block h-0.5 w-full bg-gold rounded-full transform transition-all duration-300 origin-left ${
                      isOpen ? 'rotate-45 translate-x-1 -translate-y-0.5' : ''
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-gold rounded-full transition-opacity duration-200 ${
                      isOpen ? 'opacity-0' : 'opacity-100'
                    }`}
                  />
                  <span
                    className={`block h-0.5 w-full bg-gold rounded-full transform transition-all duration-300 origin-left ${
                      isOpen ? '-rotate-45 translate-x-1 translate-y-0.5' : ''
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modern Slide-out Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop Blur Overlay */}
            <motion.div
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-out Drawer from Left */}
            <motion.div
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="relative w-full max-w-[320px] sm:max-w-sm h-full bg-charcoal text-white shadow-[0_12px_32px_-6px_rgba(0,0,0,0.12)] flex flex-col justify-between z-10 border-r border-gold/20 overflow-y-auto"
            >
              {/* Top Drawer Header */}
              <div>
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2.5" aria-label="Dial-a-Therapist Home">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-gold/40 shadow-sm shrink-0 bg-charcoal-deep">
                      <img
                        src={datLogo}
                        alt="Dial-a-Therapist Ghana Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold tracking-tighter text-gold">DIAL-A-THERAPIST</span>
                      <span className="text-[8px] uppercase tracking-[0.2em] text-gold-light/80">Your care is our care</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close navigation menu"
                    className="p-2 min-w-[48px] min-h-[48px] flex items-center justify-center text-gold hover:bg-white/5 rounded-xl transition-colors active:scale-95 focus-visible:ring-2 focus-visible:ring-gold/50"
                  >
                    <div className="w-5 h-5 relative flex items-center justify-center" aria-hidden="true">
                      <span className="absolute block h-0.5 w-5 bg-gold rotate-45 rounded-full" />
                      <span className="absolute block h-0.5 w-5 bg-gold -rotate-45 rounded-full" />
                    </div>
                  </button>
                </div>

                {/* Staggered Navigation Links */}
                <div className="px-4 py-6 space-y-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <motion.div key={link.path} variants={linkItemVariants}>
                        <Link
                          to={link.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center min-h-[48px] px-4 py-3 text-base font-medium rounded-xl transition-all ${
                            isActive
                              ? 'text-gold bg-gold/10 font-bold'
                              : 'text-white/80 hover:text-gold hover:bg-white/5'
                          }`}
                        >
                          <span>{link.name}</span>
                          {isActive && (
                            <span className="ml-auto w-2 h-2 rounded-full bg-gold" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Drawer Section: Quick Contact + Primary CTA */}
              <div className="p-6 border-t border-white/10 bg-charcoal-deep/50 space-y-4">
                <div className="space-y-2 text-xs text-white/60">
                  <a
                    href={`tel:${SITE_CONFIG.phone.e164}`}
                    className="flex items-center gap-3 py-1.5 hover:text-gold transition-colors min-h-[36px]"
                  >
                    <Phone size={14} className="text-gold shrink-0" />
                    <span>{SITE_CONFIG.phone.display}</span>
                  </a>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="flex items-center gap-3 py-1.5 hover:text-gold transition-colors min-h-[36px]"
                  >
                    <Mail size={14} className="text-gold shrink-0" />
                    <span>{SITE_CONFIG.email}</span>
                  </a>
                </div>

                <Link
                  to="/appointment"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full min-h-[48px] px-6 py-3.5 bg-gold hover:bg-gold-dark text-black rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg active:scale-95 text-center"
                >
                  Book Appointment
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
