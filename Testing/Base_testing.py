

from Src.Spliting import Split
from Src.Encoding import Encode_Y
from Src.BaseModel_LightGbm import basemodel
from Testing.Evaluation import evaluate_model
from Src.Pca import tune_pca
import pandas as pd


def basetesting():

    print("1. Loading dataset...")

    df = pd.read_csv(
        r"C:\Users\ARYAN MAHAKUR\Desktop\VS CODE\SAFEDEV.AI\ProcessedDataSet.csv"
    )

    print("2. Splitting data...")

    x_train, x_test, y_train, y_test = Split(df)

    print("3. Encoding target...")

    y_train, y_test = Encode_Y(y_train, y_test)

    print("4. Applying PCA...")

    x_train_pca, x_test_pca, pca = tune_pca(
        x_train,
        x_test,
        n_components=10
    )

    print("5. Training base model...")

    model, y_pred = basemodel(
        x_train_pca,
        y_train,
        x_test_pca,
        y_test
    )

    print("6. Evaluating model...")

    evaluate_model(y_test, y_pred)

    print("7. Complete!")


if __name__ == "__main__":
    basetesting()