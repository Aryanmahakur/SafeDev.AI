from Original_Data_Set.Original_DataSet1 import loaddata1
from Original_Data_Set.Original_DataSet2 import loaddata2
from Original_Data_Set.Original_DataSet3 import loaddata3
from Original_Data_Set.Original_DataSet4 import loaddata4
from Original_Data_Set.Original_DataSet5 import loaddata5
from Original_Data_Set.Original_DataSet6 import loaddata6
from Original_Data_Set.Original_DataSet7 import loaddata7
from Original_Data_Set.Original_DataSet8 import loaddata8

import seaborn as sns
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


def corr_matrix():

    df = loaddata1()

    # Remove extra spaces from column names
    df.columns = df.columns.str.strip()

    # Correlation matrix
    corr = df.corr(numeric_only=True)

    # Heatmap
    plt.figure(figsize=(15, 10))
    sns.heatmap(corr, cmap="coolwarm")
    plt.title("Correlation Matrix")
    plt.show()


corr_matrix()