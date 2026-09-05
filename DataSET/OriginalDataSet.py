import numpy as np
import pandas as pd

def loadDataset():
    a = pd.read_csv(r"c:\Users\ARYAN MAHAKUR\Downloads\archive (6)\cicids2017_cleaned.csv")
    print(a.shape)

loadDataset()