import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  Eye,
  Network,
  Shield,
  ShieldCheck,
  BellRing,
  ScanEye,
  AlertTriangle,
  LockKeyhole,
} from "lucide-react";
import SiteChrome from "./components/SiteChrome";

const highlights = [
  {
    icon: Eye,
    title: "Continuous System Monitoring",
    description:
      "Maintain visibility across connected computers, servers and network infrastructure through continuous security monitoring.",
  },
  {
    icon: BrainCircuit,
    title: "Intelligent Threat Detection",
    description:
      "Analyse network traffic and identify unusual patterns that may indicate suspicious activity or potential cyberattacks.",
  },
  {
    icon: BellRing,
    title: "Real-Time Security Alerts",
    description:
      "Bring important security events to your team's attention, helping security professionals investigate and respond faster.",
  },
];

const principles = [
  {
    icon: ScanEye,
    number: "01",
    title: "Monitor",
    description:
      "Maintain visibility into connected systems and continuously observe network activity.",
  },
  {
    icon: BrainCircuit,
    number: "02",
    title: "Identify",
    description:
      "Analyse network behaviour to recognise unusual patterns and potential security threats.",
  },
  {
    icon: ShieldCheck,
    number: "03",
    title: "Respond",
    description:
      "Deliver timely security alerts to help organisations investigate and take action.",
  },
];

function NetworkArtwork() {
  return (
    <div className="home-art sd-security-art">
      {/* ARTWORK HEADER */}
      <div className="sd-art-header">
        <div className="sd-art-brand">
          <span className="orange-dot" />
          SECURITY INTELLIGENCE
        </div>
        <span>SAFEDEV / 001</span>
      </div>

      {/* SECURITY MONITORING VISUAL */}
      <div className="sd-art-screen">
        <div className="sd-art-grid" />

        {/* MESSAGE */}
        <div className="sd-art-message">
          <span className="sd-art-message-label">
            PROACTIVE SECURITY
          </span>

          <h3 data-text={"Detect before\nimpact."}>
            Detect before
            <br />
            impact<span>.</span>
          </h3>

          <p>
            Identifying potential risks through network intelligence.
          </p>
        </div>

        {/* SCANNING LINE */}
        <div className="sd-art-scanner">
          <div className="sd-art-scanner-glow" />
        </div>

        {/* NETWORK VISUAL */}
        <div className="sd-art-network">
          <div className="sd-art-ring ring-one" />
          <div className="sd-art-ring ring-two" />
          <div className="sd-art-ring ring-three" />

          <div className="sd-art-connection connection-one" />
          <div className="sd-art-connection connection-two" />
          <div className="sd-art-connection connection-three" />
          <div className="sd-art-connection connection-four" />

          <span className="sd-art-network-node network-node-one" />
          <span className="sd-art-network-node network-node-two" />
          <span className="sd-art-network-node network-node-three" />
          <span className="sd-art-network-node network-node-four" />
          <span className="sd-art-network-node network-node-five" />
          <span className="sd-art-network-node network-node-six" />

          <div className="sd-art-shield">
            <ShieldCheck size={35} strokeWidth={1.3} />
          </div>
        </div>

        {/* BOTTOM INFORMATION */}
        <div className="sd-art-screen-footer">
          <div>
            <span>SECURITY VISIBILITY</span>
            <strong>Connected environments</strong>
          </div>

          <div className="sd-art-footer-icon">
            <Network size={16} />
            <span>NETWORK INTELLIGENCE</span>
          </div>
        </div>
      </div>

      <div className="art-caption">
        <span>INTELLIGENCE. VISIBILITY. SECURITY.</span>
        <span>SAFEDEV.AI</span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <SiteChrome>
      <main className="home-page">
        {/* HERO SECTION */}
        <section className="home-hero section-shell">
          <div className="home-copy">
            <h1
              style={{
                fontSize: "clamp(4rem, 7vw, 6.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.055em",
              }}
            >
              See Threats.
              <br />
              <span>Stay Ahead.</span>
            </h1>

            <p className="home-description">
              We help organisations secure their digital infrastructure
              through continuous system monitoring, intelligent threat
              detection and timely security alerts. Gain visibility into
              your network, identify suspicious activity and stay ahead
              of evolving cyber threats.
            </p>

            <div className="home-actions">
              <Link href="/solutions" className="button-secondary">
                Our Solutions
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="home-note">
              <span className="note-icon">
                <ShieldCheck size={15} />
              </span>
              SECURITY STARTS WITH VISIBILITY.
            </div>
          </div>

          <div className="home-visual">
            <NetworkArtwork />
          </div>

          <div className="hero-index">
            <span>01</span>
            <span className="index-rule" />
            <span>PROACTIVE DIGITAL SECURITY</span>
          </div>
        </section>

        {/* COMPANY STATEMENT */}
        <section className="statement-strip">
          <div className="section-shell statement-inner">
            <div className="statement-icon">
              <Shield size={21} />
            </div>

            <p>
              Cybersecurity is more than detecting attacks.
              <span> It is about identifying risks before they escalate.</span>
            </p>
          </div>
        </section>

        {/* COMPANY CAPABILITIES */}
        <section className="section-shell home-highlights">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                WHAT WE DO
              </div>

              <h2>
                Security built for
                <br />
                <span>the connected world.</span>
              </h2>
            </div>

            <p>
              We bring network visibility, intelligent analysis and
              threat awareness together to help organisations strengthen
              their digital security.
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

                  <span className="highlight-footer">
                    SAFEDEV.AI ↗
                  </span>
                </article>
              );
            })}
          </div>
        </section>

        {/* HOW SAFEDEV WORKS */}
        <section className="vision-section">
          <div className="section-shell vision-inner">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                OUR APPROACH
              </div>

              <h2>
                From system activity
                <br />
                to <span>security action.</span>
              </h2>

              <p>
                Understanding what happens across an organisation's
                digital environment is the first step towards effective
                threat detection. Our approach focuses on monitoring,
                identifying and bringing important security events
                to attention.
              </p>

              <Link href="/solutions" className="button-primary">
                Discover Our Solutions
                <ArrowRight size={17} />
              </Link>
            </div>

            {/* SECURITY APPROACH PANEL */}
            <div className="vision-panel">
              <span className="panel-label">
                THE SAFEDEV SECURITY APPROACH
              </span>

              <div className="sd-approach-list">
                {principles.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div className="sd-approach-item" key={item.number}>
                      <div className="sd-approach-icon">
                        <Icon size={22} strokeWidth={1.5} />
                      </div>

                      <div className="sd-approach-copy">
                        <span>{item.number}</span>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>

                      <ArrowUpRight
                        size={17}
                        className="sd-approach-arrow"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="vision-panel-footer">
                <span>See connections differently.</span>
                <ShieldCheck size={19} />
              </div>
            </div>
          </div>
        </section>

        {/* WHY SAFEDEV */}
        <section className="section-shell sd-trust-section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                WHY SAFEDEV.AI
              </div>

              <h2>
                A clearer view of
                <br />
                <span>your security.</span>
              </h2>
            </div>

            <p>
              Modern organisations need more than isolated security
              information. They need meaningful visibility into their
              systems and the activity taking place across them.
            </p>
          </div>

          <div className="sd-trust-grid">
            <div className="sd-trust-item">
              <Eye size={22} />
              <h3>Greater Visibility</h3>
              <p>
                Understand activity across connected digital environments.
              </p>
            </div>

            <div className="sd-trust-item">
              <BrainCircuit size={22} />
              <h3>Intelligent Analysis</h3>
              <p>
                Use data-driven insights to recognise suspicious behaviour.
              </p>
            </div>

            <div className="sd-trust-item">
              <AlertTriangle size={22} />
              <h3>Timely Awareness</h3>
              <p>
                Bring potential security issues to the attention of your team.
              </p>
            </div>

            <div className="sd-trust-item">
              <LockKeyhole size={22} />
              <h3>Security Focused</h3>
              <p>
                Put the protection of organisational infrastructure first.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bottom-cta">
          <div className="section-shell bottom-cta-inner">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              TAKE A CLOSER LOOK
            </div>

            <h2>
              Know your network.
              <br />
              <span>Stay ahead of threats.</span>
            </h2>

            <p>
              Discover the SAFEDEV.AI approach to network monitoring,
              intelligent threat detection and cybersecurity.
            </p>

            <div className="home-actions">
              <Link href="/contact" className="button-secondary">
                Contact Us
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}