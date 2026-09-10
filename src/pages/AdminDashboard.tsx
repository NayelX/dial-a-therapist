import { useState, useEffect, useMemo, useRef, FormEvent, MouseEvent } from 'react';
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
  Archive, 
  Pencil, 
  EyeOff, 
  Sparkles, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  CheckCheck,
  AlertTriangle, 
  MoreHorizontal,
  Undo2,
  Filter,
  Search,
  ArrowUpDown
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Appointment, ImpactStory, ContactMessage } from '../types';
import { api } from '../services/api';
import { Button } from '../components/common/Button';
import { FileDropzone } from '../components/common/FileDropzone';
import { SelectDropdown } from '../components/common/SelectDropdown';
import datLogo from '../assets/images/dat_logo.jpeg';

const APPOINTMENT_SORT_OPTIONS = [
  { value: 'date-desc', label: 'Date (Newest first)' },
  { value: 'date-asc', label: 'Date (Oldest first)' },
  { value: 'name-asc', label: 'Client Name (A-Z)' },
  { value: 'name-desc', label: 'Client Name (Z-A)' },
  { value: 'service', label: 'Service Type' },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'appointments' | 'stories' | 'messages'>('appointments');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [archivedAppointments, setArchivedAppointments] = useState<Appointment[]>([]);
  const [impactStories, setImpactStories] = useState<ImpactStory[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [showUnreadOnlyMessages, setShowUnreadOnlyMessages] = useState(false);
  const [isMarkingAllMessagesRead, setIsMarkingAllMessagesRead] = useState(false);
  const [expandedMessageIds, setExpandedMessageIds] = useState<Set<string>>(new Set());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedApptIds, setSelectedApptIds] = useState<Set<string>>(new Set());
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [isBulkCancelModalOpen, setIsBulkCancelModalOpen] = useState(false);
  const [bulkCancelReason, setBulkCancelReason] = useState('');
  const [isBulkActionRunning, setIsBulkActionRunning] = useState(false);
  const [isDeletingApptId, setIsDeletingApptId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Cancelled' | 'Archived'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'service'>('date-desc');
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [warningCountdownSeconds, setWarningCountdownSeconds] = useState(120);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
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
  const [revealedActionId, setRevealedActionId] = useState<string | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleTouchStart = (id: string) => {
    longPressTimerRef.current = setTimeout(() => {
      setRevealedActionId(id);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // 30-Minute Inactivity Session Manager with 2-Minute Pre-Logout Warning
  // Total inactivity: 30 minutes (1800s). Warning triggers at 28 minutes (1680s), giving 120s countdown.
  const WARNING_THRESHOLD_MS = 28 * 60 * 1000;
  const WARNING_DURATION_SECONDS = 120;
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const showWarningRef = useRef(false);

  const executeInactivityLogout = async () => {
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    setShowInactivityWarning(false);
    showWarningRef.current = false;

    try {
      await api.logout();
    } catch (err) {
      // Ignore logout errors on timeout
    }
    toast('Session expired due to 30 minutes of inactivity', { icon: '⏱️' });
    navigate('/');
  };

  const startWarningCountdown = () => {
    setShowInactivityWarning(true);
    showWarningRef.current = true;
    setWarningCountdownSeconds(WARNING_DURATION_SECONDS);

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    let remaining = WARNING_DURATION_SECONDS;
    countdownIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setWarningCountdownSeconds(remaining);
      if (remaining <= 0) {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        executeInactivityLogout();
      }
    }, 1000);
  };

  const resetInactivitySession = () => {
    // If the modal is already open, do not silently dismiss on passive mouse movement; user must click "Stay Logged In"
    if (showWarningRef.current) return;

    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    warningTimerRef.current = setTimeout(() => {
      startWarningCountdown();
    }, WARNING_THRESHOLD_MS);
  };

  const handleStayLoggedIn = () => {
    setShowInactivityWarning(false);
    showWarningRef.current = false;
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    resetInactivitySession();
    toast.success('Session extended');
  };

  useEffect(() => {
    (async () => {
      const admin = await api.getCurrentAdmin();
      if (!admin) {
        navigate('/login');
        return;
      }
      fetchData();
    })();

    // Start session timer
    resetInactivitySession();

    // User activity listeners
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    const handleUserActivity = () => {
      resetInactivitySession();
    };

    activityEvents.forEach((evt) => window.addEventListener(evt, handleUserActivity, { passive: true }));

    return () => {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      activityEvents.forEach((evt) => window.removeEventListener(evt, handleUserActivity));
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appointmentsData, archivedData, stories, contacts] = await Promise.all([
        api.getAdminAppointments(),
        api.getArchivedAppointments(),
        api.getAdminImpactStories(),
        api.getContacts(),
      ]);
      setAppointments(appointmentsData);
      setArchivedAppointments(archivedData);
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

  const handleMarkAllMessagesRead = async () => {
    if (unreadMessagesCount === 0 || isMarkingAllMessagesRead) return;
    setIsMarkingAllMessagesRead(true);
    try {
      await api.markAllContactsRead();
      setContactMessages((prev) => prev.map((m) => ({ ...m, read: true })));
      toast.success('All messages marked as read');
    } catch (err: any) {
      console.error('Failed to mark all messages as read:', err);
      toast.error(err?.message || 'Failed to mark all as read');
    } finally {
      setIsMarkingAllMessagesRead(false);
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

  const handleConfirmAppointment = async (id: string) => {
    const targetAppt = appointments.find((a) => a.id === id) || selectedAppointment;
    const clientName = targetAppt?.fullName || 'Client';

    try {
      const updated = await api.updateAppointmentStatus(id, 'Confirmed');
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: updated.status } : a)));
      if (selectedAppointment?.id === id) {
        setSelectedAppointment((prev) => (prev ? { ...prev, status: updated.status } : null));
      }
      // Call edge function for notification with no reason required
      await api.notifyStatusChange({ appointmentId: id, status: 'Confirmed' });
      toast.success(`Appointment confirmed — email sent to ${clientName}`);
    } catch (err: any) {
      console.error('Failed to confirm appointment:', err);
      toast.error(err?.message || 'Failed to confirm appointment');
    }
  };

  const handleInitiateCancel = (appointment: Appointment) => {
    setAppointmentToCancel(appointment);
    setCancelReason('');
  };

  const handleCancelSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!appointmentToCancel || !cancelReason.trim()) return;

    setIsCancelling(true);
    const apptId = appointmentToCancel.id;
    const reason = cancelReason.trim();

    try {
      const updated = await api.updateAppointmentStatus(apptId, 'Cancelled');
      setAppointments((prev) => prev.map((a) => (a.id === apptId ? { ...a, status: updated.status } : a)));
      if (selectedAppointment?.id === apptId) {
        setSelectedAppointment((prev) => (prev ? { ...prev, status: updated.status } : null));
      }
      // Invoke edge function with reason
      await api.notifyStatusChange({ appointmentId: apptId, status: 'Cancelled', reason });
      setAppointmentToCancel(null);
      setCancelReason('');
      toast.success('Appointment cancelled — client notified');
    } catch (err: any) {
      console.error('Failed to cancel appointment:', err);
      toast.error(err?.message || 'Failed to cancel appointment');
    } finally {
      setIsCancelling(false);
    }
  };

  const handleArchiveAppointment = async (id: string) => {
    setIsDeletingApptId(id);
    try {
      const updated = await api.setAppointmentArchived(id, true);
      const target = appointments.find((a) => a.id === id) || updated;
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      setArchivedAppointments((prev) => [target, ...prev.filter((a) => a.id !== id)]);
      setSelectedApptIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(null);
      }
      toast('Appointment archived', {
        icon: '📁',
      });
    } catch (err: any) {
      console.error('Failed to archive appointment:', err);
      toast.error(err?.message || 'Failed to archive appointment');
    } finally {
      setIsDeletingApptId(null);
    }
  };

  const handleUnarchiveAppointment = async (id: string) => {
    setIsDeletingApptId(id);
    try {
      const updated = await api.setAppointmentArchived(id, false);
      const target = archivedAppointments.find((a) => a.id === id) || updated;
      setArchivedAppointments((prev) => prev.filter((a) => a.id !== id));
      setAppointments((prev) => [target, ...prev.filter((a) => a.id !== id)]);
      setSelectedApptIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(null);
      }
      toast.success('Appointment restored to active list');
    } catch (err: any) {
      console.error('Failed to unarchive appointment:', err);
      toast.error(err?.message || 'Failed to unarchive appointment');
    } finally {
      setIsDeletingApptId(null);
    }
  };

  // Bulk Actions
  const handleBulkConfirm = async () => {
    const ids: string[] = Array.from(selectedApptIds);
    if (ids.length === 0) return;

    setIsBulkActionRunning(true);
    try {
      await api.bulkUpdateAppointmentStatus(ids, 'Confirmed');
      setAppointments((prev) =>
        prev.map((a) => (selectedApptIds.has(a.id) ? { ...a, status: 'Confirmed' } : a))
      );
      if (selectedAppointment && selectedApptIds.has(selectedAppointment.id)) {
        setSelectedAppointment((prev) => (prev ? { ...prev, status: 'Confirmed' } : null));
      }
      await api.notifyBatchStatusChange({ ids, status: 'Confirmed' });
      toast.success(`${ids.length} appointment${ids.length > 1 ? 's' : ''} confirmed`);
      setSelectedApptIds(new Set());
    } catch (err: any) {
      console.error('Bulk confirm failed:', err);
      toast.error(err?.message || 'Failed to confirm selected appointments');
    } finally {
      setIsBulkActionRunning(false);
    }
  };

  const handleBulkCancelSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const ids: string[] = Array.from(selectedApptIds);
    if (ids.length === 0 || !bulkCancelReason.trim()) return;

    setIsBulkActionRunning(true);
    const reason = bulkCancelReason.trim();

    try {
      await api.bulkUpdateAppointmentStatus(ids, 'Cancelled');
      setAppointments((prev) =>
        prev.map((a) => (selectedApptIds.has(a.id) ? { ...a, status: 'Cancelled' } : a))
      );
      if (selectedAppointment && selectedApptIds.has(selectedAppointment.id)) {
        setSelectedAppointment((prev) => (prev ? { ...prev, status: 'Cancelled' } : null));
      }
      await api.notifyBatchStatusChange({ ids, status: 'Cancelled', reason });
      toast.success(`${ids.length} appointment${ids.length > 1 ? 's' : ''} cancelled — clients notified`);
      setIsBulkCancelModalOpen(false);
      setBulkCancelReason('');
      setSelectedApptIds(new Set());
    } catch (err: any) {
      console.error('Bulk cancel failed:', err);
      toast.error(err?.message || 'Failed to cancel selected appointments');
    } finally {
      setIsBulkActionRunning(false);
    }
  };

  const handleBulkArchive = async () => {
    const ids: string[] = Array.from(selectedApptIds);
    if (ids.length === 0) return;

    setIsBulkActionRunning(true);
    try {
      await api.bulkArchiveAppointments(ids, true);
      const archivedSet = new Set(ids);
      const moved = appointments.filter((a) => archivedSet.has(a.id));
      setAppointments((prev) => prev.filter((a) => !archivedSet.has(a.id)));
      setArchivedAppointments((prev) => [...moved, ...prev.filter((a) => !archivedSet.has(a.id))]);
      if (selectedAppointment && archivedSet.has(selectedAppointment.id)) {
        setSelectedAppointment(null);
      }
      toast(`${ids.length} appointment${ids.length > 1 ? 's' : ''} archived`, {
        icon: '📁',
      });
      setSelectedApptIds(new Set());
    } catch (err: any) {
      console.error('Bulk archive failed:', err);
      toast.error(err?.message || 'Failed to archive selected appointments');
    } finally {
      setIsBulkActionRunning(false);
    }
  };

  const handleBulkUnarchive = async () => {
    const ids: string[] = Array.from(selectedApptIds);
    if (ids.length === 0) return;

    setIsBulkActionRunning(true);
    try {
      await api.bulkArchiveAppointments(ids, false);
      const unarchivedSet = new Set(ids);
      const restored = archivedAppointments.filter((a) => unarchivedSet.has(a.id));
      setArchivedAppointments((prev) => prev.filter((a) => !unarchivedSet.has(a.id)));
      setAppointments((prev) => [...restored, ...prev.filter((a) => !unarchivedSet.has(a.id))]);
      if (selectedAppointment && unarchivedSet.has(selectedAppointment.id)) {
        setSelectedAppointment(null);
      }
      toast.success(`${ids.length} appointment${ids.length > 1 ? 's' : ''} restored`);
      setSelectedApptIds(new Set());
    } catch (err: any) {
      console.error('Bulk unarchive failed:', err);
      toast.error(err?.message || 'Failed to restore selected appointments');
    } finally {
      setIsBulkActionRunning(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    navigate('/');
  };

  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;
  const archivedCount = archivedAppointments.length;
  const storiesCount = impactStories.filter((s) => !s.published).length;
  const unreadMessagesCount = contactMessages.filter((m) => !m.read && !m.archived).length;
  const selectedCount = selectedApptIds.size;

  const filteredAppointments = useMemo(() => {
    // 1. Status Filter
    let result = filter === 'Archived'
      ? archivedAppointments
      : filter === 'All' 
        ? appointments 
        : appointments.filter((a) => a.status === filter);

    // 2. Search query filter (client full_name case-insensitive)
    if (debouncedSearchQuery.trim()) {
      const q = debouncedSearchQuery.toLowerCase().trim();
      result = result.filter((a) => a.fullName.toLowerCase().includes(q));
    }

    // 3. Sort
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.fullName.localeCompare(b.fullName);
        case 'name-desc':
          return b.fullName.localeCompare(a.fullName);
        case 'service':
          return a.serviceType.localeCompare(b.serviceType);
        case 'date-asc':
          return (a.preferredDate || '').localeCompare(b.preferredDate || '');
        case 'date-desc':
        default:
          return (b.preferredDate || '').localeCompare(a.preferredDate || '');
      }
    });
  }, [appointments, archivedAppointments, filter, debouncedSearchQuery, sortBy]);

  const allFilteredSelected = filteredAppointments.length > 0 && filteredAppointments.every((a) => selectedApptIds.has(a.id));
  const someFilteredSelected = filteredAppointments.some((a) => selectedApptIds.has(a.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedApptIds((prev) => {
        const next = new Set(prev);
        filteredAppointments.forEach((a) => next.delete(a.id));
        return next;
      });
    } else {
      setSelectedApptIds((prev) => {
        const next = new Set(prev);
        filteredAppointments.forEach((a) => next.add(a.id));
        return next;
      });
    }
  };

  const handleToggleSelectRow = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setSelectedApptIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream font-sans text-charcoal pb-24 selection:bg-gold selection:text-charcoal relative">
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
                      ? storiesCount > 0
                        ? 'bg-charcoal text-gold font-black shadow-inner'
                        : 'bg-black/20 text-charcoal'
                      : storiesCount > 0
                        ? 'bg-amber-400 text-charcoal font-black'
                        : 'bg-white/10 text-white/70'
                  }`}
                  title={`${storiesCount} unpublished draft stories`}
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

            {/* Right: View Site & Logout Buttons */}
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={() => navigate('/')}
                className="text-stone-300 hover:text-white hover:bg-white/10 border border-white/10 rounded-xl px-3 sm:px-3.5 py-2 text-xs sm:text-sm min-h-[40px] flex items-center gap-1.5 font-bold transition-all"
                title="Return to main website"
              >
                <span>View Site</span>
              </button>

              <button 
                type="button"
                onClick={handleLogout}
                className="shrink-0 text-red-500 bg-red-500/10 hover:bg-red-600 hover:text-white active:bg-red-700 active:text-white border border-red-500/20 hover:border-red-600 rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm min-h-[40px] flex items-center gap-2 font-bold transition-all shadow-sm cursor-pointer"
                title="Log out of Admin Panel"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
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
                      ? storiesCount > 0
                        ? 'bg-charcoal text-gold font-bold'
                        : 'bg-black/20 text-charcoal'
                      : storiesCount > 0
                        ? 'bg-amber-400 text-charcoal'
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
            <header className="space-y-4 mb-6 sm:mb-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Appointment Requests</h1>
                  <p className="text-stone-500 mt-1">Manage requests and view client intake data</p>
                </div>
              </div>
              
              {/* Toolbar: Status Tabs, Search, and Sort */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2">
                {/* Status Tabs */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {(['All', 'Pending', 'Confirmed', 'Cancelled', 'Archived'] as const).map((f) => (
                    <Button
                      key={f}
                      variant={filter === f ? 'dark' : 'secondary'}
                      onClick={() => {
                        setFilter(f);
                        setSelectedApptIds(new Set());
                      }}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-bold min-h-[38px] flex items-center gap-1.5 ${
                        filter === f 
                          ? 'shadow-sm' 
                          : 'text-stone-500 hover:bg-stone-100'
                      }`}
                    >
                      <span>{f}</span>
                      {f === 'Archived' && archivedCount > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          filter === 'Archived' ? 'bg-gold text-charcoal' : 'bg-stone-200 text-stone-600'
                        }`}>
                          {archivedCount}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>

                {/* Search & Sort Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  {/* Search Input (Debounced 300ms client-side filter) */}
                  <div className="relative min-w-[220px] sm:w-64">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by client name..."
                      className="w-full pl-9 pr-8 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm text-charcoal placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all shadow-sm min-h-[38px]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded-full"
                        title="Clear search"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="min-w-[190px]">
                    <SelectDropdown
                      id="appointment-sort"
                      options={APPOINTMENT_SORT_OPTIONS}
                      value={sortBy}
                      onChange={(val) => setSortBy(val as any)}
                      triggerClassName="py-2 px-3.5 bg-white border-stone-200 rounded-xl text-xs sm:text-sm font-medium min-h-[38px] shadow-sm"
                      menuClassName="min-w-[200px]"
                    />
                  </div>
                </div>
              </div>
            </header>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-stone-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto max-h-[72vh] md:max-h-none overflow-y-auto">
              <table className="w-full min-w-[760px] text-left border-collapse">
                <thead className="sticky top-0 z-20 bg-stone-50 shadow-[0_1px_0_0_rgba(231,229,228,1)]">
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="sticky left-0 z-30 bg-stone-50 pl-6 pr-3 py-4 text-xs font-bold uppercase tracking-wider text-stone-400 w-12 shadow-[1px_0_0_0_rgba(231,229,228,1)]">
                      <input
                        type="checkbox"
                        checked={allFilteredSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected;
                        }}
                        onChange={handleToggleSelectAll}
                        className="w-4 h-4 rounded border-stone-300 text-gold focus:ring-gold/30 cursor-pointer accent-gold"
                        title="Select all visible appointments"
                      />
                    </th>
                    <th className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-stone-400">Client</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400">Service</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400">Schedule</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-stone-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-stone-400 italic">No appointments found</td>
                    </tr>
                  ) : filteredAppointments.map((app) => {
                    const isSelected = selectedApptIds.has(app.id);
                    return (
                    <tr 
                      key={app.id} 
                      className={`hover:bg-stone-50 transition-colors cursor-pointer group ${isSelected ? 'bg-gold/5' : ''}`}
                      onClick={() => setSelectedAppointment(app)}
                      onTouchStart={() => handleTouchStart(app.id)}
                      onTouchEnd={handleTouchEnd}
                    >
                      <td 
                        className={`sticky left-0 z-10 pl-6 pr-3 py-5 shadow-[1px_0_0_0_rgba(231,229,228,0.8)] transition-colors ${
                          isSelected ? 'bg-gold/10' : 'bg-white group-hover:bg-stone-50'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelectRow(app.id, e as any)}
                          className="w-4 h-4 rounded border-stone-300 text-gold focus:ring-gold/30 cursor-pointer accent-gold"
                        />
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 shrink-0">
                            <User size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-charcoal truncate">{app.fullName}</p>
                            <p className="text-xs text-stone-400 truncate">{app.email}</p>
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
                        {/* Mobile Touch Actions (<768px) */}
                        <div className="flex md:hidden justify-end items-center gap-1.5">
                          {filter === 'Archived' ? (
                            <button
                              onClick={() => handleUnarchiveAppointment(app.id)}
                              disabled={isDeletingApptId === app.id}
                              className="px-2.5 py-1.5 text-gold hover:bg-gold/10 border border-gold/30 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold"
                              title="Unarchive appointment"
                            >
                              <Undo2 size={14} />
                              <span>Unarchive</span>
                            </button>
                          ) : revealedActionId === app.id ? (
                            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
                              <button
                                onClick={() => handleArchiveAppointment(app.id)}
                                disabled={isDeletingApptId === app.id}
                                className="p-1.5 text-stone-600 hover:bg-stone-200 rounded-md transition-all flex items-center gap-1 text-xs font-bold"
                                title="Archive appointment"
                              >
                                <Archive size={15} />
                                <span>Archive</span>
                              </button>
                              <button
                                onClick={() => setRevealedActionId(null)}
                                className="p-1 text-stone-400 hover:text-stone-600 rounded-md"
                                title="Close"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <>
                              {app.status === 'Pending' ? (
                                <>
                                  <button 
                                    onClick={() => handleConfirmAppointment(app.id)}
                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                    title="Confirm appointment"
                                  >
                                    <CheckCircle2 size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleInitiateCancel(app)}
                                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                    title="Cancel appointment"
                                  >
                                    <XCircle size={18} />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleArchiveAppointment(app.id)}
                                  disabled={isDeletingApptId === app.id}
                                  className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-all"
                                  title="Archive appointment"
                                >
                                  <Archive size={17} />
                                </button>
                              )}
                              <button
                                onClick={() => setRevealedActionId(app.id)}
                                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
                                title="More actions (tap or long-press)"
                              >
                                <MoreHorizontal size={16} />
                              </button>
                            </>
                          )}
                        </div>

                        {/* Desktop Pointer Actions (>=768px) */}
                        <div className="hidden md:flex justify-end gap-2">
                          {filter === 'Archived' ? (
                            <button
                              onClick={() => handleUnarchiveAppointment(app.id)}
                              disabled={isDeletingApptId === app.id}
                              className="px-3 py-1.5 text-gold hover:bg-gold/10 border border-gold/30 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold"
                              title="Unarchive appointment"
                            >
                              <Undo2 size={15} />
                              <span>Unarchive</span>
                            </button>
                          ) : app.status === 'Pending' ? (
                            <>
                              <button 
                                onClick={() => handleConfirmAppointment(app.id)}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                title="Confirm appointment"
                              >
                                <CheckCircle2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleInitiateCancel(app)}
                                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                title="Cancel appointment"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleArchiveAppointment(app.id)}
                              disabled={isDeletingApptId === app.id}
                              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-all"
                              title="Archive appointment"
                            >
                              <Archive size={17} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
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
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-6 sm:mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Contact Messages</h1>
                <p className="text-stone-500 mt-2">Manage incoming inquiries and outreach notes from the contact form</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {/* Filter: Show unread only */}
                <Button
                  variant="ghost"
                  onClick={() => setShowUnreadOnlyMessages((prev) => !prev)}
                  className={`text-xs px-3 py-2 min-h-[36px] rounded-xl border flex items-center gap-2 font-bold transition-all ${
                    showUnreadOnlyMessages
                      ? 'bg-gold/15 border-gold text-charcoal shadow-sm'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                  title="Filter to show unread messages only"
                >
                  <Filter size={14} className={showUnreadOnlyMessages ? 'text-gold-dark' : 'text-stone-400'} />
                  <span>Show unread only</span>
                  {showUnreadOnlyMessages && (
                    <span className="w-2 h-2 rounded-full bg-gold inline-block" />
                  )}
                </Button>

                {/* Action: Mark all as read */}
                <Button
                  variant="secondary"
                  onClick={handleMarkAllMessagesRead}
                  disabled={unreadMessagesCount === 0 || isMarkingAllMessagesRead}
                  className="text-xs px-3.5 py-2 min-h-[36px] rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 font-bold"
                  title="Mark all unread messages as read"
                >
                  <CheckCheck size={15} className="text-emerald-600" />
                  <span>{isMarkingAllMessagesRead ? 'Marking...' : 'Mark all as read'}</span>
                </Button>

                <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    {contactMessages.length} Total
                  </span>
                  {unreadMessagesCount > 0 && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                      {unreadMessagesCount} unread
                    </span>
                  )}
                </div>
              </div>
            </header>

            {(() => {
              const displayedMessages = showUnreadOnlyMessages 
                ? contactMessages.filter((m) => !m.read && !m.archived) 
                : contactMessages;

              if (displayedMessages.length === 0) {
                return (
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-8 sm:p-12 text-center text-stone-400 italic shadow-sm">
                    {showUnreadOnlyMessages ? 'No unread messages.' : 'No contact messages yet.'}
                  </div>
                );
              }

              return (
                <div className="space-y-1.5 sm:space-y-2">
                  {displayedMessages.map((msg) => {
                    const isExpanded = expandedMessageIds.has(msg.id);
                    return (
                      <div 
                        key={msg.id}
                        className={`bg-white rounded-xl sm:rounded-2xl border transition-all shadow-sm overflow-hidden ${
                          msg.read 
                            ? 'border-stone-200 hover:border-stone-300 bg-stone-50/40 opacity-80 hover:opacity-100' 
                            : 'border-gold/60 bg-white ring-1 ring-gold/30 shadow-md'
                        }`}
                      >
                        {/* Compact Single-Row Header (~48-54px height) */}
                        <div 
                          onClick={() => handleToggleMessageExpand(msg)}
                          className="px-3 py-2.5 sm:px-4 sm:py-3 cursor-pointer hover:bg-stone-50/80 transition-colors flex items-center justify-between gap-3 select-none"
                        >
                          {/* Left: Avatar + Sender Info + Subject */}
                          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                            {/* Smaller Avatar */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              msg.read ? 'bg-stone-100 text-stone-400' : 'bg-gold/20 text-gold-dark'
                            }`}>
                              <MessageSquare size={14} />
                            </div>

                            {/* Sender Name + Email inline / tightly stacked */}
                            <div className="min-w-0 w-36 sm:w-48 shrink-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs sm:text-sm font-semibold truncate ${msg.read ? 'text-stone-700 font-medium' : 'text-charcoal font-bold'}`}>
                                  {msg.name}
                                </span>
                                {!msg.read && (
                                  <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-amber-400 text-charcoal shadow-sm shrink-0">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-400 truncate">{msg.email}</p>
                            </div>

                            {/* Subject Line Only (Truncated with ellipsis) */}
                            <div className="min-w-0 flex-1 hidden md:flex items-center gap-1.5 pr-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-gold shrink-0">Subject:</span>
                              <span className={`text-xs sm:text-sm truncate ${msg.read ? 'text-stone-600' : 'text-charcoal font-medium'}`}>
                                {msg.subject}
                              </span>
                            </div>
                          </div>

                          {/* Right: Timestamp, Mark Read/Unread Action, Chevron */}
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[11px] text-stone-400 hidden sm:inline whitespace-nowrap">
                              {new Date(msg.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>

                            <Button
                              variant="ghost"
                              onClick={(e) => handleMarkMessageRead(e, msg.id, !msg.read)}
                              className="text-xs py-1 px-2 min-h-[28px] rounded-lg text-stone-500 hover:text-charcoal hover:bg-stone-100 flex items-center gap-1 font-medium transition-colors"
                              title={msg.read ? "Mark as unread" : "Mark as read"}
                            >
                              <Check size={13} className={msg.read ? "text-emerald-600" : "text-stone-400"} />
                              <span className="text-[11px] whitespace-nowrap">
                                {msg.read ? 'Mark as Unread' : 'Mark as Read'}
                              </span>
                            </Button>

                            <button
                              type="button"
                              onClick={() => handleToggleMessageExpand(msg)}
                              className="p-1 text-stone-400 hover:text-stone-600 rounded-lg transition-colors cursor-pointer"
                              title={isExpanded ? "Collapse message" : "Expand message"}
                            >
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </div>
                        </div>

                        {/* Mobile Subject when collapsed */}
                        <div 
                          onClick={() => handleToggleMessageExpand(msg)}
                          className="md:hidden px-3 pb-2 -mt-1 cursor-pointer flex items-center gap-1.5"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gold shrink-0">Subject:</span>
                          <span className={`text-xs truncate ${msg.read ? 'text-stone-600' : 'text-charcoal font-medium'}`}>
                            {msg.subject}
                          </span>
                        </div>

                        {/* Expanded Content Drawer */}
                        {isExpanded && (
                          <div className="px-4 py-3 sm:px-5 sm:py-4 bg-stone-50/70 border-t border-stone-100 space-y-2">
                            <div className="md:hidden flex items-center gap-2 pb-1 border-b border-stone-200/60">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-gold">Subject:</span>
                              <span className="text-xs font-semibold text-charcoal">{msg.subject}</span>
                            </div>
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1">Message:</p>
                              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-wrap bg-white p-3.5 rounded-xl border border-stone-200/80 shadow-inner">
                                {msg.message}
                              </p>
                            </div>
                            <div className="sm:hidden text-[10px] text-stone-400 text-right pt-1">
                              Received {new Date(msg.createdAt).toLocaleString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
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
                    {selectedAppointment.archived ? (
                      <Button
                        variant="secondary"
                        onClick={() => handleUnarchiveAppointment(selectedAppointment.id)}
                        disabled={isDeletingApptId === selectedAppointment.id}
                        className="flex-1 sm:flex-none px-4 py-2 text-gold hover:bg-gold/10 border border-gold/40 rounded-lg text-sm font-bold min-h-[40px] flex items-center gap-2"
                        title="Unarchive appointment"
                      >
                        <Undo2 size={16} />
                        <span>Unarchive</span>
                      </Button>
                    ) : selectedAppointment.status === 'Pending' ? (
                      <>
                        <Button 
                          variant="primary"
                          onClick={() => handleConfirmAppointment(selectedAppointment.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold min-h-[40px]"
                          title="Confirm appointment"
                        >
                          Confirm
                        </Button>
                        <Button 
                          variant="dark"
                          onClick={() => handleInitiateCancel(selectedAppointment)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-bold min-h-[40px]"
                          title="Cancel appointment"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={() => handleArchiveAppointment(selectedAppointment.id)}
                        disabled={isDeletingApptId === selectedAppointment.id}
                        className="flex-1 sm:flex-none px-4 py-2 text-stone-700 hover:bg-stone-100 border border-stone-200 rounded-lg text-sm font-bold min-h-[40px] flex items-center gap-2"
                        title="Archive appointment"
                      >
                        <Archive size={16} />
                        <span>Archive</span>
                      </Button>
                    )}
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

      {/* Cancellation Reason Modal */}
      <AnimatePresence>
        {appointmentToCancel && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isCancelling && setAppointmentToCancel(null)}
              className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 border border-stone-200"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-charcoal">Cancel Appointment</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Client: <span className="font-semibold text-stone-700">{appointmentToCancel.fullName}</span> ({appointmentToCancel.preferredDate})
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  disabled={isCancelling}
                  onClick={() => setAppointmentToCancel(null)}
                  className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCancelSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    Cancellation Reason <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-xs text-stone-500">
                    Please explain why this appointment is being cancelled. This reason will be logged and included in client notification updates.
                  </p>
                  <textarea
                    required
                    rows={4}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g. Schedule conflict, client unreachable, therapist unavailable on selected date..."
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-sm leading-relaxed transition-all resize-none"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isCancelling}
                    onClick={() => setAppointmentToCancel(null)}
                    className="px-5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 text-sm font-bold"
                  >
                    Keep Appointment
                  </Button>
                  <Button
                    type="submit"
                    variant="dark"
                    disabled={isCancelling || !cancelReason.trim()}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center gap-2"
                  >
                    {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Cancellation Modal (Shared reason for all selected appointments) */}
      <AnimatePresence>
        {isBulkCancelModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isBulkActionRunning && setIsBulkCancelModalOpen(false)}
              className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 border border-stone-200"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-charcoal">Cancel {selectedApptIds.size} Appointments</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      A single reason will be recorded and emailed to all selected clients.
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  disabled={isBulkActionRunning}
                  onClick={() => setIsBulkCancelModalOpen(false)}
                  className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleBulkCancelSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    Shared Cancellation Reason <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={bulkCancelReason}
                    onChange={(e) => setBulkCancelReason(e.target.value)}
                    placeholder="e.g. Clinic closure due to unforeseen emergency, team training scheduled..."
                    className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none text-sm leading-relaxed transition-all resize-none"
                    autoFocus
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isBulkActionRunning}
                    onClick={() => setIsBulkCancelModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 text-sm font-bold"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="dark"
                    disabled={isBulkActionRunning || !bulkCancelReason.trim()}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center gap-2"
                  >
                    {isBulkActionRunning ? 'Cancelling...' : `Cancel All (${selectedApptIds.size})`}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {activeTab === 'appointments' && selectedApptIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] max-w-xl w-[92vw] sm:w-auto"
          >
            <div className="bg-charcoal text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-gold/40 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="bg-gold text-charcoal font-black text-xs px-2.5 py-1 rounded-full shadow-sm">
                  {selectedApptIds.size}
                </span>
                <span className="text-xs sm:text-sm font-bold text-cream">Selected</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {filter === 'Archived' ? (
                  <button
                    type="button"
                    disabled={isBulkActionRunning}
                    onClick={handleBulkUnarchive}
                    className="px-3.5 py-2 bg-gold hover:bg-gold-light text-charcoal text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                  >
                    <Undo2 size={14} />
                    <span>Unarchive All</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={isBulkActionRunning}
                      onClick={handleBulkConfirm}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <CheckCircle2 size={14} />
                      <span>Confirm All</span>
                    </button>

                    <button
                      type="button"
                      disabled={isBulkActionRunning}
                      onClick={() => {
                        setBulkCancelReason('');
                        setIsBulkCancelModalOpen(true);
                      }}
                      className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      <span>Cancel All</span>
                    </button>

                    <button
                      type="button"
                      disabled={isBulkActionRunning}
                      onClick={handleBulkArchive}
                      className="px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      <Archive size={14} />
                      <span>Archive All</span>
                    </button>
                  </>
                )}

                <button
                  type="button"
                  disabled={isBulkActionRunning}
                  onClick={() => setSelectedApptIds(new Set())}
                  className="p-1.5 text-white/60 hover:text-white rounded-lg transition-colors ml-1"
                  title="Clear selection"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-Logout Inactivity Warning Modal */}
      <AnimatePresence>
        {showInactivityWarning && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 border border-stone-200 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Clock size={32} className="animate-pulse" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-charcoal">Session Expiring Soon</h3>
              <p className="text-stone-500 text-sm mt-2 leading-relaxed">
                You have been inactive for nearly 30 minutes. For patient data security, your session will automatically end in:
              </p>

              <div className="my-6 py-4 px-6 bg-stone-50 border border-stone-200/80 rounded-2xl">
                <span className="text-3xl sm:text-4xl font-black text-amber-600 font-mono tracking-wider">
                  {Math.floor(warningCountdownSeconds / 60)}:
                  {(warningCountdownSeconds % 60).toString().padStart(2, '0')}
                </span>
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mt-1">Remaining</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={executeInactivityLogout}
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 text-xs sm:text-sm font-bold transition-all cursor-pointer"
                >
                  Log Out Now
                </button>
                <button
                  type="button"
                  onClick={handleStayLoggedIn}
                  className="flex-1 py-3 px-4 rounded-xl bg-gold hover:bg-gold-light text-charcoal text-xs sm:text-sm font-extrabold transition-all shadow-md cursor-pointer active:scale-[0.98]"
                >
                  Stay Logged In
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
