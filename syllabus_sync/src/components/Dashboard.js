import React from "react";

/**
 * Displays user dashboard with saved recommendations and uploads.
 *
 * Props:
 * - savedItems: array of recommendation items (user's favorites)
 * - uploads: array of uploaded document objects (recent uploads)
 */
// PUBLIC_INTERFACE
function Dashboard({ savedItems = [], uploads = [] }) {
  return (
    <div>
      <h2 style={{ marginBottom: 18, fontSize: 28, fontWeight: 600, color: "var(--base-light)" }}>
        User Dashboard
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 40,
          marginBottom: 32,
        }}
      >
        {/* Saved Recommendations Section */}
        <div style={{ flex: "1 1 320px", minWidth: 280 }}>
          <h3 style={{ fontWeight: 500, fontSize: 20, marginBottom: 12 }}>
            Saved Recommendations
          </h3>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1.5px solid var(--border-color)",
              borderRadius: 10,
              padding: 16,
              minHeight: 70,
              color: "var(--text-color)",
            }}
          >
            {savedItems.length === 0 ? (
              <div style={{ color: "var(--text-secondary)" }}>
                No saved recommendations yet.<br />
                Mark recommendations as favorites to see them here.
              </div>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {savedItems.map((item, idx) => (
                  <li
                    key={`${item.title}_${item.category}_${idx}`}
                    style={{
                      padding: "7px 0",
                      borderBottom: idx < savedItems.length - 1 ? "1px solid var(--border-color)" : "none"
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{item.title}</span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        marginLeft: 6,
                        background: "rgba(255,255,255,0.07)",
                        borderRadius: 4,
                        padding: "2px 7px"
                      }}
                    >
                      {item.category?.charAt(0).toUpperCase() + item.category?.slice(1)}
                    </span>
                    <div style={{ fontSize: 14, marginTop: 3 }}>
                      {item.description}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Recent Uploads Section */}
        <div style={{ flex: "1 1 260px", minWidth: 220 }}>
          <h3 style={{ fontWeight: 500, fontSize: 20, marginBottom: 12 }}>
            Recent Uploads
          </h3>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1.5px solid var(--border-color)",
              borderRadius: 10,
              padding: 16,
              minHeight: 70,
              color: "var(--text-color)",
            }}
          >
            {uploads.length === 0 ? (
              <div style={{ color: "var(--text-secondary)" }}>
                No uploads yet.<br />
                Upload a syllabus to see it here.
              </div>
            ) : (
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {uploads.map((file, idx) => (
                  <li
                    key={`upload_${file.name}_${idx}`}
                    style={{
                      padding: "7px 0",
                      borderBottom: idx < uploads.length - 1 ? "1px solid var(--border-color)" : "none"
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{file.name}</span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--text-secondary)",
                        marginLeft: 8,
                        background: "rgba(255,255,255,0.07)",
                        borderRadius: 4,
                        padding: "2px 7px"
                      }}
                    >
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                    {/* For a real system, upload timestamps or other metadata could be included here */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
        <span>
          Dashboard shows your saved favorites and uploaded syllabi.<br />
          <span style={{ color: "var(--base-light)", fontWeight: 500 }}>
            Tip:
          </span> Use the recommendation tabs to discover and favorite opportunities!
        </span>
      </div>
    </div>
  );
}

export default Dashboard;
