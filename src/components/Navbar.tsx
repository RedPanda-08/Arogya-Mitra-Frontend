import React, { useState } from "react";
import logo from "../am-logo.jpeg";

type TabId = "home" | "about" | "contact";

interface NavbarProps {
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: { id: TabId; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavigation = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md transition-shadow border-b border-slate-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavigation("home")}
          className="flex items-center gap-2.5 sm:gap-3 text-base sm:text-xl font-bold text-[#001f3f] tracking-tight cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs overflow-hidden shrink-0">
            <img
              src={logo}
              alt="Arogya Mitra Logo"
              className="w-full h-full object-cover mix-blend-multiply filter contrast-125"
            />
          </div>
          <span className="whitespace-nowrap">AROGYA VITRA</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id)}
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-900 transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onNavigate("login")}
            className="hidden md:block text-sm font-bold text-slate-700 hover:text-emerald-900 transition-colors px-3 cursor-pointer"
          >
            Sign in
          </button>
          <button
            onClick={() => onNavigate("register")}
            className="bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs rounded-xl px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm font-bold transition-all cursor-pointer"
          >
            Get Started
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-[#001f3f] hover:bg-emerald-50/70 transition-colors cursor-pointer"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <nav className="md:hidden flex flex-col px-4 py-3 gap-1 bg-white/95 backdrop-blur-md shadow-sm border-t border-slate-100">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavigation(link.id)}
              className="rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-emerald-50 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavigation("login")}
            className="rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-700 hover:bg-emerald-50 cursor-pointer"
          >
            Sign in
          </button>
        </nav>
      )}
    </header>
  );
};