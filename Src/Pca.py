import numpy as np
from sklearn.decomposition import PCA


def tune_pca(
    X_train,
    X_test,
    n_components=10,
    svd_solver="auto",
    whiten=False,
    tol=0.0,
    random_state=42
):

    pca = PCA(
        n_components=n_components,
        svd_solver=svd_solver,
        whiten=whiten,
        tol=tol,
        random_state=random_state
    )

    X_train_pca = pca.fit_transform(X_train)
    X_test_pca = pca.transform(X_test)

    np.save("X_train_pca.npy", X_train_pca)
    np.save("X_test_pca.npy", X_test_pca)

    explained_variance = pca.explained_variance_ratio_
    total_variance = explained_variance.sum()

    with open("PCA_Details.txt", "w") as file:

        file.write("========== PCA DIMENSIONALITY REDUCTION ==========\n\n")

        file.write("Original Data:\n")
        file.write(f"Training Shape: {X_train.shape}\n")
        file.write(f"Testing Shape: {X_test.shape}\n")
        file.write(f"Original Features: {X_train.shape[1]}\n\n")

        file.write("PCA Parameters:\n")
        file.write(f"Number of Components: {n_components}\n")
        file.write(f"SVD Solver: {svd_solver}\n")
        file.write(f"Whiten: {whiten}\n")
        file.write(f"Tolerance: {tol}\n")
        file.write(f"Random State: {random_state}\n\n")

        file.write("Reduced Data:\n")
        file.write(f"Training Shape: {X_train_pca.shape}\n")
        file.write(f"Testing Shape: {X_test_pca.shape}\n")
        file.write(f"Reduced Features: {X_train_pca.shape[1]}\n\n")

        file.write("Explained Variance Ratio:\n")

        for i, value in enumerate(explained_variance, start=1):
            file.write(
                f"PC{i}: {value:.6f} ({value * 100:.4f}%)\n"
            )

        file.write("\n")
        file.write(
            f"Total Explained Variance: "
            f"{total_variance:.6f} "
            f"({total_variance * 100:.4f}%)\n"
        )

        file.write(
            f"Variance Lost: "
            f"{1 - total_variance:.6f} "
            f"({(1 - total_variance) * 100:.4f}%)\n"
        )

        file.write("\n")
        file.write("===============================================\n")

    return X_train_pca, X_test_pca, pca