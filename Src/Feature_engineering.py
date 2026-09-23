import pandas as pd
import numpy as np

def feature_engineering():

    df = pd.read_csv(
        r"C:\Users\ARYAN MAHAKUR\Desktop\VS CODE\SAFEDEV.AI\ProcessedDataSet.csv"
    )
    print(df.shape)

    eps = 1e-6

    df["Total Packets"] = (
        df["Total Fwd Packets"] +
        df["Total Backward Packets"]
    )

    df["Total Bytes"] = (
        df["Total Length of Fwd Packets"] +
        df["Total Length of Bwd Packets"]
    )

    df["Packet Ratio"] = (
        df["Total Fwd Packets"] /
        (df["Total Backward Packets"] + eps)
    )

    df["Byte Ratio"] = (
        df["Total Length of Fwd Packets"] /
        (df["Total Length of Bwd Packets"] + eps)
    )

    df["Packet Difference"] = (
        df["Total Fwd Packets"] -
        df["Total Backward Packets"]
    )

    df["Byte Difference"] = (
        df["Total Length of Fwd Packets"] -
        df["Total Length of Bwd Packets"]
    )

    df["Avg Packet Length Ratio"] = (
        df["Avg Fwd Segment Size"] /
        (df["Avg Bwd Segment Size"] + eps)
    )

    df["Packets per Duration"] = (
        df["Total Packets"] /
        (df["Flow Duration"] + eps)
    )

    df["Bytes per Duration"] = (
        df["Total Bytes"] /
        (df["Flow Duration"] + eps)
    )

    df["Flow Efficiency"] = (
        df["Flow Bytes/s"] /
        (df["Flow Packets/s"] + eps)
    )

    df["Fwd Byte per Packet"] = (
        df["Total Length of Fwd Packets"] /
        (df["Total Fwd Packets"] + eps)
    )

    df["Bwd Byte per Packet"] = (
        df["Total Length of Bwd Packets"] /
        (df["Total Backward Packets"] + eps)
    )

    df["Fwd IAT Range"] = (
        df["Fwd IAT Max"] -
        df["Fwd IAT Min"]
    )

    df["Bwd IAT Range"] = (
        df["Bwd IAT Max"] -
        df["Bwd IAT Min"]
    )

    df["Flow IAT Range"] = (
        df["Flow IAT Max"] -
        df["Flow IAT Min"]
    )

    df["Active Range"] = (
        df["Active Max"] -
        df["Active Min"]
    )

    df["Idle Range"] = (
        df["Idle Max"] -
        df["Idle Min"]
    )

    df["Header Ratio"] = (
        df["Fwd Header Length"] /
        (df["Bwd Header Length"] + eps)
    )

    df["Packet Length Range"] = (
        df["Max Packet Length"] -
        df["Min Packet Length"]
    )

    df["Bidirectional Balance"] = (
        df["Total Backward Packets"] /
        (df["Total Packets"] + eps)
    )

    df = df.replace([np.inf, -np.inf], 0)

    print("Original Shape:", df.shape)
    print("New Features Added:", 20)
    print("Final Shape:", df.shape)

    df.to_csv(
        r"C:\Users\ARYAN MAHAKUR\Desktop\VS CODE\SAFEDEV.AI\ModelTrainingDataSet.csv",
        index=False
    )
    finaldf=pd.read_csv(r"C:\Users\ARYAN MAHAKUR\Desktop\VS CODE\SAFEDEV.AI\ModelTrainingDataSet.csv")
    print(df.shape)
    print("ModelTrainingDataSet.csv saved successfully!")


feature_engineering()