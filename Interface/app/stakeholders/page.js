
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Network,
  ShieldCheck,
} from "lucide-react";
import SiteChrome from "../components/SiteChrome";

const audiences = [
  {
    icon: ShieldCheck,
    title: "Security operations teams",
    description:
      "Explore traffic behavior, investigate unusual patterns, and develop a clearer picture of network activity.",
    benefit: "Visual security awareness",
  },
  {
    icon: Network,
    title: "Cybersecurity professionals",
    description:
      "Explore traffic relationships and communicate findings through visual insights.",
    benefit: "Pattern exploration",
  },
  {
    icon: Building2,
    title: "IT and network administrators",
    description:
      "Understand network environments through a more intuitive view of activity and connections.",
    benefit: "Network visibility",
  },
  {
    icon: GraduationCap,
    title: "Students and researchers",
    description:
      "Explore network behavior and security concepts through a visual learning experience.",
    benefit: "Learning and exploration",
  },
  {
    icon: BriefcaseBusiness,
    title: "Technology decision-makers",
    description:
      "Understand how network intelligence can support security discussions and workflows.",
    benefit: "Informed decisions",
  },
];

export default function StakeholdersPage() {
  return (
    <SiteChrome>
      <main>
        <section className="page-hero section-shell">
          <div className="eyebrow">
            <span className="eyebrow-line" /> WHO IT&apos;S FOR
          </div>
          <h1>
            Different roles.
            <br />
            One clearer <span>view.</span>
          </h1>
          <p>
            From security professionals to learners and technology teams,
            SafeDev AI makes network behavior easier to explore and discuss.
          </p>
          <Link href="/simulation" className="button-primary">
            Explore the Experience <ArrowRight size={17} />
          </Link>
        </section>

        <section className="section-shell page-content">
          <div className="section-heading">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" /> WHO WE SUPPORT
              </div>
              <h2>
                Designed for people
                <br />
                who work with <span>networks.</span>
              </h2>
            </div>
            <p>
              Explore how different teams can use visual network insights in
              their work and learning.
            </p>
          </div>

          <div className="audience-list">
            {audiences.map((item, index) => {
              const Icon = item.icon;

              return (
                <article className="audience-row" key={item.title}>
                  <span className="audience-number">
                    0{index + 1}
                  </span>

                  <div className="audience-icon">
                    <Icon size={23} strokeWidth={1.4} />
                  </div>

                  <div className="audience-content">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div className="audience-benefit">
                    <span>FOCUS</span>
                    <p>{item.benefit}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="page-callout">
          <div className="section-shell callout-inner">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" /> TAKE THE NEXT STEP
              </div>
              <h2>Explore network behavior yourself.</h2>
              <p>
                Open the interactive demonstration and discover visual
                insights using sample data.
              </p>
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
