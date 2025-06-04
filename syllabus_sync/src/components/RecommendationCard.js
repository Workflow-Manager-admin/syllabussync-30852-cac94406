import React from "react";
import styles from "./RecommendationCard.module.css";

/**
 * Displays a single recommendation (internship, certification, or project) with an optional clickable link,
 * and a favorite button positioned consistently at the top right.
 */
// PUBLIC_INTERFACE
function RecommendationCard({ title, description, link, isFavorite = false, onFavoriteClick }) {
  return (
    <div className={styles["recommendationCard"]}>
      {/* Favorite Button Top Right */}
      <button
        className={`
          ${styles["favoriteButton"]}
          ${isFavorite ? styles["favoriteActive"] : ""}
        `}
        type="button"
        aria-label={isFavorite ? "Saved" : "Add to favorites"}
        onClick={onFavoriteClick}
        disabled={isFavorite}
        tabIndex={0}
      >
        {/* Unicode star for accessibility and style */}
        {isFavorite ? "★" : "☆"}
      </button>
      <div className={styles["cardContent"]}>
        <h4>{title}</h4>
        <p>{description}</p>
        {link && (
          <a
            href={link}
            className={styles["recommendationLink"]}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Opportunity
          </a>
        )}
      </div>
    </div>
  );
}

export default RecommendationCard;
