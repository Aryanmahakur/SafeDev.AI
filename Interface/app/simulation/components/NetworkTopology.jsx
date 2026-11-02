"use client";

import { useMemo } from "react";
import { Network, Router } from "lucide-react";
import ComputerNode from "./ComputerNode";

const positions = [
  { x: 15, y: 17 },
  { x: 38, y: 12 },
  { x: 62, y: 12 },
  { x: 85, y: 17 },
  { x: 91, y: 48 },
  { x: 85, y: 80 },
  { x: 62, y: 87 },
  { x: 38, y: 87 },
  { x: 15, y: 80 },
  { x: 9, y: 48 },
];

function getSystemState(system) {
  if (!system) return "pending";

  if (
    system.isAttack === true ||
    system.is_attack === true ||
    system.status === "ATTACK" ||
    (system.prediction &&
      system.prediction !== "BENIGN")
  ) {
    return "attack";
  }

  if (
    system.status === "NORMAL" ||
    system.prediction === "BENIGN"
  ) {
    return "normal";
  }

  return "pending";
}

export default function NetworkTopology({
  systems = [],
  selectedId = null,
  onSelect,
}) {
  const nodes = useMemo(() => {
    return systems.slice(0, positions.length).map((system, index) => ({
      system,
      position: positions[index],
      state: getSystemState(system),
    }));
  }, [systems]);

  return (
    <div className="simx-topology">
      {/* Background grid */}
      <div className="simx-topology-grid" />

      {/* Network connection lines */}
      <svg
        className="simx-connections"
        viewBox="0 0 900 520"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {nodes.map(({ system, position, state }) => {
          const x = position.x * 9;
          const y = position.y * 5.2;

          const trafficColor =
            state === "normal"
              ? "#22c55e"
              : state === "attack"
                ? "#ef4444"
                : "#888888";

          return (
            <line
              key={system.id}
              x1="450"
              y1="260"
              x2={x}
              y2={y}
              className={`simx-connection-line simx-connection-${state}`}
              style={{
                stroke: trafficColor,
                opacity: state === "pending" ? 0.4 : 0.75,
              }}
            />
          );
        })}
      </svg>

      {/* Central network router */}
      <div className="simx-central-router">
        <span className="simx-router-glow" />

        <span className="simx-router-icon">
          <Router size={28} />
        </span>

        <strong>NETWORK</strong>
        <span>Central Switch</span>

        <div className="simx-router-status">
          <i />
          MODEL MONITORING
        </div>
      </div>

      {/* Connected computer nodes */}
      {nodes.map(({ system, position }) => (
        <ComputerNode
          key={system.id}
          system={system}
          position={position}
          selected={selectedId === system.id}
          onSelect={onSelect}
        />
      ))}

      {/* Bottom caption */}
      <div className="simx-topology-caption">
        <Network size={14} />
        Prediction-driven network simulation · {systems.length} systems
      </div>
    </div>
  );
}