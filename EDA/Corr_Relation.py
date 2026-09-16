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
def corr_Reletion():

    df = loaddata1()
    df.columns = df.columns.str.strip()

    corr = df.corr(numeric_only=True)

    upper = corr.where(
        np.triu(np.ones(corr.shape), k=1).astype(bool)
    )

    print(upper[abs(upper) >= 0.90].stack())
corr_Reletion()