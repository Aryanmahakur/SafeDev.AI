
"use client";

import { useState, useEffect, useCallback } from "react";

import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Monitor,
  Network,
  Shield,
  RefreshCw,
} from "lucide-react";

import Link from "next/link";

import SiteChrome from "../components/SiteChrome";
import NetworkTopology from "./components/NetworkTopology";
import { systems as initialSystems } from "./components/systemData";

const API = "http://127.0.0.1:8000";

export default function SimulationPage() {
  const [selectedId, setSelectedId] = useState(null);

  const [modelSystems, setModelSystems] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initialize or retrieve the ten model-driven systems.
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
        // Simulation has not been initialized yet.
        const startResponse = await fetch(
          `${API}/simulation/start`,
          { method: "POST" }
        );

        data = await startResponse.json();

        if (!startResponse.ok) {
          throw new Error(
            data.detail || "Simulation initialization failed."
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

  // Match the original frontend computer IDs with backend IDs.
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
                Monitor ten connected systems using real-time
                predictions from the trained LightGBM model.
              </p>
            </div>

            <span className="simx-demo-badge">
              <i /> ML SIMULATION
            </span>
          </div>
        </section>

        {/* DASHBOARD */}
        <section className="section-shell simx-dashboard">

          {/* OVERVIEW */}
          <div className="simx-overview">

            <article className="simx-overview-card">
              <span><Monitor size={18} /></span>
              <div>
                <small>REGISTERED SYSTEMS</small>
                <strong>{displayedSystems.length}</strong>
              </div>
            </article>

            <article className="simx-overview-card">
              <span><Network size={18} /></span>
              <div>
                <small>NETWORK NODES</small>
                <strong>{modelSystems.length}</strong>
              </div>
            </article>

            <article className="simx-overview-card">
              <span><Activity size={18} /></span>
              <div>
                <small>NORMAL SYSTEMS</small>
                <strong className="simx-overview-text">
                  {normalCount}
                </strong>
              </div>
            </article>

            <article className="simx-overview-card">
              <span><Shield size={18} /></span>
              <div>
                <small>MODEL PREDICTIONS</small>

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

          {/* MODEL STATUS */}
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
                ● {connected ? "LightGBM API Connected" : "Backend Disconnected"}
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
              {loading ? "Loading..." : "Refresh predictions"}
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
                {connected ? "MODEL CONNECTED" : "WAITING FOR MODEL"}
              </span>
            </div>

            <NetworkTopology
              systems={displayedSystems}
              selectedId={selectedId}
              onSelect={setSelectedId}
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
          <section className="simx-systems-section">

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
                  onMouseEnter={() => setSelectedId(system.id)}
                  onMouseLeave={() => setSelectedId(null)}
                  onFocus={() => setSelectedId(system.id)}
                  onBlur={() => setSelectedId(null)}
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

                    <small className="simx-system-state">
                      {system.modelConnected
                        ? system.prediction
                        : "Awaiting prediction"}
                    </small>

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

          {/* SELECTED COMPUTER */}
          {selectedSystem && (
            <div className="simx-selection-note">
              Selected: <strong>{selectedSystem.id}</strong> —{" "}
              {selectedSystem.role}

              {selectedSystem.prediction && (
                <span>
                  {" "} | Prediction: {selectedSystem.prediction}
                </span>
              )}

              <Link href={`/simulation/${selectedSystem.id}`}>
                Open details <ArrowUpRight size={14} />
              </Link>
            </div>
          )}

        </section>

        {/* DISCLAIMER */}
        <section className="section-shell simx-disclaimer">
          <Shield size={17} />

          <p>
            Predictions are generated by the trained LightGBM
            model using records from the processed network traffic
            dataset. This is a dataset-driven simulation, not a
            live network monitoring connection.
          </p>
        </section>

      </main>
    </SiteChrome>
  );
}
