
import pandas as pd
import joblib


def test_model():

    try:
        # ==========================================
        # 1. LOAD SAVED MODEL
        # ==========================================

        saved_model = joblib.load(
            "Models/lightgbm_model.joblib"
        )

        # Model is stored inside a tuple
        model = saved_model[0]

        encoder = joblib.load(
            "Models/label_encoder.pkl"
        )

        print("Model loaded successfully.")
        print("Encoder loaded successfully.")

        # ==========================================
        # 2. USER INPUT
        # ==========================================

        test_data = {
    'Destination Port': 80,
    'Flow Duration': 682575,
    'Total Fwd Packets': 3,
    'Total Backward Packets': 5,
    'Total Length of Fwd Packets': 26,
    'Total Length of Bwd Packets': 11607,
    'Fwd Packet Length Max': 20,
    'Fwd Packet Length Min': 0,
    'Fwd Packet Length Mean': 8.666667,
    'Fwd Packet Length Std': 10.2632,
    'Bwd Packet Length Max': 10135,
    'Bwd Packet Length Min': 0,
    'Bwd Packet Length Mean': 2321.4,
    'Bwd Packet Length Std': 4413.202,
    'Flow Bytes/s': 17042.82,
    'Flow Packets/s': 11.72032,
    'Flow IAT Mean': 97510.71,
    'Flow IAT Std': 257484,
    'Flow IAT Max': 681429,
    'Flow IAT Min': 1,
    'Fwd IAT Total': 1047,
    'Fwd IAT Mean': 523.5,
    'Fwd IAT Std': 738.9266,
    'Fwd IAT Max': 1046,
    'Fwd IAT Min': 1,
    'Bwd IAT Total': 682523,
    'Bwd IAT Mean': 170630.8,
    'Bwd IAT Std': 340532.5,
    'Bwd IAT Max': 681429,
    'Bwd IAT Min': 4,
    'Fwd PSH Flags': 0,
    'Fwd URG Flags': 0,
    'Fwd Header Length': 72,
    'Bwd Header Length': 112,
    'Fwd Packets/s': 4.395121,
    'Bwd Packets/s': 7.325202,
    'Min Packet Length': 0,
    'Max Packet Length': 10135,
    'Packet Length Mean': 1292.556,
    'Packet Length Std': 3350.635,
    'Packet Length Variance': 11200000,
    'FIN Flag Count': 0,
    'SYN Flag Count': 0,
    'RST Flag Count': 0,
    'PSH Flag Count': 1,
    'ACK Flag Count': 0,
    'URG Flag Count': 0,
    'CWE Flag Count': 0,
    'ECE Flag Count': 0,
    'Down/Up Ratio': 1,
    'Average Packet Size': 1454.125,
    'Avg Fwd Segment Size': 8.666667,
    'Avg Bwd Segment Size': 2321.4,
    'Fwd Header Length.1': 72,
    'Subflow Fwd Packets': 3,
    'Subflow Fwd Bytes': 26,
    'Subflow Bwd Packets': 5,
    'Subflow Bwd Bytes': 11607,
    'Init_Win_bytes_forward': 8192,
    'Init_Win_bytes_backward': 229,
    'act_data_pkt_fwd': 2,
    'min_seg_size_forward': 20,
    'Active Mean': 0,
    'Active Std': 0,
    'Active Max': 0,
    'Active Min': 0,
    'Idle Mean': 0,
    'Idle Std': 0,
    'Idle Max': 0,
    'Idle Min': 0
}
        # ==========================================
        # 3. CREATE DATAFRAME
        # ==========================================

        X = pd.DataFrame([test_data])

        # ==========================================
        # 4. NORMALIZE COLUMN NAMES
        # ==========================================

        X.columns = (
            X.columns
            .str.strip()
            .str.replace(" ", "_", regex=False)
        )

        # ==========================================
        # 5. GET MODEL FEATURES
        # ==========================================

        if hasattr(model, "feature_name_"):
            features = list(model.feature_name_)

        elif hasattr(model, "feature_name"):
            features = list(model.feature_name())

        else:
            raise ValueError(
                "Cannot retrieve feature names from model."
            )

        # ==========================================
        # 6. CHECK MISSING FEATURES
        # ==========================================

        missing_features = [
            col for col in features
            if col not in X.columns
        ]

        extra_features = [
            col for col in X.columns
            if col not in features
        ]

        if missing_features:
            print("\nMissing Features:")
            print(missing_features)

            raise ValueError(
                "Input features do not match model features."
            )

        if extra_features:
            print("\nExtra Features:")
            print(extra_features)

        # Arrange columns in exact model order
        X = X[features]

        print("\nInput shape:", X.shape)
        print("Expected features:", len(features))

        # ==========================================
        # 7. PREDICTION
        # ==========================================

        prediction = model.predict(X)

        predicted_class = encoder.inverse_transform(
            prediction.astype(int)
        )

        # ==========================================
        # 8. DISPLAY RESULT
        # ==========================================

        print("\n================================")
        print("         MODEL PREDICTION")
        print("================================")

        print("Encoded Prediction :", prediction[0])
        print("Predicted Class     :", predicted_class[0])

        print("================================")

    except Exception as e:

        print("\nERROR OCCURRED:")
        print(type(e).__name__, ":", e)


if __name__ == "__main__":
    test_model()
