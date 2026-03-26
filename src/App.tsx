import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Menu, 
  X, 
  ChevronRight, 
  Calendar, 
  Heart, 
  Brain, 
  Users, 
  Award, 
  MessageCircle,
  Stethoscope,
  Activity,
  ShieldCheck,
  LogIn,
  LayoutDashboard,
  LogOut,
  Facebook,
  Instagram
} from 'lucide-react';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Profile from './pages/Profile';
import AppointmentRequest from './pages/AppointmentRequest';
import CommunityImpact from './pages/CommunityImpact';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import { api } from './services/api';

// Components
const Navbar = () => {
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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Profile', path: '/profile' },
    { name: 'Impact', path: '/impact' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-gold/20 bg-charcoal/95 text-white backdrop-blur-md transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-bold tracking-tighter text-gold">DIAL-A-THERAPIST GHANA</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold-light/80">Your care is our care</span>
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

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gold p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-charcoal border-t border-gold/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-white/80 hover:text-gold hover:bg-white/5 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/appointment"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-bold text-gold hover:bg-white/5 rounded-lg"
              >
                Book Appointment
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleFooterLogout = async () => {
    await api.logout();
    navigate('/login');
  };

  return (
    <footer className="bg-charcoal text-white pt-16 pb-8 border-t border-gold/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex flex-col mb-6">
              <span className="text-xl font-bold tracking-tighter text-gold-light">DIAL-A-THERAPIST GHANA</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold-light/80">Your care is our care</span>
            </Link>
            <p className="text-white/75 text-sm leading-relaxed">
              Professional Occupational Therapy services dedicated to improving quality of life through personalized care and community impact.
            </p>
          </div>
          
          <div>
            <h3 className="text-gold font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-gold transition-colors">Our Services</Link></li>
              <li><Link to="/impact" className="hover:text-gold transition-colors">Community Impact</Link></li>
              <li><Link to="/appointment" className="hover:text-gold transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-bold mb-6 uppercase tracking-wider text-sm">Contact Us</h3>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold" />
                <span>+233 (0) 55 298 9900</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold" />
                <span>info@dialatherapistgh.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-gold" />
                <span>Accra, Ghana</span>
              </li>
              <li className="flex items-center gap-6 pt-4">
                <a href="https://facebook.com/DATGhana" target="_blank" rel="noopener noreferrer" className="px-1 text-white/40 hover:text-gold transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="https://instagram.com/dialatherapistgh" target="_blank" rel="noopener noreferrer" className="px-1 text-white/40 hover:text-gold transition-colors">
                  <Instagram size={20} />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gold font-bold mb-6 uppercase tracking-wider text-sm">Working Hours</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="flex justify-between">
                <span>Mon - Fri:</span>
                <span>8:00 AM - 5:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 2:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-gold/60">Closed</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} Dial-a-Therapist Ghana. All rights reserved.
          </p>
          <div className="flex gap-6">
            {isAdminRoute ? (
              <button
                type="button"
                onClick={handleFooterLogout}
                className="text-white/40 hover:text-gold text-xs flex items-center gap-1 transition-colors"
              >
                <LogOut size={12} /> Logout
              </button>
            ) : (
              <Link to="/login" className="text-white/40 hover:text-gold text-xs flex items-center gap-1">
                <LogIn size={12} /> Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

const WhatsAppButton = () => {
  const message = encodeURIComponent("Hello, I would like to inquire about therapy services.");
  const whatsappUrl = `https://wa.me/233599309776?text=${message}`;

  return (
    <div className="fixed bottom-8 right-8 z-50 group">
      <div className="absolute bottom-full right-0 mb-4 w-48 bg-white text-black p-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gold/20">
        <p className="text-xs font-medium">Chat with us on WhatsApp. We respond during working hours.</p>
        <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-white border-r border-b border-gold/20 rotate-45"></div>
      </div>
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#3a9b7a] hover:bg-[#2f8669] text-white p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
      >
        <MessageCircle size={32} />
      </a>
    </div>
  );
};

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col selection:bg-gold/30">
      {!isAdminRoute && <Navbar />}
      <main className={`flex-grow ${isAdminRoute ? '' : 'pt-20'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/appointment" element={<AppointmentRequest />} />
          <Route path="/impact" element={<CommunityImpact />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
