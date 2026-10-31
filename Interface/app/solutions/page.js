
import Link from "next/link";
import { ArrowRight, Eye, Network, ShieldCheck, Sparkles } from "lucide-react";
import SiteChrome from "../components/SiteChrome";

const solutions = [
  {
    icon: Eye,
    title: "Network visibility",
    description:
      "Explore network activity through visual experiences that make complex information easier to understand.",
    number: "01",
  },
  {
    icon: Sparkles,
    title: "Intelligent discovery",
    description:
      "Bring meaningful patterns into focus and explore activity that may deserve closer attention.",
    number: "02",
  },
  {
    icon: ShieldCheck,
    title: "Security awareness",
    description:
      "Build a clearer understanding of network behavior and possible security concerns.",
    number: "03",
  },
  {
    icon: Network,
    title: "Connected perspectives",
    description:
      "Explore relationships between network activities in a more intuitive way.",
    number: "04",
  },
];

export default function SolutionsPage() {
  return (
    <SiteChrome>
      <main>
        <section className="page-hero section-shell">
          <div className="eyebrow">
            <span className="eyebrow-line" /> OUR SOLUTIONS
          </div>
          <h1>
            Complex networks.
            <br />
            <span>Clearer answers.</span>
          </h1>
          <p>
            Discover a more approachable way to explore network activity,
            uncover patterns, and understand complex digital environments.
          </p>
          <Link href="/simulation" className="button-primary">
            Explore the Simulation <ArrowRight size={17} />
          </Link>
        </section>

        <section className="section-shell page-content">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" /> WHAT YOU CAN EXPLORE
              </div>
              <h2>
                Insight at every
                <br />
                <span>step.</span>
              </h2>
            </div>
            <p>
              A visual, accessible approach to understanding network behavior
              and exploring security insights.
            </p>
          </div>

          <div className="solution-grid">
            {solutions.map((item) => {
              const Icon = item.icon;

              return (
                <article className="solution-card" key={item.number}>
                  <div className="solution-card-top">
                    <span>{item.number} / CAPABILITY</span>
                    <Icon size={24} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="card-link">EXPLORE INSIGHTS ↗</span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="page-callout">
          <div className="section-shell callout-inner">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" /> TAKE A CLOSER LOOK
              </div>
              <h2>See the experience in action.</h2>
              <p>Explore sample network scenarios in the interactive demo.</p>
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
