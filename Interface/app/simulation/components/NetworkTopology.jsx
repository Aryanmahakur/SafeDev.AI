
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
    system.is_attack === true ||
    system.status === "ATTACK" ||
    (system.prediction && system.prediction !== "BENIGN")
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
  const lines = useMemo(
    () =>
      positions.map((position, index) => ({
        id: index,
        x: position.x * 9,
        y: position.y * 5.2,
      })),
    []
  );

  return (
    <div className="simx-topology">
      <div className="simx-topology-grid" />

      <svg
        className="simx-connections"
        viewBox="0 0 900 520"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {systems.map((system, index) => {
          const point = lines[index];
          if (!point) return null;

          const state = getSystemState(system);
          const trafficColor =
            state === "normal"
              ? "#22c55e"
              : state === "attack"
                ? "#ef4444"
                : "#888888";

          const dx = point.x - 450;
          const dy = point.y - 260;

          return (
            <g key={system.id}>
              {/* Connection belonging to this computer */}
              <line
                x1="450"
                y1="260"
                x2={point.x}
                y2={point.y}
                className={`simx-connection-line simx-connection-${state}`}
                style={{
                  stroke: trafficColor,
                  opacity: state === "pending" ? 0.3 : 0.65,
                }}
              />

              {/* Outgoing traffic: switch -> computer */}
              <circle
                r="4"
                fill={trafficColor}
                className="simx-traffic-packet"
              >
                <animateMotion
                  dur={`${2.5 + (index % 4) * 0.6}s`}
                  repeatCount="indefinite"
                  path={`M 0 0 L ${dx} ${dy}`}
                />
              </circle>

              {/* Incoming traffic: computer -> switch */}
              <circle
                cx={point.x}
                cy={point.y}
                r="3.5"
                fill={trafficColor}
                className="simx-traffic-packet"
              >
                <animateMotion
                  dur={`${3 + (index % 3) * 0.7}s`}
                  repeatCount="indefinite"
                  path={`M 0 0 L ${-dx} ${-dy}`}
                />
              </circle>
            </g>
          );
        })}
      </svg>

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

      {systems.map((system, index) => (
        <ComputerNode
          key={system.id}
          system={system}
          position={positions[index]}
          selected={selectedId === system.id}
          onSelect={onSelect}
        />
      ))}

      <div className="simx-topology-caption">
        <Network size={14} />
        Prediction-driven network simulation · {systems.length} systems
      </div>
    </div>
  );
}
