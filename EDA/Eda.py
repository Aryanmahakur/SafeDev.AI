from Original_Data_Set.Original_DataSet1 import loaddata1
from Original_Data_Set.Original_DataSet2 import loaddata2
from Original_Data_Set.Original_DataSet3 import loaddata3
from Original_Data_Set.Original_DataSet4 import loaddata4
from Original_Data_Set.Original_DataSet5 import loaddata5
from Original_Data_Set.Original_DataSet6 import loaddata6
from Original_Data_Set.Original_DataSet7 import loaddata7
from Original_Data_Set.Original_DataSet8 import loaddata8

def Eda_data_set1():

    df = loaddata2()

   
    df.columns = df.columns.str.strip()

    print("Shape:", df.shape)

    print("\nColumns:")
    print(list(df.columns))

    print("\nHead:")
    print(df.head())

    print("\nTail:")
    print(df.tail())

    print("\nSample:")
    print(df.sample(5))

    print("\nDimensions:", df.ndim)

    print("\nData Types:")
    print(df.dtypes)

    print("\nDescribe:")
    print(df.describe())

    print("\nInfo:")
    df.info()

    # ---------- DATA QUALITY CHECK ----------

    print("\nNull Values:")
    print(df.isnull().sum())

    print("\nNull Values Percentage:")
    print((df.isnull().sum() / len(df)) * 100)

    print("\nDuplicate Rows:")
    print(df.duplicated().sum())

    # ---------- CLEANING ----------

    # Drop rows with missing values
    df = df.dropna()

    # Drop exact duplicate rows
    df = df.drop_duplicates()

    print("\nShape After Cleaning:", df.shape)

    # ---------- FURTHER EDA ----------

    print("\nUnique Values:")
    print(df.nunique())

    print("\nLabel Unique Values:")
    print(df["Label"].unique())

    print("\nLabel Distribution:")
    print(df["Label"].value_counts())

    print("\nLabel Distribution Percentage:")
    print(df["Label"].value_counts(normalize=True) * 100)


Eda_data_set1()