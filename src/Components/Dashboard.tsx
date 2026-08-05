import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiClient } from '../services/api';

interface UserProfile {
  name: string;
  email: string;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await apiClient.get('/api/user/profile');
        console.log("Profile fetched successfully:", response.data);
        const userData = response.data.data || response.data;
        setProfile(userData);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate('/login');
        } else {
          setErrorMessage("Could not load profile details. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // 1. Remove the empty DTO payload since cookies are sent automatically via withCredentials: true
      await apiClient.post('/api/auth/logout', {}, {
        withCredentials: true
      });
      console.log("Logged out successfully.");
    } catch (error) {
      console.error("Backend logout failed, proceeding with local cleanup:", error);
    } finally {
      // Clear local session data (keep your remembered email if you want it to persist)
      localStorage.removeItem('arogya_refresh_token');
      setIsLoggingOut(false);
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans text-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold shadow-md">
            AM
          </div>
          <span className="text-xl font-bold text-[#001f3f] tracking-tight">AROGYA MITRA</span>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-100 disabled:opacity-50"
        >
          {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
        </button>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-grow max-w-4xl w-full mx-auto p-6 sm:p-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-[#001f3f] tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome to your Arogya Mitra portal.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {/* Profile Verification Card */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-6">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-2xl font-bold">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#001f3f]">
                {profile?.name ? `Hello, ${profile.name}!` : 'User Profile'}
              </h2>
              <p className="text-sm text-gray-500">{profile?.email || 'No email found'}</p>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-center text-teal-800 text-sm">
            <svg className="w-5 h-5 mr-3 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>
              <strong>Registration Verified:</strong> Your login session is active and your name is successfully linked to this profile.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-xl border border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Account Status</p>
              <p className="text-base font-bold text-[#001f3f]">Active Patient</p>
            </div>
            <div className="p-5 rounded-xl border border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Platform</p>
              <p className="text-base font-bold text-teal-700">Arogya Mitra System</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}