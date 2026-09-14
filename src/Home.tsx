import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from './am-logo.jpeg';

// ---------------------------------------------------------------------------
// Types & Image Assets
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
// Safe Image Component (Bulletproof Fallback System)
// ---------------------------------------------------------------------------
const SafeImage: React.FC<{ 
  src: string; 
  fallbackSrc?: string; 
  alt: string; 
  className?: string 
}> = ({ src, fallbackSrc, alt, className = '' }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 flex items-center justify-center text-white/80 font-bold text-xs p-3 text-center ${className}`}>
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
      onError={handleError}
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
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const PhoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.12.9.34 1.78.65 2.62a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.46-1.22a2 2 0 012.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0122 16.92z" />
  </svg>
);
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
const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const BrandMark: React.FC = () => (
  <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs overflow-hidden shrink-0">
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
    className={`inline-flex items-center gap-2 rounded-full bg-emerald-50/80 px-3.5 py-1.5 font-sans text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-800 shadow-2xs ${className}`}
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
    ghost: "bg-transparent text-emerald-900 hover:bg-emerald-50/60",
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${
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
        className="min-h-[100px] w-full resize-y pl-4 pr-4 py-2.5 bg-slate-50/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:bg-white transition-colors"
      />
    ) : (
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-4 pr-4 py-2.5 bg-slate-50/80 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:bg-white transition-colors"
      />
    )}
  </div>
);

// ---------------------------------------------------------------------------
// Header (Navbar: Smooth Blur Header)
// ---------------------------------------------------------------------------
const NAV_LINKS: { id: TabId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const Header: React.FC<{ onNavigate: (t: string) => void }> = ({ onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileNavigate = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md transition-shadow">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
        <nav onClick={() => handleMobileNavigate("home")} className="flex items-center gap-2.5 sm:gap-3 text-base sm:text-xl font-bold text-[#001f3f] tracking-tight">
          <BrandMark />
          <span className="whitespace-nowrap">AROGYA VITRA</span>
        </nav>

        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-900 transition-colors cursor-pointer"
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
          <Button variant="primary" onClick={() => onNavigate("register")} className="px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm shadow-xs">
            Get Started
          </Button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-[#001f3f] hover:bg-emerald-50/70 transition-colors cursor-pointer"
          >
            {mobileOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out bg-white/95 backdrop-blur-md ${
          mobileOpen ? "max-h-80 opacity-100 shadow-sm" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3 gap-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleMobileNavigate(link.id)}
              className="rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleMobileNavigate("login")}
            className="rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </nav>
      </div>
    </header>
  );
};

// ---------------------------------------------------------------------------
// Dedicated Hospital Network Section (No Jump, Modern Emerald Border Glow)
// ---------------------------------------------------------------------------
const PREVIEW_HOSPITALS = [
  {
    id: "h-001",
    name: "Apollo Multispecialty Hospital",
    address: "Road No. 72, Jubilee Hills, Hyderabad",
    phone: "+91 40 2360 7777",
    emergencyPhone: "1066",
    beds: 34,
    rating: 4.8,
    departments: ["Cardiology", "Neurology", "Emergency"],
    extraDeptsCount: 1,
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    fallbackImg: "https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "h-002",
    name: "Yashoda Care Center",
    address: "Alexander Road, Secunderabad, Hyderabad",
    phone: "+91 40 4567 4567",
    emergencyPhone: "105910",
    beds: 12,
    rating: 4.6,
    departments: ["Orthopedics", "Pulmonology", "General Surgery"],
    extraDeptsCount: 0,
    img: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
    fallbackImg: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    id: "h-003",
    name: "Care Hospitals Regional Hub",
    address: "Banjara Hills, Road No. 1, Hyderabad",
    phone: "+91 40 6165 6565",
    emergencyPhone: "105711",
    beds: 0,
    rating: 4.5,
    departments: ["Pediatrics", "Cardiology", "Nephrology"],
    extraDeptsCount: 0,
    img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    fallbackImg: "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const HospitalNetworkSection: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => (
  <section className="bg-gradient-to-b from-transparent via-slate-50/70 to-transparent py-14 sm:py-20">
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
        <div className="max-w-2xl">
          <Eyebrow className="mb-3">Live Facility Network</Eyebrow>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#001f3f] tracking-tight">
            Verified regional hospitals & real-time bed tracking.
          </h2>
          <p className="mt-3 text-base sm:text-lg font-medium text-slate-700">
            Check live occupancy, locate specialized clinical departments, and view emergency readiness across partnered centers before arriving.
          </p>
        </div>

        <button
          onClick={() => onNavigate("hospitals")}
          className="group inline-flex items-center gap-2 self-start md:self-auto rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-800 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <HospitalIcon className="h-4 w-4" />
          <span>Browse All Facilities</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </button>
      </div>

      {/* 3 Hospital Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PREVIEW_HOSPITALS.map((h) => {
          const hasBeds = h.beds > 0;
          return (
            <div
              key={h.id}
              onClick={() => onNavigate("hospitals")}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
            >
              {/* Photo Container */}
              <div className="h-48 w-full relative overflow-hidden bg-slate-900">
                <SafeImage
                  src={h.img}
                  fallbackSrc={h.fallbackImg}
                  alt={h.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                {/* Bed Capacity Pill (Bottom Left) */}
                <span className={`absolute bottom-3 left-3 px-3 py-1 rounded-md text-[11px] font-extrabold tracking-wide uppercase shadow-sm ${
                  hasBeds ? "bg-[#059669] text-white" : "bg-[#e11d48] text-white"
                }`}>
                  {hasBeds ? `${h.beds} BEDS VACANT` : "BEDS FULL"}
                </span>

                {/* Star Rating Badge (Top Right) */}
                <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-md text-xs font-black text-slate-900 flex items-center gap-1 shadow-sm">
                  <StarIcon className="w-3.5 h-3.5 text-amber-500" />
                  {h.rating.toFixed(1)}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {h.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5 line-clamp-1">
                    <PinIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {h.address}
                  </p>

                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <PhoneIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {h.phone}
                  </p>

                  {/* Department Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {h.departments.map((dept) => (
                      <span key={dept} className="px-2.5 py-0.5 bg-slate-50 text-slate-600 rounded-md text-[11px] font-bold">
                        {dept}
                      </span>
                    ))}
                    {h.extraDeptsCount > 0 && (
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[11px] font-bold">
                        +{h.extraDeptsCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate("hospitals");
                    }}
                    className="flex-1 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-xs text-center"
                  >
                    View Beds & Slots
                  </button>
                  <a
                    href={`tel:${h.emergencyPhone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-black transition-colors flex items-center justify-center shrink-0 cursor-pointer"
                    title="Direct Emergency SOS Line"
                  >
                    SOS
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Network Indicator Bar */}
      <div className="mt-10 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-xs">
            <HospitalIcon className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#001f3f]">Centralized Hospital Registry</h4>
            <p className="text-xs font-semibold text-slate-600">Synchronized every 30 seconds with partner HMS endpoints.</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate("hospitals")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-emerald-900 shadow-2xs hover:bg-emerald-100/50 transition-colors cursor-pointer"
        >
          Open Hospital Directory
        </button>
      </div>

    </div>
  </section>
);

// ---------------------------------------------------------------------------
// Home Section (Hero + Integrated Hospital Network + Features + CTA)
// ---------------------------------------------------------------------------
const LAYERS = [
  { idx: "01", title: "AV Care", desc: "Patient app, every Indian language", Icon: HeartIcon, tone: "emerald" as const, img: IMAGES.patientApp },
  { idx: "02", title: "Central Intelligence", desc: "The engine linking every layer", Icon: NetworkIcon, tone: "sage" as const, img: IMAGES.centralAi },
  { idx: "03", title: "Hospital System", desc: "HMS + doctor tools + analytics", Icon: HospitalIcon, tone: "navy" as const, img: IMAGES.hospitalHms },
];

const layerTone: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-800",
  sage: "bg-teal-50 text-teal-800",
  navy: "bg-slate-100 text-slate-800",
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
    {/* 1. Hero Section */}
    <div className="relative overflow-hidden pt-10 pb-14 sm:pt-16 sm:pb-20 md:pt-24 md:pb-28">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transform-gpu">
        <SafeImage 
          src={IMAGES.heroBanner} 
          alt="Healthcare background" 
          className="h-full w-full object-cover object-center opacity-80 filter saturate-110 contrast-110 brightness-100"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white" />
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
              <Button variant="primary" onClick={() => onNavigate("register")} block className="sm:w-auto shadow-md hover:shadow-emerald-900/20">
                Create Free Account
              </Button>
              <Button variant="ghost" onClick={() => onNavigate("about")} block className="sm:w-auto font-bold text-slate-700 hover:text-emerald-800">
                See how it works →
              </Button>
            </div>
          </Reveal>
          
          <Reveal delay={150}>
            <div className="mt-8 sm:mt-12 flex flex-wrap gap-6 sm:gap-8 pt-4">
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
          {LAYERS.map((layer, index) => {
            const delays = [90, 120, 150];
            return (
              <Reveal key={layer.idx} delay={delays[index]} className="h-full">
                <div className="relative flex items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xs p-4 sm:p-5 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all h-full">
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
                    className="w-14 h-14 rounded-xl object-cover shrink-0 hidden sm:block" 
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>

    {/* 2. Hospital Network Section (Directly Below Hero) */}
    <HospitalNetworkSection onNavigate={onNavigate} />

    {/* 3. Key Features Section */}
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
            <div key={f.title} className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all duration-300 h-full flex flex-col overflow-hidden">
              <div className="h-28 sm:h-32 -mx-5 -mt-5 sm:-mx-6 sm:-mt-6 mb-4 overflow-hidden relative">
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

    {/* 4. Call-to-Action Section */}
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
    toneColor: "text-emerald-700 bg-emerald-50",
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
    toneColor: "text-teal-700 bg-teal-50",
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
    toneColor: "text-slate-700 bg-slate-100",
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
        <div key={layer.title} className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all duration-300 h-full flex flex-col overflow-hidden">
          <div className="h-32 sm:h-36 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-5 sm:mb-6 overflow-hidden relative">
            <SafeImage src={layer.img} alt={layer.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
          </div>
          <span className={`inline-block w-fit px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${layer.toneColor}`}>
            {layer.tag}
          </span>
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
        <div key={d.title} className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all h-full">
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
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-900 shadow-2xs shrink-0">
              <MailIcon className="h-5 w-5" />
            </div>
            <span className="break-all">support@arogyavitra.in</span>
          </div>
          <div className="flex items-center gap-4 text-sm sm:text-base font-semibold text-[#001f3f]">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-900 shadow-2xs shrink-0">
              <PinIcon className="h-5 w-5" />
            </div>
            Hyderabad, Telangana, India
          </div>
          <div className="flex items-center gap-4 text-sm sm:text-base font-semibold text-[#001f3f]">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-900 shadow-2xs shrink-0">
              <PhoneIcon className="h-5 w-5" />
            </div>
            +91 9874588327
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 md:p-10 shadow-lg">
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
  <footer className="py-10 sm:py-12 mt-auto bg-slate-50">
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
      window.open("/login", "_blank", "noopener,noreferrer");
    } else if (path === "register") {
      navigate("/signup");
    } else if (path === "hospitals" || path.startsWith("hospitals")) {
      const url = path.startsWith("/") ? path : `/${path}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else if (path === "home" || path === "about" || path === "contact") {
      const element = document.getElementById(path);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/40 font-sans text-slate-800 antialiased flex flex-col">
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