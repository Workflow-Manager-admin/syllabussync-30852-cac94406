import React, { useState } from "react";
import DocumentUpload from "./DocumentUpload";
import ResultsTabs from "./ResultsTabs";
import Dashboard from "./Dashboard";

/**
 * Main app container for SyllabusSync UI.
 * Handles file upload, calls backend APIs, and manages UI state.
 */
// PUBLIC_INTERFACE
function MainContainer() {
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [parsedResults, setParsedResults] = useState(null);
  const [recommendations, setRecommendations] = useState({
    internships: [],
    certifications: [],
    projects: [],
  });
  const [savedItems, setSavedItems] = useState([]);
  const [viewDashboard, setViewDashboard] = useState(false);

  // Loading and error state for parsing/generation
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [recommendationError, setRecommendationError] = useState("");

  /**
   * Handler for document upload action:
   * - Uploads file via POST /api/parse-syllabus
   * - Then POSTs subjects/modules/keywords to /api/generate-recommendations
   * - Updates UI accordingly
   * - Includes loading and error states
   * @param {File} doc 
   */
  // PUBLIC_INTERFACE
  const handleDocUpload = async (doc) => {
    setUploadedDoc(doc);
    setParsing(true);
    setParseError("");
    setParsedResults(null);
    setRecommendations({ internships: [], certifications: [], projects: [] });
    setRecommendationError("");
    setRecommendationLoading(false);

    // Step 1: POST file to /api/parse-syllabus
    try {
      const formData = new FormData();
      formData.append("file", doc);

      // Assume backend API exists at /api/parse-syllabus, returns JSON with {subjects, modules, keywords}
      const parseRes = await fetch("/api/parse-syllabus", {
        method: "POST",
        body: formData
      });

      if (!parseRes.ok) {
        throw new Error("Syllabus parsing failed. Please upload a valid document.");
      }
      const parseData = await parseRes.json();

      // Defensive: ensure required structure
      if (
        !parseData ||
        !Array.isArray(parseData.subjects) ||
        !Array.isArray(parseData.modules) ||
        !Array.isArray(parseData.keywords)
      ) {
        throw new Error("Server returned invalid structure. Please try another file.");
      }

      setParsedResults({
        subjects: parseData.subjects,
        modules: parseData.modules,
        keywords: parseData.keywords,
      });
      setParsing(false);

      // Step 2: POST parsed content to /api/generate-recommendations
      setRecommendationLoading(true);
      setRecommendationError("");
      const recRes = await fetch("/api/generate-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjects: parseData.subjects,
          modules: parseData.modules,
          keywords: parseData.keywords,
        }),
      });

      if (!recRes.ok) {
        throw new Error("Failed to generate recommendations from parsed content.");
      }
      const recData = await recRes.json();
      // Defensive: use empty arrays as fallback for keys
      setRecommendations({
        internships: Array.isArray(recData.internships) ? recData.internships : [],
        certifications: Array.isArray(recData.certifications) ? recData.certifications : [],
        projects: Array.isArray(recData.projects) ? recData.projects : [],
      });
      setRecommendationLoading(false);
      setViewDashboard(false);

    } catch (err) {
      setParsing(false);
      setRecommendationLoading(false);
      if (!parsedResults) {
        setParseError(err.message || "Failed to parse the syllabus. Please try again.");
      } else {
        setRecommendationError(err.message || "Failed to generate recommendations. Please try again.");
      }
    }
  };

  // Handler to save a recommendation to user's dashboard
  // PUBLIC_INTERFACE
  const handleSaveItem = (item) => {
    setSavedItems((prev) => [...prev, item]);
  };

  // Toggles between recommendations view and the dashboard
  // PUBLIC_INTERFACE
  const handleDashboardToggle = () => {
    setViewDashboard((prev) => !prev);
  };

  return (
    <div className="container" style={{ paddingTop: 120, paddingBottom: 48 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn"
          onClick={handleDashboardToggle}
        >
          {viewDashboard ? "Back to Recommendations" : "Dashboard"}
        </button>
      </div>
      {!viewDashboard && (
        <>
          {/* Document Upload & Parsing */}
          <section style={{ marginBottom: 36 }}>
            <DocumentUpload
              onUpload={handleDocUpload}
              uploadedDoc={uploadedDoc}
            />

            {/* Loading/Progress States */}
            {parsing && (
              <div
                style={{
                  background: "rgba(79,209,197,0.10)",
                  borderRadius: 10,
                  padding: 16,
                  marginTop: 16,
                  color: "#4FD1C5",
                  fontWeight: 500,
                }}
              >
                Parsing document with AI...
              </div>
            )}

            {parseError && (
              <div
                style={{
                  background: "rgba(255,70,70,0.08)",
                  borderRadius: 10,
                  padding: 16,
                  marginTop: 16,
                  color: "#ff6e6e",
                  fontWeight: 500,
                }}
              >
                {parseError}
              </div>
            )}

            {/* Show parsed results if available */}
            {parsedResults && !parsing && (
              <div style={{
                background: "rgba(79,209,197,0.10)",
                borderRadius: 10,
                padding: 16,
                marginTop: 16,
              }}>
                <div style={{ color: "#4FD1C5", fontWeight: 500 }}>
                  Parsed Results:
                </div>
                <div>
                  <b>Subjects:</b> {parsedResults.subjects.join(", ")}
                </div>
                <div>
                  <b>Modules:</b> {parsedResults.modules.join(", ")}
                </div>
                <div>
                  <b>Keywords:</b> {parsedResults.keywords.join(", ")}
                </div>
              </div>
            )}

            {/* Loading/Errors for Recommendation Generation */}
            {recommendationLoading && (
              <div
                style={{
                  marginTop: 20,
                  background: "rgba(246,173,85,0.14)",
                  borderRadius: 10,
                  padding: 14,
                  color: "#F6AD55",
                  fontWeight: 500,
                }}
              >
                Generating personalized recommendations...
              </div>
            )}

            {recommendationError && (
              <div
                style={{
                  marginTop: 20,
                  background: "rgba(255,70,70,0.09)",
                  borderRadius: 10,
                  padding: 14,
                  color: "#ff6e6e",
                  fontWeight: 500,
                }}
              >
                {recommendationError}
              </div>
            )}
          </section>
          {/* Recommendations Section */}
          <section>
            <ResultsTabs
              recommendations={recommendations}
              onSave={handleSaveItem}
            />
          </section>
        </>
      )}
      {viewDashboard && (
        <section>
          <Dashboard savedItems={savedItems} uploads={uploadedDoc ? [uploadedDoc] : []} />
        </section>
      )}
    </div>
  );
}

export default MainContainer;
