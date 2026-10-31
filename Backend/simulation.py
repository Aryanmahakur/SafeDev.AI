
from pathlib import Path
from threading import Lock

import pandas as pd

from Backend.system_manager import initialize_systems, update_system


BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_PATH = BASE_DIR / "ProcessedDataSet.csv"

SYSTEM_COUNT = 10

# Keep only a small sample in memory, not the entire 2.5M-row CSV.
SAMPLES_PER_CLASS = 100

_records = {}
_positions = {}
_lock = Lock()


def load_traffic_samples():
    """
    Stream the dataset in chunks and collect representative
    traffic records for each class.
    """

    global _records, _positions

    samples = {}

    for chunk in pd.read_csv(DATASET_PATH, chunksize=20000):

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

        # Stop once we have enough BENIGN records and
        # samples from at least two attack classes.
        attack_classes = [
            label for label, records in samples.items()
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
        label for label, records in samples.items()
        if label != "BENIGN" and records
    ]

    if len(attack_classes) < 2:
        raise ValueError("At least two attack classes are required.")

    with _lock:
        _records = samples
        _positions = {label: 0 for label in samples}

    return {
        "available_classes": list(samples.keys()),
        "sample_counts": {
            label: len(records)
            for label, records in samples.items()
        }
    }


def next_record(label):
    with _lock:
        records = _records.get(label, [])

        if not records:
            raise ValueError(f"No samples available for {label}")

        position = _positions[label]
        record = records[position % len(records)]
        _positions[label] += 1

        return record


def start_simulation():
    if not _records:
        load_traffic_samples()

    attack_classes = [
        label for label in _records
        if label != "BENIGN"
    ]

    selected = [
        next_record("BENIGN")
        for _ in range(8)
    ]

    selected.append(next_record(attack_classes[0]))
    selected.append(next_record(attack_classes[1]))

    return initialize_systems(selected)

def advance_system(system_id, label):
    record = next_record(label)

    result = update_system(
        system_id,
        record["features"],
        actual_label=record["actual_label"]
    )

    return result