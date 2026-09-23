import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from Original_DataSet1 import loaddata1
from Original_DataSet2 import loaddata2
from Original_DataSet3 import loaddata3
from Original_DataSet4 import loaddata4
from Original_DataSet5 import loaddata5
from Original_DataSet6 import loaddata6
from Original_DataSet7 import loaddata7
from Original_DataSet8 import loaddata8


def concatenateall():

    df1 = loaddata1()
    df2 = loaddata2()
    df3 = loaddata3()
    df4 = loaddata4()
    df5 = loaddata5()
    df6 = loaddata6()
    df7 = loaddata7()
    df8 = loaddata8()

    # Concatenate all datasets
    df = pd.concat(
        [df1, df2, df3, df4, df5, df6, df7, df8],
        ignore_index=True
    )

    print("Concatenated Dataset Shape:", df.shape)

    # Check label distribution
    print("\nLabel Distribution:")
    print(df[" Label"].value_counts())

    # Save concatenated dataset
    df.to_csv(
        r"C:\Users\ARYAN MAHAKUR\Desktop\VS CODE\SAFEDEV.AI\ConcatenatedDataSet.csv",
        index=False
    )

    print("\nConcatenated dataset saved successfully!")

    return df


concatenateall()a