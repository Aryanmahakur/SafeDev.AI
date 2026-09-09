import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import OriginalDataSet
df = OriginalDataSet.loadDataset()




plt.figure(figsize=(10, 5))
sns.countplot(data=df, x="Attack Type")
plt.title("Attack Type Distribution")
plt.xlabel("Attack Type")
plt.ylabel("Number of Samples")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()


percentages = df["Attack Type"].value_counts(normalize=True) * 100

plt.figure(figsize=(10, 5))
sns.barplot(x=percentages.index, y=percentages.values)
plt.title("Attack Type Distribution (%)")
plt.xlabel("Attack Type")
plt.ylabel("Percentage")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()




plt.figure(figsize=(8, 8))
df["Attack Type"].value_counts().plot(
    kind="pie",
    autopct="%1.1f%%"
)
plt.title("Attack Type Percentage")
plt.ylabel("")
plt.show()



numeric_cols = df.select_dtypes(include=np.number).columns

for col in numeric_cols[:10]:
    plt.figure(figsize=(8, 4))
    sns.histplot(data=df, x=col, kde=True)
    plt.title(f"Distribution of {col}")
    plt.xlabel(col)
    plt.ylabel("Frequency")
    plt.tight_layout()
    plt.show()


for col in numeric_cols[:10]:
    plt.figure(figsize=(8, 3))
    sns.boxplot(data=df, x=col)
    plt.title(f"Boxplot of {col}")
    plt.xlabel(col)
    plt.tight_layout()
    plt.show()



corr = df.select_dtypes(include=np.number).corr()

plt.figure(figsize=(16, 12))
sns.heatmap(corr, cmap="coolwarm")
plt.title("Feature Correlation Heatmap")
plt.tight_layout()
plt.show()


important_features = [
    "Flow Duration",
    "Total Fwd Packets",
    "Total Backward Packets",
    "Total Length of Fwd Packets",
    "Total Length of Bwd Packets"
]

for col in important_features:
    plt.figure(figsize=(10, 5))
    sns.boxplot(data=df, x="Attack Type", y=col)
    plt.title(f"{col} by Attack Type")
    plt.xlabel("Attack Type")
    plt.ylabel(col)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()




sample_df = df.sample(min(10000, len(df)), random_state=42)

plt.figure(figsize=(10, 6))
sns.scatterplot(
    data=sample_df,
    x="Total Fwd Packets",
    y="Total Backward Packets",
    hue="Attack Type"
)
plt.title("Forward vs Backward Packets by Attack Type")
plt.tight_layout()
plt.show()




top_features = [
    "Flow Duration",
    "Total Fwd Packets",
    "Total Backward Packets",
    "Total Length of Fwd Packets",
    "Total Length of Bwd Packets"
]

plt.figure(figsize=(8, 6))
sns.heatmap(
    df[top_features].corr(),
    annot=True,
    cmap="coolwarm"
)
plt.title("Correlation Between Important Features")
plt.tight_layout()
plt.show()




pairplot_df = df[
    [
        "Flow Duration",
        "Total Fwd Packets",
        "Total Backward Packets",
        "Attack Type"
    ]
].sample(min(5000, len(df)), random_state=42)

sns.pairplot(
    pairplot_df,
    hue="Attack Type"
)
plt.show()