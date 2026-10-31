
import Link from "next/link";
import { ArrowLeft, CircleAlert } from "lucide-react";
import SiteChrome from "../../components/SiteChrome";
import SystemDetails from "../components/SystemDetails";
import { getSystem } from "../components/systemData";

export function generateStaticParams() {
  return Array.from({ length: 10 }, (_, index) => ({
    systemId: `SYS-${String(index + 1).padStart(2, "0")}`,
  }));
}

export default async function SystemPage({ params }) {
  const { systemId } = await params;
  const system = getSystem(systemId);

  if (!system) {
    return (
      <SiteChrome>
        <main className="simx-page section-shell">
          <h1>System not found</h1>
          <p>The requested system does not exist in this demonstration.</p>
          <Link href="/simulation" className="simx-back">
            <ArrowLeft size={15} /> Back to simulation
          </Link>
        </main>
      </SiteChrome>
    );
  }

  return (
    <SiteChrome>
      <main className="simx-page">
        <section className="section-shell simx-header">
          <Link href="/simulation" className="simx-back">
            <ArrowLeft size={15} /> Back to network simulation
          </Link>

          <div className="eyebrow">
            <span className="eyebrow-line" /> INDIVIDUAL SYSTEM MONITORING
          </div>

          <h1>
            System <span>{system.id}.</span>
          </h1>

          <p>
            Inspect the network feature inputs associated with this
            demonstration computer.
          </p>
        </section>

        <section className="section-shell simx-detail-workspace">
          <SystemDetails system={system} />
        </section>

        <section className="section-shell simx-disclaimer">
          <CircleAlert size={17} />
          <p>
            Demonstration only. Values are null placeholders. This page
            does not receive live network traffic or produce verified
            security classifications.
          </p>
        </section>
      </main>
    </SiteChrome>
  );
}
