import React from "react";

/**
 * Displays a single recommendation (internship, certification, or project) with an optional clickable link.
 */
// PUBLIC_INTERFACE
function RecommendationCard({ title, description, link }) {
  return (
    <div className="recommendation-card">
      {/* RecommendationCard: Display recommendation details */}
      <h4>{title}</h4>
      <p>{description}</p>
      {link && (
        <a
          href={link}
          className="recommendation-link"
          style={{
            display: "inline-block",
            marginTop: 10,
            color: "var(--secondary)",
            fontWeight: 600,
            textDecoration: "underline",
            wordBreak: "break-all"
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Opportunity
        </a>
      )}
    </div>
  );
}

export default RecommendationCard;
