import React from "react";
import RecommendationCard from "./RecommendationCard";

/**
 * Lists recommendations within a ResultsTab.
 *
 * Props:
 * - recommendations: Array of recommendation objects, each with title, description, and link
 */
// PUBLIC_INTERFACE
function RecommendationList({ recommendations = [] }) {
  if (!recommendations.length) {
    return (
      <div style={{ color: "var(--text-secondary)", padding: "20px 0", textAlign: "center" }}>
        No recommendations available.
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {recommendations.map((rec, idx) => (
        <RecommendationCard
          key={`${rec.title}_${idx}`}
          title={rec.title}
          description={rec.description}
          link={rec.link}
        />
      ))}
    </div>
  );
}

export default RecommendationList;
