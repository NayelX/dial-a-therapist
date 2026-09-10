import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, LogIn, AlertCircle, Eye, EyeOff, X } from 'lucide-react';
import { api } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    // Check if user already has an active admin session
    (async () => {
      try {
        const admin = await api.getCurrentAdmin();
        if (admin) {
          navigate('/admin', { replace: true });
        }
      } catch (err) {
        // Not authenticated, stay on login page
      }
    })();

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={handleBack} 
        aria-label="Close modal background"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="relative w-full max-w-md max-h-[90vh] flex flex-col z-10"
      >
        <div className="relative bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-stone-100 overflow-y-auto">
          {/* Top-Right Dismiss */}
          <button
            type="button"
            onClick={handleBack}
            className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close login modal"
            title="Close"
          >
            <X size={20} />
          </button>

          {/* Header & Badge */}
          <div className="text-center mb-8 sm:mb-9">
            <div className="w-14 h-14 bg-gold/15 border border-gold/30 rounded-2xl flex items-center justify-center mx-auto mb-5 text-gold-dark shadow-sm">
              <Lock size={26} className="text-gold" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">Administrative Portal</h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1.5 font-medium">Authorized staff access only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
                Admin Email
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-stone-50/80 border border-stone-200/80 rounded-2xl focus:bg-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm font-medium text-charcoal placeholder:text-stone-400"
                  placeholder="admin@dialatherapistgh.com"
                />
              </div>
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
                <input 
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-stone-50/80 border border-stone-200/80 rounded-2xl focus:bg-white focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm font-medium text-charcoal placeholder:text-stone-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-600 text-xs font-medium bg-rose-50 border border-rose-100 p-3 rounded-xl">
                <AlertCircle size={15} className="shrink-0" /> 
                <span>{error}</span>
              </div>
            )}

            {/* Sign In Button */}
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-charcoal text-white py-4 rounded-2xl font-semibold text-base hover:bg-charcoal-deep transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99] mt-2"
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  <LogIn size={18} className="text-gold" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
          
          {/* Clean Dismiss Link */}
          <div className="mt-6 pt-5 border-t border-stone-100 text-center">
            <button
              type="button"
              onClick={handleBack}
              className="text-xs font-semibold text-stone-400 hover:text-stone-700 transition-colors cursor-pointer py-1 px-3 rounded-lg hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
