
"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";

import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Monitor,
  Network,
  Shield,
  RefreshCw,
} from "lucide-react";

import SiteChrome from "../components/SiteChrome";
import NetworkTopology from "./components/NetworkTopology";
import { systems as initialSystems } from "./components/systemData";

const API = "http://127.0.0.1:8000";

export default function SimulationPage() {
  const [selectedId, setSelectedId] = useState(null);
  const selectionTimeoutRef = useRef(null);

  // Keep the selected-system bar visible for 10 seconds after hover ends.
  const handleSelection = (id) => {
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
      selectionTimeoutRef.current = null;
    }

    if (id) {
      setSelectedId(id);
      return;
    }

    selectionTimeoutRef.current = setTimeout(() => {
      setSelectedId(null);
      selectionTimeoutRef.current = null;
    }, 10000);
  };

  // Clear the pending timeout when the page unmounts.
  useEffect(() => {
    return () => {
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, []);
  const [modelSystems, setModelSystems] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initialize or retrieve the ten connected systems.
  const loadSimulation = useCallback(async () => {
    try {
      setLoading(true);

      const healthResponse = await fetch(`${API}/health`);

      if (!healthResponse.ok) {
        throw new Error("Backend health check failed.");
      }

      const systemsResponse = await fetch(
        `${API}/simulation/systems`
      );

      let data;

      if (systemsResponse.status === 409) {
        // Initialize the simulation if it has not started.
        const startResponse = await fetch(
          `${API}/simulation/start`,
          { method: "POST" }
        );

        data = await startResponse.json();

        if (!startResponse.ok) {
          throw new Error(
            data.detail || "System initialization failed."
          );
        }
      } else {
        data = await systemsResponse.json();

        if (!systemsResponse.ok) {
          throw new Error(
            data.detail || "Unable to retrieve systems."
          );
        }
      }

      setModelSystems(data.systems || []);
      setConnected(true);
      setError("");
    } catch (err) {
      setConnected(false);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSimulation();
  }, [loadSimulation]);

  // Match frontend computer IDs with backend system IDs.
  const displayedSystems = initialSystems.map((system) => {
    const modelSystem = modelSystems.find(
      (item) => item.system_id === system.id
    );

    return {
      ...system,
      prediction: modelSystem?.prediction ?? null,
      status: modelSystem?.status ?? "PENDING",
      color: modelSystem?.color ?? "grey",
      actualLabel: modelSystem?.actual_label ?? null,
      features: modelSystem?.features ?? {},
      isAttack: modelSystem?.is_attack ?? false,
      modelConnected: Boolean(modelSystem),
    };
  });

  const selectedSystem = displayedSystems.find(
    (system) => system.id === selectedId
  );

  const normalCount = displayedSystems.filter(
    (system) => system.status === "NORMAL"
  ).length;

  const attackCount = displayedSystems.filter(
    (system) => system.status === "ATTACK"
  ).length;

  const pendingCount = displayedSystems.filter(
    (system) => system.status === "PENDING"
  ).length;

  return (
    <SiteChrome>
      <main className="simx-page">

        {/* HEADER */}
        <section className="section-shell simx-header">
          <Link href="/" className="simx-back">
            <ArrowLeft size={15} />
            Back to home
          </Link>

          <div className="simx-heading-row">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                NETWORK OPERATIONS
              </div>

              <h1>
                Network <span>Simulation.</span>
              </h1>

              <p>
                Monitor connected systems, network activity
                and system security status.
              </p>
            </div>

            <span className="simx-demo-badge">
              <i /> SYSTEM MONITORING
            </span>
          </div>
        </section>

        {/* DASHBOARD */}
        <section className="section-shell simx-dashboard">

          {/* OVERVIEW */}
          <div className="simx-overview">

            <article className="simx-overview-card">
              <span>
                <Monitor size={18} />
              </span>

              <div>
                <small>REGISTERED SYSTEMS</small>
                <strong>{displayedSystems.length}</strong>
              </div>
            </article>

            <article className="simx-overview-card">
              <span>
                <Network size={18} />
              </span>

              <div>
                <small>NETWORK NODES</small>
                <strong>{modelSystems.length}</strong>
              </div>
            </article>

            <article className="simx-overview-card">
              <span>
                <Activity size={18} />
              </span>

              <div>
                <small>NORMAL SYSTEMS</small>
                <strong className="simx-overview-text">
                  {normalCount}
                </strong>
              </div>
            </article>

            <article className="simx-overview-card">
              <span>
                <Shield size={18} />
              </span>

              <div>
                <small>SYSTEM STATUS</small>

                <strong className="simx-overview-text">
                  {loading
                    ? "Loading..."
                    : connected
                      ? "Connected"
                      : "Disconnected"}
                </strong>
              </div>
            </article>

          </div>

          {/* CONNECTION STATUS */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "14px",
              marginBottom: "20px",
            }}
          >
            <div>
              <span
                style={{
                  color: connected ? "#22c55e" : "#ef4444",
                  fontSize: "13px",
                }}
              >
                ●{" "}
                {connected
                  ? "Backend Connected"
                  : "Backend Disconnected"}
              </span>

              {error && (
                <p style={{ color: "#ef4444", fontSize: "13px" }}>
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={loadSimulation}
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#f97316",
                color: "#fff",
                border: "none",
                borderRadius: "7px",
                padding: "10px 15px",
                cursor: "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              <RefreshCw size={15} />
              {loading ? "Loading..." : "Refresh Systems"}
            </button>
          </div>

          {/* NETWORK TOPOLOGY */}
          <section className="simx-network-panel">
            <div className="simx-panel-heading">
              <div>
                <div className="simx-panel-label">
                  NETWORK TOPOLOGY VIEW
                </div>

                <h2>Connected systems</h2>

                <p>
                  Select a computer to inspect its individual
                  monitoring workspace.
                </p>
              </div>

              <span className="simx-live-indicator">
                <i />
                {connected
                  ? "SYSTEMS CONNECTED"
                  : "WAITING FOR CONNECTION"}
              </span>
            </div>

            <NetworkTopology
              systems={displayedSystems}
              selectedId={selectedId}
              onSelect={handleSelection}
            />

            <div className="simx-topology-footer">
              <span>
                <i className="simx-legend-orange" />
                Network connection
              </span>

              <span>
                <i className="simx-legend-pulse" />
                Computer activity animation
              </span>

              <span>
                <i className="simx-legend-selected" />
                Selected system
              </span>
            </div>
          </section>

          {/* SYSTEM DIRECTORY */}
          <section
            className="simx-systems-section"
            id="system-directory"
          >
            <div className="simx-panel-heading">
              <div>
                <div className="simx-panel-label">
                  SYSTEM DIRECTORY
                </div>

                <h2>Monitored computers</h2>
              </div>

              <span className="simx-system-count">
                {modelSystems.length}/10 SYSTEMS
              </span>
            </div>

            <div className="simx-system-grid">

              {displayedSystems.map((system) => (
                <Link
                  key={system.id}
                  href={`/simulation/${system.id}`}
                  onMouseEnter={() => handleSelection(system.id)}
                  onMouseLeave={() => handleSelection(null)}
                  onFocus={() => handleSelection(system.id)}
                  onBlur={() => handleSelection(null)}
                  className={`simx-system-card ${
                    selectedId === system.id ? "active" : ""
                  }`}
                  style={{
                    borderColor:
                      system.status === "NORMAL"
                        ? "#16a34a"
                        : system.status === "ATTACK"
                          ? "#dc2626"
                          : undefined,
                  }}
                >
                  <span className="simx-system-card-icon">
                    <Monitor size={21} />
                    <i />
                  </span>

                  <span className="simx-system-card-info">
                    <strong>{system.id}</strong>

                    <small>{system.role}</small>

                    <small
                      style={{
                        color:
                          system.status === "NORMAL"
                            ? "#22c55e"
                            : system.status === "ATTACK"
                              ? "#ef4444"
                              : "#999",
                      }}
                    >
                      {system.status}
                    </small>
                  </span>

                  <ArrowUpRight
                    size={17}
                    className="simx-card-arrow"
                  />
                </Link>
              ))}

            </div>
          </section>

          {/* SELECTED  */}
          {selectedSystem && (
            <div className="simx-selection-note">
              Selected: <strong>{selectedSystem.id}</strong> —{" "}
              {selectedSystem.role}

              <Link href={`/simulation/${selectedSystem.id}`}>
                Open details <ArrowUpRight size={14} />
              </Link>
            </div>
          )}

        </section>

        {/* SYSTEM INSIGHTS */}
        <section className="section-shell simx-visualization-footer">
          <div className="simx-visualization-content">

            <span className="simx-visualization-label">
              SYSTEM INSIGHTS
            </span>

            <h2>Explore System Monitoring</h2>

            <p>
              Get a closer look at connected systems and their current status.
            </p>

            <Link
  href="/visualizations"
  className="simx-visualization-btn"
>
  <Monitor size={16} />
  View System Details
  <ArrowUpRight size={15} />
</Link>

          </div>
        </section>

      </main>
    </SiteChrome>
  );
}
