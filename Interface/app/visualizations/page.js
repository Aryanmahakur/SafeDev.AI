
"use client";

import Image from "next/image";
import SiteChrome from "../components/SiteChrome";

const chartSections = [
  {
    charts: [
      {
        title: "PCA — Principal Component Projection",
        file: "pca_2d_labelled.png",
        subtitle:
          "Visualizes how different network traffic classes are distributed across the first two principal components.",
        meaning:
          "Each point represents a network traffic record. Its colour identifies the original traffic class.",
      },
      {
        title: "t-SNE — Network Traffic Clustering",
        file: "tsne_2d_labelled.png",
        subtitle:
          "Maps similar network traffic records into nearby positions to reveal local patterns and clusters.",
        meaning:
          "Nearby points represent records with similar local neighbourhood structure.",
      },
    ],
  },
  {
    charts: [
      {
        title: "PCA — Component-wise Explained Variance",
        file: "pca_scree_plot.png",
        subtitle:
          "Displays the percentage of variance captured by each principal component.",
        meaning:
          "Helps identify which principal components retain the most information.",
      },
      {
        title: "PCA — Cumulative Information Retention",
        file: "pca_cumulative_variance.png",
        subtitle:
          "Shows how the retained information increases as more principal components are included.",
        meaning:
          "Helps determine how many components are needed to preserve a chosen amount of variance.",
      },
    ],
  },
  {
    charts: [
      {
        title: "Network Traffic Class Distribution",
        file: "class_distribution.png",
        subtitle:
          "Displays the number of records belonging to each normal and attack category.",
        meaning:
          "Highlights class imbalance in the CICIDS2017 dataset.",
      },
      {
        title: "Network Feature Correlation Analysis",
        file: "feature_correlation_heatmap.png",
        subtitle:
          "Shows the relationships between selected numerical network traffic features.",
        meaning:
          "Values closer to +1 or -1 indicate stronger positive or negative linear correlations.",
      },
    ],
  },
];

const comparisonCharts = [
  {
    title: "Feature Dimensionality Reduction",
    file: "feature_reduction_comparison.png",
    subtitle:
      "Shows how the original network features are transformed into a smaller representation.",
    meaning:
      "Compares the original feature count, PCA components and two-dimensional visualization spaces.",
  },
  {
    title: "PCA vs t-SNE — Cluster Separation Analysis",
    file: "cluster_separation_comparison.png",
    subtitle:
      "Compares the silhouette scores of the PCA and t-SNE two-dimensional representations.",
    meaning:
      "A higher score indicates better separation and compactness according to the supplied class labels.",
  },
];

/* REUSABLE GRAPH CARD */
function ChartCard({ chart }) {
  return (
    <article className="visual-card">

      {/* GRAPH TITLE */}
      <div className="visual-card-heading">
        <h2>{chart.title}</h2>
      </div>

      {/* GRAPH IMAGE */}
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

      {/* GRAPH DESCRIPTION */}
      <div className="visual-content">
        <p className="visual-subtitle">
          {chart.subtitle}
        </p>

        <div className="visual-meaning">
          <span>WHAT THIS SHOWS</span>
          <p>{chart.meaning}</p>
        </div>
      </div>

    </article>
  );
}

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

        {/* MAIN GRAPHS */}
        {chartSections.map((section, index) => (
          <section
            className="visual-section"
            key={index}
          >
            <div className="visual-grid">
              {section.charts.map((chart) => (
                <ChartCard
                  key={chart.file}
                  chart={chart}
                />
              ))}
            </div>
          </section>
        ))}

        {/* TWO COMPARISON GRAPHS SIDE BY SIDE */}
        <section className="visual-section">
          <div className="visual-comparison-grid">
            {comparisonCharts.map((chart) => (
              <div
                className="visual-comparison-column"
                key={chart.file}
              >
                <ChartCard chart={chart} />
              </div>
            ))}
          </div>
        </section>

      </main>
    </SiteChrome>
  );
}
