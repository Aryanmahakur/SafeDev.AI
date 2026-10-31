
import pandas as pd
import requests

df = pd.read_csv(
    r"ProcessedDataSet.csv",
    nrows=1
)

features = df.drop(columns=["Label"]).iloc[0].to_dict()

response = requests.post(
    "http://127.0.0.1:8000/predict",
    json={
        "system_id": "SYS-01",
        "features": features
    },
    timeout=5
)

print("HTTP Status:", response.status_code)
print("API Response:", response.json())
print("Actual Label:", df["Label"].iloc[0])
