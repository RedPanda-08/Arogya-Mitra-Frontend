import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePatientStore } from '../store/usePatientStore';
import logo from '../am-logo.jpeg';
import { apiClient } from '../services/api';
import { patientApi } from '../services/patientApi';
import { geocodeAddress } from '../services/geoUtils';

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

const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BuildingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1" />
  </svg>
);

// ---------------------------------------------------------------------------
// Formatters & Types
// ---------------------------------------------------------------------------
interface NearbyHospital {
  hospitalId: string;
  name: string;
  city?: string;
  totalBeds?: number;
  distance?: number;
  distanceKm?: number;
}

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
// Sidebar config
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

  // Proximity Hospitals & Location Resolution State
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
  const [isLoadingHospitals, setIsLoadingHospitals] = useState<boolean>(false);
  const [activeLocationLabel, setActiveLocationLabel] = useState<string>('Resolving locality...');
  const [isUsingLiveGPS, setIsUsingLiveGPS] = useState<boolean>(false);
  const [savedProfileAddress, setSavedProfileAddress] = useState<string>('');

  // 1. Fetch Fresh Patient Profile
  useEffect(() => {
    const syncPatientData = async () => {
      const storedUserId = localStorage.getItem('userId') || patient?.userId;
      if (!storedUserId) {
        setIsSyncing(false);
        return;
      }

      try {
        const freshPatient = await patientApi.getByUserId(storedUserId);
        if (freshPatient) {
          setPatient(freshPatient);
          if (freshPatient.address) {
            setSavedProfileAddress(freshPatient.address);
          }
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

  // 2. Resolve Dynamic Coordinates, Update Visible Address & Fetch Facilities
  const fetchNearbyHospitals = useCallback(async (preferLiveGPS: boolean = false) => {
    setIsLoadingHospitals(true);
    try {
      let lat: number | null = null;
      let lon: number | null = null;
      let label = 'Your Location';

      // Route A: Live Device GPS (Reverse Geocode to human-readable address)
      if (preferLiveGPS && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              maximumAge: 30000,
              enableHighAccuracy: true,
            });
          });

          lat = position.coords.latitude;
          lon = position.coords.longitude;

          // Reverse-geocode to get the actual street/area address of the live position
          try {
            const revRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
              { headers: { Accept: 'application/json' } }
            );

            if (revRes.ok) {
              const revData = await revRes.json();
              if (revData && revData.display_name) {
                const addrParts = revData.address;
                const shortLocality = [
                  addrParts.suburb || addrParts.neighbourhood || addrParts.residential,
                  addrParts.city || addrParts.town || addrParts.state_district,
                  addrParts.state,
                ].filter(Boolean).join(', ');

                const detectedFull = shortLocality || revData.display_name.split(',').slice(0, 3).join(',');
                label = detectedFull;

                // Dynamically update the patient's active address to this live location
                if (patient) {
                  setPatient({ ...patient, address: detectedFull });
                }
              }
            }
          } catch (revErr) {
            console.warn('Reverse geocoding failed, using coordinates label:', revErr);
            label = `${lat.toFixed(4)}, ${lon.toFixed(4)} (Live GPS)`;
          }

          setIsUsingLiveGPS(true);
        } catch (gpsError) {
          console.warn('GPS prompt dismissed or unavailable, falling back to profile address:', gpsError);
        }
      }

      // Route B: Revert to / use registered profile address
      if (lat === null || lon === null) {
        const addressToUse = savedProfileAddress || patient?.address;

        if (addressToUse) {
          // Restore original profile address if we were previously using live GPS
          if (patient && patient.address !== addressToUse) {
            setPatient({ ...patient, address: addressToUse });
          }

          // Check if coordinates are embedded in the address string
          const coordMatch = addressToUse.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
          if (coordMatch && coordMatch[1] && coordMatch[2]) {
            lat = parseFloat(coordMatch[1]);
            lon = parseFloat(coordMatch[2]);
            label = addressToUse.split(',')[0] || 'Registered Address';
          } else {
            const geocoded = await geocodeAddress(addressToUse);
            if (geocoded) {
              lat = geocoded.lat;
              lon = geocoded.lng;
              label = addressToUse.split(',')[0] || 'Profile Locality';
            }
          }
        }
        setIsUsingLiveGPS(false);
      }

      // Route C: Regional fallback if both GPS and geocoding fail
      if (lat === null || lon === null) {
        lat = 17.4429;
        lon = 78.4725;
        label = 'Regional Emergency Center';
        setIsUsingLiveGPS(false);
      }

      setActiveLocationLabel(label);

      // Query Hospital Microservice with resolved coordinates
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = { 'Accept': 'application/json' };
      if (token && token !== 'session_active') headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(
        `http://localhost:8081/api/hospitals/nearby?latitude=${lat}&longitude=${lon}&radius=35`,
        { headers }
      );

      if (response.ok) {
        const data: NearbyHospital[] = await response.json();
        setHospitals(data.slice(0, 3));
      } else {
        setHospitals([]);
      }
    } catch (err) {
      console.warn('Could not load nearby hospitals for dashboard:', err);
      setHospitals([]);
    } finally {
      setIsLoadingHospitals(false);
    }
  }, [patient, savedProfileAddress, setPatient]);

  useEffect(() => {
    if (!patient) return;

    const timeoutId = window.setTimeout(() => {
      void fetchNearbyHospitals(false);
    }, 0);

    return () => window.clearTimeout(timeoutId);
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
            onClick={() => navigate('/profile')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 bg-emerald-700 text-white rounded-lg flex items-center justify-center font-bold text-xs shrink-0">
              {firstName[0]}
            </div>
            <div className="min-w-0 leading-tight">
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

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Topbar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30">
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="sm:hidden p-2 -ml-2 mr-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <MenuIcon className="w-5 h-5 text-slate-600" />
              </button>
              <span className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Dashboard Overview</span>
            </div>

            {/* Resident / Active Locality Badge (Updates dynamically with GPS) */}
            {patient?.address && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 max-w-xs truncate shadow-2xs">
                <MapPinIcon className={`w-3.5 h-3.5 shrink-0 ${isUsingLiveGPS ? 'text-rose-500 animate-pulse' : 'text-emerald-600'}`} />
                <span className="truncate font-medium">{patient.address}</span>
              </div>
            )}
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

          {/* Vitals Strip */}
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

          {/* Dynamic Proximity Hospitals Module */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
                  <BuildingIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">Nearby Partner Hospitals</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                      <MapPinIcon className={`w-3 h-3 ${isUsingLiveGPS ? 'text-rose-500' : 'text-emerald-600'}`} />
                      {activeLocationLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Showing emergency network hubs nearest to your {isUsingLiveGPS ? 'active GPS coordinates' : 'registered profile address'}.
                  </p>
                </div>
              </div>

              {/* Dynamic Toggle Action */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => fetchNearbyHospitals(!isUsingLiveGPS)}
                  disabled={isLoadingHospitals}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  <MapPinIcon className={`w-3.5 h-3.5 ${isUsingLiveGPS ? 'text-emerald-600' : 'text-rose-500'}`} />
                  <span>{isUsingLiveGPS ? 'Use Profile Address' : 'Use Current GPS'}</span>
                </button>

                <button
                  onClick={() => navigate('/appointments')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer p-1"
                >
                  <span>Directory</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {isLoadingHospitals ? (
              <div className="py-8 flex items-center justify-center gap-2 text-xs text-slate-400">
                <span className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span>Locating partner medical hubs for {activeLocationLabel}...</span>
              </div>
            ) : hospitals.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No nearby network hospitals detected within 35 km of {activeLocationLabel}.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hospitals.map((h) => {
                  const dist = h.distance ?? h.distanceKm;
                  return (
                    <div
                      key={h.hospitalId}
                      className="border border-slate-200/90 rounded-xl p-4 hover:border-emerald-400 hover:shadow-md transition-all bg-slate-50/50 flex flex-col justify-between gap-3 group"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors truncate">
                            {h.name}
                          </h3>
                          {dist !== undefined && (
                            <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100/70 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0">
                              {dist.toFixed(1)} km
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{h.city || 'Verified Emergency Hub'}</p>
                      </div>

                      <button
                        onClick={() => navigate('/appointments')}
                        className="w-full py-2 bg-white hover:bg-emerald-700 hover:text-white text-emerald-700 border border-slate-200 hover:border-emerald-700 font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        Book Visit
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Service Shortcuts */}
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