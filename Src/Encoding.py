from sklearn.preprocessing import LabelEncoder

def Encode_Y(y_train, y_test):

    encoder = LabelEncoder()

    y_train = encoder.fit_transform(y_train)
    y_test = encoder.transform(y_test)

    print("Classes:", encoder.classes_)

    for i, label in enumerate(encoder.classes_):
        print(i, "->", label)

    return y_train, y_test, encoder