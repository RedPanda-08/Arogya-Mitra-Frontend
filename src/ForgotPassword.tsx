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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans text-slate-800 p-6 antialiased">
      
      {/* Main Container */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 max-w-md w-full relative overflow-hidden">
        

        {!isSent ? (
          <>
            {/* Form Header */}
            <div className="mb-6 text-center sm:text-left">
              <h1 className="text-2xl font-extrabold text-[#001f3f]">Forgot Password?</h1>
              <p className="text-sm font-medium text-slate-600 mt-1.5 leading-relaxed">
                No worries. Enter your registered email address and we'll send you a secure link to reset your password.
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Reset Request Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#001f3f] mb-1.5">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-sm font-medium transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transition-all disabled:opacity-70 text-sm cursor-pointer shadow-xs active:scale-[0.99]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Link...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </>
        ) : (
          /* Confirmation Success State */
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-2xs">
              <CheckCircleIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#001f3f]">Check Your Email</h2>
            <p className="text-sm text-slate-600 font-medium mt-2 leading-relaxed">
              {message}
            </p>
            <div className="mt-6 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium">
              Didn't receive the email? Check your spam folder or try again.
            </div>
            <button
              onClick={() => setIsSent(false)}
              className="mt-4 text-xs font-bold text-emerald-800 hover:text-emerald-900 transition-colors cursor-pointer"
            >
              Re-enter email address
            </button>
          </div>
        )}

        {/* Back to Login Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-900 transition-colors group"
          >
            <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
}