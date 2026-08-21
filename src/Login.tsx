import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiClient } from './services/api';
import { usePatientStore } from './store/usePatientStore';
import logo from './am-logo.jpeg';

export default function Login() {
  const [email, setEmail] = useState<string>(() => {
    return localStorage.getItem('arogya_remembered_email') ?? '';
  });
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('arogya_remembered_email'));
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // Logout Success Toast Logic via sessionStorage
  // ---------------------------------------------------------------------------
  const [showLogoutToast, setShowLogoutToast] = useState<boolean>(() => {
    return sessionStorage.getItem('arogya_logged_out') === 'true';
  });

  useEffect(() => {
    if (showLogoutToast) {
      sessionStorage.removeItem('arogya_logged_out');
      
      const timer = setTimeout(() => {
        setShowLogoutToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLogoutToast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (rememberMe) {
      localStorage.setItem('arogya_remembered_email', email);
    } else {
      localStorage.removeItem('arogya_remembered_email');
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post('/api/auth/login', {
        email: email,
        password: password
      }, {
        withCredentials: true 
      });

      const res = response.data || {};
      const token = res.accessToken || res.token;
      const userId = res.authUserId || res.userId || res.id;

      if (!token || !userId) {
        throw new Error("Invalid response structure from auth service. Missing accessToken or authUserId.");
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userId', String(userId));
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      if (res.refreshToken) {
        localStorage.setItem('refreshToken', res.refreshToken);
      }

      let patientProfile = null;
      try {
        patientProfile = await usePatientStore.getState().fetchPatientByUserId(String(userId));
      } catch (profileErr) {
        console.warn("No patient profile found for authUserId, proceeding to onboarding:", profileErr);
      }

      const targetPath = patientProfile ? '/dashboard' : '/onboarding';
      navigate(targetPath, { replace: true });

    } catch (error) {
      console.error("Login failed:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;
          
          if (status === 400 || status === 401 || status === 403 || status === 404) {
            setErrorMessage("Invalid email or password. Please try again.");
          } else {
            const backendData = error.response.data;
            if (backendData && typeof backendData === 'string' && backendData.trim() !== '') {
              setErrorMessage(backendData);
            } else if (backendData && backendData.message) {
              setErrorMessage(backendData.message);
            } else {
              setErrorMessage("An unexpected error occurred. Please try again.");
            }
          }
        } else if (error.request) {
          setErrorMessage("Network error. Please check if the server is running.");
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      } else {
        setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-800 overflow-hidden">
      
      {/* ----------------------------------------------------- */}
      {/* Successfully Logged Out Toast (Sliding in from Left) */}
      {/* ----------------------------------------------------- */}
      {showLogoutToast && (
        <div className="fixed top-8 right-8 z-[9999] animate-in slide-in-from-left-8 fade-in duration-300 pointer-events-none">
          <div className="bg-white border border-emerald-200 shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[320px]">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Successfully Logged Out</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Your session was securely closed.</p>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-teal-50/80 to-transparent pointer-events-none z-0"></div>

      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 relative z-10">
        
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-xl bg-teal-700 mb-4 flex items-center justify-center text-white shadow-md overflow-hidden">
              <img 
                src={logo} 
                alt="Arogya Mitra Logo" 
                className="w-full h-full object-cover mix-blend-multiply filter contrast-125" 
              />
            </div>
            <h1 className="text-2xl font-extrabold text-[#001f3f] tracking-tight">
              AROGYA MITRA
            </h1>
          </div>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            Please sign in to access your dashboard.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-center text-red-700 text-sm font-medium transition-all shadow-sm">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#001f3f] mb-1.5">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@example.com"
                disabled={isLoading}
                autoComplete="username"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all shadow-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-[#001f3f] mb-1.5">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
                autoComplete="current-password"
                className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all shadow-sm"
                required
              />
              <button 
                type="button" 
                disabled={isLoading}
                className="absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-teal-700 focus:outline-none transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 text-teal-700 bg-slate-100 border-slate-300 rounded focus:ring-teal-600 focus:ring-2 cursor-pointer transition-colors"
              />
              <span className="ml-2 text-sm text-slate-600 group-hover:text-[#001f3f] font-medium transition-colors">Remember me</span>
            </label>
            
            <Link to="/forgot-password" className="text-sm font-bold text-teal-700 hover:text-teal-800 hover:underline transition-all cursor-pointer">
              Forgot password?
            </Link>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 active:scale-[0.98] ${
                isLoading ? 'bg-teal-600 cursor-not-allowed opacity-80' : 'bg-teal-700 hover:bg-teal-800 cursor-pointer'
              }`}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold cursor-pointer text-teal-700 hover:text-teal-800 hover:underline transition-all">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}