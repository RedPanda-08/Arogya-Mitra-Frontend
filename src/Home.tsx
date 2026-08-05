import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from './am-logo.jpeg';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type TabId = "home" | "about" | "contact";

// ---------------------------------------------------------------------------
// Toast Hook & Component
// ---------------------------------------------------------------------------
function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMessage(null), 3200);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { message, showToast };
}

const Toast: React.FC<{ message: string | null }> = ({ message }) => (
  <div
    className={`fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-[#001f3f] px-5 py-3 text-sm font-medium text-white shadow-xl transition-all duration-300 ${
      message ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-5 opacity-0"
    }`}
  >
    {message}
  </div>
);

// ---------------------------------------------------------------------------
// Shared Icons (Exact SVG Paths)
// ---------------------------------------------------------------------------
const iconProps = { fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c1.9 0 3.3 1 4 2.2C11.2 6 12.6 5 14.5 5 18 5 20.5 8.5 18.5 12.5 16 16.65 12 21 12 21z" />
  </svg>
);
const NetworkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
  </svg>
);
const HospitalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M4 21V8l8-5 8 5v13" />
    <path d="M9 21v-6h6v6" />
  </svg>
);
const SirenIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M9 12l2 2 4-4" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const MailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
const PinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.34 1.78.65 2.62a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.46-1.22a2 2 0 012.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0122 16.92z" />
  </svg>
);

const BrandMark: React.FC = () => (
  <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-md overflow-hidden">
    <img 
      src={logo} 
      alt="Arogya Mitra Logo" 
      className="w-full h-full object-cover mix-blend-multiply filter contrast-125" 
    />
  </div>
);

// ---------------------------------------------------------------------------
// Professional Scroll & Mount Animation Wrapper
// ---------------------------------------------------------------------------
const Reveal: React.FC<{ 
  children: React.ReactNode; 
  delay?: number; 
  className?: string; 
  direction?: 'up' | 'left' | 'right' 
}> = ({ children, delay = 0, className = "", direction = 'up' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const transformClass = direction === 'up' 
    ? 'translate-y-4' 
    : direction === 'left' 
      ? '-translate-x-4' 
      : 'translate-x-4';

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? "opacity-100 translate-y-0 translate-x-0" : `opacity-0 ${transformClass}`
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Shared UI Components
// ---------------------------------------------------------------------------
const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div
    className={`inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-100 px-3 py-1.5 font-sans text-xs font-bold uppercase tracking-widest text-teal-700 ${className}`}
  >
    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-500" />
    {children}
  </div>
);

type ButtonVariant = "primary" | "accent" | "ghost";

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; block?: boolean }
> = ({ variant = "primary", block, className = "", children, ...rest }) => {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-teal-700 text-white hover:bg-teal-800 shadow-sm focus:ring-teal-600",
    accent: "bg-[#001f3f] text-white hover:bg-[#00152e] shadow-sm focus:ring-[#001f3f]",
    ghost: "bg-transparent text-teal-700 hover:bg-teal-50 border border-transparent",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${
        variants[variant]
      } ${block ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

const Field: React.FC<{
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  required?: boolean;
}> = ({ id, label, type = "text", placeholder, value, onChange, textarea, required }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-semibold text-[#001f3f] mb-1.5">
      {label}
    </label>
    {textarea ? (
      <textarea
        id={id}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] w-full resize-y pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
      />
    ) : (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all"
      />
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------
const NAV_LINKS: { id: TabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const Header: React.FC<{ onNavigate: (t: string) => void }> = ({ onNavigate }) => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-3 text-xl font-bold text-[#001f3f] tracking-tight hover:opacity-80 transition-opacity cursor-pointer">
          <BrandMark />
          AROGYA VITRA
        </button>

        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="rounded-lg px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-teal-700 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate("login")}
            className="hidden sm:block text-sm font-bold text-slate-500 hover:text-teal-700 transition-colors px-3 cursor-pointer"
          >
            Sign in
          </button>
          <Button variant="primary" onClick={() => onNavigate("register")}>
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

// ---------------------------------------------------------------------------
// Home Section
// ---------------------------------------------------------------------------
const LAYERS = [
  { idx: "01", title: "Av Care", desc: "Patient app, every Indian language", Icon: HeartIcon, tone: "teal" as const },
  { idx: "02", title: "Central Intelligence", desc: "The engine linking every layer", Icon: NetworkIcon, tone: "blue" as const },
  { idx: "03", title: "Hospital System", desc: "HMS + doctor tools + analytics", Icon: HospitalIcon, tone: "navy" as const },
];

const layerTone: Record<string, string> = {
  teal: "bg-teal-50 text-teal-700",
  blue: "bg-blue-50 text-blue-600",
  navy: "bg-indigo-50 text-indigo-700",
};

const FEATURES = [
  {
    Icon: HospitalIcon,
    title: "Doctor Care auto-reassignment",
    desc: "If a doctor cancels, the system reassigns your slot automatically — no chasing the front desk.",
  },
  {
    Icon: SirenIcon,
    title: "108 Emergency SOS",
    desc: "One tap alerts the nearest hospital and your family in real time, before the ambulance even arrives.",
  },
  {
    Icon: NetworkIcon,
    title: "AI analytics for hospitals",
    desc: "Hospitals see patient load, outcomes and resourcing patterns as they happen, not at month end.",
  },
  {
    Icon: CheckCircleIcon,
    title: "ABDM / ABHA integration",
    desc: "Your health records follow the national digital health ID — no paperwork to carry between visits.",
  },
];

const HomeSection: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
  <>
    <div className="relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-emerald-50/80 to-transparent pointer-events-none z-0"></div>
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-teal-100/40 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-6 pb-16 pt-16 md:grid-cols-[1.1fr_0.9fr] md:pt-24">
        <div>
          <Reveal delay={100}>
            <Eyebrow className="mb-5">Built for Indian healthcare</Eyebrow>
          </Reveal>
          
          <Reveal delay={200}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-[#001f3f]">
              One platform for every <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">layer of care</span>, from home to hospital.
            </h1>
          </Reveal>
          
          <Reveal delay={300}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-500">
              Arogya Mitra connects patients, doctors and hospitals on a single intelligent system — with real-time
              emergency response, AI-guided diagnostics and support in every Indian language.
            </p>
          </Reveal>
          
          <Reveal delay={400}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="primary" onClick={() => onNavigate("register")}>
                Create Free Account
              </Button>
              <Button variant="ghost" onClick={() => onNavigate("about")}>
                See how it works →
              </Button>
            </div>
          </Reveal>
          
          <Reveal delay={500}>
            <div className="mt-12 flex gap-8 border-t border-slate-200 pt-8">
              {[
                ["16", "Platform microservices"],
                ["108", "Emergency SOS network"],
                ["3", "Connected layers"],
              ].map(([num, label]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-2xl font-extrabold text-[#001f3f]">
                    {num}
                  </span>
                  <span className="mt-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="relative flex flex-col gap-4">
          <div
            className="absolute bottom-0 left-10 top-0 z-0 w-0.5"
            style={{
              backgroundImage: "repeating-linear-gradient(to bottom, #e2e8f0 0 4px, transparent 4px 8px)",
            }}
          />
          {LAYERS.map((layer, index) => {
            const delays = [300, 400, 500];
            return (
              <Reveal key={layer.idx} delay={delays[index]} direction="left" className="h-full">
                <div className="relative flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow h-full flex">
                  <span className="font-mono text-xs font-bold text-slate-400">{layer.idx}</span>
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${layerTone[layer.tone]}`}>
                    <layer.Icon className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-base font-bold text-[#001f3f]">{layer.title}</h4>
                    <p className="mt-0.5 text-sm text-slate-500">{layer.desc}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>

    <div className="bg-white border-y border-slate-200">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <Eyebrow className="mx-auto mb-4">Why Arogya Mitra</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#001f3f]">
              Care that doesn&rsquo;t drop the thread
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Every feature is built to close a gap most healthcare apps leave open — from a missed appointment to a
              delayed ambulance.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, index) => (
            <Reveal key={f.title} delay={index * 100} className="h-full">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 hover:bg-white hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                <f.Icon className="mb-4 h-8 w-8 text-teal-600 shrink-0" />
                <h4 className="text-lg font-bold text-[#001f3f]">{f.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 mt-auto">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>

    <div className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <div className="flex flex-col items-center justify-between gap-8 rounded-3xl bg-[#001f3f] p-10 sm:p-14 text-center md:flex-row md:text-left shadow-2xl">
          <div>
            <h3 className="max-w-md text-3xl font-extrabold text-white leading-tight">
              Your care team, records, and emergency line — in one place.
            </h3>
            <p className="mt-3 text-teal-100 font-medium">Create a free account in under a minute.</p>
          </div>
          <Button variant="primary" className="bg-teal-500 hover:bg-teal-400 text-[#001f3f] px-8 py-4 text-base" onClick={() => onNavigate("register")}>
            Create account →
          </Button>
        </div>
      </Reveal>
    </div>
  </>
);

// ---------------------------------------------------------------------------
// About Section
// ---------------------------------------------------------------------------
const LAYER_DETAILS = [
  {
    tag: "Layer 01 — Patient",
    title: "AV Care",
    border: "border-t-teal-600",
    items: [
      "Mobile app for patients, in every Indian language",
      "Daily Check-In with streaks and family notifications",
      "AI diet planner with meal-photo recognition",
      "Lab and home testing, reminder calendar",
    ],
  },
  {
    tag: "Layer 02 — Intelligence",
    title: "Central Intelligence Platform",
    border: "border-t-indigo-500",
    items: [
      "Connects every app and hospital system in real time",
      "Arogya Score engine and OCR record ingestion",
      "Routes the 108 emergency network and pre-alerts",
      "Shared backend for all sixteen platform services",
    ],
  },
  {
    tag: "Layer 03 — Hospital",
    title: "Hospital / Doctor System",
    border: "border-t-blue-500",
    items: [
      "Arogya Mitra HMS for hospital administration",
      "Av Care Sub, the companion app for doctors",
      "AI analytics dashboard for hospital management",
      "Home-to-hospital transport and attendant service",
    ],
  },
];

const DIFFERENTIATORS = [
  {
    Icon: SirenIcon,
    title: "Real 108 emergency integration",
    desc: "Direct contract-based routing into the national emergency ambulance network, not a call-center layer bolted on top.",
  },
  {
    Icon: HospitalIcon,
    title: "One record, every stop",
    desc: "The same patient record moves from home to lab to hospital, instead of resetting at each door.",
  },
  {
    Icon: ClockIcon,
    title: "Daily habits, not just transactions",
    desc: "Blink, Today's Plate and streaks give people a reason to open the app on days they're not sick.",
  },
  {
    Icon: CheckCircleIcon,
    title: "Hospitals get intelligence, not just software",
    desc: "AI analytics turn day-to-day hospital data into decisions, not just storage.",
  },
];

const AboutSection: React.FC = () => (
  <div className="mx-auto max-w-6xl px-6 pb-20 pt-16">
    <Reveal>
      <Eyebrow className="mb-2">About Arogya Mitra</Eyebrow>
      <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#001f3f]">
        A centralized system, built in three layers.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-500">
        Most healthcare apps solve one piece of the journey — booking, or records, or hospital admin. Arogya Mitra was
        built to hold all of it together, so a patient&rsquo;s history, a doctor&rsquo;s schedule and a
        hospital&rsquo;s operations stay in sync.
      </p>
    </Reveal>

    <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
      {LAYER_DETAILS.map((layer, index) => (
        <Reveal key={layer.title} delay={index * 150} className="h-full">
          <div className={`rounded-2xl border border-slate-200 border-t-4 bg-white p-8 shadow-md ${layer.border} h-full flex flex-col`}>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">{layer.tag}</span>
            <h4 className="mt-3 text-xl font-bold text-[#001f3f]">{layer.title}</h4>
            <ul className="mt-4 list-disc pl-5 text-sm leading-relaxed text-slate-500 space-y-2">
              {layer.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>

    <Reveal>
      <div className="mx-auto mb-12 mt-24 max-w-2xl text-center">
        <Eyebrow className="mx-auto mb-4">What sets it apart</Eyebrow>
        <h2 className="text-3xl font-extrabold text-[#001f3f]">
          Four things competitors don&rsquo;t do together
        </h2>
      </div>
    </Reveal>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {DIFFERENTIATORS.map((d, index) => (
        <Reveal key={d.title} delay={index * 100} className="h-full">
          <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-full flex">
            <d.Icon className="h-8 w-8 shrink-0 text-teal-600" />
            <div>
              <h4 className="text-lg font-bold text-[#001f3f]">{d.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{d.desc}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Contact Section
// ---------------------------------------------------------------------------
const ContactSection: React.FC<{ showToast: (msg: string) => void }> = ({ showToast }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [note, setNote] = useState("We usually reply within one business day.");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await fetch("http://localhost:8090/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: msg,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

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
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 py-20 md:grid-cols-2">
      <div>
        <Reveal delay={100}>
          <Eyebrow className="mb-2">Get in touch</Eyebrow>
          <h1 className="mt-4 text-4xl font-extrabold text-[#001f3f]">Let&rsquo;s talk.</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-500">
            Questions about the platform, a hospital partnership, or something else — send a note and the team will
            get back to you.
          </p>
        </Reveal>
        
        <div className="mt-10 space-y-6">
          <Reveal delay={200}>
            <div className="flex items-center gap-4 text-base font-semibold text-[#001f3f]">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
                <MailIcon className="h-5 w-5" />
              </div>
              support@arogyavitra.in
            </div>
          </Reveal>
          <Reveal delay={300}>
            <div className="flex items-center gap-4 text-base font-semibold text-[#001f3f]">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
                <PinIcon className="h-5 w-5" />
              </div>
              Hyderabad, Telangana, India
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="flex items-center gap-4 text-base font-semibold text-[#001f3f]">
              <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-700">
                <PhoneIcon className="h-5 w-5" />
              </div>
              +91 9874588327
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal delay={200} direction="up">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xl">
          <form onSubmit={handleSubmit}>
            <Field id="cName" label="Name" placeholder="Your name" value={name} onChange={setName} required />
            <Field id="cEmail" label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} required />
            <Field id="cMsg" label="Message" placeholder="How can we help?" value={msg} onChange={setMsg} textarea required />
            <Button type="submit" variant="primary" block disabled={sending} className="mt-2">
              {sending ? "Sending..." : "Send message"}
            </Button>
            <p className="mt-4 text-center text-sm font-medium text-slate-500">{note}</p>
          </form>
        </div>
      </Reveal>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
const Footer: React.FC = () => (
  <footer className="border-t border-slate-200 bg-slate-50 py-8 mt-auto">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 text-sm font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <BrandMark />
        <span className="font-bold text-[#001f3f] tracking-tight ml-1">AROGYA VITRA</span>
      </div>
      <span>© {new Date().getFullYear()} Arogya Vitra. Hyderabad, India.</span>
      <span className="font-semibold text-slate-400">AV Care · Central Intelligence · Hospital System</span>
    </div>
  </footer>
);

// ---------------------------------------------------------------------------
// App (Home Page Wrapper)
// ---------------------------------------------------------------------------
export default function Home() {
  const { message, showToast } = useToast();
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (path === "login") {
      navigate("/login");
    } else if (path === "register") {
      navigate("/signup");
    } else if (path === "home" || path === "about" || path === "contact") {
      const element = document.getElementById(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased flex flex-col">
      <Header onNavigate={handleNavigate} />

      <main className="flex-grow">
        <section id="home" className="scroll-mt-20">
          <HomeSection onNavigate={handleNavigate} />
        </section>
        
        <section id="about" className="scroll-mt-20 border-t border-slate-200">
          <AboutSection />
        </section>
        
        <section id="contact" className="scroll-mt-20 border-t border-slate-200 bg-white">
          <ContactSection showToast={showToast} />
        </section>
      </main>

      <Footer />
      <Toast message={message} />
    </div>
  );
}