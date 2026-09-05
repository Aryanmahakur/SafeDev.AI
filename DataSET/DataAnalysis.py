import OriginalDataSet

df = OriginalDataSet.loadDataset()

def loadSample(df):
    print(df.columns.tolist())

loadSample(df)