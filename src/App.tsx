import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloat } from './components/layout/WhatsAppFloat';

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
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppFloat />}
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
