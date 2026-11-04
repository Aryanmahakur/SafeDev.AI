
import os
from pathlib import Path
from threading import Lock

import pandas as pd
from huggingface_hub import hf_hub_download

from Backend.system_manager import initialize_systems


# ==========================================
# CONFIGURATION
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_PATH = BASE_DIR / "ProcessedDataSet.csv"

HF_REPO_ID = "AryanMahakur/SafeDev.ai"
HF_FILENAME = "ProcessedDataSet.csv"

SYSTEM_COUNT = 10
SAMPLES_PER_CLASS = 100

_records = {}
_positions = {}
_lock = Lock()


# ==========================================
# DOWNLOAD DATASET FROM HUGGING FACE
# ==========================================

def ensure_dataset():

    if DATASET_PATH.exists():
        print("Dataset already exists locally.")
        return str(DATASET_PATH)

    token = os.getenv("HF_TOKEN")

    print("HF_TOKEN configured:", bool(token))
    print(
        "HF_TOKEN prefix valid:",
        bool(token and token.startswith("hf_"))
    )

    if not token:
        raise RuntimeError(
            "HF_TOKEN environment variable is missing."
        )

    if not token.startswith("hf_"):
        raise RuntimeError(
            "HF_TOKEN does not appear to be a valid Hugging Face token."
        )

    print("Downloading dataset from Hugging Face...")

    downloaded_path = hf_hub_download(
        repo_id=HF_REPO_ID,
        filename=HF_FILENAME,
        repo_type="dataset",
        token=token
    )

    print(f"Dataset downloaded successfully: {downloaded_path}")

    return downloaded_path


# ==========================================
# LOAD TRAFFIC SAMPLES
# ==========================================

def load_traffic_samples():

    global _records, _positions

    dataset_path = ensure_dataset()

    samples = {}

    print("Loading traffic samples...")

    for chunk in pd.read_csv(
        dataset_path,
        chunksize=20000
    ):

        for label, group in chunk.groupby("Label"):

            if label not in samples:
                samples[label] = []

            remaining = SAMPLES_PER_CLASS - len(samples[label])

            if remaining <= 0:
                continue

            selected = group.head(remaining)

            for _, row in selected.iterrows():

                features = row.drop(labels=["Label"]).to_dict()

                samples[label].append({
                    "features": features,
                    "actual_label": str(label)
                })

        attack_classes = [
            label
            for label, records in samples.items()
            if label != "BENIGN" and len(records) >= 2
        ]

        if (
            len(samples.get("BENIGN", [])) >= SAMPLES_PER_CLASS
            and len(attack_classes) >= 2
        ):
            break

    if len(samples.get("BENIGN", [])) < 8:
        raise ValueError("Not enough BENIGN records.")

    attack_classes = [
        label
        for label, records in samples.items()
        if label != "BENIGN" and records
    ]

    if len(attack_classes) < 2:
        raise ValueError(
            "At least two attack classes are required."
        )

    with _lock:

        _records = samples

        _positions = {
            label: 0
            for label in samples
        }

    print("Traffic samples loaded successfully.")

    return {
        "available_classes": list(samples.keys()),
        "sample_counts": {
            label: len(records)
            for label, records in samples.items()
        }
    }


# ==========================================
# GET NEXT TRAFFIC RECORD
# ==========================================

def next_record(label):

    with _lock:

        records = _records.get(label, [])

        if not records:
            raise ValueError(
                f"No samples available for {label}"
            )

        position = _positions[label]

        record = records[position % len(records)]

        _positions[label] += 1

        return record


# ==========================================
# START SIMULATION
# ==========================================

def start_simulation():

    if not _records:
        load_traffic_samples()

    attack_classes = [
        label
        for label in _records
        if label != "BENIGN"
    ]

    if len(attack_classes) < 2:
        raise ValueError(
            "At least two attack classes are required."
        )

    selected = [
        next_record("BENIGN")
        for _ in range(8)
    ]

    selected.append(next_record(attack_classes[0]))
    selected.append(next_record(attack_classes[1]))

    if len(selected) != SYSTEM_COUNT:
        raise ValueError(
            "Simulation must initialize exactly 10 systems."
        )

    return initialize_systems(selected)
