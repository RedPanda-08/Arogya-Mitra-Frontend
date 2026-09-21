/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../am-logo.jpeg';
import { hospitalApi, type HospitalResponseDTO } from '../services/hospitalApi';

// ---------------------------------------------------------------------------
// UI View Model
// ---------------------------------------------------------------------------
interface HospitalCardModel {
  hospitalId: string;
  name: string;
  address: string;
  city: string;
  phoneNumber: string;
  emergencyContact: string;
  rating: number;
  availableBeds: number;
  totalBeds: number;
  departments: string[];
  imageUrl: string;
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80";

// ---------------------------------------------------------------------------
// SVG Icons
// ---------------------------------------------------------------------------
const iconProps = { fill: "none", stroke: "currentColor", strokeWidth: 1.8 } as const;

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

const MapPinIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.68 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.32 1.85.55 2.81.68A2 2 0 0122 16.92z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const BrandMark: React.FC = () => (
  <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm overflow-hidden shrink-0">
    <img 
      src={logo} 
      alt="Arogya Vitra Logo" 
      className="w-full h-full object-cover mix-blend-multiply filter contrast-125" 
    />
  </div>
);

// ---------------------------------------------------------------------------
// Navbar / Header Component
// ---------------------------------------------------------------------------
const NAV_LINKS = [
  { path: "/", label: "Home" },
  { path: "/#about", label: "About" },
  { path: "/#contact", label: "Contact" },
];

const Header: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileClick = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/80 shadow-2xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
        <button 
          onClick={() => handleMobileClick("/")} 
          className="flex items-center gap-2.5 sm:gap-3 text-base sm:text-xl font-bold text-[#001f3f] tracking-tight hover:opacity-80 transition-opacity cursor-pointer"
        >
          <BrandMark />
          <span className="whitespace-nowrap">AROGYA VITRA</span>
        </button>

        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => onNavigate(link.path)}
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
          <button 
            onClick={() => onNavigate("register")}
            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg px-3.5 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            Get Started
          </button>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-[#001f3f] hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            {mobileOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden overflow-hidden transition-all duration-300 ease-out border-t border-slate-200/80 bg-white">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => handleMobileClick(link.path)}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleMobileClick("login")}
              className="rounded-lg px-3 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------
export default function HospitalBrowse() {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState<HospitalCardModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [onlyAvailableBeds, setOnlyAvailableBeds] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Real API Fetch on Mount using getAllHospitals
  useEffect(() => {
    let isMounted = true;

    const fetchHospitals = async () => {
      try {
        console.log("[BrowseHospitals] Calling hospitalApi.getAllHospitals()...");
        const rawData = await hospitalApi.getAllHospitals();

        if (isMounted && Array.isArray(rawData)) {
          const mapped: HospitalCardModel[] = rawData.map((item: any, index: number) => {
            const rawDepts: string[] = Array.isArray(item.departments) && item.departments.length > 0
              ? item.departments.map((d: any) => (typeof d === "string" ? d : d.name || "General"))
              : ["General Medicine", "Emergency Care"];

            const addressParts = [item.addressLine, item.area].filter(Boolean);
            const address = addressParts.length > 0 ? addressParts.join(", ") : (item.address || "Main Branch");

            return {
              hospitalId: String(item.hospitalId || `h-${index + 1}`),
              name: item.name || "Verified Hospital",
              address,
              city: item.city || "Hyderabad",
              phoneNumber: item.contactNumber || item.phoneNumber || "+91 40 2360 7777",
              emergencyContact: item.emergencyPhone || item.emergencyContact || "108",
              rating: Number(item.rating ?? 4.7),
              availableBeds: Number(item.totalBeds ?? item.beds ?? item.availableBeds ?? 0),
              totalBeds: Number(item.totalBeds ?? item.beds ?? 0),
              departments: rawDepts,
              imageUrl: item.imageUrl || DEFAULT_IMAGE,
            };
          });

          setHospitals(mapped);
        } else if (isMounted) {
          setHospitals([]);
        }
      } catch (err: any) {
        console.error("[BrowseHospitals] Error fetching hospitals:", err);
        if (isMounted) {
          setError(err.response?.data?.message || err.message || "Failed to load hospitals");
          setHospitals([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHospitals();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavigate = (path: string) => {
    if (path === "login") {
      window.open("/login", "_blank", "noopener,noreferrer");
    } else if (path === "register") {
      navigate("/signup");
    } else if (path.startsWith("/#")) {
      navigate("/");
      setTimeout(() => {
        const id = path.replace("/#", "");
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      navigate(path);
    }
  };

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      const matchesSearch =
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hospital.departments.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesBeds = onlyAvailableBeds ? hospital.availableBeds > 0 : true;

      return matchesSearch && matchesBeds;
    });
  }, [hospitals, searchTerm, onlyAvailableBeds]);

  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage) || 1;
  const paginatedHospitals = filteredHospitals.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800 flex flex-col">
      <Header onNavigate={handleNavigate} />

      <main className="flex-grow max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header & Search Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Browse Hospitals & Facilities
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Locate verified regional centers, departments, and real-time bed capacities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search hospital or department..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
              />
            </div>

            <button
              onClick={() => { setOnlyAvailableBeds(!onlyAvailableBeds); setCurrentPage(1); }}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                onlyAvailableBeds 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {onlyAvailableBeds ? '✓ Beds Available' : 'Show All'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center text-slate-500">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-700 border-r-transparent mb-3" />
            <p className="font-semibold text-sm">Fetching hospital directory...</p>
          </div>
        )}

        {/* Error / Empty State */}
        {!loading && hospitals.length === 0 && (
          <div className="py-16 text-center border border-dashed border-slate-200 bg-white rounded-2xl p-8">
            <p className="font-bold text-slate-800 text-lg">No hospitals currently registered</p>
            <p className="text-xs text-slate-500 mt-1">
              {error ? `Connection notice: ${error}` : "Ensure the database contains active hospital entities."}
            </p>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && hospitals.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedHospitals.map((hospital) => {
              const hasBeds = hospital.availableBeds > 0;

              return (
                <div
                  key={hospital.hospitalId}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-emerald-400 transition-all duration-200 flex flex-col overflow-hidden group"
                >
                  <div className="h-44 w-full relative overflow-hidden bg-slate-900">
                    <img
                      src={hospital.imageUrl}
                      alt={hospital.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = DEFAULT_IMAGE;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

                    <span className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-extrabold tracking-wide uppercase shadow-2xs ${
                      hasBeds ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {hasBeds ? `${hospital.availableBeds} Beds Vacant` : 'Beds Full'}
                    </span>

                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-2xs px-2 py-0.5 rounded-md text-xs font-extrabold text-slate-800 flex items-center gap-1 shadow-2xs">
                      <StarIcon className="w-3.5 h-3.5 text-amber-500" />
                      {hospital.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                        {hospital.name}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 line-clamp-1">
                        <MapPinIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {hospital.address}, {hospital.city}
                      </p>

                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <PhoneIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {hospital.phoneNumber}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {hospital.departments.slice(0, 3).map((dept) => (
                          <span key={dept} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold">
                            {dept}
                          </span>
                        ))}
                        {hospital.departments.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[10px] font-bold">
                            +{hospital.departments.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/hospitals/${hospital.hospitalId}`)}
                        className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs text-center"
                      >
                        View Beds & Slots
                      </button>
                      <a
                        href={`tel:${hospital.emergencyContact}`}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center shrink-0"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-slate-500 px-2">Page {currentPage} of {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}