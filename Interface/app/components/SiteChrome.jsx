
import Link from "next/link";
import { ArrowRight, Network } from "lucide-react";

export function Header() {
  return (
    <header className="navbar">
      <Link href="/" className="brand" aria-label="SafeDev AI home">
        <span className="brand-mark">
          <Network size={19} />
        </span>
        <span>
          SAFEDEV<span className="brand-dot">.</span>AI
        </span>
      </Link>

      <nav className="nav-links" aria-label="Main navigation">
        <Link href="/solutions">Solutions</Link>
        <Link href="/why-safedev">Why SafeDev</Link>
        <Link href="/stakeholders">Stakeholders</Link>
        <Link href="/contact">Contact Us</Link>
      </nav>

      <Link href="/simulation" className="nav-cta">
        Get Simulation <ArrowRight size={15} />
      </Link>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer section-shell">
      <Link href="/" className="brand footer-brand">
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

export default function SiteChrome({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
