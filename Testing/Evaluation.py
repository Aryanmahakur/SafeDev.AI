from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix
)

from datetime import datetime
import os


def evaluate_model(y_test, y_pred):

    accuracy = accuracy_score(y_test, y_pred)

    precision = precision_score(
        y_test,
        y_pred,
        average="weighted",
        zero_division=0
    )

    recall = recall_score(
        y_test,
        y_pred,
        average="weighted",
        zero_division=0
    )

    f1 = f1_score(
        y_test,
        y_pred,
        average="weighted",
        zero_division=0
    )

    report = classification_report(
        y_test,
        y_pred,
        zero_division=0
    )

    matrix = confusion_matrix(y_test, y_pred)

    file_path = "Evaluation_Results.txt"

    if os.path.exists(file_path):

        with open(file_path, "r") as file:
            content = file.read()

        run_number = content.count("========== Run") + 1

    else:
        run_number = 1

    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(file_path, "a") as file:

        file.write(f"\n========== Run {run_number} ==========\n")
        file.write(f"Date & Time: {current_time}\n")
        file.write("----------------------------------------\n")

        file.write(f"Accuracy:  {accuracy:.6f}\n")
        file.write(f"Precision: {precision:.6f}\n")
        file.write(f"Recall:    {recall:.6f}\n")
        file.write(f"F1 Score:  {f1:.6f}\n\n")

        file.write("Classification Report:\n")
        file.write(report)

        file.write("\nConfusion Matrix:\n")
        file.write(str(matrix))

        file.write("\n========================================\n")