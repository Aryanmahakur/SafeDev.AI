import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split

def Train_Test_Split(df):

    Y = df["Label"]

    df.drop(columns=["Label"], inplace=True)

    X = df

    x_train, x_test, y_train, y_test = train_test_split(
        X, Y,
        random_state=42,
        test_size=0.2,
        stratify=Y
    )

    return x_train, x_test, y_train, y_test