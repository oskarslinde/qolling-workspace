# MLS-C01 Granular Topic Checklist

Each row is an atomic authoring target. `Max questions` uses the shared 3/5/8/10 policy; `Collection signal` is populated only after direct question mapping.

| ID | Topic / item | Boundary | Max questions | Collection signal |
| --- | --- | --- | ---: | --- |
| 1.1.01 | ML data repositories | S3, databases, EFS, EBS, repository selection, and data access patterns. | 8 | |
| 1.1.02 | Data formats and partitioning | File formats, compression, partitioning, and data-lake organization. | 5 | |
| 1.2.01 | Batch and streaming ingestion | Batch versus streaming requirements and service selection. | 8 | |
| 1.2.02 | Streaming ingestion services | Kinesis Data Streams, Firehose, Flink, and event processing. | 8 | |
| 1.2.03 | Ingestion orchestration and scheduling | Glue, Step Functions, EventBridge, scheduling, and retries. | 8 | |
| 1.3.01 | ETL and transformation services | Glue, EMR, Batch, and service trade-offs. | 8 | |
| 1.3.02 | Distributed transformation frameworks | Hadoop, Spark, Hive, MapReduce, and scale trade-offs. | 8 | |
| 2.1.01 | Missing, corrupt, and duplicate data | Detection and preparation strategies. | 8 | |
| 2.1.02 | Data normalization, scaling, and formatting | Feature scaling and formatting choices. | 5 | |
| 2.1.03 | Labels and data-labeling workflows | Ground Truth, labeling quality, and representative labels. | 8 | |
| 2.1.04 | Text and image preparation | Stop words, tokenization, augmentation, and modality preparation. | 8 | |
| 2.2.01 | Categorical and synthetic features | One-hot encoding, binning, and derived features. | 8 | |
| 2.2.02 | Outliers and dimensionality reduction | Outlier treatment, PCA, and feature-space trade-offs. | 8 | |
| 2.2.03 | Feature extraction by modality | Text, image, speech, and time-series features. | 8 | |
| 2.3.01 | Descriptive statistics and distributions | Summary statistics, histograms, box plots, and interpretation. | 8 | |
| 2.3.02 | Correlation, p-values, and visualization | Correlation analysis, statistical significance, and graph selection. | 8 | |
| 2.3.03 | Cluster and time-series analysis | Elbow method, cluster visualization, and temporal patterns. | 5 | |
| 3.1.01 | ML problem framing | ML suitability, requirements, data availability, and success criteria. | 8 | |
| 3.1.02 | Supervised problem types | Classification, regression, forecasting, and labeling. | 8 | |
| 3.1.03 | Unsupervised and recommendation problems | Clustering, anomaly detection, recommendation, and segmentation. | 8 | |
| 3.1.04 | Foundation-model problem fit | FM/LLM use cases versus classical ML. | 5 | |
| 3.2.01 | Linear, logistic, and tree models | Regression, classification, trees, and random forests. | 8 | |
| 3.2.02 | XGBoost, ensembles, and k-means | Model characteristics and selection trade-offs. | 8 | |
| 3.2.03 | Deep-learning architectures | CNNs, RNNs, transformers, and modality fit. | 8 | |
| 3.2.04 | Transfer learning and pretrained models | Reuse, adaptation, and model-source trade-offs. | 5 | |
| 3.3.01 | Dataset splits and cross-validation | Train/validation/test separation and leakage prevention. | 8 | |
| 3.3.02 | Optimization and loss | Gradient descent, convergence, loss functions, and learning behavior. | 8 | |
| 3.3.03 | Compute and distributed training | CPU/GPU, instances, Spot, distributed training, and Spark. | 8 | |
| 3.3.04 | Retraining and training pipelines | Repeatability, retraining triggers, and pipeline design. | 8 | |
| 3.4.01 | Regularization and dropout | L1/L2, dropout, overfit mitigation, and trade-offs. | 8 | |
| 3.4.02 | Neural-network hyperparameters | Layers, nodes, initialization, batch size, and learning rate. | 8 | |
| 3.4.03 | Tree and search optimization | Tree parameters, search methods, and tuning workflow. | 8 | |
| 3.5.01 | Classification metrics | Accuracy, precision, recall, F1, ROC/AUC, and confusion matrices. | 10 | |
| 3.5.02 | Regression and model comparison | RMSE, error analysis, A/B tests, and comparison design. | 8 | |
| 3.5.03 | Bias, variance, overfit, and underfit | Diagnostic patterns and corrective actions. | 8 | |
| 4.1.01 | Performance, scaling, and availability | Auto Scaling, load balancing, instance rightsizing, and capacity. | 8 | |
| 4.1.02 | Resilience and fault tolerance | Multi-AZ/Region, containers, AMIs, backups, and recovery. | 8 | |
| 4.1.03 | Logging, monitoring, and observability | Metrics, logs, alarms, and operational diagnosis. | 8 | |
| 4.2.01 | SageMaker model development options | Built-in algorithms, custom models, notebooks, and features. | 8 | |
| 4.2.02 | Endpoint and inference selection | Real-time, batch, asynchronous, serverless, and multi-model endpoints. | 8 | |
| 4.2.03 | ML service cost and quotas | Instance types, quotas, managed services, and Spot-training trade-offs. | 8 | |
| 4.3.01 | Identity and network security for ML | IAM, S3 policies, VPCs, security groups, and private access. | 8 | |
| 4.3.02 | Encryption, privacy, and anonymization | KMS, encryption, PII, anonymization, and secure data handling. | 8 | |
| 4.4.01 | Deployment strategies and endpoints | Endpoint deployment, variants, A/B tests, and rollout decisions. | 8 | |
| 4.4.02 | Model monitoring, drift, and retraining | Data/model drift, performance drops, monitoring, and remediation. | 10 | |
| 4.4.03 | ML troubleshooting and operationalization | Debugging pipelines/endpoints, performance diagnosis, and runbooks. | 8 | |
