import OriginalDataSet
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
df = OriginalDataSet.loadDataset()

def loadSample(df):
   print("Shape:")
   print(df.shape)

   print("\nColumn Names:")
   print(df.columns)

   print("\nDimensions:")
   print(df.ndim)

   print("\nFirst 5 Rows:")
   print(df.head())

   print("\nLast 5 Rows:")
   print(df.tail())
g
   print("\nData Types:")
   print(df.dtypes)

   print("\nTotal Missing Values:")
   print(df.isnull().sum().sum())

   print("\nDuplicates Before Removing:")
   print(df.duplicated().sum())

   df.drop_duplicates(inplace=True)

   print("\nDuplicates After Removing:")
   print(df.duplicated().sum())

corr_matrix = df.corr(numeric_only=True).abs()


upper = corr_matrix.where(
    np.triu(np.ones(corr_matrix.shape), k=1).astype(bool)
)


high_corr = upper.stack().sort_values(ascending=False)


print("Highly Correlated Feature Pairs:")
print(high_corr[high_corr > 0.90])
loadSample(df)