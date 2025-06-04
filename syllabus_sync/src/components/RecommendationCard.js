import React from "react";

/**
 * Displays a single recommendation (internship, certification, or project).
 */
// PUBLIC_INTERFACE
function RecommendationCard({ title, description }) {
  return (
    <div className="recommendation-card">
      {/* RecommendationCard: Display recommendation details */}
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}

export default RecommendationCard;
