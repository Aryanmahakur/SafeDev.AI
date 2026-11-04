
"use client";

import { useState, useEffect, useRef } from "react";

import {
  getSessionSystem,
  setSessionSystem
} from "./sessionSimulationState";

import {
  ArrowDown,
  ArrowUp,
  Monitor,
  Search,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function SystemDetails({ system }) {
  const [search, setSearch] = useState("");
  const [features, setFeatures] = useState({});
  const [prediction, setPrediction] = useState(null);

  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState("");

  const [showOnlyEmpty, setShowOnlyEmpty] = useState(false);

  const [bulkInput, setBulkInput] = useState("");
  const [bulkMessage, setBulkMessage] = useState("");

  const timer = useRef(null);
  const requestSequence = useRef(0);

  // LOAD SYSTEM DATA
  useEffect(() => {
    let cancelled = false;

    async function loadSystem() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API}/simulation/systems/${system.id}`
        );

        if (!response.ok) {
          throw new Error("Unable to load computer data.");
        }

        const data = await response.json();

        if (cancelled) return;

        // Restore this computer's state from this browser session.
        // Otherwise use the original backend defaults.
        const sessionState = getSessionSystem(system.id);

        setFeatures(
          sessionState?.features ?? data.features ?? {}
        );

        setPrediction(
          sessionState?.prediction ?? {
            prediction: data.prediction,
            status: data.status,
            color: data.color,
            is_attack: data.is_attack,
            actual_label: data.actual_label,
          }
        );

      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    setFeatures({});
    setPrediction(null);

    loadSystem();

    return () => {
      cancelled = true;
      clearTimeout(timer.current);
      requestSequence.current += 1;
    };
  }, [system.id]);

  // RUN LIGHTGBM PREDICTION
  async function runPrediction(updatedFeatures) {
    const currentRequest = ++requestSequence.current;

    try {
      setPredicting(true);
      setError("");

      const response = await fetch(
        `${API}/simulation/systems/${system.id}/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            features: updatedFeatures,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Prediction failed."
        );
      }

      if (currentRequest !== requestSequence.current) {
        return;
      }

      const nextPrediction = {
        prediction: data.prediction,
        status: data.status,
        color: data.color,
        is_attack: data.is_attack,
        actual_label: data.actual_label,
      };

      setPrediction(nextPrediction);

      // Store only in temporary browser memory.
      // This does not modify Render's shared simulation data.
      setSessionSystem(system.id, {
        features: updatedFeatures,
        prediction: nextPrediction,
      });

    } catch (err) {
      if (currentRequest === requestSequence.current) {
        setError(err.message);
      }
    } finally {
      if (currentRequest === requestSequence.current) {
        setPredicting(false);
      }
    }
  }

  // MANUAL FEATURE INPUT
  function handleFeatureChange(name, value) {
    if (value.trim() === "") {
      setFeatures((previous) => ({
        ...previous,
        [name]: null,
      }));

      setError("Enter a valid value to run prediction.");
      return;
    }

    const numericValue = Number(value);

    if (!Number.isFinite(numericValue)) {
      setError("Feature values must be valid numbers.");
      return;
    }

    const updatedFeatures = {
      ...features,
      [name]: numericValue,
    };

    setFeatures(updatedFeatures);
    setError("");

    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      if (
        Object.values(updatedFeatures).every(
          (value) =>
            value !== null &&
            value !== undefined &&
            Number.isFinite(Number(value))
        )
      ) {
        runPrediction(updatedFeatures);
      }
    }, 120);
  }

  // BULK EXCEL IMPORT
  function handleBulkImport() {
    const featureNames = Object.keys(features);

    if (featureNames.length !== 70) {
      setBulkMessage(
        `Expected 70 loaded features, but found ${featureNames.length}.`
      );
      return;
    }

    let values;

    const input = bulkInput.trim().replace(/^\|+|\|+$/g, "");

    if (input.includes("\t")) {
      values = input.split("\t").map((v) => v.trim());
    } else if (input.includes(",")) {
      values = input.split(",").map((v) => v.trim());
    } else if (input.includes("|")) {
      values = input
        .split("|")
        .map((v) => v.trim())
        .filter(Boolean);
    } else {
      values = input.split(/\s+/).filter(Boolean);
    }

    // Ignore an optional final text label.
    if (
      values.length === 71 &&
      !Number.isFinite(Number(values[70]))
    ) {
      values = values.slice(0, 70);
    }

    if (values.length !== 70) {
      setBulkMessage(
        `Found ${values.length} values. Please paste exactly 70 feature values.`
      );
      return;
    }

    if (
      values.some(
        (value) =>
          value === "" ||
          !Number.isFinite(Number(value))
      )
    ) {
      setBulkMessage(
        "Import failed: every feature must be numeric."
      );
      return;
    }

    const numericValues = values.map(Number);

    const updatedFeatures = Object.fromEntries(
      featureNames.map((name, index) => [
        name,
        numericValues[index],
      ])
    );

    clearTimeout(timer.current);
    requestSequence.current += 1;

    setFeatures(updatedFeatures);

    setBulkMessage(
      "70 features imported. Running prediction..."
    );

    runPrediction(updatedFeatures);
  }

  // FILTER FEATURES
  const featureEntries = Object.entries(features);

  const filteredFeatures = featureEntries.filter(
    ([name, value]) => {
      const matchesSearch = name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesEmpty =
        !showOnlyEmpty || value === null;

      return matchesSearch && matchesEmpty;
    }
  );

  const normal = prediction?.status === "NORMAL";
  const attack = prediction?.status === "ATTACK";

  return (
    <div className="simx-detail-content">

      {/* COMPUTER IDENTIFICATION */}
      <div className="simx-device-overview">

        <div className="simx-device-icon">
          <Monitor size={30} />
        </div>

        <div>
          <div className="simx-panel-label">
            SYSTEM IDENTIFICATION
          </div>

          <h2>{system.id}</h2>

          <p>
            {system.name} · {system.role}
          </p>
        </div>

        <span className="simx-demo-badge">
          <i />
          {loading ? "LOADING SYSTEM" : "ML MONITORED"}
        </span>

      </div>

      {/* METRICS */}
      <div className="simx-detail-metrics">

        <article>
          <small>DEVICE ROLE</small>
          <strong>{system.role}</strong>
        </article>

        <article>
          <small>FEATURE COUNT</small>
          <strong>{featureEntries.length || 70}</strong>
        </article>

        <article>
          <small>INPUT STATUS</small>
          <strong>
            {loading
              ? "Loading..."
              : featureEntries.length === 70
                ? "Available"
                : "Incomplete"}
          </strong>
        </article>

        <article>
          <small>MODEL STATUS</small>
          <strong
            style={{
              color: normal
                ? "#22c55e"
                : attack
                  ? "#ef4444"
                  : "#999",
            }}
          >
            {loading
              ? "Loading..."
              : predicting
                ? "Predicting..."
                : prediction?.status || "Pending"}
          </strong>
        </article>

      </div>

      {/* FEATURE INPUTS */}
      <section className="simx-feature-panel">

        <div className="simx-panel-heading">
          <div>
            <div className="simx-panel-label">
              MACHINE LEARNING INPUTS
            </div>

            <h2>Network traffic features</h2>

            <p>
              Edit any feature to automatically run a new
              LightGBM prediction, or import a complete Excel
              row below.
            </p>
          </div>

          <span className="simx-feature-count">
            {filteredFeatures.length} SHOWN
          </span>
        </div>

        {/* BULK EXCEL IMPORT */}
        <div
          style={{
            margin: "18px 0",
            padding: "16px",
            border: "1px solid #333",
            borderRadius: "8px",
            background: "#111",
          }}
        >
          <label
            htmlFor="bulk-feature-input"
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: 600,
            }}
          >
            IMPORT 70 FEATURES FROM EXCEL
          </label>

          <p
            style={{
              margin: "0 0 10px",
              color: "#aaa",
              fontSize: "13px",
            }}
          >
            Copy one complete Excel row and paste its 70
            numeric feature values here. Leave out the final
            Attack Type label.
          </p>

          <textarea
            id="bulk-feature-input"
            value={bulkInput}
            onChange={(event) => {
              setBulkInput(event.target.value);
              setBulkMessage("");
            }}
            placeholder="Paste the 70 Excel values here (tab-separated)..."
            rows={3}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px",
              resize: "vertical",
              background: "#151515",
              border: "1px solid #444",
              borderRadius: "5px",
              color: "#fff",
              fontFamily: "monospace",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "10px",
            }}
          >
            <button
              type="button"
              onClick={handleBulkImport}
              disabled={
                loading ||
                predicting ||
                !bulkInput.trim()
              }
              style={{
                background: "#f97316",
                color: "#fff",
                border: 0,
                borderRadius: "6px",
                padding: "10px 15px",
                cursor: "pointer",
                opacity:
                  loading ||
                  predicting ||
                  !bulkInput.trim()
                    ? 0.55
                    : 1,
              }}
            >
              {predicting
                ? "Predicting..."
                : "Import 70 Features & Predict"}
            </button>

            <button
              type="button"
              onClick={() => {
                setBulkInput("");
                setBulkMessage("");
              }}
              style={{
                background: "transparent",
                color: "#ccc",
                border: "1px solid #555",
                borderRadius: "6px",
                padding: "9px 13px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>

            {bulkMessage && (
              <span
                role="status"
                style={{
                  color:
                    bulkMessage.includes("failed") ||
                    bulkMessage.includes("Found") ||
                    bulkMessage.includes("Expected")
                      ? "#ef4444"
                      : "#22c55e",
                  fontSize: "13px",
                }}
              >
                {bulkMessage}
              </span>
            )}
          </div>
        </div>

        {/* CONTROLS */}
        <div className="simx-feature-controls">

          <label className="simx-search">
            <Search size={17} />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search feature names..."
            />
          </label>

          <button
            type="button"
            className={`simx-empty-filter ${
              showOnlyEmpty ? "active" : ""
            }`}
            onClick={() =>
              setShowOnlyEmpty((current) => !current)
            }
          >
            {showOnlyEmpty
              ? <ArrowUp size={15} />
              : <ArrowDown size={15} />}

            {showOnlyEmpty
              ? "Show all"
              : "Show empty values"}
          </button>

        </div>

        {/* FEATURE TABLE */}
        <div className="simx-feature-table-wrap">

          {loading ? (
            <div
              style={{
                padding: 30,
                textAlign: "center",
              }}
            >
              <Loader2 className="animate-spin" />
              Loading network features...
            </div>
          ) : (

            <table className="simx-feature-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>FEATURE NAME</th>
                  <th>INPUT VALUE</th>
                  <th>DATA STATUS</th>
                </tr>
              </thead>

              <tbody>
                {filteredFeatures.map(([name, value]) => {
                  const index = featureEntries.findIndex(
                    ([featureName]) => featureName === name
                  );

                  return (
                    <tr key={name}>
                      <td className="simx-feature-index">
                        {index + 1}
                      </td>

                      <td>{name}</td>

                      <td>
                        <input
                          type="number"
                          step="any"
                          value={value ?? ""}
                          onChange={(event) =>
                            handleFeatureChange(
                              name,
                              event.target.value
                            )
                          }
                          aria-label={`Edit ${name}`}
                          style={{
                            width: "150px",
                            padding: "8px",
                            background: "#151515",
                            border: "1px solid #444",
                            borderRadius: "5px",
                            color: "#fff",
                          }}
                        />
                      </td>

                      <td>
                        <span
                          className="simx-null-badge"
                          style={{
                            color:
                              value === null
                                ? "#ef4444"
                                : "#22c55e",
                          }}
                        >
                          {value === null
                            ? "EMPTY"
                            : "AVAILABLE"}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredFeatures.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="simx-no-results"
                    >
                      No matching features found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          )}
        </div>

        <div className="simx-feature-footer">
          <span>
            {featureEntries.length} total model inputs
          </span>

          <span>
            Automatic prediction enabled
          </span>
        </div>

      </section>

      {/* PREDICTION RESULT */}
      <section
        className="simx-prediction-placeholder"
        style={{
          borderColor: normal
            ? "#16a34a"
            : attack
              ? "#dc2626"
              : undefined,
        }}
      >
        <div className="simx-prediction-icon">
          {predicting ? (
            <Loader2 size={22} />
          ) : (
            <Shield size={22} />
          )}
        </div>

        <div>
          <div className="simx-panel-label">
            LIGHTGBM SECURITY ANALYSIS
          </div>

          <h3>
            {loading
              ? "Loading prediction..."
              : predicting
                ? "Analysing updated traffic..."
                : prediction
                  ? prediction.prediction
                  : "Prediction unavailable"}
          </h3>

          <p>
            {normal
              ? "Normal network traffic detected."
              : attack
                ? "Potential malicious network traffic detected."
                : "Waiting for a valid prediction."}
          </p>

          {prediction?.actual_label && (
            <p>
              Dataset actual label: {prediction.actual_label}
            </p>
          )}
        </div>

        {prediction && !predicting && (
          <span
            className="simx-pending-badge"
            style={{
              color: normal ? "#22c55e" : "#ef4444",
            }}
          >
            {prediction.status}
          </span>
        )}
      </section>

      {/* ERROR */}
      {error && (
        <div
          style={{
            marginTop: 15,
            color: "#ef4444",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <AlertCircle size={16} />
          {error}
        </div>
      )}

    </div>
  );
}
