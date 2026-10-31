
"use client";

import { useState, useEffect, useRef } from "react";

import {
  ArrowDown,
  ArrowUp,
  Monitor,
  Search,
  Shield,
  Activity,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API = "http://127.0.0.1:8000";

export default function SystemDetails({ system }) {
  const [search, setSearch] = useState("");

  const [features, setFeatures] = useState({});
  const [prediction, setPrediction] = useState(null);

  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState("");

  const [showOnlyEmpty, setShowOnlyEmpty] = useState(false);

  const initialized = useRef(false);
  const timer = useRef(null);
  const requestSequence = useRef(0);

  // ------------------------------------------------
  // LOAD THIS COMPUTER'S ACTUAL BACKEND DATA
  // ------------------------------------------------

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

        setFeatures(data.features);
        setPrediction({
          prediction: data.prediction,
          status: data.status,
          color: data.color,
          is_attack: data.is_attack,
          actual_label: data.actual_label,
        });

        initialized.current = true;
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

    initialized.current = false;
    setFeatures({});
    setPrediction(null);

    loadSystem();

    return () => {
      cancelled = true;
      clearTimeout(timer.current);
    };
  }, [system.id]);

  // ------------------------------------------------
  // SEND UPDATED FEATURES TO LIGHTGBM
  // ------------------------------------------------

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

      // Ignore an older response if a newer request exists.
      if (currentRequest !== requestSequence.current) {
        return;
      }

      setPrediction({
        prediction: data.prediction,
        status: data.status,
        color: data.color,
        is_attack: data.is_attack,
        actual_label: data.actual_label,
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

  // ------------------------------------------------
  // HANDLE INPUT CHANGES
  // ------------------------------------------------

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

    // Short debounce prevents excessive requests while typing.
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

  // ------------------------------------------------
  // FILTER FEATURES
  // ------------------------------------------------

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

  // ------------------------------------------------
  // UI
  // ------------------------------------------------

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
              LightGBM prediction.
            </p>
          </div>

          <span className="simx-feature-count">
            {filteredFeatures.length} SHOWN
          </span>

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

        {/* TABLE */}

        <div className="simx-feature-table-wrap">

          {loading ? (
            <div style={{ padding: 30, textAlign: "center" }}>
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
