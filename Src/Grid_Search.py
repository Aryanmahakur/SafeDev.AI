from lightgbm import LGBMClassifier
from sklearn.model_selection import GridSearchCV


def gridsearch(x_train, y_train):

    # Base LightGBM model
    model = LGBMClassifier(
        class_weight="balanced"
    )

    # Hyperparameter combinations
    param_grid = {
        "n_estimators": [200, 500],
        "learning_rate": [0.05, 0.1],
        "num_leaves": [31, 63],
        "max_depth": [-1, 10],
        "min_child_samples": [20, 50]
    }

    # Grid Search
    grid = GridSearchCV(
        estimator=model,
        param_grid=param_grid,
        scoring="f1_macro",
        cv=3,
        n_jobs=-1,
        verbose=2
    )

    # Train all parameter combinations
    grid.fit(x_train, y_train)

    # Display best result
    print("Best Parameters:")
    print(grid.best_params_)

    print("Best Macro F1:")
    print(grid.best_score_)

    # Return already-trained best LightGBM model
    return grid.best_estimator_