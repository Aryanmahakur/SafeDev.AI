from Src.Spliting import Split
from Src.Encoding import Encode_Y
from Src.BaseModel_LightGbm import basemodel

import pandas as pd
import joblib
import os


def train_base_model():

    print("1. Loading dataset...")

    df = pd.read_csv(
        r"C:\Users\ARYAN MAHAKUR\Desktop\VS CODE\SAFEDEV.AI\ProcessedDataSet.csv"
    )

    print("2. Splitting data...")

    x_train, x_test, y_train, y_test = Split(df)

    print("3. Encoding target...")

    y_train, y_test, encoder = Encode_Y(y_train, y_test)

    print("4. Training LightGBM...")

    model = basemodel(
        x_train,
        y_train,
        x_test,
        y_test
    )

    print("5. Saving model and encoder...")

    os.makedirs("Models", exist_ok=True)

    # Save LightGBM model
    joblib.dump(
        model,
        "Models/lightgbm_model.joblib"
    )

    # Save LabelEncoder
    joblib.dump(
        encoder,
        "Models/label_encoder.pkl"
    )

    print("LightGBM model saved.")
    print("Label encoder saved.")

    print("\nClass Mapping:")

    for i, label in enumerate(encoder.classes_):
        print(f"{i} -> {label}")


if __name__ == "__main__":
    train_base_model()