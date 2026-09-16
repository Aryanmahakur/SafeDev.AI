from Original_Data_Set.Original_DataSet1 import loaddata1
from Original_Data_Set.Original_DataSet2 import loaddata2
from Original_Data_Set.Original_DataSet3 import loaddata3
from Original_Data_Set.Original_DataSet4 import loaddata4
from Original_Data_Set.Original_DataSet5 import loaddata5
from Original_Data_Set.Original_DataSet6 import loaddata6
from Original_Data_Set.Original_DataSet7 import loaddata7
from Original_Data_Set.Original_DataSet8 import loaddata8
def Eda_data_set1():

    df = loaddata1()

    print("Shape:", df.shape)
    print("Columns:", list(df.columns))
    print("Head:")
    print(df.head())
    print("Tail:")
    print(df.tail())
    print("Sample:")
    print(df.sample(5))
    print("Dimensions:", df.ndim)
    print("Data Types:")
    print(df.dtypes)
    print("Describe:")
    print(df.describe())
    print("Info:")
    print(df.info())
    print("Null Values:")
    print(df.isnull().sum())
    print("Duplicate Rows:", df.duplicated().sum())
    print(df[' Label'].unique())

Eda_data_set1()