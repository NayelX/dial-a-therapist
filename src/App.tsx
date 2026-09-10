import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloat } from './components/layout/WhatsAppFloat';
import ScrollToTop from './components/ScrollToTop';

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

const AppLayout = () => {
  const location = useLocation();
  const isAuthOrAdmin = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col selection:bg-gold/30">
      <ScrollToTop />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#2D2D2D',
            color: '#f6f2e8',
            border: '1px solid rgba(184, 155, 74, 0.3)',
            borderRadius: '1rem',
            padding: '12px 18px',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#b89b4a',
              secondary: '#2D2D2D',
            },
          },
          error: {
            style: {
              background: '#2D2D2D',
              color: '#f6f2e8',
              border: '1px solid rgba(239, 68, 68, 0.4)',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#2D2D2D',
            },
          },
        }}
      />
      {!isAuthOrAdmin && <Navbar />}
      <main className={`flex-grow ${isAuthOrAdmin ? '' : 'pt-20'}`}>
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
      {!isAuthOrAdmin && <Footer />}
      {!isAuthOrAdmin && <WhatsAppFloat />}
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
