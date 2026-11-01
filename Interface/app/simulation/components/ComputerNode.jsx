
"use client";

import Link from "next/link";
import { Monitor } from "lucide-react";

function getSystemState(system) {
  if (
    system.is_attack ||
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

  const statusColor =
    state === "attack"
      ? "#ff4545"
      : state === "normal"
        ? "#20d878"
        : "#a5a5a5";

  return (
    <Link
      href={`/simulation/${system.id}`}
      className={`simx-node simx-node--${state} ${
        selected ? "simx-node-selected" : ""
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        "--node-status-color": statusColor,
      }}
      onClick={() => onSelect?.(system.id)}
      aria-label={`Open ${system.name}`}
    >
      <span className="simx-node-icon">
        <Monitor size={23} />
        <span className="simx-node-pulse" />
      </span>

      <span className="simx-node-id">
        {system.id}
      </span>

      <span className="simx-node-role">
        {system.role}
      </span>
    </Link>
  );
}
