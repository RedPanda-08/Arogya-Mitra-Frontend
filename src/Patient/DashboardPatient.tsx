import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePatientStore } from '../store/usePatientStore';
import logo from '../am-logo.jpeg';
import { apiClient } from '../services/api';
import { patientApi } from '../services/patientApi';

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------
const iconProps = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SirenIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ActivityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const LogOutIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const DropletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M12 2s7 7.58 7 12a7 7 0 11-14 0c0-4.42 7-12 7-12z" />
  </svg>
);

const FingerprintIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M12 3a6 6 0 016 6c0 4-1 6-1 9" />
    <path d="M8 21a15 15 0 001.5-6.5" />
    <path d="M6 18a18 18 0 001.6-9" />
    <path d="M12 21c1.2-2.1 2-4 2-8a2 2 0 10-4 0" />
    <path d="M16 21c.8-2.6 1-4.4 1-8a5 5 0 00-1.7-3.8" />
  </svg>
);

const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.68 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0122 16.92z" />
  </svg>
);

const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const FlaskIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M9 3h6M10 3v6.5L4.5 19a1.5 1.5 0 001.3 2.3h12.4a1.5 1.5 0 001.3-2.3L14 9.5V3" />
    <line x1="7.5" y1="14" x2="16.5" y2="14" />
  </svg>
);

const MessageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const PillIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M10.5 20.5L3.5 13.5a5 5 0 117.07-7.07l7 7a5 5 0 11-7.07 7.07z" />
    <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------
const formatBloodGroup = (bg?: string) => {
  if (!bg) return 'Not Set';
  const map: Record<string, string> = {
    'A_POS': 'A+', 'A_NEG': 'A-',
    'B_POS': 'B+', 'B_NEG': 'B-',
    'AB_POS': 'AB+', 'AB_NEG': 'AB-',
    'O_POS': 'O+', 'O_NEG': 'O-',
  };
  return map[bg] || bg;
};

const formatPhoneNumber = (phone?: string) => {
  if (!phone) return 'Not Provided';
  if (phone.startsWith('+91')) {
    return `+91 - ${phone.slice(3)}`;
  }
  return phone;
};

// ---------------------------------------------------------------------------
// Sidebar nav config
// ---------------------------------------------------------------------------
type NavItem = {
  label: string;
  path: string;
  icon: React.FC<{ className?: string }>;
  service: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: ActivityIcon, service: 'gateway' },
  { label: 'Appointments', path: '/appointments', icon: CalendarIcon, service: 'appointments-svc' },
  { label: 'Medical Vault', path: '/records', icon: FileTextIcon, service: 'records-svc' },
  { label: 'Prescriptions', path: '/prescriptions', icon: PillIcon, service: 'pharmacy-svc' },
  { label: 'Lab Results', path: '/lab-results', icon: FlaskIcon, service: 'diagnostics-svc' },
  { label: 'Messages', path: '/messages', icon: MessageIcon, service: 'messaging-svc' },
  { label: 'Billing', path: '/billing', icon: CreditCardIcon, service: 'billing-svc' },
  { label: 'My Profile', path: '/profile', icon: UserIcon, service: 'identity-svc' },
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patient, setPatient, clearPatient } = usePatientStore();

  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  // 🔄 AUTO-SYNC LOGIC: Fetch fresh database state on dashboard mount via patientApi (Port 8082)
  useEffect(() => {
    const syncPatientData = async () => {
      const storedUserId = localStorage.getItem('userId') || patient?.userId;
      if (!storedUserId) {
        setIsSyncing(false);
        return;
      }

      try {
        // 🔴 FIX 2: Use patientApi.getByUserId to route to Port 8082 instead of Gateway 8080
        const freshPatient = await patientApi.getByUserId(storedUserId);
        if (freshPatient) {
          setPatient(freshPatient);
        }
      } catch (error) {
        console.error("Failed to sync latest patient state:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    syncPatientData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = patient?.fullName ? patient.fullName.split(' ')[0] : 'Patient';
  const shortId = patient?.patientId
    ? `AM-${patient.patientId.split('-')[0].substring(0, 4).toUpperCase()}`
    : 'AM-0000';

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiClient.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearPatient();
      localStorage.removeItem('arogya_refresh_token');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');

      sessionStorage.setItem('arogya_logged_out', 'true');
      navigate('/login', { replace: true });
    }
  };

  const goTo = (path: string) => {
    setIsMobileNavOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex">

      <style>{`
        @keyframes av-heartbeat-travel {
          0% { stroke-dashoffset: 340; }
          100% { stroke-dashoffset: 0; }
        }
        .av-heartbeat-path {
          stroke-dasharray: 6 8;
          animation: av-heartbeat-travel 2.4s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .av-heartbeat-path { animation: none; }
        }

        @keyframes av-content-enter {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .av-content-enter {
          animation: av-content-enter 220ms ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .av-content-enter { animation: none; }
        }
      `}</style>

      {/* Sidebar */}
      <aside
        className={`fixed sm:sticky top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-200
          ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}`}
      >
        <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm overflow-hidden shrink-0 ring-1 ring-emerald-800/10">
            <img
              src={logo}
              alt="Arogya Vitra Logo"
              className="w-full h-full object-cover mix-blend-multiply filter contrast-125"
            />
          </div>
          <div className="leading-none">
            <span className="font-extrabold text-base tracking-tight text-emerald-900 block">AROGYA VITRA</span>
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.2em] mt-0.5 block">
              Patient Portal
            </span>
          </div>
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="ml-auto sm:hidden p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <XIcon className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => goTo(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer relative
                  ${isActive
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-emerald-600 rounded-r-full" />
                )}
                <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 shrink-0 space-y-1">
          <button
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 bg-emerald-700 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
              {firstName[0]}
            </div>
            <div className="min-w-0 leading-tight text-left">
              <div className="text-xs font-bold text-slate-900 truncate">{patient?.fullName || 'Patient'}</div>
              <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">{shortId}</div>
            </div>
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <LogOutIcon className="w-[18px] h-[18px] text-rose-500" />
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 sm:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Topbar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
          <div className="h-16 px-4 sm:px-6 flex items-center">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="sm:hidden p-2 -ml-2 mr-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <MenuIcon className="w-5 h-5 text-slate-600" />
            </button>

            <span className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Dashboard Overview</span>
          </div>
        </header>

        {/* Content */}
        <main className="av-content-enter flex-grow w-full mx-auto px-4 sm:px-6 py-6 space-y-6 max-w-6xl">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {firstName} 👋</h1>
              <p className="text-sm text-slate-500 mt-1.5 font-medium">Manage your health records, scheduled visits, and emergency contacts.</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="self-start sm:self-auto px-4 py-2 bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md text-slate-700 text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer group"
            >
              <UserIcon className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              View Bio & Vitals
            </button>
          </div>

          {/* SOS Banner */}
          <div className="relative bg-gradient-to-r from-rose-600 via-rose-700 to-red-800 rounded-2xl p-5 sm:p-6 text-white shadow-md overflow-hidden border border-rose-800/50">
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 800 120" preserveAspectRatio="none" aria-hidden="true">
              <path
                className="av-heartbeat-path"
                d="M0 60 L120 60 L145 60 L160 20 L180 100 L200 60 L230 60 L250 40 L270 60 L800 60"
                fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-rose-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-200 animate-pulse" />
                  Emergency Network Standby
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">108 Emergency SOS Dispatch</h2>
                <p className="text-sm text-rose-100/90 max-w-md leading-relaxed font-medium">
                  One-tap priority alert to nearest hospital emergency hubs and registered family contacts (+91).
                </p>
              </div>
              <button
                onClick={() => alert("SOS Alert dispatched to 108 emergency network and active emergency contacts.")}
                className="bg-white text-rose-700 hover:bg-rose-50 px-5 py-3 rounded-xl font-extrabold text-sm shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2 shrink-0 ring-2 ring-white/20 hover:ring-white/40"
              >
                <SirenIcon className="w-4 h-4 text-rose-600 animate-pulse" />
                Trigger SOS Alert
              </button>
            </div>
          </div>

          {/* Compacted Vitals strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                <DropletIcon className="w-3.5 h-3.5 text-rose-400" /> Blood Group
              </div>
              <div className="inline-flex self-start items-center bg-rose-50 text-rose-600 border border-rose-100 px-2.5 py-1 rounded-md text-base font-extrabold shadow-sm">
                {formatBloodGroup(patient?.bloodGroup)}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                <FingerprintIcon className="w-3.5 h-3.5 text-emerald-500" /> Arogya Health ID
              </div>
              <div className="inline-flex self-start items-center bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-md text-sm font-bold font-mono shadow-sm tracking-wide">
                {shortId}
              </div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2.5">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                <PhoneIcon className="w-3.5 h-3.5 text-sky-500" /> Emergency Contact
              </div>
              <div className="text-sm font-extrabold text-slate-800 truncate">
                {formatPhoneNumber(patient?.emergencyContact)}
              </div>
            </div>

            {/* DYNAMIC VERIFICATION BADGE CARD WITH SYNC STATE */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                <ShieldIcon className="w-3.5 h-3.5 text-emerald-600" /> Status
              </div>
              {isSyncing ? (
                <div className="w-28 h-6 bg-slate-100 animate-pulse rounded-md" />
              ) : patient?.active ? (
                <div className="inline-flex self-start items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" /> Identity Verified
                </div>
              ) : (
                <div className="inline-flex self-start items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Verification Pending
                </div>
              )}
            </div>
          </div>

          {/* Service shortcuts */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-3 px-1">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div
                onClick={() => navigate('/appointments')}
                className="bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center mb-3 border border-emerald-100 group-hover:bg-emerald-700 group-hover:text-white transition-colors shadow-sm">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Appointments</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">Book slots with specialist doctors and check appointment statuses.</p>
                <div className="mt-4 flex items-center text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform gap-1.5">
                  Book Appointment <ArrowRightIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => navigate('/records')}
                className="bg-white border border-slate-200 hover:border-teal-500 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="w-10 h-10 bg-teal-50 text-teal-700 rounded-lg flex items-center justify-center mb-3 border border-teal-100 group-hover:bg-teal-700 group-hover:text-white transition-colors shadow-sm">
                  <FileTextIcon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Medical Vault</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">Securely store lab diagnostic reports, and digital prescriptions.</p>
                <div className="mt-4 flex items-center text-xs font-bold text-teal-700 group-hover:translate-x-1 transition-transform gap-1.5">
                  Open Vault <ArrowRightIcon className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => navigate('/lab-results')}
                className="bg-white border border-slate-200 hover:border-slate-400 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="w-10 h-10 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center mb-3 border border-slate-200 group-hover:bg-slate-800 group-hover:text-white transition-colors shadow-sm">
                  <FlaskIcon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">Lab Results</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">View diagnostic test results as they come in from the labs.</p>
                <div className="mt-4 flex items-center text-xs font-bold text-slate-700 group-hover:translate-x-1 transition-transform gap-1.5">
                  View Results <ArrowRightIcon className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}