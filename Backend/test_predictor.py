
import pandas as pd

from predictor import predict_traffic

DATASET_PATH = (
    r"C:\Users\ARYAN MAHAKUR\Desktop\VS CODE"
    r"\SAFEDEV.AI\ProcessedDataSet.csv"
)

# Read one complete record
df = pd.read_csv(DATASET_PATH, nrows=1)

# Separate model inputs from the actual label
features = df.drop(columns=["Label"]).iloc[0].to_dict()

# Predict
result = predict_traffic(features)

print("\n--- LIGHTGBM PREDICTION ---")
print(result)

print("\nActual dataset label:", df["Label"].iloc[0])
