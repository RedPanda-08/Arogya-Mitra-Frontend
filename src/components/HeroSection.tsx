import React from "react";

const IMAGES = {
  heroBanner: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80",
  patientApp: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
  centralAi: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  hospitalHms: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
};

const SafeImage: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = "" }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
};

export const HeroSection: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const layers = [
    { idx: "01", title: "AV Care", desc: "Patient app, every Indian language", img: IMAGES.patientApp },
    { idx: "02", title: "Central Intelligence", desc: "The engine linking every layer", img: IMAGES.centralAi },
    { idx: "03", title: "Hospital System", desc: "HMS + doctor tools + analytics", img: IMAGES.hospitalHms },
  ];

  return (
    <div className="relative pt-10 pb-12 sm:pt-14 sm:pb-16 md:pt-18 md:pb-20">
      {/* Background layer completely faded at bottom edges so no line can form */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent_100%)]">
        <SafeImage 
          src={IMAGES.heroBanner} 
          alt="Healthcare background" 
          className="h-full w-full object-cover object-center opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/95 via-slate-50/85 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 sm:gap-14 px-4 sm:px-6 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50/80 px-3.5 py-1.5 font-sans text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-800 backdrop-blur-xs mb-4 sm:mb-5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600 shrink-0" />
            Built for Indian healthcare
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-[#001f3f]">
            One platform for every <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-600">layer of care</span>, from home to hospital.
          </h1>

          <p className="mt-4 sm:mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-slate-600 font-medium">
            Arogya Vitra connects patients, doctors and hospitals on a single intelligent system.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <button 
              onClick={() => onNavigate("register")} 
              className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl px-6 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              Create Free Account
            </button>
            <button 
              onClick={() => onNavigate("about")} 
              className="text-slate-600 hover:text-emerald-800 px-4 py-3 text-sm font-bold transition-colors duration-200 cursor-pointer"
            >
              See how it works →
            </button>
          </div>
        </div>

        {/* Side Stacked Layers */}
        <div className="relative flex flex-col gap-3 sm:gap-4">
          {layers.map((layer) => (
            <div 
              key={layer.idx} 
              className="group flex items-center justify-between gap-3 rounded-2xl border border-slate-200/60 bg-white/90 backdrop-blur-md p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-300"
            >
              <div className="flex items-center gap-3.5">
                <span className="font-mono text-xs font-black text-emerald-800/80 group-hover:text-emerald-700">
                  {layer.idx}
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-[#001f3f] group-hover:text-emerald-900 transition-colors">
                    {layer.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-slate-500">
                    {layer.desc}
                  </p>
                </div>
              </div>
              <SafeImage 
                src={layer.img} 
                alt={layer.title} 
                className="w-14 h-14 rounded-xl object-cover hidden sm:block shadow-xs" 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};