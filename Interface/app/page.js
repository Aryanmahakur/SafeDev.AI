
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Eye,
  Network,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";
import SiteChrome from "./components/SiteChrome";

const highlights = [
  {
    icon: BrainCircuit,
    title: "Intelligence that simplifies",
    description: "Make complex information easier to explore and understand.",
  },
  {
    icon: Eye,
    title: "A clearer perspective",
    description: "Discover meaningful patterns through a visual experience.",
  },
  {
    icon: Shield,
    title: "Security with purpose",
    description: "Explore network behavior with greater awareness.",
  },
];

function NetworkArtwork() {
  return (
    <div className="home-art" aria-label="Abstract network illustration">
      <div className="art-grid" />
      <div className="art-orbit orbit-a" />
      <div className="art-orbit orbit-b" />
      <div className="art-orbit orbit-c" />

      <div className="art-line line-a" />
      <div className="art-line line-b" />
      <div className="art-line line-c" />
      <div className="art-line line-d" />
      <div className="art-line line-e" />

      {Array.from({ length: 8 }, (_, index) => (
        <span className={`art-node node-${index + 1}`} key={index} />
      ))}

      <div className="art-center">
        <Sparkles size={31} strokeWidth={1.3} />
      </div>

      <div className="art-chip chip-top">
        <span className="orange-dot" />
        Intelligent insights
      </div>

      <div className="art-chip chip-bottom">
        <Eye size={14} />
        A clearer view of your network
      </div>

      <span className="art-coordinate">SD.AI / 001</span>
    </div>
  );
}

export default function Home() {
  return (
    <SiteChrome>
      <main className="home-page">
        <section className="home-hero section-shell">
          <div className="home-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              A NEW PERSPECTIVE ON NETWORK SECURITY
            </div>

            <h1>
              Security is complex.
              <br />
              <span>Understanding it shouldn&apos;t be.</span>
            </h1>

            <p className="home-description">
              Meet a smarter way to explore network behavior. SafeDev AI
              brings clarity to complexity, helping you discover patterns and
              understand your digital environment through AI-powered insights.
            </p>

            <div className="home-actions">
              <Link href="/simulation" className="button-primary">
                Explore the Experience <ArrowRight size={17} />
              </Link>

              <Link href="/solutions" className="button-secondary">
                Discover SafeDev <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="home-note">
              <span className="note-icon"><Zap size={15} /></span>
              Less complexity. More clarity.
            </div>
          </div>

          <div className="home-visual">
            <NetworkArtwork />
            <div className="art-caption">
              <span>INTELLIGENCE, VISUALIZED.</span>
              <span>01 — SAFEDEV AI</span>
            </div>
          </div>

          <div className="hero-index">
            <span>01</span>
            <span className="index-rule" />
            <span>DISCOVER A DIFFERENT PERSPECTIVE</span>
          </div>
        </section>

        <section className="statement-strip">
          <div className="section-shell statement-inner">
            <div className="statement-icon"><Sparkles size={21} /></div>
            <p>
              The future of security isn&apos;t just about more information.
              <span> It&apos;s about understanding what matters.</span>
            </p>
          </div>
        </section>

        <section className="section-shell home-highlights">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                THE SAFEDEV APPROACH
              </div>
              <h2>
                Built around
                <br />
                <span>understanding.</span>
              </h2>
            </div>

            <p>
              Technology should make difficult things easier to understand.
              That belief shapes the SafeDev AI experience.
            </p>
          </div>

          <div className="highlight-grid">
            {highlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <article className="highlight-card" key={item.title}>
                  <div className="highlight-top">
                    <span>0{index + 1}</span>
                    <Icon size={23} strokeWidth={1.5} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="highlight-footer">SAFEDEV AI ↗</span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="vision-section">
          <div className="section-shell vision-inner">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                BEYOND THE ORDINARY
              </div>

              <h2>
                From overwhelming
                <br />
                to <span>understandable.</span>
              </h2>

              <p>
                Explore a visual approach to network intelligence designed to
                make complex digital environments more approachable.
              </p>

              <Link href="/simulation" className="button-primary">
                Get Simulation <ArrowRight size={17} />
              </Link>
            </div>

            <div className="vision-panel">
              <span className="panel-label">SAFEDEV / EXPERIENCE</span>
              <div className="vision-symbol">
                <Network size={65} strokeWidth={1} />
              </div>
              <div className="vision-panel-footer">
                <span>See connections differently.</span>
                <ArrowUpRight size={20} />
              </div>
            </div>
          </div>
        </section>

        <section className="bottom-cta">
          <div className="section-shell bottom-cta-inner">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              YOUR NEXT PERSPECTIVE STARTS HERE
            </div>

            <h2>
              Ready to see
              <br />
              <span>things differently?</span>
            </h2>

            <p>
              Step into SafeDev AI and explore a clearer view of network
              intelligence.
            </p>

            <Link href="/simulation" className="button-primary">
              Get Simulation <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
