import OriginalDataSet

df = OriginalDataSet.loadDataset()

def loadSample(df):
     print(df.shape)
     print(df.columns)
     print(df.ndim)
     print(df.head())
     print(df.tail())
     print(df.dtypes)
     print(df.isnull().sum().sum())
     print(df.duplicated().sum().sum())
loadSample(df)