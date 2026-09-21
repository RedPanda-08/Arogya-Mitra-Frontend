import React from "react";

const IMAGES = {
  patientApp: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
  centralAi: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  hospitalHms: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
};

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
    icon: (
      <svg className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Real 108 emergency integration",
    desc: "Direct contract-based routing into the national emergency ambulance network, not a call-center layer bolted on top.",
  },
  {
    icon: (
      <svg className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M4 21V8l8-5 8 5v13" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
    title: "One record, every stop",
    desc: "The same patient record moves from home to lab to hospital, instead of resetting at each door.",
  },
  {
    icon: (
      <svg className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Daily habits, not just transactions",
    desc: "Blink, Today's Plate and streaks give people a reason to open the app on days they're not sick.",
  },
  {
    icon: (
      <svg className="h-7 w-7 sm:h-8 sm:w-8 shrink-0 text-emerald-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M9 12l2 2 4-4" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    title: "Hospitals get intelligence, not just software",
    desc: "AI analytics turn day-to-day hospital data into decisions, not just storage.",
  },
];

export const About: React.FC = () => (
  <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
    <div>
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50/80 px-3.5 py-1.5 font-sans text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-800 shadow-2xs">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600 shrink-0" />
        About Arogya Vitra
      </div>
      <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#001f3f] tracking-tight">
        A centralized system, built in three layers.
      </h2>
      <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-700 font-medium">
        Most healthcare apps solve one piece of the journey — booking, or records, or hospital admin. Arogya Vitra was
        built to hold all of it together, so a patient&rsquo;s history, a doctor&rsquo;s schedule and a
        hospital&rsquo;s operations stay in sync.
      </p>
    </div>

    <div className="mt-10 sm:mt-12 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
      {LAYER_DETAILS.map((layer) => (
        <div key={layer.title} className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all duration-300 h-full flex flex-col overflow-hidden">
          <div className="h-32 sm:h-36 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-5 sm:mb-6 overflow-hidden relative">
            <img src={layer.img} alt={layer.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
          </div>
          <span className={`inline-block w-fit px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${layer.toneColor}`}>
            {layer.tag}
          </span>
          <h4 className="mt-3 text-lg sm:text-xl font-bold text-[#001f3f]">{layer.title}</h4>
          <ul className="mt-4 list-disc pl-5 text-sm leading-relaxed text-slate-600 font-medium space-y-2">
            {layer.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="mx-auto mb-10 sm:mb-12 mt-16 sm:mt-20 max-w-2xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50/80 px-3.5 py-1.5 font-sans text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-800 shadow-2xs mx-auto mb-4">
        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-600 shrink-0" />
        What sets it apart
      </div>
      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#001f3f] tracking-tight">
        Four things competitors don&rsquo;t do together
      </h3>
    </div>

    <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
      {DIFFERENTIATORS.map((d) => (
        <div key={d.title} className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all h-full">
          {d.icon}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-[#001f3f]">{d.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 font-medium">{d.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);