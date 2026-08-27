import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientApi, type PatientRequestDTO, type Gender, type BloodGroup } from '../services/patientApi';
import { usePatientStore } from '../store/usePatientStore';

const iconProps = { fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
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
  const [gender, setGender] = useState<Gender>('MALE');
  // FIX 1: Updated default state to match backend enum
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O_POS');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('');

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

    // Format without spaces to satisfy standard E.164 regex (+919876543210)
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

    console.log("Submitting Patient Payload to 8082:", payload);

    try {
      const response = await patientApi.createProfile(payload);
      setPatient(response);
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error("Patient creation failed:", err);
      const apiError = err as { 
        response?: { 
          data?: { 
            message?: string; 
            errors?: Record<string, string> | string[]; 
          } 
        } 
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans text-slate-800 antialiased">
      <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-lg border border-slate-200/80 max-w-3xl w-full">
        
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-800 transition-colors group cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </button>
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800">
            AROGYA MITRA
          </span>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001f3f] tracking-tight">
            Complete Patient Profile
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1.5 leading-relaxed">
            Provide your medical details to activate emergency response and hospital linkage.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#001f3f] mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#001f3f] mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <input
                  type="date"
                  required
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#001f3f] mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-sm font-medium cursor-pointer transition-all"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#001f3f] mb-2">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-sm font-medium cursor-pointer transition-all"
              >
                {/* FIX 2: Updated select options to match backend enum exact strings */}
                <option value="O_POS">O+ (O Positive)</option>
                <option value="O_NEG">O- (O Negative)</option>
                <option value="A_POS">A+ (A Positive)</option>
                <option value="A_NEG">A- (A Negative)</option>
                <option value="B_POS">B+ (B Positive)</option>
                <option value="B_NEG">B- (B Negative)</option>
                <option value="AB_POS">AB+ (AB Positive)</option>
                <option value="AB_NEG">AB- (AB Negative)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#001f3f] mb-2">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 gap-1.5">
                  <PhoneIcon className="w-4 h-4" />
                  <span className="text-xs font-bold text-slate-700 border-r border-slate-300 pr-2">
                    +91
                  </span>
                </div>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value, setPhoneNumber)}
                  placeholder="9876543210"
                  className="w-full pl-20 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#001f3f] mb-2">
                Emergency Contact
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-rose-500 gap-1.5">
                  <SirenIcon className="w-4 h-4" />
                  <span className="text-xs font-bold text-slate-700 border-r border-slate-300 pr-2">
                    +91
                  </span>
                </div>
                <input
                  type="tel"
                  required
                  value={emergencyContact}
                  onChange={(e) => handlePhoneChange(e.target.value, setEmergencyContact)}
                  placeholder="9876543211"
                  className="w-full pl-20 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-sm font-medium transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#001f3f] mb-2">
                Residential Address
              </label>
              <textarea
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House No., Street, City, State, Pincode"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-sm font-medium resize-none transition-all"
              />
            </div>

          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transition-all disabled:opacity-70 text-sm cursor-pointer shadow-sm active:scale-[0.99]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Patient Profile...
                </span>
              ) : (
                'Save & Complete Profile'
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}