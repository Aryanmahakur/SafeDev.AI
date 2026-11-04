
from threading import RLock
from copy import deepcopy

from Backend.predictor import predict_traffic

_systems = {}
_lock = RLock()


def initialize_systems(records):
    if len(records) != 10:
        raise ValueError("Exactly 10 records are required.")

    initialized = {}

    for index, record in enumerate(records, start=1):
        system_id = f"SYS-{index:02d}"

        features = deepcopy(record["features"])
        actual_label = record["actual_label"]

        prediction = predict_traffic(features)

        initialized[system_id] = {
            "system_id": system_id,
            "features": features,
            "actual_label": actual_label,
            **prediction
        }

    with _lock:
        _systems.clear()
        _systems.update(initialized)

    return get_all_systems()


def get_all_systems():
    with _lock:
        return deepcopy(list(_systems.values()))


def get_system(system_id):
    with _lock:
        system = _systems.get(system_id)

        return deepcopy(system) if system else None


def predict_system_input(system_id, features):
    """
    Predict traffic without modifying shared simulation data.
    """

    with _lock:
        if system_id not in _systems:
            raise ValueError("System not found.")

    prediction = predict_traffic(features)

    return {
        "system_id": system_id,
        "features": deepcopy(features),
        "actual_label": None,
        **prediction
    }
