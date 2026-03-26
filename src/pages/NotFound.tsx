import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-charcoal text-white flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        <p className="text-gold font-bold tracking-[0.3em] text-xs uppercase mb-4">Error</p>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-gold mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
        <p className="text-white/70 mb-10">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="bg-gold text-black px-8 py-4 rounded-full font-bold hover:bg-gold-dark transition-all"
          >
            Back to Home
          </Link>
          <Link
            to="/contact"
            className="border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all"
          >
            Contact Us
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
