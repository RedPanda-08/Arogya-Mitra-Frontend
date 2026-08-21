/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { patientApi, type PatientRequestDTO } from '../services/patientApi';
import { usePatientStore } from '../store/usePatientStore';

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------
const iconProps = { fill: "none", stroke: "currentColor", strokeWidth: 2 } as const;

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const SirenIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>);
const LogOutIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>);
const EditIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>);
const XIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>);
const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>);
const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>);
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} viewBox="0 0 24 24" {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);

// ---------------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------------
const formatBloodGroup = (bg: string) => {
  const map: Record<string, string> = {
    'A_POS': 'A+ (Positive)', 'A_NEG': 'A- (Negative)',
    'B_POS': 'B+ (Positive)', 'B_NEG': 'B- (Negative)',
    'AB_POS': 'AB+ (Positive)', 'AB_NEG': 'AB- (Negative)',
    'O_POS': 'O+ (Positive)', 'O_NEG': 'O- (Negative)',
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

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { patient, setPatient, clearPatient } = usePatientStore();
  
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState<boolean>(false); // NEW STATE FOR UPDATE TOAST
  
  const [editForm, setEditForm] = useState({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    emergencyContact: '',
    address: ''
  });

  useEffect(() => {
    if (!patient) navigate('/onboarding');
  }, [patient, navigate]);

  // Auto-dismiss update notification after 3 seconds
  useEffect(() => {
    if (showUpdateToast) {
      const timer = setTimeout(() => setShowUpdateToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showUpdateToast]);

  const handleOpenEdit = () => {
    if (patient) {
      setEditForm({
        fullName: patient.fullName || '',
        dateOfBirth: patient.dateOfBirth || '',
        phoneNumber: (patient.phoneNumber || '').replace('+91', '').trim(),
        emergencyContact: (patient.emergencyContact || '').replace('+91', '').trim(),
        address: patient.address || '',
      });
      setIsEditModalOpen(true);
    }
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
      setShowUpdateToast(true); // Trigger success toast notification!
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
      // 1. Clear data immediately
      clearPatient();
      localStorage.removeItem('arogya_refresh_token');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      
      sessionStorage.setItem('arogya_logged_out', 'true');
      
      // 2. Pass the flag via query parameter to match Login.tsx
      navigate('/login?loggedOut=true', { replace: true });
    }
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
      </div>
    );
  }

  const firstName = patient.fullName ? patient.fullName.split(' ')[0] : 'Patient';
  const age = calculateAge(patient.dateOfBirth);
  const initials = getInitials(patient.fullName);
  const shortId = `AM-${patient.patientId.split('-')[0].substring(0, 4).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col relative">
      
      {/* ----------------------------------------------------- */}
      {/* Profile Updated Toast Notification */}
      {/* ----------------------------------------------------- */}
      {showUpdateToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-8 fade-in duration-300 pointer-events-none">
          <div className="bg-white border border-emerald-200 shadow-xl rounded-2xl p-4 flex items-center gap-4 min-w-[300px]">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
              <CheckIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Profile Updated</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Your medical credentials have been saved.</p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------- */}
      {/* Enterprise Navbar */}
      {/* ----------------------------------------------------- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-700 rounded flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xs tracking-wider">AM</span>
            </div>
            <span className="font-extrabold text-lg text-emerald-900 tracking-tight hidden sm:block">AROGYA MITRA</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <div className="text-sm font-bold text-slate-900">{patient.fullName}</div>
              <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">Patient Profile Hub</div>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>
            
            <button 
              onClick={handleLogout} 
              disabled={isLoggingOut} 
              className="flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 text-sm font-bold rounded-md transition-all cursor-pointer disabled:opacity-50"
            >
              <LogOutIcon className="w-4 h-4" />
              <span className="hidden sm:block">{isLoggingOut ? 'Signing Out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ----------------------------------------------------- */}
      {/* Main Content Area */}
      {/* ----------------------------------------------------- */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Page Title */}
        <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {firstName} 👋</h1>
            <p className="text-sm text-slate-500 mt-1">Review and securely manage your <span className="font-semibold text-emerald-700">Patient Profile & Health Records</span>.</p>
          </div>
          <button 
            onClick={handleOpenEdit} 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:border-emerald-500 hover:text-emerald-700 text-slate-700 text-sm font-bold rounded-lg transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <EditIcon className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* ----------------------------------------------------- */}
        {/* Profile Identity Card w/ Avatar */}
        {/* ----------------------------------------------------- */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="h-3 w-full bg-emerald-600"></div>
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            
            {/* Profile Picture UI */}
            <div className="relative group cursor-pointer shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-md border-4 border-white transition-transform group-hover:scale-105">
                {initials}
              </div>
              <div className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full text-slate-500 shadow-sm group-hover:text-emerald-600 transition-colors">
                <CameraIcon className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex-grow w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{patient.fullName}</h2>
                  <div className="text-sm text-slate-500 mt-1.5 flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium bg-slate-100 px-2.5 py-0.5 rounded-md"><UserIcon className="w-4 h-4" /> {patient.gender}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-medium">{age} Years Old</span>
                  </div>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-right sm:w-auto w-full flex sm:block justify-between items-center">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest sm:mb-1">Arogya Mitra Health ID</div>
                  <div className="font-mono text-base font-bold text-slate-800">{shortId}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ----------------------------------------------------- */}
        {/* Information Grid */}
        {/* ----------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Clinical Demographics */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldIcon className="w-4 h-4 text-emerald-600" /> Vitals & Demographics
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Blood Group</label>
                <div className="text-sm font-bold text-rose-600 bg-rose-50 inline-flex px-3 py-1 rounded-md border border-rose-100">
                  {formatBloodGroup(patient.bloodGroup)}
                </div>
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</label>
                <div className="text-sm font-medium text-slate-900">{formatDate(patient.dateOfBirth)}</div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPinIcon className="w-4 h-4 text-emerald-600" /> Contact Details
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Mobile Number</label>
                <div className="text-sm font-medium text-slate-900">{formatPhoneNumber(patient.phoneNumber)}</div>
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-rose-500 uppercase tracking-wider mb-1">Emergency Contact</label>
                <div className="text-sm font-medium text-slate-900">{formatPhoneNumber(patient.emergencyContact)}</div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Current Address</label>
                <div className="text-sm font-medium text-slate-900 leading-relaxed">
                  {patient.address}
                </div>
              </div>
            </div>
          </div>

          {/* Network & Status */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:col-span-2 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-5">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <SirenIcon className="w-4 h-4 text-emerald-600" /> Network Status
              </h3>
              {patient.active ? (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                  Inactive
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Emergency SOS Line</label>
                <div className="text-sm font-bold text-slate-900">108 Network</div>
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Linked Hospital Facility</label>
                {patient.hospitalId ? (
                  <div className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                    <ShieldIcon className="w-4 h-4" /> Connection Active
                  </div>
                ) : (
                  <div className="text-sm font-medium text-slate-400 italic">No facility assigned yet.</div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Account Verification</label>
                <div className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                   Identity Securely Verified
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* ----------------------------------------------------- */}
      {/* Minimal & Theme-Matched Edit Profile Modal */}
      {/* ----------------------------------------------------- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] border border-slate-100">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-white">
              <div>
                <h3 className="font-bold text-base text-slate-900">Edit Patient Profile</h3>
                <p className="text-xs text-slate-400 mt-0.5">Update your personal medical credentials.</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-100"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Form Body */}
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4 overflow-y-auto">
              
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name (As per Govt. ID)</label>
                <input 
                  type="text" 
                  value={editForm.fullName} 
                  onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Date of Birth</label>
                  <input 
                    type="date" 
                    value={editForm.dateOfBirth} 
                    onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all cursor-pointer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mobile Number</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs text-slate-400 font-semibold">+91 -</span>
                    <input 
                      type="text" 
                      maxLength={10}
                      value={editForm.phoneNumber} 
                      onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value.replace(/\D/g, '')})}
                      className="w-full pl-12 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-600 mb-1.5">Emergency Contact</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs text-rose-400 font-semibold">+91 -</span>
                  <input 
                    type="text" 
                    maxLength={10}
                    value={editForm.emergencyContact} 
                    onChange={(e) => setEditForm({...editForm, emergencyContact: e.target.value.replace(/\D/g, '')})}
                    className="w-full pl-12 pr-3.5 py-2.5 bg-rose-50/30 border border-rose-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Current Address</label>
                <textarea 
                  rows={2}
                  value={editForm.address} 
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none resize-none transition-all"
                  required
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 mt-1 border-t border-slate-100 flex justify-end gap-2.5">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-70 flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  {isUpdating ? (
                     <>
                      <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Saving...
                     </>
                  ) : 'Save Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}