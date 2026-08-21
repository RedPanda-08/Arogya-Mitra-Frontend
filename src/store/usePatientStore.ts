import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { type PatientResponseDTO, patientApi } from '../services/patientApi';

interface PatientState {
  patient: PatientResponseDTO | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setPatient: (patient: PatientResponseDTO) => void;
  fetchPatientByUserId: (userId: string) => Promise<PatientResponseDTO | null>;
  clearPatient: () => void;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set) => ({
      patient: null,
      isLoading: false,
      error: null,

      // Directly set patient state after onboarding completion
      setPatient: (patient) => set({ patient, error: null }),

      // Fetch patient from backend on app load/login
      fetchPatientByUserId: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const patientData = await patientApi.getByUserId(userId);
          set({ patient: patientData, isLoading: false });
          return patientData;
        } catch (err: unknown) {
          const errorObj = err as { response?: { status?: number; data?: { message?: string } } };
          
          // 404 status indicates onboarding form needs to be completed
          if (errorObj.response?.status === 404) {
            set({ patient: null, isLoading: false, error: 'NO_PROFILE' });
          } else {
            set({ 
              patient: null, 
              isLoading: false, 
              error: errorObj.response?.data?.message || 'Failed to fetch patient profile' 
            });
          }
          return null;
        }
      },

      // Reset store on user logout
      clearPatient: () => set({ patient: null, isLoading: false, error: null }),
    }),
    {
      name: 'arogya-patient-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the patient data, not transient loading or error states
      partialize: (state) => ({ patient: state.patient }),
    }
  )
);