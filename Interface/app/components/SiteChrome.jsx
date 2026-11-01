
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Network } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  const navLinks = [
  { label: "Home", href: "/" },
  { label: "Solutions", href: "/solutions" },
  { label: "Why SafeDev", href: "/why-safedev" },
  { label: "Stakeholders", href: "/stakeholders" },
  { label: "Contact Us", href: "/contact" },
];

  return (
    <header className="navbar">
      {/* BRAND */}
      <Link
        href="/"
        className="brand"
        aria-label="SafeDev AI home"
      >
        <span className="brand-mark">
          <Network size={19} />
        </span>

        <span>
          SAFEDEV<span className="brand-dot">.</span>AI
        </span>
      </Link>

      {/* NAVIGATION */}
      <nav className="nav-links" aria-label="Main navigation">
        {navLinks.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "active" : ""}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* SIMULATION BUTTON */}
      <Link href="/simulation" className="nav-cta">
        Get Simulation
        <ArrowRight size={15} />
      </Link>
    </header>
  );
}

/* =========================================
   FOOTER
========================================= */

export function Footer() {
  return (
    <footer className="footer section-shell">
      <Link
        href="/"
        className="brand footer-brand"
        aria-label="SafeDev AI home"
      >
        <span className="brand-mark">
          <Network size={17} />
        </span>

        <span>
          SAFEDEV<span className="brand-dot">.</span>AI
        </span>
      </Link>

      <p>A clearer perspective on network security.</p>

      <div className="footer-links">
        <Link href="/contact">Contact Us</Link>
        <Link href="/solutions">Solutions</Link>
      </div>

      <span className="footer-copy">
        © {new Date().getFullYear()} SafeDev AI
      </span>
    </footer>
  );
}

/* =========================================
   SITE CHROME
========================================= */

export default function SiteChrome({ children }) {
  return (
    <>
      <Header />

      {children}

      <Footer />
    </>
  );
}
