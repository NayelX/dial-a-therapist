import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, LogIn, LogOut } from 'lucide-react';
import { api } from '../../services/api';
import { SITE_CONFIG } from '../../config/site';

export const Footer = () => {
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
                <a href={`tel:${SITE_CONFIG.phone.e164}`} className="hover:text-gold transition-colors">{SITE_CONFIG.phone.display}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-gold transition-colors">{SITE_CONFIG.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="text-gold" />
                <span>{SITE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-6 pt-4">
                <a href={SITE_CONFIG.facebookUrl} target="_blank" rel="noopener noreferrer" className="px-1 text-white/40 hover:text-gold transition-colors">
                  <Facebook size={20} />
                </a>
                <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className="px-1 text-white/40 hover:text-gold transition-colors">
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
                <span>{SITE_CONFIG.businessHours.monToFri}</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>{SITE_CONFIG.businessHours.saturday}</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="text-gold/60">{SITE_CONFIG.businessHours.sunday}</span>
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

export default Footer;
