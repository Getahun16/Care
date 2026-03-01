"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { t, lang, toggle } = useLanguage();

  const navItems = [
    { label: t.nav.home, path: "/" },
    { label: t.nav.project, path: "/project" },
    { label: t.nav.research, path: "/research" },
    { label: t.nav.team, path: "/team" },
    { label: t.nav.impact, path: "/impact" },
    { label: t.nav.library, path: "/library" },
    { label: t.nav.news, path: "/news" },
    { label: t.nav.contact, path: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card shadow-card py-3" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/assets/CARES LOGO.png"
            alt="CARES Logo"
            width={60}
            height={60}
            className="h-14 w-14 rounded-full object-cover shadow-glow"
            priority
          />
          <div className="hidden sm:block">
            <span className="font-serif font-bold text-lg leading-none block text-foreground">
              CARES
            </span>
            <span className="text-xs text-leaf-bright tracking-wide">
              Circular Economy Research
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === item.path
                    ? "text-leaf-bright"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {pathname === item.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-leaf-bright rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle language"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-leaf-bright/50 transition-all duration-200"
          >
            <span className={lang === "en" ? "text-leaf-bright" : "text-muted-foreground"}>EN</span>
            <span className="text-border">|</span>
            <span className={lang === "am" ? "text-leaf-bright" : "text-muted-foreground"}>አማ</span>
          </button>
          <Link
            href="/contact"
            className="px-5 py-2 rounded-full text-sm font-semibold bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-all duration-200 shadow-glow"
          >
            {t.nav.getInvolved}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-md text-foreground hover:text-leaf-bright transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden glass-card mt-2 mx-4 rounded-xl p-4 border border-border animate-fade-in">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === item.path
                      ? "bg-accent text-leaf-bright"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 flex flex-col gap-2">
              <button
                onClick={toggle}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg text-sm border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className={lang === "en" ? "font-bold text-leaf-bright" : ""}>English</span>
                <span className="text-border">|</span>
                <span className={lang === "am" ? "font-bold text-leaf-bright" : ""}>አማርኛ</span>
              </button>
              <Link
                href="/contact"
                className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-secondary text-secondary-foreground hover:bg-leaf-bright transition-colors"
              >
                {t.nav.getInvolved}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
