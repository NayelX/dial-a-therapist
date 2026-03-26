import { useState, useEffect, FormEvent } from 'react';
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
  EyeOff
} from 'lucide-react';
import { Appointment, ImpactStory } from '../types';
import { api } from '../services/api';

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [impactStories, setImpactStories] = useState<ImpactStory[]>([]);
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
      const [appointments, stories] = await Promise.all([
        api.getAdminAppointments(),
        api.getAdminImpactStories(),
      ]);
      setAppointments(appointments);
      setImpactStories(stories);
    } catch (err) {
      navigate('/login');
    } finally {
      setLoading(false);
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
      {/* Top Navigation */}
      <nav className="bg-charcoal text-white px-4 sm:px-8 py-3 sm:py-4 sticky top-0 z-[60] shadow-lg border-b border-gold/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-3">
          <div className="flex items-center gap-4 sm:gap-8 min-w-0">
            <div>
              <h2 className="text-xl font-bold text-gold tracking-tighter leading-none">ADMIN PANEL</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Dial-A-Therapist Ghana</p>
            </div>
            {/* <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-lg border border-gold/20">
              <Calendar size={16} className="text-gold" />
              <span className="text-xs font-bold text-gold uppercase tracking-wider">Appointments</span>
            </div> */}
          </div>

          <button 
            onClick={handleLogout}
            className="shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all text-xs sm:text-sm font-bold"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-8 md:p-12">
        <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-8 sm:mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Appointment Requests</h1>
            <p className="text-stone-500 mt-2">Manage requests and view client intake data</p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {['All', 'Pending', 'Confirmed', 'Cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border ${
                  filter === f 
                    ? 'bg-charcoal text-white border-charcoal shadow-md' 
                    : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <div className="space-y-6">
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

          <div className="bg-white rounded-[2rem] border border-stone-200 shadow-sm p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Community Impact Stories Upload</h2>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {impactStories.length} total
              </span>
            </div>

            <form onSubmit={handleCreateOrUpdateImpactStory} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <input
                required
                type="text"
                placeholder="Story title"
                value={impactForm.title}
                onChange={(e) => setImpactForm((prev) => ({ ...prev, title: e.target.value }))}
                className="px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl"
              />
              <div className="px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Story Image {editingImpactStoryId ? '(optional to replace)' : '(required)'}
                </label>
                <input
                  required={!editingImpactStoryId}
                  type="file"
                  accept="image/*"
                  multiple
                  title="Upload story images"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []).slice(0, 3);
                    setImpactImageFiles(files);
                  }}
                  className="w-full text-sm"
                />
                <p className="mt-2 text-[11px] text-stone-500">
                  Upload up to 3 images per story {impactImageFiles.length > 0 ? `(${impactImageFiles.length} selected)` : ''}
                </p>
              </div>
              <input
                required
                type="text"
                placeholder="Date label (e.g. March 2026 • Outreach)"
                value={impactForm.date}
                onChange={(e) => setImpactForm((prev) => ({ ...prev, date: e.target.value }))}
                className="px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl"
              />
              <input
                required
                type="url"
                placeholder="Full story URL"
                value={impactForm.fullStoryUrl}
                onChange={(e) => setImpactForm((prev) => ({ ...prev, fullStoryUrl: e.target.value }))}
                className="px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl"
              />
              <textarea
                required
                placeholder="Summary"
                value={impactForm.summary}
                onChange={(e) => setImpactForm((prev) => ({ ...prev, summary: e.target.value }))}
                className="md:col-span-2 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl"
                rows={3}
              />
              <input
                type="text"
                placeholder="Quote (optional)"
                value={impactForm.quote}
                onChange={(e) => setImpactForm((prev) => ({ ...prev, quote: e.target.value }))}
                className="px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl"
              />
              <input
                type="text"
                placeholder="Testimonial author (optional)"
                value={impactForm.testimonialAuthor}
                onChange={(e) => setImpactForm((prev) => ({ ...prev, testimonialAuthor: e.target.value }))}
                className="px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl"
              />
              <label className="md:col-span-2 flex items-center gap-2 text-sm font-medium text-stone-600">
                <input
                  type="checkbox"
                  checked={impactForm.published}
                  onChange={(e) => setImpactForm((prev) => ({ ...prev, published: e.target.checked }))}
                />
                Publish immediately (if unchecked, story will be saved as draft)
              </label>
              <button
                type="submit"
                disabled={impactStatus === 'saving'}
                className="md:col-span-2 inline-flex items-center justify-center gap-2 bg-charcoal text-white px-5 py-3 rounded-xl font-bold disabled:opacity-50"
              >
                <Plus size={16} /> {impactStatus === 'saving' ? 'Saving...' : editingImpactStoryId ? 'Update Impact Story' : 'Add Impact Story'}
              </button>
              {editingImpactStoryId && (
                <button
                  type="button"
                  onClick={resetImpactForm}
                  className="md:col-span-2 inline-flex items-center justify-center gap-2 bg-stone-200 text-stone-800 px-5 py-3 rounded-xl font-bold"
                >
                  Cancel Edit
                </button>
              )}
              {impactStatus === 'error' && (
                <p className="md:col-span-2 text-sm text-rose-600 font-medium">Could not save story. Please check your values and try again.</p>
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
        </div>
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
              className="relative w-full max-w-4xl bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
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
                    <button 
                      onClick={() => updateStatus(selectedAppointment.id, 'Confirmed')}
                      className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-all"
                      title="Confirm appointment"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => updateStatus(selectedAppointment.id, 'Cancelled')}
                      className="flex-1 sm:flex-none px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 transition-all"
                      title="Cancel appointment"
                    >
                      Cancel
                    </button>
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
