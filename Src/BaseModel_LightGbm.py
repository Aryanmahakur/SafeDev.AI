from lightgbm import LGBMClassifier, log_evaluation


def basemodel(x_train, y_train, x_test, y_test):

    print("Starting LightGBM training...")

    model = LGBMClassifier(
        n_estimators=300,
        learning_rate=0.05,
        num_leaves=31,
        max_depth=-1,
        min_child_samples=30,
        subsample=0.8,
        class_weight="balanced",
        colsample_bytree=0.8,
        reg_alpha=0.1,
        reg_lambda=0.1,
        random_state=42,
        n_jobs=-1
    )

    model.fit(
        x_train,
        y_train,
        callbacks=[log_evaluation(10)]
    )

    print("LightGBM training completed.")

    y_pred = model.predict(x_test)

    print("Prediction completed.")

    return model, y_pred