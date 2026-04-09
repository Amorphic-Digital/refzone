"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { ChevronDown, Sun, Moon } from "lucide-react";

const appLinks = [
  { label: "Scenarios", href: "/features/scenarios", desc: "100+ match decision situations" },
  { label: "Quizzes", href: "/features/quizzes", desc: "500+ Laws of the Game questions" },
  { label: "Decision Lab", href: "/features/decision-lab", desc: "AI-powered law analysis" },
  { label: "Analytics", href: "/features/analytics", desc: "Track your training progress" },
  { label: "Weekly Quiz", href: "/weekly-quiz", desc: "Free weekly challenge" },
  { label: "Streaks", href: "/features/gamification", desc: "Build daily training habits" },
];

const navLinks = [
  { label: "Web", href: "/web" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function MarketingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [appDropdownOpen, setAppDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => setMounted(true), []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAppDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleDropdownEnter() {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setAppDropdownOpen(true);
  }

  function handleDropdownLeave() {
    dropdownTimeout.current = setTimeout(() => setAppDropdownOpen(false), 150);
  }

  const isAppActive = pathname.startsWith("/features") || pathname === "/weekly-quiz";

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />
    <header className="fixed top-0 left-0 right-0 z-50 px-2 sm:px-8 pt-2 sm:pt-6">
      <div className="nav-blur mx-auto px-3 sm:px-9 flex flex-col" style={{ maxWidth: "min(1420px, 100vw - 1rem)" }}>
        {/* Top bar */}
        <div className="h-[76px] flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center shrink-0">
            <span className="text-[18px] font-semibold leading-none">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">R</span>
              <span className="text-white">efZone</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">
            {/* App dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                className={`flex items-center gap-1 px-5 py-2 rounded-md text-[16px] transition-colors ${
                  isAppActive ? "text-white" : "text-white/45 hover:text-white"
                }`}
                onClick={() => setAppDropdownOpen(!appDropdownOpen)}
              >
                App
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${appDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown panel */}
              <div
                className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-200 ${
                  appDropdownOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
                }`}
              >
                <div className="w-[280px] rounded-xl border shadow-2xl p-2 backdrop-blur-xl" style={{ background: 'var(--m-bg-raised)', borderColor: 'var(--m-border)' }}>
                  {appLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        className={`flex flex-col gap-0.5 px-3 py-2.5 rounded-lg transition-colors ${
                          isActive ? "bg-white/[0.08] text-white" : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                        }`}
                        onClick={() => setAppDropdownOpen(false)}
                      >
                        <span className="text-[14px] font-medium">{link.label}</span>
                        <span className="text-[12px]" style={{ color: 'var(--m-text-4)' }}>{link.desc}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Static nav links */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === "/web" && pathname.startsWith("/web"));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-5 py-2 rounded-md text-[16px] transition-colors ${
                    isActive ? "text-white" : "text-white/45 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-5 ml-auto">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-[var(--m-text-3)] hover:text-[var(--m-text)] hover:bg-[var(--m-bg-card)] transition-colors"
                aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
              >
                {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            )}
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-[15px] font-medium bg-white/85 text-black py-2.5 px-5 rounded-xl hover:bg-white transition-colors border border-white/20"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-[16px] text-white/45 hover:text-white px-4 py-2 transition-colors">
                  Log in
                </Link>
                <Link
                  href="/auth/sign-up"
                  className="flex items-center gap-2 text-[15px] font-medium bg-white/85 text-black py-2.5 px-5 rounded-xl hover:bg-white transition-colors border border-white/20"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-white/60 hover:text-white transition-colors relative w-9 h-9 flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span className="flex flex-col justify-center items-center w-5 h-5 relative">
              <span
                className={`absolute h-[2.5px] w-5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  mobileOpen ? "h-[1.5px] rotate-45 top-[9.5px]" : "top-[4px]"
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-5 bg-current rounded-full top-[9.5px] transition-all duration-200 ease-in-out ${
                  mobileOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-5 bg-current rounded-full transition-all duration-300 ease-in-out ${
                  mobileOpen ? "-rotate-45 top-[9.5px]" : "top-[15px]"
                }`}
              />
            </span>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-white/[0.06]" />
          <nav className="py-3 flex flex-col gap-0.5">
            {/* App section */}
            <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/20">App</p>
            {appLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`py-2 px-3 rounded-md text-[14px] transition-colors ${
                    isActive ? "text-white bg-white/[0.08]" : "text-white/45 hover:text-white"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="border-t border-white/[0.06] my-2" />

            {/* Static links */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === "/web" && pathname.startsWith("/web"));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`py-2.5 px-3 rounded-md text-[14px] transition-colors ${
                    isActive ? "text-white bg-white/[0.08]" : "text-white/45 hover:text-white"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="border-t border-white/[0.06] mt-2 pt-3 flex flex-col gap-2">
              {/* Mobile theme toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-2 py-2 px-3 rounded-md text-[14px] text-[var(--m-text-3)] hover:text-[var(--m-text)] transition-colors"
                >
                  {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
                </button>
              )}
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-1.5 text-[13px] font-medium bg-white text-black py-2.5 px-4 rounded-lg"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="text-[14px] text-white/45 py-2 px-3">Log in</Link>
                  <Link
                    href="/auth/sign-up"
                    className="flex items-center justify-center gap-1.5 text-[13px] font-medium bg-white text-black py-2.5 px-4 rounded-lg"
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
    </>
  );
}
