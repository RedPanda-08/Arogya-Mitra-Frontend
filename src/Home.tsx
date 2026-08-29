import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from './am-logo.jpeg';

// ---------------------------------------------------------------------------
// Types & Image Assets (Live Unsplash CDN)
// ---------------------------------------------------------------------------
type TabId = "home" | "about" | "contact";

const IMAGES = {
  heroBanner: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80", 
  patientApp: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",  
  centralAi: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",   
  hospitalHms: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80", 
  emergencySos: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80",
  doctorCare: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80",  
  abdmRecord: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80",  
};

// ---------------------------------------------------------------------------
// Safe Image Component (Prevents Broken Image Icons on Other Machines)
// ---------------------------------------------------------------------------
const SafeImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = '' }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 flex items-center justify-center text-white/70 font-semibold text-xs text-center p-2 ${className}`}>
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};

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
// Shared Icons & Logos
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
// Added: mobile menu open/close icons (same handwritten-svg pattern as the icons above)
const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" {...iconProps}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

const BrandMark: React.FC = () => (
  <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm overflow-hidden shrink-0">
    <img 
      src={logo} 
      alt="Arogya Mitra Logo" 
      className="w-full h-full object-cover mix-blend-multiply filter contrast-125" 
    />
  </div>
);

// ---------------------------------------------------------------------------
// Lightweight Hero Animation Wrapper
// ---------------------------------------------------------------------------
const Reveal: React.FC<{ 
  children: React.ReactNode; 
  delay?: number; 
  className?: string; 
}> = ({ children, delay = 0, className = "" }) => {
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
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
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
    className={`inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 sm:px-3.5 font-sans text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-800 shadow-2xs ${className}`}
  >
    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600 shrink-0" />
    {children}
  </div>
);

type ButtonVariant = "primary" | "accent" | "ghost";

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; block?: boolean }
> = ({ variant = "primary", block, className = "", children, ...rest }) => {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs focus:ring-emerald-600",
    accent: "bg-[#001f3f] text-white hover:bg-[#00152e] shadow-xs focus:ring-[#001f3f]",
    ghost: "bg-transparent text-emerald-900 hover:bg-emerald-50 border border-transparent",
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
        className="min-h-[100px] w-full resize-y pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-colors"
      />
    ) : (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-4 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-colors"
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
  // Added: mobile menu open state. Nav links and Sign in were previously
  // `hidden` below the `md` breakpoint with no alternate way to reach them —
  // this restores access to the same onNavigate handler on mobile.
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileNavigate = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 shadow-2xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
        <button onClick={() => handleMobileNavigate("home")} className="flex items-center gap-2.5 sm:gap-3 text-base sm:text-xl font-bold text-[#001f3f] tracking-tight hover:opacity-80 transition-opacity cursor-pointer">
          <BrandMark />
          <span className="whitespace-nowrap">AROGYA VITRA</span>
        </button>

        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="rounded-lg px-4 py-2 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => onNavigate("login")}
            className="hidden md:block text-sm font-bold text-slate-700 hover:text-emerald-900 transition-colors px-3 cursor-pointer"
          >
            Sign in
          </button>
          <Button variant="primary" onClick={() => onNavigate("register")} className="px-3.5 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm">
            Get Started
          </Button>
          {/* Added: hamburger toggle, mobile-only */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-[#001f3f] hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            {mobileOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Added: mobile nav panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out border-t border-slate-200/80 bg-white ${
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 border-t-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3 gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleMobileNavigate(link.id)}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleMobileNavigate("login")}
            className="rounded-lg px-3 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </nav>
      </div>
    </header>
  );
};

// ---------------------------------------------------------------------------
// Home Section (Unified Flow with Safe Unsplash Images)
// ---------------------------------------------------------------------------
const LAYERS = [
  { idx: "01", title: "AV Care", desc: "Patient app, every Indian language", Icon: HeartIcon, tone: "emerald" as const, img: IMAGES.patientApp },
  { idx: "02", title: "Central Intelligence", desc: "The engine linking every layer", Icon: NetworkIcon, tone: "sage" as const, img: IMAGES.centralAi },
  { idx: "03", title: "Hospital System", desc: "HMS + doctor tools + analytics", Icon: HospitalIcon, tone: "navy" as const, img: IMAGES.hospitalHms },
];

const layerTone: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  sage: "bg-teal-50 text-teal-800 border border-teal-200",
  navy: "bg-slate-100 text-slate-800 border border-slate-200",
};

const FEATURES = [
  {
    Icon: HospitalIcon,
    title: "Doctor Care auto-reassignment",
    desc: "If a doctor cancels, the system reassigns your slot automatically — no chasing the front desk.",
    img: IMAGES.doctorCare,
  },
  {
    Icon: SirenIcon,
    title: "108 Emergency SOS",
    desc: "One tap alerts the nearest hospital and your family in real time, before the ambulance even arrives.",
    img: IMAGES.emergencySos,
  },
  {
    Icon: NetworkIcon,
    title: "AI analytics for hospitals",
    desc: "Hospitals see patient load, outcomes and resourcing patterns as they happen, not at month end.",
    img: IMAGES.centralAi,
  },
  {
    Icon: CheckCircleIcon,
    title: "ABDM / ABHA integration",
    desc: "Your health records follow the national digital health ID — no paperwork to carry between visits.",
    img: IMAGES.abdmRecord,
  },
];

const HomeSection: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
  <>
    {/* Hero Section */}
    <div className="relative overflow-hidden pt-10 pb-14 sm:pt-16 sm:pb-20 md:pt-24 md:pb-28">
      {/* Background Banner */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transform-gpu">
        <SafeImage 
          src={IMAGES.heroBanner} 
          alt="Healthcare background" 
          className="h-full w-full object-cover object-center opacity-80 filter saturate-110 contrast-110 brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/95" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 sm:gap-14 px-4 sm:px-6 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal delay={30}>
            <Eyebrow className="mb-4 sm:mb-5">Built for Indian healthcare</Eyebrow>
          </Reveal>
          
          <Reveal delay={60}>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-[#001f3f]">
              One platform for every <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-700">layer of care</span>, from home to hospital.
            </h1>
          </Reveal>
          
          <Reveal delay={90}>
            <p className="mt-4 sm:mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-slate-800 font-semibold">
              Arogya Vitra connects patients, doctors and hospitals on a single intelligent system — with real-time
              emergency response, AI-guided diagnostics and support in every Indian language.
            </p>
          </Reveal>
          
          <Reveal delay={120}>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Button variant="primary" onClick={() => onNavigate("register")} block className="sm:w-auto">
                Create Free Account
              </Button>
              <Button variant="ghost" onClick={() => onNavigate("about")} block className="sm:w-auto">
                See how it works →
              </Button>
            </div>
          </Reveal>
          
          <Reveal delay={150}>
            <div className="mt-8 sm:mt-12 flex flex-wrap gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-slate-200">
              {[
                ["8", "Platform microservices"],
                ["108", "Emergency SOS network"],
                ["3", "Connected layers"],
              ].map(([num, label]) => (
                <div key={label} className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#001f3f]">
                    {num}
                  </span>
                  <span className="mt-1 text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Hero Architecture Cards */}
        <div className="relative flex flex-col gap-3 sm:gap-4">
          <div
            className="absolute bottom-0 left-9 sm:left-10 top-6 z-0 w-0.5"
            style={{
              backgroundImage: "repeating-linear-gradient(to bottom, #059669 0 4px, transparent 4px 8px)",
            }}
          />
          {LAYERS.map((layer, index) => {
            const delays = [90, 120, 150];
            return (
              <Reveal key={layer.idx} delay={delays[index]} className="h-full">
                <div className="relative flex items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-2xs p-4 sm:p-5 shadow-xs hover:border-emerald-300 transition-colors h-full">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="font-mono text-xs font-extrabold text-emerald-800">{layer.idx}</span>
                    <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl ${layerTone[layer.tone]}`}>
                      <layer.Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm sm:text-base font-bold text-[#001f3f]">{layer.title}</h4>
                      <p className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-700">{layer.desc}</p>
                    </div>
                  </div>
                  <SafeImage 
                    src={layer.img} 
                    alt={layer.title} 
                    className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0 hidden sm:block" 
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>

    {/* Key Features Section */}
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-10 sm:mb-16 max-w-2xl text-center">
          <Eyebrow className="mx-auto mb-4">Why Arogya Vitra</Eyebrow>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#001f3f]">
            Care that doesn&rsquo;t drop the thread
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-slate-700">
            Every feature is built to close a gap most healthcare apps leave open — from a missed appointment to a
            delayed ambulance.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 hover:border-emerald-300 hover:shadow-md transition-all duration-200 h-full flex flex-col overflow-hidden">
              <div className="h-28 sm:h-32 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-4 overflow-hidden relative border-b border-slate-100">
                <SafeImage src={f.img} alt={f.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                <f.Icon className="absolute bottom-3 left-4 h-7 w-7 text-white drop-shadow-md" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-[#001f3f]">{f.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 font-medium mt-auto">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Call-to-Action Section */}
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-12">
      <div className="relative overflow-hidden flex flex-col items-center justify-between gap-6 sm:gap-8 rounded-3xl bg-[#001f3f] p-7 sm:p-10 md:p-14 text-center md:flex-row md:text-left shadow-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h3 className="max-w-md text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            Your care team, records, and emergency line — in one place.
          </h3>
          <p className="mt-3 text-emerald-200 font-medium text-sm sm:text-base">Create a free account in under a minute.</p>
        </div>
        <Button variant="primary" block className="sm:w-auto relative z-10 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 sm:py-4 text-base shadow-md" onClick={() => onNavigate("register")}>
          Create account →
        </Button>
      </div>
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
    border: "border-t-emerald-600",
    img: IMAGES.patientApp,
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
    border: "border-t-teal-600",
    img: IMAGES.centralAi,
    items: [
      "Connects every app and hospital system in real time",
      "Arogya Score engine and OCR record ingestion",
      "Routes the 108 emergency network and pre-alerts",
      "Shared backend for all seven platform services",
    ],
  },
  {
    tag: "Layer 03 — Hospital",
    title: "Hospital / Doctor System",
    border: "border-t-[#001f3f]",
    img: IMAGES.hospitalHms,
    items: [
      "Arogya Vitra HMS for hospital administration",
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
  <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 sm:py-16">
    <div className="mb-2">
      <Eyebrow>About Arogya Vitra</Eyebrow>
      <h1 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#001f3f]">
        A centralized system, built in three layers.
      </h1>
      <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-700 font-semibold">
        Most healthcare apps solve one piece of the journey — booking, or records, or hospital admin. Arogya Vitra was
        built to hold all of it together, so a patient&rsquo;s history, a doctor&rsquo;s schedule and a
        hospital&rsquo;s operations stay in sync.
      </p>
    </div>

    <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
      {LAYER_DETAILS.map((layer) => (
        <div key={layer.title} className={`rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm ${layer.border} h-full flex flex-col overflow-hidden`}>
          <div className="h-32 sm:h-36 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-5 sm:mb-6 overflow-hidden relative border-b border-slate-100">
            <SafeImage src={layer.img} alt={layer.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
          </div>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">{layer.tag}</span>
          <h4 className="mt-3 text-lg sm:text-xl font-bold text-[#001f3f]">{layer.title}</h4>
          <ul className="mt-4 list-disc pl-5 text-sm leading-relaxed text-slate-700 font-medium space-y-2">
            {layer.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="mx-auto mb-10 sm:mb-12 mt-16 sm:mt-20 max-w-2xl text-center">
      <Eyebrow className="mx-auto mb-4">What sets it apart</Eyebrow>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#001f3f]">
        Four things competitors don&rsquo;t do together
      </h2>
    </div>

    <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
      {DIFFERENTIATORS.map((d) => (
        <div key={d.title} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs hover:border-emerald-300 h-full">
          <d.Icon className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 text-emerald-800" />
          <div>
            <h4 className="text-base sm:text-lg font-bold text-[#001f3f]">{d.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 font-medium">{d.desc}</p>
          </div>
        </div>
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
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:gap-16 px-4 sm:px-6 py-12 sm:py-16 md:grid-cols-2">
      <div>
        <Eyebrow className="mb-2">Get in touch</Eyebrow>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#001f3f]">Let&rsquo;s talk.</h1>
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-700 font-semibold">
          Questions about the platform, a hospital partnership, or something else — send a note and the team will
          get back to you.
        </p>
        
        <div className="mt-8 sm:mt-10 space-y-5 sm:space-y-6">
          <div className="flex items-center gap-4 text-sm sm:text-base font-semibold text-[#001f3f]">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-900 shadow-2xs shrink-0">
              <MailIcon className="h-5 w-5" />
            </div>
            <span className="break-all">support@arogyavitra.in</span>
          </div>
          <div className="flex items-center gap-4 text-sm sm:text-base font-semibold text-[#001f3f]">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-900 shadow-2xs shrink-0">
              <PinIcon className="h-5 w-5" />
            </div>
            Hyderabad, Telangana, India
          </div>
          <div className="flex items-center gap-4 text-sm sm:text-base font-semibold text-[#001f3f]">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-900 shadow-2xs shrink-0">
              <PhoneIcon className="h-5 w-5" />
            </div>
            +91 9874588327
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 md:p-10 shadow-lg">
        <form onSubmit={handleSubmit}>
          <Field id="cName" label="Name" placeholder="Your name" value={name} onChange={setName} required />
          <Field id="cEmail" label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} required />
          <Field id="cMsg" label="Message" placeholder="How can we help?" value={msg} onChange={setMsg} textarea required />
          <Button type="submit" variant="primary" block disabled={sending} className="mt-2">
            {sending ? "Sending..." : "Send message"}
          </Button>
          <p className="mt-4 text-center text-sm font-semibold text-slate-600">{note}</p>
        </form>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
const Footer: React.FC = () => (
  <footer className="py-10 sm:py-12 mt-auto bg-slate-50 border-t border-slate-200">
    <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 sm:px-6 text-sm font-medium text-slate-600 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <BrandMark />
        <span className="font-bold text-[#001f3f] tracking-tight ml-1">AROGYA VITRA</span>
      </div>
      <span>© {new Date().getFullYear()} Arogya Vitra. Hyderabad, India.</span>
      <span className="font-semibold text-slate-500">AV Care · Central Intelligence · Hospital System</span>
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
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased flex flex-col">
      <Header onNavigate={handleNavigate} />

      <main className="flex-grow">
        <section id="home" className="scroll-mt-20">
          <HomeSection onNavigate={handleNavigate} />
        </section>
        
        <section id="about" className="scroll-mt-20">
          <AboutSection />
        </section>
        
        <section id="contact" className="scroll-mt-20">
          <ContactSection showToast={showToast} />
        </section>
      </main>

      <Footer />
      <Toast message={message} />
    </div>
  );
}