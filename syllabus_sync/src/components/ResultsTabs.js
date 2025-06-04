import React, { useState } from "react";
import Tab from "./Tab";

/**
 * Tabs to show results: Internships, Certifications, Project Ideas.
 * Renders mock recommendations for each category and allows "favorite" interaction.
 * 
 * Props:
 * - recommendations: { internships: [], certifications: [], projects: [] }
 * - onSave: function(item) => void   // callback when user clicks Favorite
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
        {items.map((item, idx) => {
          // We can use title + tab as a makeshift unique id since mock data has no ids
          const favKey = `${activeTab}:${item.title}`;
          const isFav = favoriteIds.has(favKey);
          return (
            <div
              key={favKey}
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 9,
                padding: 18,
                boxShadow: isFav
                  ? "0 0 0 2px var(--base-light)" : "0 0 0 1px var(--border-color)",
                display: "flex",
                alignItems: "flex-start",
                gap: 18,
                position: "relative"
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>
                  {item.title}
                </div>
                <div style={{
                  color: "var(--text-secondary)",
                  fontSize: 15,
                  lineHeight: 1.45,
                  marginBottom: 5
                }}>
                  {item.description}
                </div>
              </div>
              <button
                className="btn"
                style={{
                  minWidth: 100,
                  fontSize: 15,
                  background: isFav
                    ? "var(--base-light)"
                    : "rgba(255,255,255,0.12)",
                  color: isFav ? "#fff" : "var(--base-light)",
                  border: `1px solid var(--base-light)`,
                  marginLeft: 8
                }}
                onClick={() => {
                  if (!isFav) {
                    setFavoriteIds(prev => new Set(prev).add(favKey));
                    if (onSave) onSave({ ...item, category: activeTab });
                  }
                }}
                disabled={isFav}
                aria-label={isFav ? "Saved" : "Save as favorite"}
              >
                {isFav ? "★ Saved" : "☆ Favorite"}
              </button>
            </div>
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
