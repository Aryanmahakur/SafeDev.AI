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

      {/* Network connections and animated traffic */}
      <svg
        className="simx-connections"
        viewBox="0 0 900 520"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <filter
            id="green-packet-glow"
            x="-300%"
            y="-300%"
            width="700%"
            height="700%"
          >
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {nodes.map(({ system, position, state }, index) => {
          const x = position.x * 9;
          const y = position.y * 5.2;

          const trafficColor =
            state === "normal"
              ? "#22c55e"
              : state === "attack"
                ? "#ef4444"
                : "#888888";

          const pathId = `network-path-${index}`;

          const path = `M 450 260 L ${x} ${y}`;

          return (
            <g key={system.id}>

              {/* Original connection line */}
              <line
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

              {/* Invisible path used by moving packets */}
              {state === "normal" && (
                <>
                  <path
                    id={pathId}
                    d={path}
                    fill="none"
                  />

                  {/* Green packet: switch to computer */}
                  <circle
                    r="4"
                    fill="#22c55e"
                    filter="url(#green-packet-glow)"
                  >
                    <animateMotion
                      dur={`${2.8 + (index % 3) * 0.5}s`}
                      repeatCount="indefinite"
                      path={path}
                      begin={`${index * 0.18}s`}
                    />
                  </circle>

                  {/* Green packet: computer to switch */}
                  <circle
                    r="4"
                    fill="#22c55e"
                    filter="url(#green-packet-glow)"
                  >
                    <animateMotion
                      dur={`${3.2 + (index % 3) * 0.5}s`}
                      repeatCount="indefinite"
                      path={`M ${x} ${y} L 450 260`}
                      begin={`${index * 0.18 + 1.4}s`}
                    />
                  </circle>

                  {/* Smaller trailing packet */}
                  <circle
                    r="2.5"
                    fill="#86efac"
                    filter="url(#green-packet-glow)"
                  >
                    <animateMotion
                      dur={`${3.5 + (index % 3) * 0.5}s`}
                      repeatCount="indefinite"
                      path={path}
                      begin={`${index * 0.18 + 1.2}s`}
                    />
                  </circle>
                </>
              )}

            </g>
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