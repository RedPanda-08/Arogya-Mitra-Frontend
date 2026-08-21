import axios from 'axios';

// Dedicated Axios instance pointing to the Patient Microservice (Port 8082)
export const patientApiClient = axios.create({
  baseURL: 'http://localhost:8082',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Attach JWT bearer token from localStorage
patientApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401 Unauthorized errors for expired tokens
patientApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type BloodGroup = 'A_POS' | 'A_NEG' | 'B_POS' | 'B_NEG' | 'AB_POS' | 'AB_NEG' | 'O_POS' | 'O_NEG';

export interface PatientRequestDTO {
  userId: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  phoneNumber: string;
  emergencyContact: string;
  address: string;
}

// Updated to perfectly match the data your Spring Boot backend actually returns
export interface PatientResponseDTO extends PatientRequestDTO {
  patientId: string;
  hospitalId?: string | null;
  active: boolean;
}

export const patientApi = {
  createProfile: async (payload: PatientRequestDTO): Promise<PatientResponseDTO> => {
    if (!payload.userId || payload.userId.trim() === '') {
      throw new Error("Missing valid userId in session. Please log in again.");
    }
    const response = await patientApiClient.post('/api/patients', payload);
    return response.data;
  },

  getByUserId: async (userId: string): Promise<PatientResponseDTO> => {
    const response = await patientApiClient.get(`/api/patients/user/${userId}`);
    return response.data;
  },

  // NEW METHOD: Used by the Dashboard's Edit Modal
  updateProfile: async (patientId: string, payload: Partial<PatientRequestDTO>): Promise<PatientResponseDTO> => {
    const response = await patientApiClient.put(`/api/patients/${patientId}`, payload);
    return response.data;
  },
};