from Src.Grid_Search import gridsearch


def gridsearchm(x_train, y_train, x_test):

    # Run Grid Search and get the best trained LightGBM model
    model = gridsearch(x_train, y_train)

    # Make predictions using the best model
    y_pred = model.predict(x_test)

    return model, y_pred