import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientApi, type PatientRequestDTO, type Gender, type BloodGroup } from '../services/patientApi';
import { usePatientStore } from '../store/usePatientStore';
import { fetchNeighborhoodFromCoords, getBrowserPosition } from '../utilities/getPincode';

const iconProps = { fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.34 1.78.65 2.62a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.46-1.22a2 2 0 012.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0122 16.92z" />
  </svg>
);

const SirenIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" strokeLinecap="round" strokeLinejoin="round" />
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

const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const DropletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
  </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const getUserIdFromStorageOrToken = (): string | null => {
  const possibleKeys = ['userId', 'id', 'user_id', 'sub'];
  for (const key of possibleKeys) {
    const val = localStorage.getItem(key);
    if (val && val !== 'undefined' && val !== 'null' && val.trim() !== '') {
      return val;
    }
  }

  const token = localStorage.getItem('token');
  if (!token || token === 'session_active') return null;

  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payloadBase64 = parts[1];
    const decodedJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const decoded = JSON.parse(decodedJson);
    const extractedId = decoded.userId || decoded.user_id || decoded.id || decoded.uid || decoded.sub;
    if (extractedId) {
      localStorage.setItem('userId', extractedId);
      return extractedId;
    }
  } catch (e) {
    console.error('[Onboarding] Failed to decode JWT token:', e);
  }

  return null;
};

export default function PatientOnboarding() {
  const navigate = useNavigate();
  const { setPatient, clearPatient } = usePatientStore();

  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('');

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedPincodeInfo, setDetectedPincodeInfo] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBackToLogin = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    clearPatient();
    navigate('/login');
  };

  const handlePhoneChange = (value: string, setter: (val: string) => void) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    setter(cleaned);
  };

  const handleAutoDetectAddress = async () => {
    setIsDetectingLocation(true);
    setError(null);

    try {
      const coords = await getBrowserPosition();
      const result = await fetchNeighborhoodFromCoords(coords.lat, coords.lng);

      if (result && result.formattedAddress) {
        setAddress((prev) => {
          const existing = prev.trim();
          return existing ? `${existing}, ${result.formattedAddress}` : result.formattedAddress;
        });

        const localityBadge = [
          result.suburb || result.neighbourhood,
          result.city,
          result.pincode ? `PIN: ${result.pincode}` : null,
        ]
          .filter(Boolean)
          .join(', ');

        setDetectedPincodeInfo(localityBadge);
      } else {
        setError('Could not identify your exact locality.');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.warn('GPS lookup unavailable:', err);
      if (err.code === 1) {
        setError('Location permission denied. Please allow location in your browser.');
      } else {
        setError('Unable to detect precise GPS location.');
      }
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const activeUserId = getUserIdFromStorageOrToken();

    if (!activeUserId) {
      setError('Session invalid. Please log out and log in again.');
      setIsLoading(false);
      return;
    }

    if (phoneNumber.length < 10 || emergencyContact.length < 10) {
      setError('Please enter valid 10-digit mobile numbers.');
      setIsLoading(false);
      return;
    }

    if (!gender) {
      setError('Please select a gender.');
      setIsLoading(false);
      return;
    }

    if (!bloodGroup) {
      setError('Please select a blood group.');
      setIsLoading(false);
      return;
    }

    const payload: PatientRequestDTO = {
      userId: activeUserId,
      fullName: fullName.trim(),
      dateOfBirth,
      gender,
      bloodGroup,
      phoneNumber: `+91${phoneNumber.trim()}`,
      emergencyContact: `+91${emergencyContact.trim()}`,
      address: address.trim(),
    };

    try {
      const response = await patientApi.createProfile(payload);
      setPatient(response);
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Patient creation failed:', err);
      const apiError = err as {
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, string> | string[];
          };
        };
      };

      const serverData = apiError.response?.data;
      if (serverData?.errors) {
        const errorDetails = Array.isArray(serverData.errors)
          ? serverData.errors.join(', ')
          : Object.entries(serverData.errors).map(([k, v]) => `${k}: ${v}`).join(', ');
        setError(`Validation failed: ${errorDetails}`);
      } else if (serverData?.message) {
        setError(serverData.message);
      } else {
        setError('Failed to save patient profile. Please check form fields and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50/40 flex items-center justify-center p-4 sm:p-8 font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-10 md:p-12 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200/90 max-w-3xl w-full transition-all">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors group cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform stroke-slate-500 group-hover:stroke-slate-800" />
            <span>Back to Login</span>
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Arogya Mitra
            </span>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Complete Patient Profile
          </h1>
          <p className="text-sm font-normal text-slate-500 mt-1.5 leading-relaxed">
            Provide your medical information to configure neighborhood emergency dispatch and hospital routing.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-800 text-sm font-medium flex items-start gap-3 shadow-xs">
            <span className="text-base leading-none mt-0.5">⚠️</span>
            <div className="flex-1 leading-snug">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white text-sm font-normal transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Date of Birth <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white text-sm font-normal transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Gender Native Select */}
            <div className="min-w-0">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <div className="relative group min-w-0">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <UserIcon className="w-5 h-5" />
                </div>
                <select
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className={`w-full appearance-none pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-sm transition-all shadow-xs focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white cursor-pointer truncate ${
                    gender ? 'text-slate-900 font-medium' : 'text-slate-400 font-normal'
                  }`}
                >
                  <option value="" disabled hidden>
                    Select Gender
                  </option>
                  <option value="MALE" className="text-slate-900">Male</option>
                  <option value="FEMALE" className="text-slate-900">Female</option>
                  <option value="OTHER" className="text-slate-900">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Blood Group Native Select */}
            <div className="min-w-0">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Blood Group <span className="text-rose-500">*</span>
              </label>
              <div className="relative group min-w-0">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400 group-focus-within:text-rose-600 transition-colors">
                  <DropletIcon className="w-5 h-5" />
                </div>
                <select
                  required
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className={`w-full appearance-none pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-sm transition-all shadow-xs focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white cursor-pointer truncate ${
                    bloodGroup ? 'text-slate-900 font-medium' : 'text-slate-400 font-normal'
                  }`}
                >
                  <option value="" disabled hidden>
                    Select Blood Group
                  </option>
                  <optgroup label="Common Groups" className="text-slate-800 font-semibold">
                    <option value="O_POS" className="text-slate-900 font-normal">O+ (Universal Donor / Common)</option>
                    <option value="A_POS" className="text-slate-900 font-normal">A+ (A Positive)</option>
                    <option value="B_POS" className="text-slate-900 font-normal">B+ (B Positive)</option>
                    <option value="AB_POS" className="text-slate-900 font-normal">AB+ (Universal Recipient)</option>
                  </optgroup>
                  <optgroup label="Rh-Negative Groups" className="text-slate-800 font-semibold">
                    <option value="O_NEG" className="text-slate-900 font-normal">O- (Universal Red Cell Donor)</option>
                    <option value="A_NEG" className="text-slate-900 font-normal">A- (A Negative)</option>
                    <option value="B_NEG" className="text-slate-900 font-normal">B- (B Negative)</option>
                    <option value="AB_NEG" className="text-slate-900 font-normal">AB- (AB Negative)</option>
                  </optgroup>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <ChevronDownIcon className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center group">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 gap-1.5 transition-colors">
                  <PhoneIcon className="w-4 h-4" />
                  <span className="text-xs font-bold text-slate-700 border-r border-slate-200 pr-2">
                    +91
                  </span>
                </div>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value, setPhoneNumber)}
                  placeholder="9876543210"
                  className="w-full pl-20 pr-4 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white text-sm font-normal transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Emergency Contact <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center group">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-rose-500 group-focus-within:text-rose-600 gap-1.5 transition-colors">
                  <SirenIcon className="w-4 h-4" />
                  <span className="text-xs font-bold text-slate-700 border-r border-slate-200 pr-2">
                    +91
                  </span>
                </div>
                <input
                  type="tel"
                  required
                  value={emergencyContact}
                  onChange={(e) => handlePhoneChange(e.target.value, setEmergencyContact)}
                  placeholder="9876543211"
                  className="w-full pl-20 pr-4 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 focus:bg-white text-sm font-normal transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Residential Address & Geolocation */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Residential Address <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleAutoDetectAddress}
                  disabled={isDetectingLocation}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100/80 active:bg-emerald-200/80 border border-emerald-300/80 px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-60 shadow-2xs"
                >
                  {isDetectingLocation ? (
                    <>
                      <span className="w-3 h-3 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                      <span>Detecting Neighborhood...</span>
                    </>
                  ) : (
                    <>
                      <MapPinIcon className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Auto-Detect Locality & PIN</span>
                    </>
                  )}
                </button>
              </div>

              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Flat / House No., Apartment or Landmark, Road / Colony, Area, City, PIN Code"
                className="w-full px-4 py-2.5 bg-slate-50/70 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-600 focus:bg-white text-sm font-normal resize-none transition-all shadow-xs"
              />

              {detectedPincodeInfo && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50/80 border border-emerald-200 text-xs font-medium text-emerald-800">
                  <span className="font-bold text-emerald-700">✓ Detected Area:</span>
                  <span>{detectedPincodeInfo}</span>
                </div>
              )}
            </div>

          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-600/20 transition-all disabled:opacity-70 text-sm cursor-pointer shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Patient Profile...</span>
                </>
              ) : (
                <span>Save & Complete Profile</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}