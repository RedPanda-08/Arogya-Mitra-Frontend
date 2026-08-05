import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiClient } from './services/api';
import logo from './am-logo.jpeg';

export default function Signup() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  
  // Track whether we are on the initial registration form or the OTP verification step
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const navigate = useNavigate();

  // Step 1: Submit Registration Details to trigger OTP email
  const handleRegisterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage("You must agree to the Terms and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post('/api/auth/register', {
        email: email,
        password: password
      });

      console.log("Registration response:", response.data);
      
      setSuccessMessage('OTP sent to your email! Please enter the code below.');
      setStep('otp'); // Switch to OTP verification view
      
    } catch (error) {
      console.error("Signup failed:", error);
      
      // Safely handle Axios errors without TypeScript complaining
      if (axios.isAxiosError(error) && error.response?.data) {
        const backendData = error.response.data;
        // Check if backend returned a string or a JSON object with a message
        setErrorMessage(typeof backendData === 'string' ? backendData : (backendData.message || "Failed to register."));
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false); 
    }
  };

  // Step 2: Submit OTP code for verification
  const handleVerifyOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otp.trim()) {
      setErrorMessage("Please enter the OTP sent to your email.");
      return;
    }

    setIsLoading(true);

    try {
      // Calls /api/auth/verify-otp with payload { email, otp }
      const response = await apiClient.post('/api/auth/verify-otp', {
        email: email,
        otp: otp
      });

      console.log("OTP verification successful:", response.data);
      
      setSuccessMessage('Account successfully created! Redirecting to login...');

      // Redirect to the login page after a 2-second delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error("OTP verification failed:", error);
      
      // Safely handle Axios errors without TypeScript complaining
      if (axios.isAxiosError(error) && error.response?.data) {
        const backendData = error.response.data;
        setErrorMessage(typeof backendData === 'string' ? backendData : (backendData.message || "Invalid OTP. Please try again."));
      } else {
        setErrorMessage("Verification failed. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-800 overflow-hidden">
      
      {/* Soft, non-glowing top accent gradient */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-teal-50/80 to-transparent pointer-events-none z-0"></div>

      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 relative z-10 my-8">
        
        {/* Header & Logo (Non-clickable, no hover) */}
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
              {step === 'form' ? 'Create an Account' : 'Verify Your Email'}
            </h1>
          </div>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            {step === 'form' 
              ? 'Set up your Arogya Mitra patient profile.' 
              : `We sent a verification code to ${email}`}
          </p>
        </div>

        {/* Notification Banners */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-center text-red-700 text-sm font-medium transition-all shadow-sm">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3.5 rounded-lg bg-teal-50 border border-teal-200 flex items-center text-teal-800 text-sm font-medium transition-all shadow-sm">
            <svg className="w-5 h-5 mr-2 flex-shrink-0 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {successMessage}
          </div>
        )}

        {/* STEP 1: Registration Form */}
        {step === 'form' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
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
                  autoComplete="new-password"
                  className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all shadow-sm"
                  required
                  minLength={8}
                />
                <button 
                  type="button" 
                  disabled={isLoading}
                  className="absolute inset-y-0 cursor-pointer right-0 pr-3 flex items-center text-slate-400 hover:text-teal-700 focus:outline-none transition-colors"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#001f3f] mb-1.5">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="flex items-start mt-4 group">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 text-teal-700 bg-slate-100 border-slate-300 rounded focus:ring-teal-600 focus:ring-2 cursor-pointer transition-colors"
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-sm text-slate-600 group-hover:text-[#001f3f] font-medium transition-colors cursor-pointer select-none">
                I agree to the{' '}
                <a href="#" className="font-bold text-teal-700 hover:text-teal-800 hover:underline transition-all">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="font-bold text-teal-700 hover:text-teal-800 hover:underline transition-all">
                  Privacy Policy
                </a>.
              </label>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full flex justify-center cursor-pointer py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 active:scale-[0.98] ${
                  isLoading ? 'bg-teal-600 cursor-not-allowed opacity-80' : 'bg-teal-700 hover:bg-teal-800'
                }`}
              >
                {isLoading ? 'Sending OTP...' : 'Continue'}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: OTP Verification Form */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
            <div>
              <label htmlFor="otp" className="block text-sm font-semibold text-[#001f3f] mb-1.5">
                Verification Code (OTP)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-teal-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 tracking-widest text-lg font-mono focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full flex justify-center cursor-pointer py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 active:scale-[0.98] ${
                  isLoading ? 'bg-teal-600 cursor-not-allowed opacity-80' : 'bg-teal-700 hover:bg-teal-800'
                }`}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP & Complete Signup'}
              </button>

              <button 
                type="button"
                onClick={() => setStep('form')}
                disabled={isLoading}
                className="w-full text-center text-sm cursor-pointer font-semibold text-slate-500 hover:text-[#001f3f] transition-colors"
              >
                ← Back to Registration
              </button>
            </div>
          </form>
        )}

        {/* Footer Link */}
        <div className="mt-8 text-center text-sm font-medium text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold cursor-pointer text-teal-700 hover:text-teal-800 hover:underline transition-all">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}