import React, { useState } from "react";
import Tab from "./Tab";
import RecommendationCard from "./RecommendationCard";

/**
 * Tabs to show results: Internships, Certifications, Project Ideas.
 * Renders recommendations for each category with integrated favorite interaction.
 *
 * Props:
 * - recommendations: { internships: [], certifications: [], projects: [] }
 * - onSave: function(item) => void // callback when user clicks Favorite
 */
// PUBLIC_INTERFACE
function ResultsTabs({ recommendations = {}, onSave }) {
  const tabLabels = [
    { label: "Internships", key: "internships" },
    { label: "Certifications", key: "certifications" },
    { label: "Project Ideas", key: "projects" },
  ];

  const [activeTab, setActiveTab] = useState(tabLabels[0].key);
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // Helper: render recommendations list for active tab
  const renderRecommendations = () => {
    const items = recommendations[activeTab] || [];
    if (!items.length) {
      return (
        <div style={{ color: "var(--text-secondary)", padding: "20px 0", textAlign: "center" }}>
          No recommendations yet.
        </div>
      );
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Render the list of recommendations for the current tab;
            pass favorite state and handler for the favorite button */}
        {items.map((item, idx) => {
          const favKey = `${activeTab}:${item.title}`;
          const isFav = favoriteIds.has(favKey);
          return (
            <RecommendationCard
              key={`rec_${favKey}_${idx}`}
              title={item.title}
              description={item.description}
              link={item.link}
              isFavorite={isFav}
              onFavoriteClick={() => {
                if (!isFav) {
                  setFavoriteIds((prev) => new Set(prev).add(favKey));
                  if (onSave) onSave({ ...item, category: activeTab });
                }
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div style={{
        display: "flex",
        gap: 8,
        marginBottom: 18,
        borderBottom: "1.5px solid var(--border-color)"
      }}>
        {tabLabels.map(tabObj => (
          <Tab
            key={tabObj.key}
            label={tabObj.label}
            isActive={activeTab === tabObj.key}
            onClick={() => setActiveTab(tabObj.key)}
          />
        ))}
      </div>
      {renderRecommendations()}
    </div>
  );
}

export default ResultsTabs;
