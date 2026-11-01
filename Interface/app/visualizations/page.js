
"use client";

import Image from "next/image";
import SiteChrome from "../components/SiteChrome";

const chartSections = [
  {
    category: "DIMENSIONALITY REDUCTION",
    charts: [
      {
        title: "PCA 2D Visualization",
        file: "pca_2d_labelled.png",
        subtitle:
          "Visualizes how different network traffic classes are distributed across the first two principal components.",
        meaning:
          "Each point represents a network traffic record. Its colour identifies the original traffic class.",
      },
      {
        title: "t-SNE 2D Visualization",
        file: "tsne_2d_labelled.png",
        subtitle:
          "Maps similar network traffic records into nearby positions to reveal local patterns and clusters.",
        meaning:
          "Nearby points represent records with similar local neighbourhood structure.",
      },
      {
        title: "Feature Reduction Comparison",
        file: "feature_reduction_comparison.png",
        subtitle:
          "Shows how the original network features are transformed into a smaller representation.",
        meaning:
          "Compares the original feature count, PCA components and two-dimensional visualization spaces.",
      },
    ],
  },
  {
    category: "PCA ANALYSIS",
    charts: [
      {
        title: "PCA Scree Plot",
        file: "pca_scree_plot.png",
        subtitle:
          "Displays the percentage of variance captured by each principal component.",
        meaning:
          "Helps identify which principal components retain the most information.",
      },
      {
        title: "Cumulative Explained Variance",
        file: "pca_cumulative_variance.png",
        subtitle:
          "Shows how the retained information increases as more principal components are included.",
        meaning:
          "Helps determine how many components are needed to preserve a chosen amount of variance.",
      },
    ],
  },
  {
    category: "NETWORK TRAFFIC ANALYSIS",
    charts: [
      {
        title: "Traffic Class Distribution",
        file: "class_distribution.png",
        subtitle:
          "Displays the number of records belonging to each normal and attack category.",
        meaning:
          "Highlights class imbalance in the CICIDS2017 dataset.",
      },
      {
        title: "Feature Correlation Heatmap",
        file: "feature_correlation_heatmap.png",
        subtitle:
          "Shows the relationships between selected numerical network traffic features.",
        meaning:
          "Values closer to +1 or -1 indicate stronger positive or negative linear correlations.",
      },
    ],
  },
  {
    category: "CLUSTER EVALUATION",
    charts: [
      {
        title: "PCA vs t-SNE Cluster Separation",
        file: "cluster_separation_comparison.png",
        subtitle:
          "Compares the silhouette scores of the PCA and t-SNE two-dimensional representations.",
        meaning:
          "A higher score indicates better separation and compactness according to the supplied class labels.",
      },
    ],
  },
];

export default function VisualizationsPage() {
  return (
    <SiteChrome>
      <main className="visual-page">

        {/* PAGE HEADER */}
        <header className="visual-header">
          <span className="visual-eyebrow">
            SECURITY ANALYTICS / SOC VISUALIZATION
          </span>

          <h1>
            Network Traffic <span>Visualizations.</span>
          </h1>

          <p>
            Explore how high-dimensional network traffic data
            is reduced, analysed and visualized using PCA and
            t-SNE. These visualizations help investigate traffic
            patterns and class separation.
          </p>
        </header>

        {/* CHART SECTIONS */}
        {chartSections.map((section) => (
          <section
            className="visual-section"
            key={section.category}
          >
            <div className="visual-section-heading">
              <span>{section.category}</span>
              <div />
            </div>

            <div className="visual-grid">
              {section.charts.map((chart) => (
                <article
                  className="visual-card"
                  key={chart.file}
                >
                  <div className="visual-image">
                    <Image
                      src={`/visualizations/${chart.file}`}
                      alt={chart.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{
                        objectFit: "contain",
                      }}
                    />
                  </div>

                  <div className="visual-content">
                    <h2>{chart.title}</h2>

                    <p className="visual-subtitle">
                      {chart.subtitle}
                    </p>

                    <div className="visual-meaning">
                      <span>WHAT THIS SHOWS</span>
                      <p>{chart.meaning}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}

        {/* FOOTNOTE */}
        <section className="visual-note">
          <h3>About this analysis</h3>

          <p>
            PCA and t-SNE are used for dimensionality reduction
            and visualization. The silhouette score evaluates
            separation in the reduced representations using
            the known dataset labels. These visualizations
            support network traffic exploration and do not
            replace the LightGBM prediction model.
          </p>
        </section>

      </main>
    </SiteChrome>
  );
}
