
import re
import joblib
import numpy as np
import pandas as pd

from pathlib import Path


# --------------------------------------------------
# PATHS
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "Models" / "lightgbm_model.joblib"
ENCODER_PATH = BASE_DIR / "Models" / "label_encoder.pkl"


# --------------------------------------------------
# LOAD MODEL ONCE
# --------------------------------------------------

saved_model = joblib.load(MODEL_PATH)

model = saved_model[0]
encoder = joblib.load(ENCODER_PATH)

MODEL_FEATURES = model.feature_name_


# --------------------------------------------------
# FEATURE NAME NORMALIZATION
# --------------------------------------------------

def normalize_feature_name(name):
    """
    Makes differently formatted feature names comparable.

    Example:
    TotalFwd Packets  -> totalfwdpackets
    Total_Fwd_Packets -> totalfwdpackets
    """

    return re.sub(r"[^a-zA-Z0-9]", "", str(name)).lower()


MODEL_FEATURE_MAP = {
    normalize_feature_name(feature): feature
    for feature in MODEL_FEATURES
}


if len(MODEL_FEATURE_MAP) != len(MODEL_FEATURES):
    raise ValueError("Duplicate normalized model feature names detected.")


# --------------------------------------------------
# PREDICTION FUNCTION
# --------------------------------------------------

def predict_traffic(features: dict):

    if not isinstance(features, dict):
        raise ValueError("Features must be supplied as a dictionary.")

    normalized_inputs = {}

    for key, value in features.items():

        normalized_key = normalize_feature_name(key)

        if normalized_key in normalized_inputs:
            raise ValueError(f"Duplicate feature supplied: {key}")

        normalized_inputs[normalized_key] = value

    expected_keys = set(MODEL_FEATURE_MAP.keys())
    supplied_keys = set(normalized_inputs.keys())

    missing = expected_keys - supplied_keys
    unexpected = supplied_keys - expected_keys

    if missing:
        raise ValueError(
            f"Missing model features: {sorted(missing)}"
        )

    if unexpected:
        raise ValueError(
            f"Unexpected features: {sorted(unexpected)}"
        )

    # Arrange features in the exact order expected by LightGBM
    ordered_values = []

    for feature in MODEL_FEATURES:

        normalized_key = normalize_feature_name(feature)
        value = normalized_inputs[normalized_key]

        if value is None:
            raise ValueError(f"{feature} cannot be null.")

        try:
            numeric_value = float(value)
        except (TypeError, ValueError):
            raise ValueError(f"{feature} must be numeric.")

        if not np.isfinite(numeric_value):
            raise ValueError(f"{feature} must be finite.")

        ordered_values.append(numeric_value)

    X = pd.DataFrame(
        [ordered_values],
        columns=MODEL_FEATURES
    )

    # Actual model prediction
    prediction = model.predict(X)

    predicted_index = int(prediction[0])

    predicted_class = encoder.inverse_transform(
        np.array([predicted_index])
    )[0]

    is_normal = predicted_class == "BENIGN"

    return {
        "prediction": str(predicted_class),
        "status": "NORMAL" if is_normal else "ATTACK",
        "color": "green" if is_normal else "red",
        "is_attack": not is_normal
    }


# --------------------------------------------------
# MODEL INFORMATION
# --------------------------------------------------

def get_model_info():

    return {
        "model": type(model).__name__,
        "feature_count": len(MODEL_FEATURES),
        "classes": encoder.classes_.tolist()
    }
