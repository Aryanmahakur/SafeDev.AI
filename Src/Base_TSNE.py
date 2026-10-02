from sklearn.manifold import TSNE
import matplotlib.pyplot as plt


def apply_tsne(X, y, n_components=2, perplexity=30,
               learning_rate="auto", max_iter=1000,
               random_state=42):

    tsne = TSNE(
        n_components=n_components,
        perplexity=perplexity,
        learning_rate=learning_rate,
        max_iter=max_iter,
        random_state=random_state
    )

    X_tsne = tsne.fit_transform(X)

    plt.figure(figsize=(10, 7))
    plt.scatter(
        X_tsne[:, 0],
        X_tsne[:, 1],
        c=y,
        s=5,
        alpha=0.6
    )

    plt.xlabel("t-SNE 1")
    plt.ylabel("t-SNE 2")
    plt.title("t-SNE Visualization")
    plt.colorbar(label="Attack Type")
    plt.show()