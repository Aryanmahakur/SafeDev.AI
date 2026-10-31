
import Link from "next/link";
import { ArrowRight, Eye, Lightbulb, Shield, Target } from "lucide-react";
import SiteChrome from "../components/SiteChrome";

const principles = [
  {
    icon: Eye,
    title: "Clarity over complexity",
    description:
      "Present information in a way that helps people understand what they are seeing.",
  },
  {
    icon: Lightbulb,
    title: "Intelligence with purpose",
    description:
      "Use AI-driven insights to make exploring network behavior more approachable.",
  },
  {
    icon: Target,
    title: "Focus on what matters",
    description:
      "Help users explore patterns and focus on relevant activity.",
  },
  {
    icon: Shield,
    title: "Awareness through visibility",
    description:
      "Support a clearer understanding of digital environments and potential security concerns.",
  },
];

export default function WhySafeDevPage() {
  return (
    <SiteChrome>
      <main>
        <section className="page-hero section-shell">
          <div className="eyebrow">
            <span className="eyebrow-line" /> WHY SAFEDEV AI
          </div>
          <h1>
            Security should feel
            <br />
            <span>clear.</span>
          </h1>
          <p>
            Network environments can be complicated. Understanding them
            should be more intuitive. SafeDev AI makes complex network
            information easier to explore.
          </p>
          <Link href="/solutions" className="button-primary">
            Explore Our Solutions <ArrowRight size={17} />
          </Link>
        </section>

        <section className="section-shell story-section">
          <div className="story-visual">
            <div className="story-ring ring-a" />
            <div className="story-ring ring-b" />
            <div className="story-ring ring-c" />
            <div className="story-center">
              <Eye size={35} />
              <span>CLARITY</span>
            </div>
            <span className="story-tag story-tag-a">UNDERSTAND</span>
            <span className="story-tag story-tag-b">EXPLORE</span>
          </div>

          <div className="story-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" /> OUR PURPOSE
            </div>
            <h2>
              Better understanding
              <br />
              starts with <span>visibility.</span>
            </h2>
            <p>
              Large amounts of network information can be difficult to
              interpret. A clear visual perspective can make it easier to
              explore relationships, recognize patterns, and ask better
              questions.
            </p>
            <p>
              SafeDev AI brings these ideas together in a security-focused
              experience designed to make network behavior more accessible.
            </p>
          </div>
        </section>

        <section className="section-shell page-content">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" /> WHAT GUIDES US
              </div>
              <h2>
                Principles behind
                <br />
                <span>the experience.</span>
              </h2>
            </div>
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

        <section className="page-callout">
          <div className="section-shell callout-inner">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" /> EXPERIENCE THE DIFFERENCE
              </div>
              <h2>See network intelligence differently.</h2>
              <p>Explore the SafeDev AI sample simulation.</p>
            </div>
            <Link href="/simulation" className="button-primary">
              Get Simulation <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}
