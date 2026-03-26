import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-stone-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-6 text-black shadow-lg">
              <Lock size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
            <p className="text-stone-500 text-sm mt-2">Access the management dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400 ml-1">Admin Email</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  placeholder="admin@dialatherapistgh.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-charcoal text-white py-5 rounded-2xl font-bold text-lg hover:bg-charcoal-deep transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : <><LogIn size={20} /> Sign In</>}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-400">
              Use your Supabase admin account credentials.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
