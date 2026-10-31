
"use client";

import { useCallback, useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export default function MLSimulationTest() {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  const loadSystems = useCallback(async () => {
    try {
      const response = await fetch(`${API}/simulation/systems`);

      if (!response.ok) {
        throw new Error("Simulation not initialized. Start it first.");
      }

      const data = await response.json();
      setSystems(data.systems);
      setConnected(true);
      setError("");
    } catch (err) {
      setConnected(false);
      setError(err.message);
    }
  }, []);

  const startSimulation = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/simulation/start`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Simulation failed.");
      }

      setSystems(data.systems);
      setConnected(true);
    } catch (err) {
      setConnected(false);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const advanceSystem = async (systemId) => {
    try {
      const response = await fetch(
        `${API}/simulation/systems/${systemId}/advance`,
        { method: "POST" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction update failed.");
      }

      setSystems((previous) =>
        previous.map((system) =>
          system.system_id === systemId ? data : system
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadSystems();
  }, [loadSystems]);

  const normalCount = systems.filter(
    (system) => system.status === "NORMAL"
  ).length;

  const attackCount = systems.filter(
    (system) => system.status === "ATTACK"
  ).length;

  return (
    <main className="mltest">
      <style jsx>{`
        .mltest {
          min-height: 100vh;
          background: #090909;
          color: #f5f5f5;
          padding: 36px;
          font-family: Arial, sans-serif;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 30px;
        }

        .muted {
          color: #929292;
          font-size: 13px;
        }

        .connection {
          border: 1px solid #333;
          padding: 9px 13px;
          border-radius: 20px;
          font-size: 12px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin: 24px 0;
        }

        .stat, .machine {
          background: #121212;
          border: 1px solid #292929;
          border-radius: 12px;
          padding: 20px;
        }

        .stat strong {
          display: block;
          font-size: 28px;
          margin-top: 10px;
        }

        .machines {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
        }

        .machine {
          border-top: 3px solid #777;
          min-width: 0;
        }

        .machine.normal { border-top-color: #16a34a; }
        .machine.attack { border-top-color: #dc2626; }

        .machine h3 { margin: 0 0 16px; }

        .prediction {
          font-size: 17px;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .green { color: #22c55e; }
        .red { color: #ef4444; }

        button {
          background: #f97316;
          color: white;
          border: none;
          border-radius: 7px;
          padding: 11px 16px;
          cursor: pointer;
          font-weight: 600;
        }

        button:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .machine button {
          margin-top: 15px;
          width: 100%;
          font-size: 12px;
          padding: 9px;
        }

        .error {
          color: #ef4444;
          margin: 18px 0;
        }

        @media (max-width: 900px) {
          .machines { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 550px) {
          .mltest { padding: 18px; }
          .stats, .machines { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="header">
        <div>
          <h1>SAFEDEV.AI Network Simulation</h1>
          <p className="muted">
            Actual predictions from your trained LightGBM model
          </p>
        </div>

        <div className="connection">
          {connected ? "● Backend Connected" : "● Backend Disconnected"}
        </div>
      </div>

      <button onClick={startSimulation} disabled={loading}>
        {loading ? "Initializing..." : "Start 10-System Simulation"}
      </button>

      {error && <p className="error">{error}</p>}

      <div className="stats">
        <div className="stat">
          <span className="muted">Total Systems</span>
          <strong>{systems.length}/10</strong>
        </div>

        <div className="stat">
          <span className="muted">Normal Systems</span>
          <strong className="green">{normalCount}</strong>
        </div>

        <div className="stat">
          <span className="muted">Attacks Detected</span>
          <strong className="red">{attackCount}</strong>
        </div>
      </div>

      <h2>Connected Computers</h2>

      <div className="machines">
        {systems.map((system) => (
          <div
            key={system.system_id}
            className={`machine ${
              system.status === "NORMAL" ? "normal" : "attack"
            }`}
          >
            <h3>{system.system_id}</h3>

            <p className="muted">Predicted class</p>

            <div
              className={`prediction ${
                system.status === "NORMAL" ? "green" : "red"
              }`}
            >
              {system.prediction}
            </div>

            <p className="muted">Status: {system.status}</p>

            <p className="muted">
              Actual label: {system.actual_label ?? "Manual input"}
            </p>

            <button onClick={() => advanceSystem(system.system_id)}>
              Next traffic record
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
