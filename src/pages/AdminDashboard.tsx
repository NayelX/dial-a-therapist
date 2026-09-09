import { useState, useEffect, FormEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  LogOut, 
  User,
  Phone,
  Mail,
  X,
  MapPin,
  ShieldCheck,
  Plus,
  Trash2,
  Pencil,
  EyeOff,
  Sparkles,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';
import { Appointment, ImpactStory, ContactMessage } from '../types';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { FileDropzone } from '../components/common/FileDropzone';
import datLogo from '../assets/images/dat_logo.jpeg';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'stories' | 'messages'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [impactStories, setImpactStories] = useState<ImpactStory[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [expandedMessageIds, setExpandedMessageIds] = useState<Set<string>>(new Set());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filter, setFilter] = useState('All');
  const [impactStatus, setImpactStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [editingImpactStoryId, setEditingImpactStoryId] = useState<string | null>(null);
  const [impactForm, setImpactForm] = useState({
    title: '',
    summary: '',
    quote: '',
    testimonialAuthor: '',
    date: '',
    fullStoryUrl: '',
    published: true,
  });
  const [impactImageFiles, setImpactImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const admin = await api.getCurrentAdmin();
      if (!admin) {
        navigate('/login');
        return;
      }
      fetchData();
    })();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appointments, stories, contacts] = await Promise.all([
        api.getAdminAppointments(),
        api.getAdminImpactStories(),
        api.getContacts(),
      ]);
      setAppointments(appointments);
      setImpactStories(stories);
      setContactMessages(contacts);
    } catch (err) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMessageExpand = async (message: ContactMessage) => {
    const isExpanded = expandedMessageIds.has(message.id);
    setExpandedMessageIds((prev) => {
      const next = new Set(prev);
      if (isExpanded) {
        next.delete(message.id);
      } else {
        next.add(message.id);
      }
      return next;
    });

    if (!isExpanded && !message.read) {
      try {
        await api.markContactRead(message.id, true);
        setContactMessages((prev) =>
          prev.map((m) => (m.id === message.id ? { ...m, read: true } : m))
        );
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }
  };

  const handleMarkMessageRead = async (e: MouseEvent, id: string, read: boolean) => {
    e.stopPropagation();
    try {
      await api.markContactRead(id, read);
      setContactMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, read } : m))
      );
    } catch (err) {
      console.error('Failed to update message status:', err);
    }
  };

  const resetImpactForm = () => {
    setImpactForm({
      title: '',
      summary: '',
      quote: '',
      testimonialAuthor: '',
      date: '',
      fullStoryUrl: '',
      published: true,
    });
    setImpactImageFiles([]);
    setEditingImpactStoryId(null);
  };

  const handleCreateOrUpdateImpactStory = async (event: FormEvent) => {
    event.preventDefault();
    setImpactStatus('saving');
    try {
      if (editingImpactStoryId) {
        const updated = await api.updateImpactStory(editingImpactStoryId, {
          ...impactForm,
          imageFiles: impactImageFiles.length > 0 ? impactImageFiles : undefined,
        });
        setImpactStories((prev) => prev.map((story) => story.id === editingImpactStoryId ? updated : story));
      } else {
        const created = await api.createImpactStory({
          ...impactForm,
          imageFiles: impactImageFiles.length > 0 ? impactImageFiles : undefined,
        });
        setImpactStories((prev) => [created, ...prev]);
      }
      resetImpactForm();
      setImpactStatus('idle');
    } catch (error) {
      console.error(error);
      setImpactStatus('error');
    }
  };

  const handleEditImpactStory = (story: ImpactStory) => {
    setEditingImpactStoryId(story.id);
    setImpactForm({
      title: story.title,
      summary: story.summary,
      quote: story.quote || '',
      testimonialAuthor: story.testimonialAuthor || '',
      date: story.date,
      fullStoryUrl: story.fullStoryUrl,
      published: story.published,
    });
    setImpactImageFiles([]);
  };

  const handleDeleteImpactStory = async (id: string) => {
    try {
      await api.deleteImpactStory(id);
      setImpactStories((prev) => prev.filter((story) => story.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id: string, status: Appointment['status']) => {
    try {
      const updated = await api.updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: updated.status } : a));
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(prev => prev ? { ...prev, status: updated.status } : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    navigate('/login');
  };

  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const storiesCount = impactStories.length;
  const unreadMessagesCount = contactMessages.filter((m) => !m.read).length;

  const filteredAppointments = filter === 'All' 
    ? appointments 
    : appointments.filter(a => a.status === filter);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Navigation Bar */}
      <nav className="bg-charcoal text-white sticky top-0 z-[60] shadow-lg border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
          {/* Main Header Row */}
          <div className="flex justify-between items-center gap-4">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/40 shadow-sm shrink-0 bg-charcoal-deep">
                <img
                  src={datLogo}
                  alt="Dial-A-Therapist Ghana"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 hidden sm:block">
                <h2 className="text-xl font-bold text-gold tracking-tighter leading-none">ADMIN PANEL</h2>
                <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1 truncate">Dial-A-Therapist Ghana</p>
              </div>
              <div className="sm:hidden">
                <span className="text-xs font-bold text-gold tracking-wider uppercase">Admin</span>
              </div>
            </div>

            {/* Center (Desktop only): Segmented Tab Control */}
            <div className="hidden sm:flex items-center bg-black/40 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeTab === 'appointments'
                    ? 'bg-gold text-charcoal shadow-md font-extrabold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar size={15} />
                <span>Appointments</span>
                <span 
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                    activeTab === 'appointments'
                      ? pendingCount > 0 
                        ? 'bg-charcoal text-gold font-black shadow-inner' 
                        : 'bg-black/20 text-charcoal'
                      : pendingCount > 0
                        ? 'bg-amber-400 text-charcoal font-black'
                        : 'bg-white/10 text-white/50'
                  }`}
                  title={`${pendingCount} pending appointments`}
                >
                  {pendingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stories')}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeTab === 'stories'
                    ? 'bg-gold text-charcoal shadow-md font-extrabold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles size={15} />
                <span>Impact Stories</span>
                <span 
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                    activeTab === 'stories'
                      ? 'bg-black/20 text-charcoal'
                      : 'bg-white/10 text-white/70'
                  }`}
                  title={`${storiesCount} total stories`}
                >
                  {storiesCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('messages')}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeTab === 'messages'
                    ? 'bg-gold text-charcoal shadow-md font-extrabold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare size={15} />
                <span>Messages</span>
                <span 
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                    activeTab === 'messages'
                      ? unreadMessagesCount > 0
                        ? 'bg-charcoal text-gold font-black shadow-inner'
                        : 'bg-black/20 text-charcoal'
                      : unreadMessagesCount > 0
                        ? 'bg-amber-400 text-charcoal font-black'
                        : 'bg-white/10 text-white/50'
                  }`}
                  title={`${unreadMessagesCount} unread messages`}
                >
                  {unreadMessagesCount}
                </span>
              </button>
            </div>

            {/* Right: Logout Button with guaranteed touch target */}
            <div className="flex items-center">
              <Button 
                variant="ghost"
                onClick={handleLogout}
                className="shrink-0 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm min-h-[44px] flex items-center gap-2 font-bold"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>

          {/* Mobile Tab Row (below sm/640px): Full-width Segmented Control */}
          <div className="sm:hidden mt-3 pt-3 border-t border-white/10">
            <div className="grid grid-cols-3 gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('appointments')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'appointments'
                    ? 'bg-gold text-charcoal shadow-md font-extrabold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Calendar size={13} />
                <span className="truncate">Appts</span>
                <span 
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === 'appointments'
                      ? pendingCount > 0 
                        ? 'bg-charcoal text-gold' 
                        : 'bg-black/20 text-charcoal'
                      : pendingCount > 0
                        ? 'bg-amber-400 text-charcoal'
                        : 'bg-white/10 text-white/50'
                  }`}
                >
                  {pendingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('stories')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'stories'
                    ? 'bg-gold text-charcoal shadow-md font-extrabold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles size={13} />
                <span className="truncate">Stories</span>
                <span 
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === 'stories'
                      ? 'bg-black/20 text-charcoal'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  {storiesCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('messages')}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'messages'
                    ? 'bg-gold text-charcoal shadow-md font-extrabold'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare size={13} />
                <span className="truncate">Inbox</span>
                <span 
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === 'messages'
                      ? unreadMessagesCount > 0
                        ? 'bg-charcoal text-gold'
                        : 'bg-black/20 text-charcoal'
                      : unreadMessagesCount > 0
                        ? 'bg-amber-400 text-charcoal'
                        : 'bg-white/10 text-white/50'
                  }`}
                >
                  {unreadMessagesCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-8 md:p-12">
        {activeTab === 'appointments' && (
          <div>
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8 sm:mb-12">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Appointment Requests</h1>
                <p className="text-stone-500 mt-2">Manage requests and view client intake data</p>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {['All', 'Pending', 'Confirmed', 'Cancelled'].map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? 'dark' : 'secondary'}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest min-h-[40px] ${
                      filter === f 
                        ? 'shadow-md' 
                        : 'text-stone-500 hover:bg-stone-100'
                    }`}
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </header>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400">Client</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400">Service</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400">Schedule</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-stone-400 italic">No appointments found</td>
                    </tr>
                  ) : filteredAppointments.map((app) => (
                    <tr 
                      key={app.id} 
                      className="hover:bg-stone-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAppointment(app)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{app.fullName}</p>
                            <p className="text-xs text-stone-400">{app.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 rounded-full bg-gold/10 text-gold-dark text-[10px] font-bold uppercase tracking-wider">
                          {app.serviceType}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm">
                          <p className="font-medium">{app.preferredDate}</p>
                          <p className="text-xs text-stone-400">{app.preferredTime}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          app.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {app.status === 'Pending' && <Clock size={10} />}
                          {app.status === 'Confirmed' && <CheckCircle2 size={10} />}
                          {app.status === 'Cancelled' && <XCircle size={10} />}
                          {app.status}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => updateStatus(app.id, 'Confirmed')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            title="Confirm appointment"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                          <button 
                            onClick={() => updateStatus(app.id, 'Cancelled')}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Cancel appointment"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Community Impact Stories Upload</h2>
                <p className="text-stone-500 text-sm mt-1">Publish, edit, and manage public community stories</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {impactStories.length} total
              </span>
            </div>

            <form onSubmit={handleCreateOrUpdateImpactStory} className="space-y-6 mb-10">
              {/* Section 1: Story Content */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">1. Story Content</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600">Story Title *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. A New Beginning for Kofi"
                      value={impactForm.title}
                      onChange={(e) => setImpactForm((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600">Date Label *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. March 2026 • Community Outreach"
                      value={impactForm.date}
                      onChange={(e) => setImpactForm((prev) => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-stone-600">Summary *</label>
                    <textarea
                      required
                      placeholder="Detailed overview of the outreach, beneficiary, or equipment impact..."
                      value={impactForm.summary}
                      onChange={(e) => setImpactForm((prev) => ({ ...prev, summary: e.target.value }))}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Media */}
              <div className="pt-6 border-t border-stone-200 space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">2. Media</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-2">
                    Story Images {editingImpactStoryId ? '(optional to replace)' : '(required)'}
                  </label>
                  <FileDropzone
                    files={impactImageFiles}
                    onFilesChange={(files) => setImpactImageFiles(files)}
                    maxFiles={3}
                    required={!editingImpactStoryId}
                  />
                </div>
              </div>

              {/* Section 3: Testimonial (Optional) */}
              <div className="pt-6 border-t border-stone-200 space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">3. Testimonial (Optional)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600">Quote</label>
                    <input
                      type="text"
                      placeholder="e.g. Seeing him write was a miracle..."
                      value={impactForm.quote}
                      onChange={(e) => setImpactForm((prev) => ({ ...prev, quote: e.target.value }))}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600">Author / Attribution</label>
                    <input
                      type="text"
                      placeholder="e.g. Beneficiary's Mother"
                      value={impactForm.testimonialAuthor}
                      onChange={(e) => setImpactForm((prev) => ({ ...prev, testimonialAuthor: e.target.value }))}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Publishing */}
              <div className="pt-6 border-t border-stone-200 space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-stone-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">4. Publishing & Links</span>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-600">Full Story URL *</label>
                    <input
                      required
                      type="url"
                      placeholder="https://facebook.com/..."
                      value={impactForm.fullStoryUrl}
                      onChange={(e) => setImpactForm((prev) => ({ ...prev, fullStoryUrl: e.target.value }))}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-gold/20 focus:border-gold outline-none transition-all"
                    />
                  </div>

                  <label className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={impactForm.published}
                      onChange={(e) => setImpactForm((prev) => ({ ...prev, published: e.target.checked }))}
                      className="w-4 h-4 accent-gold cursor-pointer rounded"
                    />
                    <span className="text-sm font-medium text-stone-700">
                      Publish immediately to public community impact page (if unchecked, saves as draft)
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  variant="dark"
                  isLoading={impactStatus === 'saving'}
                  loadingText="Saving..."
                  className="w-full sm:w-auto px-8 rounded-xl"
                >
                  <Plus size={16} /> {editingImpactStoryId ? 'Update Impact Story' : 'Add Impact Story'}
                </Button>
                {editingImpactStoryId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={resetImpactForm}
                    className="w-full sm:w-auto px-6 rounded-xl"
                  >
                    Cancel Edit
                  </Button>
                )}
              </div>

              {impactStatus === 'error' && (
                <p className="text-sm text-rose-600 font-medium">Could not save story. Please check your values and try again.</p>
              )}
            </form>

            <div className="space-y-3">
              {impactStories.length === 0 ? (
                <p className="text-stone-400 italic">No impact stories yet.</p>
              ) : (
                impactStories.map((story) => (
                  <div key={story.id} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 p-4 bg-stone-50 border border-stone-200 rounded-xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm">{story.title}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${story.published ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-600'}`}>
                          {story.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">{story.date}</p>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">{story.summary}</p>
                    </div>
                    <div className="flex items-center gap-1 self-end sm:self-auto">
                      <button
                        onClick={() => handleEditImpactStory(story)}
                        className="p-2 text-stone-700 hover:bg-stone-200 rounded-lg"
                        title="Edit story"
                      >
                        <Pencil size={16} />
                      </button>
                      {story.published && (
                        <button
                          onClick={() => handleDeleteImpactStory(story.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title="Take down (delete) story"
                        >
                          <EyeOff size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteImpactStory(story.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete story"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8 sm:mb-12">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Contact Messages</h1>
                <p className="text-stone-500 mt-2">Manage incoming inquiries and outreach notes from the contact form</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  {contactMessages.length} Total Messages
                </span>
                {unreadMessagesCount > 0 && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                    {unreadMessagesCount} unread
                  </span>
                )}
              </div>
            </header>

            {contactMessages.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-stone-200 p-12 text-center text-stone-400 italic shadow-sm">
                No contact messages yet.
              </div>
            ) : (
              <div className="space-y-4">
                {contactMessages.map((msg) => {
                  const isExpanded = expandedMessageIds.has(msg.id);
                  return (
                    <div 
                      key={msg.id}
                      onClick={() => handleToggleMessageExpand(msg)}
                      className={`bg-white rounded-[1.75rem] border transition-all cursor-pointer shadow-sm overflow-hidden ${
                        msg.read 
                          ? 'border-stone-200 hover:border-stone-300' 
                          : 'border-gold/60 bg-gold/[0.02] ring-1 ring-gold/30'
                      }`}
                    >
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                              msg.read ? 'bg-stone-100 text-stone-500' : 'bg-gold/20 text-gold-dark'
                            }`}>
                              <MessageSquare size={18} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                <h3 className="text-base font-bold text-charcoal">{msg.name}</h3>
                                {!msg.read && (
                                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-charcoal shadow-sm">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-stone-400 truncate">{msg.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                            <span className="text-xs text-stone-400">
                              {new Date(msg.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                onClick={(e) => handleMarkMessageRead(e, msg.id, !msg.read)}
                                className="text-xs py-1 px-2.5 min-h-[32px] rounded-lg text-stone-500 hover:text-charcoal hover:bg-stone-100 flex items-center gap-1.5"
                                title={msg.read ? "Mark as unread" : "Mark as read"}
                              >
                                <Check size={14} className={msg.read ? "text-emerald-600" : "text-stone-400"} />
                                <span>{msg.read ? 'Mark Unread' : 'Mark Read'}</span>
                              </Button>
                              <div className="p-1.5 text-stone-400 rounded-lg">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-stone-100">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-gold">Subject:</span>
                            <span className="text-sm font-semibold text-charcoal">{msg.subject}</span>
                          </div>
                          
                          <p className={`text-sm text-stone-600 leading-relaxed whitespace-pre-wrap ${
                            isExpanded ? '' : 'line-clamp-2'
                          }`}>
                            {msg.message}
                          </p>

                          {!isExpanded && msg.message.length > 120 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleMessageExpand(msg);
                              }}
                              className="mt-2 text-xs font-bold text-gold hover:text-gold-dark flex items-center gap-1 cursor-pointer"
                            >
                              <span>Read full message</span>
                              <ChevronDown size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAppointment(null)}
              className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2rem] sm:rounded-[3rem] shadow-[0_12px_32px_-6px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[92vh]"
            >
              <div className="p-4 sm:p-8 border-b border-stone-100 flex justify-between items-start sm:items-center gap-3 bg-stone-50">
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold truncate">{selectedAppointment.fullName}</h2>
                  <p className="text-stone-500 text-xs sm:text-sm break-all">Request ID: {selectedAppointment.id}</p>
                </div>
                <button 
                title="selected appointments"
                  onClick={() => setSelectedAppointment(null)}
                  className="p-2 hover:bg-stone-200 rounded-full transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-4 sm:p-8 space-y-8 sm:space-y-12">
                {/* Status Banner */}
                <div className={`p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                  selectedAppointment.status === 'Pending' ? 'bg-amber-50 border border-amber-100' :
                  selectedAppointment.status === 'Confirmed' ? 'bg-emerald-50 border border-emerald-100' :
                  'bg-rose-50 border border-rose-100'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedAppointment.status === 'Pending' ? 'bg-amber-100 text-amber-600' :
                      selectedAppointment.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-rose-100 text-rose-600'
                    }`}>
                      {selectedAppointment.status === 'Pending' && <Clock size={24} />}
                      {selectedAppointment.status === 'Confirmed' && <CheckCircle2 size={24} />}
                      {selectedAppointment.status === 'Cancelled' && <XCircle size={24} />}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider opacity-60">Current Status</p>
                      <p className="font-bold text-lg">{selectedAppointment.status}</p>
                    </div>
                  </div>
                    <div className="flex w-full sm:w-auto gap-2">
                    <Button 
                      variant="primary"
                      onClick={() => updateStatus(selectedAppointment.id, 'Confirmed')}
                      className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold min-h-[40px]"
                      title="Confirm appointment"
                    >
                      Confirm
                    </Button>
                    <Button 
                      variant="dark"
                      onClick={() => updateStatus(selectedAppointment.id, 'Cancelled')}
                      className="flex-1 sm:flex-none px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-bold min-h-[40px]"
                      title="Cancel appointment"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gold mb-4">Client Information</h3>
                      <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-3">
                          <Mail size={16} className="text-stone-400" />
                          <span className="font-medium">{selectedAppointment.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone size={16} className="text-stone-400" />
                          <span className="font-medium">{selectedAppointment.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-stone-400" />
                          <span className="font-medium">DOB: {selectedAppointment.dob}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <User size={16} className="text-stone-400" />
                          <span className="font-medium">Gender: {selectedAppointment.gender}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin size={16} className="text-stone-400" />
                          <span className="font-medium">{selectedAppointment.address}</span>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gold mb-4">Emergency Contact</h3>
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 text-sm">
                        <p className="font-bold">{selectedAppointment.emergencyContactName}</p>
                        <p className="text-stone-500">{selectedAppointment.emergencyContactPhone}</p>
                      </div>
                    </section>
                  </div>

                  <div className="space-y-8">
                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gold mb-4">Appointment Details</h3>
                      <div className="p-6 bg-stone-900 text-white rounded-2xl space-y-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-white/40">Service</p>
                          <p className="font-bold text-gold">{selectedAppointment.serviceType}</p>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/40">Date</p>
                            <p className="font-bold">{selectedAppointment.preferredDate}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-white/40">Time</p>
                            <p className="font-bold">{selectedAppointment.preferredTime}</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gold mb-4">Medical History & Reason</h3>
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-stone-400 mb-1">Medical History:</p>
                          <p className="p-4 bg-stone-50 rounded-xl border border-stone-100 leading-relaxed">{selectedAppointment.medicalHistory}</p>
                        </div>
                        <div>
                          <p className="text-stone-400 mb-1">Reason for Visit:</p>
                          <p className="p-4 bg-stone-50 rounded-xl border border-stone-100 leading-relaxed">{selectedAppointment.reasonForVisit}</p>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gold mb-4">Additional Notes</h3>
                    <p className="p-6 bg-stone-50 rounded-2xl border border-stone-100 italic text-stone-600">
                      "{selectedAppointment.notes}"
                    </p>
                  </section>
                )}

                <div className="pt-8 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-stone-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Consent Form Signed & Verified
                  </div>
                  <p>Submitted on {new Date(selectedAppointment.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
