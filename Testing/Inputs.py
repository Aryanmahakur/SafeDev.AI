import pandas as pd

d

# Get a real DDoS record
row = df[df["Label"] == "DDoS"].iloc[0]

# Remove Label
test_data = row.drop("Label").to_dict()

print("DDoS test input:")
print(test_data)