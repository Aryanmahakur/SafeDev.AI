
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  BrainCircuit,
  ShieldCheck,
  Target,
  Network,
  BellRing,
  LockKeyhole,
  Activity,
} from "lucide-react";

import SiteChrome from "../components/SiteChrome";

const principles = [
  {
    icon: ShieldCheck,
    title: "Security by design",
    description:
      "We believe security should be considered at every layer of digital infrastructure, not treated as an afterthought.",
  },
  {
    icon: BrainCircuit,
    title: "Intelligence that matters",
    description:
      "We focus on turning network activity and security data into meaningful insights that support better decisions.",
  },
  {
    icon: Eye,
    title: "Visibility without complexity",
    description:
      "We aim to make security information easier to understand, helping teams recognise potential risks across their environments.",
  },
  {
    icon: Target,
    title: "Proactive protection",
    description:
      "We believe organisations should be better prepared to identify suspicious activity before it develops into a larger security incident.",
  },
];

const capabilities = [
  {
    icon: Network,
    number: "01",
    title: "Understand the environment",
    description:
      "Gain a clearer view of connected systems, network activity and the digital infrastructure that supports your organisation.",
  },
  {
    icon: Activity,
    number: "02",
    title: "Identify potential threats",
    description:
      "Use intelligent analysis to recognise unusual behaviour and patterns that may indicate cybersecurity risks.",
  },
  {
    icon: BellRing,
    number: "03",
    title: "Stay informed",
    description:
      "Bring important security events to the attention of the people responsible for protecting your organisation.",
  },
  {
    icon: ShieldCheck,
    number: "04",
    title: "Support informed decisions",
    description:
      "Turn security insights into meaningful information that helps organisations assess risks and make better security decisions.",
  },
];

export default function WhySafeDevPage() {
  return (
    <SiteChrome>
      <main>
        {/* COMPANY INTRODUCTION */}
        <section className="page-hero section-shell">
          <div className="eyebrow">
            <span className="eyebrow-line" />
            WHY SAFEDEV.AI
          </div>

          <h1>
            Security starts
            <br />
            with <span>understanding.</span>
          </h1>

          <p>
            SAFEDEV.AI is focused on helping organisations strengthen
            their digital security through system visibility, intelligent
            threat detection and timely security awareness. We believe
            better security begins with understanding what is happening
            across your digital environment.
          </p>

          <Link href="/solutions" className="button-primary">
            Explore Our Solutions
            <ArrowRight size={17} />
          </Link>
        </section>

        {/* COMPANY PURPOSE */}
        <section className="section-shell story-section">
          <div className="story-visual">
            <div className="story-ring ring-a" />
            <div className="story-ring ring-b" />
            <div className="story-ring ring-c" />

            <div className="story-center">
              <ShieldCheck size={35} />
              <span>SECURITY</span>
            </div>

            <span className="story-tag story-tag-a">
              VISIBILITY
            </span>

            <span className="story-tag story-tag-b">
              PROTECTION
            </span>
          </div>

          <div className="story-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" />
              OUR PURPOSE
            </div>

            <h2>
              Making digital
              <br />
              environments <span>safer.</span>
            </h2>

            <p>
              Organisations depend on connected systems, networks
              and digital infrastructure every day. As these environments
              grow, understanding and managing their security becomes
              increasingly important.
            </p>

            <p>
              SAFEDEV.AI aims to address this challenge by bringing
              system monitoring, intelligent threat analysis and
              security awareness into one focused platform.
              Our goal is to help organisations gain visibility into
              their environments and make more informed security decisions.
            </p>
          </div>
        </section>

        {/* OUR APPROACH */}
        <section className="section-shell page-content">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                OUR APPROACH
              </div>

              <h2>
                Security through
                <br />
                <span>intelligence.</span>
              </h2>
            </div>

            <p>
              A structured approach to understanding network activity,
              identifying potential risks and improving security awareness.
            </p>
          </div>

          <div className="principle-grid">
            {capabilities.map((item) => {
              const Icon = item.icon;

              return (
                <article className="principle-card" key={item.number}>
                  <div className="principle-top">
                    <span>{item.number}</span>
                    <Icon size={23} />
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* COMPANY PRINCIPLES */}
        <section className="section-shell page-content">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                WHAT WE STAND FOR
              </div>

              <h2>
                The principles behind
                <br />
                <span>SAFEDEV.AI.</span>
              </h2>
            </div>

            <p>
              Our approach is shaped by a commitment to meaningful
              security, responsible technology and practical value
              for organisations.
            </p>
          </div>

          <div className="principle-grid">
            {principles.map((item, index) => {
              const Icon = item.icon;

              return (
                <article className="principle-card" key={item.title}>
                  <div className="principle-top">
                    <span>0{index + 1}</span>
                    <Icon size={23} />
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* COMPANY POSITIONING */}
        <section className="vision-section">
          <div className="section-shell vision-inner">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                OUR COMMITMENT
              </div>

              <h2>
                Stay informed.
                <br />
                Stay <span>prepared.</span>
              </h2>

              <p>
                We believe organisations deserve a clearer understanding
                of their digital security. SAFEDEV.AI is being developed
                with a focus on making intelligent security monitoring
                and threat awareness more accessible and practical.
              </p>

              <Link href="/solutions" className="button-primary">
                Discover Our Platform
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="vision-panel">
              <span className="panel-label">
                THE SAFEDEV.AI MISSION
              </span>

              <div className="vision-symbol">
                <ShieldCheck size={90} strokeWidth={1} />
              </div>

              <div className="vision-panel-footer">
                <span>See Threats. Stay Ahead.</span>
                <LockKeyhole size={18} />
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="page-callout">
          <div className="section-shell callout-inner">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                EXPLORE SAFEDEV.AI
              </div>

              <h2>
                A clearer approach to cybersecurity.
              </h2>

              <p>
                Discover how SAFEDEV.AI approaches network visibility,
                intelligent threat detection and security awareness.
              </p>
            </div>

            <Link href="/simulation" className="button-primary">
              Explore Our Platform
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
