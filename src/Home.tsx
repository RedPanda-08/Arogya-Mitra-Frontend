/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { About } from "./components/About";
import { Contact } from "./components/Contact";

export interface HospitalCardData {
  id: string;
  name: string;
  address: string;
  phone: string;
  emergencyPhone: string;
  beds: number;
  rating: number;
  departments: string[];
  extraDeptsCount: number;
  img: string;
  fallbackImg: string;
}

const DEFAULT_HOSPITAL_IMAGES = [
  {
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    fallbackImg: "https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    img: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80",
    fallbackImg: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
    fallbackImg: "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

const SafeImage: React.FC<{ src: string; fallbackSrc?: string; alt: string; className?: string }> = ({
  src,
  fallbackSrc,
  alt,
  className = "",
}) => {
  const [failedOriginal, setFailedOriginal] = useState<string | null>(null);
  const [failedFallback, setFailedFallback] = useState(false);

  const isOriginalFailed = failedOriginal === src;
  const currentSrc = isOriginalFailed && fallbackSrc ? fallbackSrc : src;

  const handleError = () => {
    if (!isOriginalFailed && fallbackSrc) {
      setFailedOriginal(src);
    } else {
      setFailedFallback(true);
    }
  };

  if (failedFallback || (isOriginalFailed && !fallbackSrc)) {
    return (
      <div className={`bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 flex items-center justify-center text-white/80 font-bold text-xs p-3 text-center ${className}`}>
        <span>{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
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

const HospitalNetworkSection: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [hospitals, setHospitals] = useState<HospitalCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeLocality] = useState<string>("Regional Hub");

  useEffect(() => {
    let isMounted = true;

    const loadHospitals = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = { Accept: "application/json" };
      if (token && token !== "session_active") headers["Authorization"] = `Bearer ${token}`;

      try {
        const response = await axios.get("http://localhost:8081/api/hospitals/getAllHospitals", { headers });
        const rawData = response.data;

        if (isMounted && Array.isArray(rawData) && rawData.length > 0) {
          const mapped: HospitalCardData[] = rawData.slice(0, 3).map((item: any, index: number) => {
            const addressParts = [item.addressLine, item.area, item.city, item.pincode].filter(Boolean);
            const fullAddress = addressParts.length > 0 ? addressParts.join(", ") : item.city || "Verified Facility";
            const imgPair = DEFAULT_HOSPITAL_IMAGES[index % DEFAULT_HOSPITAL_IMAGES.length];
            const rawDepts: string[] = Array.isArray(item.departments) && item.departments.length > 0
              ? item.departments.map((d: any) => (typeof d === "string" ? d : d.name || "General"))
              : ["General Medicine", "Emergency Care", "Cardiology"];

            return {
              id: item.hospitalId || `h-${index + 1}`,
              name: item.name || "Partner Healthcare Center",
              address: fullAddress,
              phone: item.contactNumber || "+91 40 2360 7777",
              emergencyPhone: item.emergencyPhone || "108",
              beds: Number(item.totalBeds ?? item.beds ?? 0),
              rating: Number(item.rating ?? 4.7),
              departments: rawDepts.slice(0, 3),
              extraDeptsCount: Math.max(0, rawDepts.length - 3),
              img: item.imageUrl || imgPair.img,
              fallbackImg: imgPair.fallbackImg,
            };
          });
          setHospitals(mapped);
        } else if (isMounted) {
          setHospitals([]);
        }
      } catch (err) {
        console.warn("[HospitalNetworkSection] Failed to load hospitals:", err);
        if (isMounted) setHospitals([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadHospitals();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-14 sm:py-18">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3.5 py-1.5 font-sans text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-800 shadow-sm backdrop-blur-xs mb-3 transition-transform hover:scale-105 duration-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              Live Facility Network
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#001f3f] tracking-tight leading-snug">
              Verified regional hospitals & real-time bed tracking.
            </h2>
            <p className="mt-3 text-base sm:text-lg font-medium text-slate-600">
              Showing closest facilities routed from your <span className="font-bold text-emerald-800  underline-offset-4">{activeLocality}</span>.
            </p>
          </div>

          <button
            onClick={() => onNavigate("hospitals")}
            className="group relative inline-flex items-center gap-2.5 self-start md:self-auto rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-800 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
          >
            <span>Browse All Facilities</span>
            <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">→</span>
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div 
                key={n} 
                className="rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-xs p-4 h-96 animate-pulse flex flex-col justify-between shadow-sm"
              >
                <div className="w-full h-48 bg-slate-200/70 rounded-xl" />
                <div className="space-y-3 mt-4">
                  <div className="h-5 bg-slate-200/70 rounded-md w-3/4" />
                  <div className="h-4 bg-slate-200/70 rounded-md w-1/2" />
                </div>
                <div className="h-10 bg-slate-200/70 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : hospitals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/80 p-10 text-center shadow-sm">
            <p className="font-bold text-slate-800 text-base">No partner facilities currently active in your network range.</p>
            <p className="text-xs text-slate-500 mt-1">Please explore the full hospital directory for regional listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hospitals.map((h) => {
              const hasBeds = h.beds > 0;
              return (
                <div
                  key={h.id}
                  onClick={() => onNavigate("hospitals")}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:border-emerald-500/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col overflow-hidden cursor-pointer"
                >
                  <div className="h-48 w-full relative overflow-hidden bg-slate-900">
                    <SafeImage
                      src={h.img}
                      fallbackSrc={h.fallbackImg}
                      alt={h.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />
                    <span className={`absolute bottom-3 left-3 px-3 py-1 rounded-lg text-[11px] font-extrabold tracking-wide uppercase shadow-md ${
                      hasBeds ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                    }`}>
                      {hasBeds ? `${h.beds} BEDS VACANT` : "BEDS FULL"}
                    </span>
                    <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-xs font-black text-slate-900 flex items-center gap-1 shadow-md">
                      <span className="text-amber-500">★</span> {h.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-1">
                        {h.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-1">{h.address}</p>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{h.phone}</p>

                      <div className="mt-3.5 flex flex-wrap gap-1.5">
                        {h.departments.map((dept) => (
                          <span key={dept} className="px-2.5 py-0.5 bg-slate-50 text-slate-600 rounded-md text-[11px] font-bold border border-slate-200/70">
                            {dept}
                          </span>
                        ))}
                        {h.extraDeptsCount > 0 && (
                          <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[11px] font-bold border border-slate-200/70">
                            +{h.extraDeptsCount}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate("hospitals");
                        }}
                        className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all duration-200 cursor-pointer text-center active:scale-95"
                      >
                        View Beds & Slots
                      </button>
                      <a
                        href={`tel:${h.emergencyPhone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
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
        )}
      </div>
    </section>
  );
};

export default function Home() {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToastMsg(null), 3200);
  }, []);

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
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/40 font-sans text-slate-800 antialiased flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar onNavigate={handleNavigate} />

      <main className="flex-grow space-y-4 sm:space-y-6">
        <section id="home" className="scroll-mt-20">
          <HeroSection onNavigate={handleNavigate} />
        </section>

        <HospitalNetworkSection onNavigate={handleNavigate} />

        <section id="about" className="scroll-mt-20">
          <About />
        </section>

        <section id="contact" className="scroll-mt-20">
          <Contact showToast={showToast} />
        </section>
      </main>

      <footer className="py-10 sm:py-12 mt-12 bg-transparent text-center text-sm font-medium text-slate-500">
        <span>© {new Date().getFullYear()} Arogya Vitra. Hyderabad, India.</span>
      </footer>

      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-xl bg-[#001f3f]/95 backdrop-blur-md px-6 py-3.5 text-sm font-medium text-white shadow-2xl border border-white/10">
          {toastMsg}
        </div>
      )}
    </div>
  );
}