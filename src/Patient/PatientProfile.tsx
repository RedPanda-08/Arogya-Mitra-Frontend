/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { patientApi, type PatientRequestDTO } from '../services/patientApi';
import { usePatientStore } from '../store/usePatientStore';
import logo from '../am-logo.jpeg';

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------
const iconProps = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const LogOutIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>);
const EditIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>);
const XIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>);
const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>);
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>);
const LockIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>);

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------
const formatBloodGroup = (bg: string) => {
  const map: Record<string, string> = {
    'A_POS': 'A+', 'A_NEG': 'A-',
    'B_POS': 'B+', 'B_NEG': 'B-',
    'AB_POS': 'AB+', 'AB_NEG': 'AB-',
    'O_POS': 'O+', 'O_NEG': 'O-',
  };
  return map[bg] || bg;
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
};

const formatPhoneNumber = (phone?: string) => {
  if (!phone) return 'Not Provided';
  if (phone.startsWith('+91')) {
    return `+91 - ${phone.slice(3)}`;
  }
  return phone;
};

const calculateAge = (dobString: string) => {
  if (!dobString) return '';
  const diffMs = Date.now() - new Date(dobString).getTime();
  return Math.abs(new Date(diffMs).getUTCFullYear() - 1970);
};

const getInitials = (name: string) => {
  if (!name) return 'PT';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

// ---------------------------------------------------------------------------
// Row Component
// ---------------------------------------------------------------------------
const InfoRow: React.FC<{ label: string; value: React.ReactNode; labelClassName?: string; stacked?: boolean }> = ({ label, value, labelClassName, stacked }) => (
  <div className={`flex gap-1 py-4 first:pt-0 last:pb-0 ${stacked ? 'flex-col' : 'flex-col sm:flex-row sm:items-center justify-between'}`}>
    <label className={`text-[11px] font-extrabold uppercase tracking-widest shrink-0 ${stacked ? '' : 'sm:w-52'} ${labelClassName || 'text-slate-400'}`}>{label}</label>
    <div className={`text-sm font-bold text-slate-900 min-w-0 ${stacked ? 'text-left mt-1.5' : 'sm:text-right'}`}>{value}</div>
  </div>
);

export default function PatientProfile() {
  const navigate = useNavigate();
  const { patient, setPatient, clearPatient } = usePatientStore();

  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState<boolean>(false);

  const [editForm, setEditForm] = useState({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    emergencyContact: '',
    address: ''
  });

  const addressRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!patient) navigate('/onboarding');
  }, [patient, navigate]);

  useEffect(() => {
    if (patient?.userId) {
      usePatientStore.getState().fetchPatientByUserId(String(patient.userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (showUpdateToast) {
      const timer = setTimeout(() => setShowUpdateToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showUpdateToast]);

  useEffect(() => {
    if (isEditModalOpen && addressRef.current) {
      const el = addressRef.current;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [isEditModalOpen]);

  // ⚡ INSTANT RESPONSE: Opens modal immediately with 0ms UI delay
  const handleOpenEdit = () => {
    if (!patient) return;

    setEditForm({
      fullName: patient.fullName || '',
      dateOfBirth: patient.dateOfBirth || '',
      phoneNumber: (patient.phoneNumber || '').replace('+91', '').trim(),
      emergencyContact: (patient.emergencyContact || '').replace('+91', '').trim(),
      address: patient.address || '',
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    setIsUpdating(true);
    try {
      const payloadToSave: PatientRequestDTO = {
        userId: patient.userId,
        fullName: editForm.fullName.trim(),
        dateOfBirth: editForm.dateOfBirth,
        gender: patient.gender,
        bloodGroup: patient.bloodGroup,
        phoneNumber: `+91${editForm.phoneNumber.trim()}`,
        emergencyContact: `+91${editForm.emergencyContact.trim()}`,
        address: editForm.address.trim(),
      };

      const updatedData = await patientApi.updateProfile(patient.patientId, payloadToSave);
      setPatient(updatedData);
      setIsEditModalOpen(false);
      setShowUpdateToast(true);
    } catch (error: any) {
      console.error("Failed to update profile", error);
      const serverMsg = error.response?.data?.message || error.response?.data || "Unknown error";
      alert(`Failed to update profile.\n\nReason: ${typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg)}`);
    } finally {
      setIsUpdating(false);
    }
  };

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

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
      </div>
    );
  }

  const age = calculateAge(patient.dateOfBirth);
  const initials = getInitials(patient.fullName);
  const shortId = `AM-${patient.patientId.split('-')[0].substring(0, 4).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col relative pb-20">

      <style>{`
        @keyframes av-content-enter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .av-content-enter {
          animation: av-content-enter 300ms ease-out forwards;
        }
      `}</style>

      {/* Toast Notification */}
      {showUpdateToast && (
        <div className="fixed top-10 right-6 z-[100] animate-in slide-in-from-right-8 fade-in duration-300 ease-out pointer-events-none">
          <div className="bg-white border border-emerald-200 shadow-xl rounded-2xl p-4 flex items-center gap-4 min-w-[300px]">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
              <CheckIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Medical Profile Updated</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Your credentials have been securely saved.</p>
            </div>
          </div>
        </div>
      )}
 
      {/* Focused Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 select-none">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm overflow-hidden shrink-0">
              <img src={logo} alt="Arogya Vitra Logo" className="w-full h-full object-cover mix-blend-multiply filter contrast-125" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-emerald-900 hidden sm:block">
              AROGYA VITRA
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer group bg-slate-50 hover:bg-emerald-50 px-3 sm:px-4 py-2 rounded-xl border border-slate-200 hover:border-emerald-200"
            >
              <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Return to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-sm font-bold text-slate-500 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogOutIcon className="w-4 h-4" />
              <span>{isLoggingOut ? 'Signing out...' : 'Sign out'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="av-content-enter flex-grow w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        {/* Page Title & Edit Action */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-5">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Medical Identity & Settings</h1>
            <p className="text-sm text-slate-500 mt-2 font-medium max-w-md leading-relaxed">
              Manage your personal information, emergency contacts, and linked healthcare facilities.
            </p>
          </div>

          <button
            onClick={handleOpenEdit}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-md text-slate-700 text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer active:scale-95 shrink-0"
          >
            <EditIcon className="w-4 h-4 text-emerald-600" />
            Edit Information
          </button>
        </div>

        {/* Profile Identity Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

              <div className="relative group cursor-pointer shrink-0">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-3xl font-extrabold text-white shadow-md border-4 border-white transition-transform group-hover:scale-105">
                  {initials}
                </div>
                <div className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full text-slate-500 shadow-sm group-hover:text-emerald-600 transition-colors">
                  <CameraIcon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex-grow w-full">
                <h2 className="text-2xl font-extrabold text-slate-900">{patient.fullName}</h2>
                <div className="text-sm text-slate-500 mt-2 flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 font-bold bg-slate-100 px-3 py-1 rounded-lg text-xs">
                    <UserIcon className="w-3.5 h-3.5" /> {patient.gender}
                  </span>
                  <span className="font-bold bg-slate-100 px-3 py-1 rounded-lg text-xs">{age} years old</span>
                </div>
              </div>
            </div>

            {/* Emphasis row: Blood group + Health ID */}
            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="bg-rose-50 border border-rose-100 rounded-xl px-5 py-4 shadow-sm">
                <div className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest mb-1">Blood group</div>
                <div className="text-2xl font-extrabold text-rose-700">{formatBloodGroup(patient.bloodGroup)}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 shadow-sm">
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Arogya Vitra ID</div>
                <div className="font-mono text-xl font-extrabold text-slate-800 tracking-wide">{shortId}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal details */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-slate-400" /> Contact & Demographics
          </h3>
          <div className="divide-y divide-slate-100">
            <InfoRow label="Date of birth" value={formatDate(patient.dateOfBirth)} />
            <InfoRow label="Mobile number" value={formatPhoneNumber(patient.phoneNumber)} />
            <InfoRow
              label="Emergency Dispatch Contact"
              labelClassName="text-rose-500"
              value={formatPhoneNumber(patient.emergencyContact)}
            />
            <InfoRow
              label="Registered address"
              stacked
              value={<span className="leading-relaxed break-words">{patient.address}</span>}
            />
          </div>
        </div>

        {/* Care network & Status */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ShieldIcon className="w-4 h-4 text-slate-400" /> Security & Affiliations
            </h3>
            {patient.active ? (
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shadow-sm">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-600 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
                Inactive
              </span>
            )}
          </div>
          <div className="divide-y divide-slate-100">
            <InfoRow
              label="Primary Healthcare Facility"
              value={
                patient.hospitalId ? (
                  <span className="text-emerald-700 flex items-center gap-1.5 sm:justify-end">
                    <ShieldIcon className="w-4 h-4" /> Actively Linked
                  </span>
                ) : (
                  <span className="text-slate-400 italic font-medium">No facility assigned yet</span>
                )
              }
            />
            <InfoRow
              label="Verification Status"
              value={
                <span className="text-emerald-700 flex items-center gap-1.5 sm:justify-end">
                  <CheckIcon className="w-4 h-4" />
                  Identity Verified (Gov. ID)
                </span>
              }
            />
          </div>
        </div>

      </main>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">

            <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-white">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Edit your information</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Update your personal medical credentials.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-2 rounded-lg hover:bg-slate-100"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-5 overflow-y-auto">

              <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 shadow-sm">
                <LockIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Blood group and gender are verified by your clinic and cannot be self-edited. Contact your care provider to update them.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full name (as per govt. ID)</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of birth</label>
                  <input
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all cursor-pointer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile number</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-sm text-slate-400 font-bold">+91 -</span>
                    <input
                      type="text"
                      maxLength={10}
                      value={editForm.phoneNumber}
                      onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value.replace(/\D/g, '')})}
                      className="w-full pl-14 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-rose-600 mb-1.5">Emergency dispatch contact</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-sm text-rose-400 font-bold">+91 -</span>
                  <input
                    type="text"
                    maxLength={10}
                    value={editForm.emergencyContact}
                    onChange={(e) => setEditForm({...editForm, emergencyContact: e.target.value.replace(/\D/g, '')})}
                    className="w-full pl-14 pr-4 py-3 bg-rose-50/30 border border-rose-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Registered address</label>
                <textarea
                  ref={addressRef}
                  rows={2}
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = 'auto';
                    el.style.height = `${el.scrollHeight}px`;
                  }}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none resize-none overflow-hidden transition-all"
                  required
                />
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  {isUpdating ? (
                     <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Saving...
                     </>
                  ) : 'Save changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}