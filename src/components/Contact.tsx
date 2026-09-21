import React, { useState } from "react";
import axios from "axios";

export const Contact: React.FC<{ showToast: (msg: string) => void }> = ({ showToast }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("We usually reply within one business day.");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post("http://localhost:8090/api/contact", {
        name,
        email,
        message: msg,
      });

      setNote("We usually reply within one business day.");
      setName("");
      setEmail("");
      setMsg("");
      showToast("Message sent successfully!");
    } catch (error) {
      console.error("Contact form error:", error);
      setNote("Could not send right now — please try again.");
      showToast("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:gap-16 px-4 sm:px-6 py-14 sm:py-20 md:grid-cols-2 items-start">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50/80 px-3.5 py-1.5 font-sans text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-800 shadow-2xs mb-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600 shrink-0" />
          Get in touch
        </div>
        <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#001f3f] tracking-tight">Let&rsquo;s talk.</h2>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-700 font-medium">
          Questions about the platform, a hospital partnership, or something else — send a note and the team will
          get back to you.
        </p>

        <div className="mt-8 sm:mt-10 space-y-5 sm:space-y-6">
          <div className="flex items-center gap-4 text-sm sm:text-base font-semibold text-[#001f3f]">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-900 shadow-2xs shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </div>
            <span className="break-all">support@arogyavitra.in</span>
          </div>
          <div className="flex items-center gap-4 text-sm sm:text-base font-semibold text-[#001f3f]">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-900 shadow-2xs shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            Hyderabad, Telangana, India
          </div>
          <div className="flex items-center gap-4 text-sm sm:text-base font-semibold text-[#001f3f]">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-900 shadow-2xs shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.34 1.78.65 2.62a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.46-1.22a2 2 0 012.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0122 16.92z" />
              </svg>
            </div>
            +91 9874588327
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 md:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cName" className="block text-sm font-semibold text-[#001f3f] mb-1.5">Name</label>
            <input
              id="cName"
              type="text"
              placeholder="Your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 bg-slate-50/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:bg-white transition-colors border border-slate-200"
            />
          </div>

          <div>
            <label htmlFor="cEmail" className="block text-sm font-semibold text-[#001f3f] mb-1.5">Email</label>
            <input
              id="cEmail"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-4 pr-4 py-2.5 bg-slate-50/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:bg-white transition-colors border border-slate-200"
            />
          </div>

          <div>
            <label htmlFor="cMsg" className="block text-sm font-semibold text-[#001f3f] mb-1.5">Message</label>
            <textarea
              id="cMsg"
              placeholder="How can we help?"
              required
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="min-h-[100px] w-full resize-y pl-4 pr-4 py-2.5 bg-slate-50/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:bg-white transition-colors border border-slate-200"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm rounded-xl px-5 py-2.5 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 cursor-pointer disabled:opacity-70 mt-2"
          >
            {sending ? "Sending..." : "Send message"}
          </button>
          <p className="mt-4 text-center text-sm font-medium text-slate-500">{note}</p>
        </form>
      </div>
    </div>
  );
};