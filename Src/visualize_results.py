
import os
import warnings
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.manifold import TSNE

warnings.filterwarnings("ignore")

# =====================================================
# 1. PROJECT PATHS
# =====================================================

# Script is inside SAFEDEV.AI/Src
# Move one directory up to SAFEDEV.AI
ROOT = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

DATASET = os.path.join(ROOT, "ProcessedDataSet.csv")

X_TRAIN = os.path.join(ROOT, "X_train_pca.npy")
X_TEST = os.path.join(ROOT, "X_test_pca.npy")

PCA_MODEL = os.path.join(
    ROOT, "Models", "pca_model.joblib"
)

OUTPUT = os.path.join(
    ROOT,
    "Interface",
    "public",
    "visualizations"
)

os.makedirs(OUTPUT, exist_ok=True)

sns.set_theme(style="darkgrid")

plt.rcParams.update({
    "figure.facecolor": "#0b0b0b",
    "axes.facecolor": "#111111",
    "axes.edgecolor": "#444444",
    "axes.labelcolor": "#eeeeee",
    "text.color": "#eeeeee",
    "xtick.color": "#cccccc",
    "ytick.color": "#cccccc"
})


# =====================================================
# 2. LOAD PCA ARRAYS
# =====================================================

print("\n[1/6] Loading PCA arrays...")

if not os.path.exists(X_TRAIN):
    raise FileNotFoundError(f"Missing file: {X_TRAIN}")

if not os.path.exists(X_TEST):
    raise FileNotFoundError(f"Missing file: {X_TEST}")

X_train = np.load(X_TRAIN)
X_test = np.load(X_TEST)

X_pca = np.vstack((X_train, X_test))

print("Training shape:", X_train.shape)
print("Testing shape:", X_test.shape)
print("Combined shape:", X_pca.shape)


# =====================================================
# 3. PCA 2D SCATTER VISUALIZATION
# =====================================================

print("\n[2/6] Generating PCA scatter plot...")

if X_pca.shape[1] < 2:
    print("PCA needs at least two components for 2D visualization.")
else:

    # Use a sample for a readable graph
    rng = np.random.default_rng(42)

    sample_size = min(20000, len(X_pca))

    indices = rng.choice(
        len(X_pca),
        size=sample_size,
        replace=False
    )

    X_pca_plot = X_pca[indices]

    plt.figure(figsize=(12, 8))

    sns.scatterplot(
        x=X_pca_plot[:, 0],
        y=X_pca_plot[:, 1],
        s=8,
        alpha=0.55,
        color="#ff8a24",
        edgecolor=None
    )

    plt.title(
        "PCA - Network Traffic Visualization",
        fontsize=17,
        fontweight="bold"
    )

    plt.xlabel("Principal Component 1")
    plt.ylabel("Principal Component 2")

    plt.tight_layout()

    plt.savefig(
        os.path.join(OUTPUT, "pca_2d.png"),
        dpi=220,
        bbox_inches="tight"
    )

    plt.close()


# =====================================================
# 4. PCA EXPLAINED VARIANCE AND SCREE PLOT
# =====================================================

print("\n[3/6] Generating PCA variance graphs...")

if os.path.exists(PCA_MODEL):

    pca = joblib.load(PCA_MODEL)

    if isinstance(pca, tuple):
        pca = pca[0]

    if hasattr(pca, "explained_variance_ratio_"):

        variance = pca.explained_variance_ratio_

        components = np.arange(1, len(variance) + 1)

        # Individual explained variance
        plt.figure(figsize=(11, 6))

        sns.barplot(
            x=components,
            y=variance * 100,
            color="#ff8a24"
        )

        plt.title(
            "PCA - Explained Variance by Component",
            fontsize=16,
            fontweight="bold"
        )

        plt.xlabel("Principal Component")
        plt.ylabel("Explained Variance (%)")

        plt.tight_layout()

        plt.savefig(
            os.path.join(OUTPUT, "pca_scree_plot.png"),
            dpi=220,
            bbox_inches="tight"
        )

        plt.close()

        # Cumulative explained variance
        cumulative = np.cumsum(variance) * 100

        plt.figure(figsize=(11, 6))

        sns.lineplot(
            x=components,
            y=cumulative,
            marker="o",
            color="#ff8a24",
            linewidth=2
        )

        plt.title(
            "PCA - Cumulative Explained Variance",
            fontsize=16,
            fontweight="bold"
        )

        plt.xlabel("Number of Principal Components")
        plt.ylabel("Cumulative Explained Variance (%)")

        plt.ylim(0, 105)
        plt.tight_layout()

        plt.savefig(
            os.path.join(OUTPUT, "pca_cumulative_variance.png"),
            dpi=220,
            bbox_inches="tight"
        )

        plt.close()

        print(
            "Total explained variance:",
            round(cumulative[-1], 2),
            "%"
        )

    else:
        print("PCA object does not contain explained variance.")

else:
    print("PCA model not found. Skipping variance graphs.")


# =====================================================
# 5. t-SNE VISUALIZATION
# =====================================================

print("\n[4/6] Preparing t-SNE...")

# t-SNE is expensive on large datasets.
# Use a representative sample of PCA-reduced records.

tsne_size = min(5000, len(X_pca))

rng = np.random.default_rng(42)

tsne_indices = rng.choice(
    len(X_pca),
    size=tsne_size,
    replace=False
)

X_tsne_input = X_pca[tsne_indices]

print("t-SNE input shape:", X_tsne_input.shape)
print("Running t-SNE. Please wait...")

tsne = TSNE(
    n_components=2,
    perplexity=30,
    learning_rate="auto",
    init="pca",
    max_iter=1000,
    random_state=42
)

X_tsne = tsne.fit_transform(X_tsne_input)

plt.figure(figsize=(12, 8))

sns.scatterplot(
    x=X_tsne[:, 0],
    y=X_tsne[:, 1],
    s=9,
    alpha=0.6,
    color="#ff8a24",
    edgecolor=None
)

plt.title(
    "t-SNE - Network Traffic Cluster Visualization",
    fontsize=17,
    fontweight="bold"
)

plt.xlabel("t-SNE Dimension 1")
plt.ylabel("t-SNE Dimension 2")

plt.tight_layout()

plt.savefig(
    os.path.join(OUTPUT, "tsne_2d.png"),
    dpi=220,
    bbox_inches="tight"
)

plt.close()


# =====================================================
# 6. ORIGINAL DATASET CLASS DISTRIBUTION
# =====================================================

print("\n[5/6] Generating class distribution...")

if not os.path.exists(DATASET):
    raise FileNotFoundError(f"Missing dataset: {DATASET}")

class_counts = {}

for chunk in pd.read_csv(
    DATASET,
    usecols=["Label"],
    chunksize=100000
):

    counts = chunk["Label"].astype(str).value_counts()

    for label, count in counts.items():
        class_counts[label] = (
            class_counts.get(label, 0) + int(count)
        )

counts_series = pd.Series(class_counts).sort_values()

plt.figure(figsize=(13, 8))

sns.barplot(
    x=counts_series.values,
    y=counts_series.index,
    color="#ff8a24"
)

plt.title(
    "Network Traffic Class Distribution",
    fontsize=17,
    fontweight="bold"
)

plt.xlabel("Number of Records")
plt.ylabel("Traffic Class")

plt.tight_layout()

plt.savefig(
    os.path.join(OUTPUT, "class_distribution.png"),
    dpi=220,
    bbox_inches="tight"
)

plt.close()


# =====================================================
# 7. FEATURE CORRELATION HEATMAP
# =====================================================

print("\n[6/6] Generating feature correlation heatmap...")

df_sample = pd.read_csv(
    DATASET,
    nrows=20000,
    low_memory=False
)

numeric = df_sample.select_dtypes(
    include=np.number
)

# Use up to 20 numerical features
numeric = numeric.iloc[:, :20]

correlation = numeric.corr()

plt.figure(figsize=(15, 11))

sns.heatmap(
    correlation,
    cmap="coolwarm",
    center=0,
    annot=False,
    linewidths=0.3
)

plt.title(
    "Network Traffic Feature Correlation",
    fontsize=17,
    fontweight="bold"
)

plt.tight_layout()

plt.savefig(
    os.path.join(OUTPUT, "feature_correlation.png"),
    dpi=220,
    bbox_inches="tight"
)

plt.close()


# =====================================================
# 8. FINISHED
# =====================================================

print("\n" + "=" * 55)
print("ALL AVAILABLE VISUALIZATIONS GENERATED")
print("=" * 55)

print("\nSaved files:")

for filename in sorted(os.listdir(OUTPUT)):
    print("  ", filename)

print("\nOutput directory:")
print(OUTPUT)

print("\nNote:")
print("PCA and t-SNE scatter plots are unlabelled.")
print("Class distribution uses the complete original dataset.")
print("No model training was performed.")

import os
from pathlib import Path
import warnings

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.metrics import silhouette_score


# ==========================================================
# 1. CONFIGURATION
# ==========================================================

ROOT = Path(__file__).resolve().parent.parent

DATASET_PATH = ROOT / "ProcessedDataSet.csv"

OUTPUT_DIR = (
    ROOT / "Interface" / "public" / "visualizations"
)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

LABEL_COLUMN = "Label"

CHUNK_SIZE = 100_000
SAMPLES_PER_CLASS = 300
CANDIDATES_PER_CHUNK = 300

RANDOM_STATE = 42
PCA_COMPONENTS = 10

rng = np.random.default_rng(RANDOM_STATE)

sns.set_theme(style="whitegrid", context="notebook")

plt.rcParams["figure.facecolor"] = "#111111"
plt.rcParams["axes.facecolor"] = "#111111"
plt.rcParams["axes.labelcolor"] = "white"
plt.rcParams["text.color"] = "white"
plt.rcParams["xtick.color"] = "white"
plt.rcParams["ytick.color"] = "white"
plt.rcParams["axes.edgecolor"] = "#666666"


# ==========================================================
# 2. CHECK DATASET
# ==========================================================

print("\n[1/8] Checking dataset...")

if not DATASET_PATH.exists():
    raise FileNotFoundError(
        f"Dataset not found: {DATASET_PATH}"
    )

print("Dataset:", DATASET_PATH)


# ==========================================================
# 3. READ DATASET IN CHUNKS
#    Count all records and collect a balanced sample
# ==========================================================

print("\n[2/8] Reading dataset in chunks...")

class_counts = {}
candidate_samples = {}

feature_columns = None

for chunk_number, chunk in enumerate(
    pd.read_csv(
        DATASET_PATH,
        chunksize=CHUNK_SIZE
    )
):

    chunk.columns = chunk.columns.str.strip()

    if LABEL_COLUMN not in chunk.columns:
        raise ValueError(
            f"Missing target column: {LABEL_COLUMN}"
        )

    if feature_columns is None:
        feature_columns = [
            col for col in chunk.columns
            if col != LABEL_COLUMN
        ]

    chunk[LABEL_COLUMN] = (
        chunk[LABEL_COLUMN]
        .astype(str)
        .str.strip()
    )

    # Count the complete dataset
    counts = chunk[LABEL_COLUMN].value_counts()

    for label, count in counts.items():
        class_counts[label] = (
            class_counts.get(label, 0) + int(count)
        )

    # Collect a sample from each class
    for label, group in chunk.groupby(LABEL_COLUMN):

        sample_size = min(
            CANDIDATES_PER_CHUNK,
            len(group)
        )

        sample = group.sample(
            n=sample_size,
            random_state=RANDOM_STATE
        )

        candidate_samples.setdefault(
            label, []
        ).append(sample)

    if (chunk_number + 1) % 5 == 0:
        print(
            f"Processed {chunk_number + 1} chunks"
        )


# ==========================================================
# 4. CREATE BALANCED VISUALIZATION DATASET
# ==========================================================

print("\n[3/8] Creating balanced visualization sample...")

balanced_parts = []

for label, samples in candidate_samples.items():

    combined = pd.concat(
        samples,
        ignore_index=True
    )

    selected = combined.sample(
        n=min(SAMPLES_PER_CLASS, len(combined)),
        random_state=RANDOM_STATE
    )

    balanced_parts.append(selected)

visual_data = pd.concat(
    balanced_parts,
    ignore_index=True
)

visual_data = visual_data.sample(
    frac=1,
    random_state=RANDOM_STATE
).reset_index(drop=True)

y = visual_data[LABEL_COLUMN].astype(str)

X = visual_data[feature_columns].copy()

# Convert features into numeric values
X = X.apply(
    pd.to_numeric,
    errors="coerce"
)

# Replace infinite values
X = X.replace(
    [np.inf, -np.inf],
    np.nan
)

# Remove completely empty columns
X = X.dropna(
    axis=1,
    how="all"
)

# Remove constant columns
X = X.loc[
    :, X.nunique(dropna=True) > 1
]

# Fill missing values using median
X = X.fillna(
    X.median()
)

if X.empty:
    raise ValueError(
        "No usable numeric features were found."
    )

if y.nunique() < 2:
    raise ValueError(
        "At least two traffic classes are required."
    )

print("Original feature count:", len(feature_columns))
print("Usable feature count:", X.shape[1])
print("Visualization sample:", X.shape)
print("Traffic classes:", y.nunique())


# ==========================================================
# 5. STANDARDIZE FEATURES
# ==========================================================

print("\n[4/8] Standardizing features...")

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

print("Scaled data shape:", X_scaled.shape)


# ==========================================================
# 6. PCA
# ==========================================================

print("\n[5/8] Applying PCA...")

n_components = min(
    PCA_COMPONENTS,
    X_scaled.shape[1],
    X_scaled.shape[0]
)

pca = PCA(
    n_components=n_components,
    random_state=RANDOM_STATE
)

X_pca = pca.fit_transform(X_scaled)

class_order = sorted(y.unique())

palette = sns.color_palette(
    "husl",
    n_colors=len(class_order)
)

class_palette = dict(
    zip(class_order, palette)
)

# Encode class labels for metric calculation
encoder = LabelEncoder()

y_encoded = encoder.fit_transform(y)


# ==========================================================
# CHART 1: PCA 2D SCATTER PLOT
# ==========================================================

print("Generating PCA 2D plot...")

pca_plot = pd.DataFrame({
    "PC1": X_pca[:, 0],
    "PC2": X_pca[:, 1],
    "Traffic Class": y.values
})

fig, ax = plt.subplots(figsize=(14, 9))

sns.scatterplot(
    data=pca_plot,
    x="PC1",
    y="PC2",
    hue="Traffic Class",
    hue_order=class_order,
    palette=class_palette,
    s=20,
    alpha=0.7,
    linewidth=0,
    ax=ax
)

ax.set_title(
    "PCA: Network Traffic Class Separation",
    fontsize=17,
    pad=18
)

ax.set_xlabel(
    "Principal Component 1",
    fontsize=12
)

ax.set_ylabel(
    "Principal Component 2",
    fontsize=12
)

ax.legend(
    title="Traffic Class",
    bbox_to_anchor=(1.02, 1),
    loc="upper left",
    fontsize=8
)

fig.text(
    0.5,
    0.01,
    "Each point represents one traffic record. "
    "Colours identify its original dataset label.",
    ha="center",
    fontsize=10
)

plt.tight_layout(rect=[0, 0.04, 0.83, 1])

plt.savefig(
    OUTPUT_DIR / "pca_2d_labelled.png",
    dpi=300,
    bbox_inches="tight"
)

plt.close()


# ==========================================================
# CHART 2: PCA SCREE PLOT
# ==========================================================

print("Generating PCA scree plot...")

explained = pca.explained_variance_ratio_ * 100

fig, ax = plt.subplots(figsize=(11, 6))

bars = ax.bar(
    range(1, len(explained) + 1),
    explained,
    color="#f28c28",
    edgecolor="white"
)

ax.bar_label(
    bars,
    fmt="%.2f%%",
    padding=4,
    fontsize=9
)

ax.set_title(
    "PCA Scree Plot: Variance per Component",
    fontsize=16
)

ax.set_xlabel("Principal Component Number")
ax.set_ylabel("Explained Variance (%)")

ax.text(
    0.02,
    0.95,
    "Meaning: Shows how much data variance "
    "each component captures.",
    transform=ax.transAxes,
    fontsize=10,
    va="top"
)

plt.tight_layout()

plt.savefig(
    OUTPUT_DIR / "pca_scree_plot.png",
    dpi=300
)

plt.close()


# ==========================================================
# CHART 3: PCA CUMULATIVE VARIANCE
# ==========================================================

print("Generating cumulative variance plot...")

cumulative = np.cumsum(explained)

fig, ax = plt.subplots(figsize=(11, 6))

ax.plot(
    range(1, len(cumulative) + 1),
    cumulative,
    marker="o",
    linewidth=2.5,
    color="#ff922e"
)

ax.axhline(
    95,
    linestyle="--",
    color="#22c55e",
    label="95% variance reference"
)

ax.set_title(
    "PCA: Cumulative Explained Variance",
    fontsize=16
)

ax.set_xlabel("Number of Principal Components")
ax.set_ylabel("Cumulative Explained Variance (%)")

ax.set_ylim(0, 105)

ax.legend(title="Reference")

ax.text(
    0.02,
    0.82,
    f"{n_components} components retain "
    f"{cumulative[-1]:.2f}% variance",
    transform=ax.transAxes,
    fontsize=11
)

plt.tight_layout()

plt.savefig(
    OUTPUT_DIR / "pca_cumulative_variance.png",
    dpi=300
)

plt.close()


# ==========================================================
# CHART 4: FEATURE DIMENSION REDUCTION
# ==========================================================

print("Generating dimensionality reduction chart...")

stages = [
    "Original features",
    "PCA components",
    "PCA visualization",
    "t-SNE visualization"
]

dimensions = [
    X.shape[1],
    n_components,
    2,
    2
]

fig, ax = plt.subplots(figsize=(11, 6))

bars = ax.bar(
    stages,
    dimensions,
    color=[
        "#777777",
        "#f28c28",
        "#22a06b",
        "#4c91e2"
    ],
    width=0.55
)

ax.bar_label(
    bars,
    labels=[str(v) for v in dimensions],
    padding=5,
    fontsize=12
)

ax.set_title(
    "Network Traffic Feature Dimensionality Reduction",
    fontsize=16
)

ax.set_ylabel("Number of Dimensions / Components")

ax.text(
    0.02,
    0.92,
    f"Original: {X.shape[1]} features\n"
    f"PCA: {n_components} components\n"
    "PCA plot: first 2 components\n"
    "t-SNE: 2D output from PCA components",
    transform=ax.transAxes,
    fontsize=10,
    va="top"
)

plt.tight_layout()

plt.savefig(
    OUTPUT_DIR / "feature_reduction_comparison.png",
    dpi=300
)

plt.close()


# ==========================================================
# CHART 5: t-SNE 2D SCATTER PLOT
# ==========================================================

print("\nRunning t-SNE...")

# t-SNE receives PCA-reduced data, not all raw features
tsne_input = X_pca

perplexity = min(
    30,
    max(2, (len(tsne_input) - 1) // 3)
)

tsne = TSNE(
    n_components=2,
    perplexity=perplexity,
    learning_rate="auto",
    init="pca",
    max_iter=1000,
    random_state=RANDOM_STATE
)

X_tsne = tsne.fit_transform(tsne_input)

tsne_plot = pd.DataFrame({
    "t-SNE Dimension 1": X_tsne[:, 0],
    "t-SNE Dimension 2": X_tsne[:, 1],
    "Traffic Class": y.values
})

print("Generating t-SNE plot...")

fig, ax = plt.subplots(figsize=(14, 9))

sns.scatterplot(
    data=tsne_plot,
    x="t-SNE Dimension 1",
    y="t-SNE Dimension 2",
    hue="Traffic Class",
    hue_order=class_order,
    palette=class_palette,
    s=20,
    alpha=0.7,
    linewidth=0,
    ax=ax
)

ax.set_title(
    "t-SNE: Network Traffic Cluster Visualization",
    fontsize=17,
    pad=18
)

ax.set_xlabel("t-SNE Dimension 1")
ax.set_ylabel("t-SNE Dimension 2")

ax.legend(
    title="Traffic Class",
    bbox_to_anchor=(1.02, 1),
    loc="upper left",
    fontsize=8
)

fig.text(
    0.5,
    0.01,
    "Nearby points represent records with similar local "
    "neighbourhood structure in the embedding.",
    ha="center",
    fontsize=10
)

plt.tight_layout(rect=[0, 0.04, 0.83, 1])

plt.savefig(
    OUTPUT_DIR / "tsne_2d_labelled.png",
    dpi=300,
    bbox_inches="tight"
)

plt.close()


# ==========================================================
# CHART 6: COMPLETE DATASET CLASS DISTRIBUTION
# ==========================================================

print("Generating class distribution...")

distribution = pd.Series(
    class_counts
).sort_values(ascending=True)

fig, ax = plt.subplots(figsize=(13, 8))

bars = ax.barh(
    distribution.index,
    distribution.values,
    color="#f28c28"
)

ax.set_xscale("log")

ax.set_title(
    "CICIDS2017: Network Traffic Class Distribution",
    fontsize=16
)

ax.set_xlabel(
    "Number of Records (Logarithmic Scale)"
)

ax.set_ylabel("Traffic Class")

ax.text(
    0.02,
    0.96,
    "Meaning: A logarithmic scale makes minority "
    "attack classes visible despite class imbalance.",
    transform=ax.transAxes,
    va="top",
    fontsize=10
)

plt.tight_layout()

plt.savefig(
    OUTPUT_DIR / "class_distribution.png",
    dpi=300
)

plt.close()


# ==========================================================
# CHART 7: FEATURE CORRELATION HEATMAP
# ==========================================================

print("Generating feature correlation heatmap...")

# Select 15 features with highest variance
top_features = (
    X.var()
    .sort_values(ascending=False)
    .head(min(15, X.shape[1]))
    .index
)

correlation = X[top_features].corr()

fig, ax = plt.subplots(figsize=(14, 11))

sns.heatmap(
    correlation,
    cmap="coolwarm",
    center=0,
    vmin=-1,
    vmax=1,
    annot=True,
    fmt=".2f",
    linewidths=0.4,
    annot_kws={"size": 7},
    ax=ax
)

ax.set_title(
    "Network Traffic Feature Correlation",
    fontsize=16,
    pad=15
)

plt.tight_layout()

plt.savefig(
    OUTPUT_DIR / "feature_correlation_heatmap.png",
    dpi=300
)

plt.close()


# ==========================================================
# CHART 8: CLUSTER SEPARATION COMPARISON
# ==========================================================

print("Calculating silhouette scores...")

# Use the same true class labels for both representations
# Sample up to 2500 records to control computation time

metric_sample_size = min(
    2500,
    len(y_encoded)
)

metric_indices = rng.choice(
    len(y_encoded),
    size=metric_sample_size,
    replace=False
)

metric_labels = y_encoded[metric_indices]

if len(np.unique(metric_labels)) < 2:
    raise ValueError(
        "Not enough classes for silhouette evaluation."
    )

pca_silhouette = silhouette_score(
    X_pca[metric_indices, :2],
    metric_labels
)

tsne_silhouette = silhouette_score(
    X_tsne[metric_indices],
    metric_labels
)

print("PCA silhouette:", pca_silhouette)
print("t-SNE silhouette:", tsne_silhouette)

scores = [
    pca_silhouette,
    tsne_silhouette
]

fig, ax = plt.subplots(figsize=(9, 6))

bars = ax.bar(
    ["PCA 2D", "t-SNE 2D"],
    scores,
    color=["#f28c28", "#3989d8"],
    width=0.5
)

ax.bar_label(
    bars,
    fmt="%.4f",
    padding=5,
    fontsize=11
)

ax.axhline(
    0,
    color="white",
    linewidth=0.8
)

ax.set_title(
    "PCA vs t-SNE: Silhouette Score Comparison",
    fontsize=15
)

ax.set_ylabel("Silhouette Score")
ax.set_ylim(-1, 1)

ax.text(
    0.02,
    0.96,
    "Higher scores indicate better separation "
    "and compactness for the supplied class labels.",
    transform=ax.transAxes,
    fontsize=9,
    va="top"
)

plt.tight_layout()

plt.savefig(
    OUTPUT_DIR / "cluster_separation_comparison.png",
    dpi=300
)

plt.close()


# ==========================================================
# 9. SAVE NUMERICAL EVALUATION REPORT
# ==========================================================

report_path = OUTPUT_DIR / "visualization_report.txt"

with open(report_path, "w", encoding="utf-8") as file:

    file.write(
        "NETWORK TRAFFIC DIMENSIONALITY REDUCTION REPORT\n"
    )

    file.write("=" * 55 + "\n\n")

    file.write(
        f"Complete dataset records: {sum(class_counts.values())}\n"
    )

    file.write(
        f"Original feature count: {len(feature_columns)}\n"
    )

    file.write(
        f"Usable numeric features: {X.shape[1]}\n"
    )

    file.write(
        f"Visualization sample size: {len(X)}\n"
    )

    file.write(
        f"Traffic classes: {y.nunique()}\n\n"
    )

    file.write("PCA RESULTS\n")
    file.write("-" * 30 + "\n")

    for i, variance in enumerate(explained, start=1):
        file.write(
            f"PC{i}: {variance:.4f}%\n"
        )

    file.write(
        f"\nCumulative explained variance: "
        f"{cumulative[-1]:.4f}%\n"
    )

    file.write("\nCLUSTER SEPARATION\n")
    file.write("-" * 30 + "\n")

    file.write(
        f"PCA 2D silhouette score: "
        f"{pca_silhouette:.4f}\n"
    )

    file.write(
        f"t-SNE 2D silhouette score: "
        f"{tsne_silhouette:.4f}\n"
    )

    file.write(
        f"\nMetric sample size: {metric_sample_size}\n"
    )

    file.write(
        "\nIMPORTANT INTERPRETATION:\n"
        "Silhouette scores were calculated using the "
        "known dataset labels in each 2D representation.\n"
        "t-SNE changes distances and density, so its "
        "silhouette score should be interpreted cautiously.\n"
        "These scores are exploratory visualization metrics, "
        "not LightGBM classification metrics.\n"
    )


# ==========================================================
# 10. FINAL SUMMARY
# ==========================================================

print("\n" + "=" * 60)
print("ALL PROJECT VISUALIZATIONS GENERATED")
print("=" * 60)

print("\nGenerated charts:")

for file in sorted(OUTPUT_DIR.glob("*.png")):
    print(" -", file.name)

print("\nEvaluation report:")
print(report_path)

print("\nPCA explained variance:", round(cumulative[-1], 2), "%")

print("PCA silhouette score:", round(pca_silhouette, 4))
print("t-SNE silhouette score:", round(tsne_silhouette, 4))

print("\nOutput folder:")
print(OUTPUT_DIR)

print("\nNo LightGBM model was trained or modified.")
