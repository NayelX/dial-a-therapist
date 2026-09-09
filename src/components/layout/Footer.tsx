import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, LogIn, LogOut } from 'lucide-react';
import { api } from '../../services/api';
import { SITE_CONFIG } from '../../config/site';
import datLogo from '../../assets/images/dat_logo.jpeg';

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const handleFooterLogout = async () => {
    await api.logout();
    navigate('/login');
  };

  return (
    <footer className="bg-charcoal text-white pt-8 pb-6 sm:pt-16 sm:pb-8 border-t border-gold/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-12 mb-8 md:mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 sm:mb-6 group">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/40 shadow-sm shrink-0 bg-charcoal-deep">
                <img
                  src={datLogo}
                  alt="Dial-a-Therapist Ghana Logo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tighter text-gold-light">DIAL-A-THERAPIST GHANA</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-gold-light/80">Your care is our care</span>
              </div>
            </Link>
            <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
              Professional Occupational Therapy services dedicated to improving quality of life through personalized care and community impact.
            </p>
          </div>
          
          {/* Mini 2-column grid on mobile for Quick Links & Working Hours to cut vertical height, standard columns on md+ */}
          <div className="grid grid-cols-2 gap-4 md:contents">
            <div className="md:col-span-1">
              <h3 className="text-gold font-bold mb-3 sm:mb-6 uppercase tracking-wider text-xs sm:text-sm">Quick Links</h3>
              <ul className="space-y-2.5 sm:space-y-4 text-xs sm:text-sm text-white/60">
                <li><Link to="/about" className="hover:text-gold transition-colors">About Us</Link></li>
                <li><Link to="/services" className="hover:text-gold transition-colors">Our Services</Link></li>
                <li><Link to="/impact" className="hover:text-gold transition-colors">Community Impact</Link></li>
                <li><Link to="/appointment" className="hover:text-gold transition-colors">Book Appointment</Link></li>
              </ul>
            </div>

            <div className="md:col-span-1 md:order-last">
              <h3 className="text-gold font-bold mb-3 sm:mb-6 uppercase tracking-wider text-xs sm:text-sm">Working Hours</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-white/60">
                <li className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-white/80 sm:text-white/60">Mon - Fri:</span>
                  <span>{SITE_CONFIG.businessHours.monToFri}</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-white/80 sm:text-white/60">Saturday:</span>
                  <span>{SITE_CONFIG.businessHours.saturday}</span>
                </li>
                <li className="flex flex-col sm:flex-row sm:justify-between">
                  <span className="text-white/80 sm:text-white/60">Sunday:</span>
                  <span className="text-gold/60">{SITE_CONFIG.businessHours.sunday}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-span-1 md:col-span-1">
            <h3 className="text-gold font-bold mb-3 sm:mb-6 uppercase tracking-wider text-xs sm:text-sm">Contact Us</h3>
            <ul className="space-y-2.5 sm:space-y-4 text-xs sm:text-sm text-white/60">
              <li className="flex items-center gap-2.5 sm:gap-3">
                <Phone size={15} className="text-gold shrink-0 sm:w-4 sm:h-4" />
                <a href={`tel:${SITE_CONFIG.phone.e164}`} className="hover:text-gold transition-colors">{SITE_CONFIG.phone.display}</a>
              </li>
              <li className="flex items-center gap-2.5 sm:gap-3">
                <Mail size={15} className="text-gold shrink-0 sm:w-4 sm:h-4" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-gold transition-colors break-all sm:break-normal">{SITE_CONFIG.email}</a>
              </li>
              <li className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                <MapPin size={15} className="text-gold shrink-0 mt-0.5 sm:mt-0 sm:w-4 sm:h-4" />
                <span>{SITE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-5 sm:gap-6 pt-2 sm:pt-4">
                <a href={SITE_CONFIG.facebookUrl} target="_blank" rel="noopener noreferrer" className="px-1 text-white/40 hover:text-gold transition-colors" aria-label="Facebook">
                  <Facebook size={18} className="sm:w-5 sm:h-5" />
                </a>
                <a href={SITE_CONFIG.instagramUrl} target="_blank" rel="noopener noreferrer" className="px-1 text-white/40 hover:text-gold transition-colors" aria-label="Instagram">
                  <Instagram size={18} className="sm:w-5 sm:h-5" />
                </a>
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
