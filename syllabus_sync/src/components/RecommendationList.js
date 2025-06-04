import React from "react";
import RecommendationCard from "./RecommendationCard";

/**
 * Lists recommendations within a ResultsTab.
 *
 * Props:
 * - recommendations: Array of recommendation objects, each with title, description, and link
 * - isFavorite: a function or array indicating if the card is favored - optional for future expansion
 * - onFavoriteClick: callback for favorite click - optional for future expansion
 */
// PUBLIC_INTERFACE
function RecommendationList({ recommendations = [], isFavorite, onFavoriteClick }) {
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
          isFavorite={typeof isFavorite === "function" ? isFavorite(rec, idx) : false}
          onFavoriteClick={onFavoriteClick ? () => onFavoriteClick(rec, idx) : undefined}
        />
      ))}
    </div>
  );
}

export default RecommendationList;
