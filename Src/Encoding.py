from sklearn.preprocessing import LabelEncoder

def Encode_Y(y_train, y_test):

    encoder = LabelEncoder()

    y_train = encoder.fit_transform(y_train)
    y_test = encoder.transform(y_test)

    return y_train, y_test 
Encode_Y()