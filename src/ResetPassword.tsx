import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { apiClient } from './services/api';

// ---------------------------------------------------------------------------
// Inline Icons
// ---------------------------------------------------------------------------
const iconProps = { fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;

const LockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M9 12l2 2 4-4" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const AlertTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please check again.');
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post('/api/auth/reset-password', {
        token,
        newPassword
      });

      setMessage('Your password has been successfully reset!');
      setIsSuccess(true);
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: unknown) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setError(apiError.response?.data?.message || 'Failed to reset password. The reset link may have expired or is invalid.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-slate-800 p-6 antialiased relative overflow-hidden">
      
      {/* 🌿 Smooth Light Green Floating Corner Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-300/70 via-emerald-100/20 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-200/50 via-transparent to-transparent pointer-events-none z-0" />

      {/* Main Card Container */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200/80 max-w-md w-full relative z-10">
        
        {/* Invalid or Missing Token Warning */}
        {!token ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto mb-6 shadow-xs">
              <AlertTriangleIcon className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#001f3f]">Invalid Reset Link</h1>
            <p className="text-sm font-medium text-slate-600 mt-2.5 leading-relaxed">
              This password reset link is missing a valid token or has expired. Please request a new reset link.
            </p>
            <Link
              to="/forgot-password"
              className="mt-8 inline-block w-full py-3.5 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition-colors text-sm shadow-sm"
            >
              Request New Link
            </Link>
          </div>
        ) : !isSuccess ? (
          <>
            {/* Form Header */}
            <div className="mb-8 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001f3f] tracking-tight">
                Reset Your Password
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-2.5 leading-relaxed">
                Please enter a new secure password for your account below.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-3">
                <span className="text-base flex-shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Password Reset Form with expanded space between fields */}
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-2.5">
                <label htmlFor="newPassword" className="block text-xs font-bold uppercase tracking-wider text-[#001f3f]">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LockIcon className="w-5 h-5" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-[#001f3f]">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <LockIcon className="w-5 h-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transition-all disabled:opacity-70 text-sm cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Resetting Password...
                    </span>
                  ) : (
                    'Update Password'
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Confirmation Success State */
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-6 shadow-xs">
              <CheckCircleIcon className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#001f3f]">Password Reset Complete!</h2>
            <p className="text-sm text-slate-600 font-medium mt-3 leading-relaxed">
              {message}
            </p>
            <div className="mt-8 p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Redirecting to login page in 3 seconds...
            </div>
            <button
              onClick={() => navigate('/login')}
              className="mt-6 w-full py-3.5 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition-colors text-sm cursor-pointer shadow-sm"
            >
              Go to Login Now
            </button>
          </div>
        )}

        {/* Back to Login Footer */}
        <div className="mt-10 pt-8 border-t border-slate-100 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2.5 text-sm font-bold text-emerald-800 hover:text-emerald-900 transition-colors group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}