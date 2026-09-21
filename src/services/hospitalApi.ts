import axios from 'axios';

export interface HospitalResponseDTO {
  hospitalId: string;
  name: string;
  addressLine?: string;
  area?: string;
  city?: string;
  pincode?: string;
  contactNumber?: string;
  emergencyPhone?: string;
  emergencyAvailable?: boolean;
  open24hours?: boolean;
  totalBeds?: number;
  rating?: number;
  departments?: string[];
  imageUrl?: string;
  distance?: number;
  distanceKm?: number;
}

// If your hospital service runs on a separate port/microservice (8081), 
// copy the full interceptor logic from api.ts so it handles 401s and tokens identically:
const hospitalClient = axios.create({
  baseURL: 'http://localhost:8081', // Adjust to 8080 if your gateway handles it
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Attach token cleanly
hospitalClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'session_active' && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 identically to your auth api.ts
hospitalClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('refreshToken');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const hospitalApi = {
  // Added missing method for BrowseHospitals directory
  async getAllHospitals(): Promise<HospitalResponseDTO[]> {
    const response = await hospitalClient.get<HospitalResponseDTO[]>('/api/hospitals/getAllHospitals');
    return response.data;
  },

  async getNearbyHospitals(
    latitude: number, 
    longitude: number, 
    radius: number = 15.0
  ): Promise<HospitalResponseDTO[]> {
    const response = await hospitalClient.get<HospitalResponseDTO[]>('/api/hospitals/nearby', {
      params: { latitude, longitude, radius }
    });
    return response.data;
  },

  async getNearbyWithAutoExpand(
    latitude: number,
    longitude: number,
    radiusSteps: number[] = [15.0, 30.0, 60.0, 100.0]
  ): Promise<{ hospitals: HospitalResponseDTO[]; resolvedRadius: number }> {
    for (const radius of radiusSteps) {
      try {
        const results = await this.getNearbyHospitals(latitude, longitude, radius);
        if (results && results.length > 0) {
          return { hospitals: results, resolvedRadius: radius };
        }
      } catch (err) {
        console.warn(`[hospitalApi] Search failed at ${radius} km:`, err);
      }
    }
    return { hospitals: [], resolvedRadius: radiusSteps[radiusSteps.length - 1] };
  },
};