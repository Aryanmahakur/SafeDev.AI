
"use client";

import Link from "next/link";
import { Monitor, ArrowUpRight } from "lucide-react";

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

export default function ComputerNode({
  system,
  position,
  selected = false,
  onSelect,
}) {
  const state = getSystemState(system);

  const statusText =
    state === "normal"
      ? "NORMAL TRAFFIC"
      : state === "attack"
        ? "ATTACK DETECTED"
        : "AWAITING PREDICTION";

  return (
    <Link
      href={`/simulation/${system.id}`}
      className={`simx-node simx-node--${state} ${
        selected ? "simx-node-selected" : ""
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        "--node-status-color":
          state === "normal"
            ? "#22c55e"
            : state === "attack"
              ? "#ef4444"
              : "#888888",
      }}
      onMouseEnter={() => onSelect?.(system.id)}
      onMouseLeave={() => onSelect?.(null)}
      onFocus={() => onSelect?.(system.id)}
      onBlur={() => onSelect?.(null)}
      aria-label={`Open ${system.id} monitoring details. ${statusText}`}
    >
      <span className="simx-node-icon">
        <Monitor size={23} />
        <span className="simx-node-pulse" />
      </span>

      <span className="simx-node-id">{system.id}</span>
      <span className="simx-node-role">{system.role}</span>

      <span className="simx-node-preview">
        <strong>{system.name}</strong>
        <span>{system.role}</span>

        <span className="simx-preview-status">
          <i />
          {statusText}
        </span>

        {system.prediction && (
          <span className="simx-preview-prediction">
            Prediction: {system.prediction}
          </span>
        )}

        <span className="simx-preview-action">
          View system <ArrowUpRight size={13} />
        </span>
      </span>
    </Link>
  );
}
