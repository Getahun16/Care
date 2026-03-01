"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-charcoal-mid mt-24">
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/assets/CARES LOGO.png"
                alt="CARES Logo"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <span className="font-serif font-bold text-lg leading-none block">
                  CARES
                </span>
                <span className="text-xs text-leaf-bright tracking-wide">
                  Circular Economy Research
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t.footer.tagline}
            </p>
            <div className="mt-4 flex gap-2">
              <span className="tag-pill">VLIR-UOS</span>
              <span className="tag-pill tag-coffee">Ethiopia</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                ["The Project", "/project"],
                ["Research & Pillars", "/research"],
                ["Our Team", "/team"],
                ["Impact", "/impact"],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link
                    href={path}
                    className="text-muted-foreground hover:text-leaf-bright transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                ["Publications Library", "/library"],
                ["News & Events", "/news"],
                ["Contact Us", "/contact"],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link
                    href={path}
                    className="text-muted-foreground hover:text-leaf-bright transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-leaf-bright transition-colors flex items-center gap-1"
                >
                  VLIR-UOS Website <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold text-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 mt-0.5 text-leaf-bright shrink-0" />
                <span>info@circularcoffee.org</span>
              </li>
              <li className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 text-leaf-bright shrink-0" />
                <span>
                  Antwerp University &<br />
                  AAU, Addis Ababa
                </span>
              </li>
            </ul>
            <div className="mt-5">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest">
                Partners
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                  AAU
                </span>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                  UA Antwerp
                </span>
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                  VLIR-UOS
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="section-divider my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} CARES Project. VLIR-UOS Cooperation Programme.</p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>{t.footer.fundeBy}</p>
            <p>
              {t.footer.developedBy}{" "}
              <a
                href="https://wubsites.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-leaf-bright hover:underline transition-colors"
              >
                Wubsites
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
