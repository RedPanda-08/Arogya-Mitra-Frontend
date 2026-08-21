import React, { useState } from 'react';
import { apiClient } from './services/api';
import { Link } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Inline Icons
// ---------------------------------------------------------------------------
const iconProps = { fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;

const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
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

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      await apiClient.post('/api/auth/forgot-password', { email });
      setMessage('If an account with that email exists, a password reset link has been sent.');
      setIsSent(true);
    } catch {
      setError('Something went wrong. Please check your email and try again.');
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
        
        {!isSent ? (
          <>
            {/* Form Header */}
            <div className="mb-8 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001f3f] tracking-tight">
                Forgot Password?
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-2.5 leading-relaxed">
                No worries. Enter your registered email address and we'll send you a secure link to reset your password.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-3">
                <span className="text-base flex-shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Reset Request Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <label 
                  htmlFor="email" 
                  className="block text-xs font-bold uppercase tracking-wider text-[#001f3f]"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MailIcon className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl  focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transition-all disabled:opacity-70 text-sm cursor-pointer shadow-sm active:scale-[0.99]"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Link...
                    </span>
                  ) : (
                    'Send Reset Link'
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
            <h2 className="text-2xl font-extrabold text-[#001f3f]">Check Your Email</h2>
            <p className="text-sm text-slate-600 font-medium mt-3 leading-relaxed">
              {message}
            </p>
            <div className="mt-8 p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-semibold leading-relaxed">
              Didn't receive the email? Check your spam folder or try again.
            </div>
            <button
              onClick={() => setIsSent(false)}
              className="mt-6 text-xs font-bold text-emerald-800 hover:text-emerald-900 transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-emerald-50"
            >
              Re-enter email address
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