# SafeDev.AI | Network Threat Detector

**An Intelligent Network Intrusion Detection System Using Machine Learning**

## Overview

SafeDev.AI is a machine learning-based network intrusion detection project designed to analyze network traffic and identify potential cyber threats. The system leverages network flow characteristics from the CICIDS2017 dataset to distinguish benign activities from malicious traffic and classify different categories of cyberattacks.

By combining data preprocessing, feature engineering, and supervised machine learning algorithms, the project aims to develop an effective approach to automated network threat identification and classification.

## Key Highlights

- **Network Traffic Analysis:** Processes network flow data to identify suspicious traffic patterns.
- **Multi-Class Classification:** Distinguishes normal traffic from multiple cyberattack categories.
- **Data Preprocessing:** Includes data cleaning, feature transformation, and preparation for model training.
- **Machine Learning:** Implements classification algorithms, including LightGBM.
- **Model Evaluation:** Assesses performance using accuracy, precision, recall, F1-score, and other evaluation metrics.

## Dataset

**CICIDS2017 – Canadian Institute for Cybersecurity**

The project uses the CICIDS2017 benchmark dataset, containing labeled network traffic records representing benign activities and various types of cyberattacks.

## Attack Categories

| Category | Description |
|---|---|
| Normal Traffic | Legitimate network activity |
| DoS | Denial of Service |
| DDoS | Distributed Denial of Service |
| Port Scanning | Network reconnaissance |
| Brute Force | Unauthorized access attempts |
| Web Attacks | Web-based malicious activities |
| Bots | Botnet-related traffic |

## Technology Stack

- **Programming Language:** Python
- **Data Processing:** Pandas, NumPy
- **Machine Learning:** Scikit-learn, LightGBM
- **Data Visualization:** Matplotlib, Seaborn
- **Development Environment:** Jupyter Notebook

## Project Goal

The primary goal of SafeDev.AI is to explore the application of machine learning in modern cybersecurity by developing a system that can recognize malicious network behavior, classify potential threats, and support network intrusion detection through data-driven analysis.

---

*SafeDev.AI – Applying Machine Learning to Network Security.*