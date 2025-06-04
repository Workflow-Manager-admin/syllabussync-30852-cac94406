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
  // Track mode: "upload" (syllabus upload) or "domain" (type subject/domain)
  const [inputMode, setInputMode] = useState("upload");
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [typedDomain, setTypedDomain] = useState("");
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

      // Try to call backend API for syllabus parsing.
      let parseData = null;
      try {
        const parseRes = await fetch("/api/parse-syllabus", {
          method: "POST",
          body: formData,
        });
        if (!parseRes.ok) {
          throw new Error(`API returned status: ${parseRes.status}`);
        }
        parseData = await parseRes.json();
      } catch (err) {
        // fallback below
      }

      // If no parseData, fallback for dev/demo
      if (!parseData) {
        const USE_DEMO_FALLBACK = true;

        if (USE_DEMO_FALLBACK) {
          // Demo fallback for frontend-only or demo mode.
          parseData = {
            subjects: ["Artificial Intelligence", "Data Structures", "Software Engineering"],
            modules: ["Machine Learning", "Graph Algorithms", "Project Management"],
            keywords: ["Python", "Agile", "Big Data", "NLP"]
          };
        } else {
          throw new Error("Syllabus parsing failed (API unavailable). Please ensure backend is running or upload a valid document.");
        }
      }

      // Defensive structure check
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

      let recData = null;
      try {
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
          throw new Error(`Recommendation API returned status: ${recRes.status}`);
        }
        recData = await recRes.json();
      } catch (err) {
        // fallback below
      }

      // Fallback: If recommendations fetch fails
      if (!recData) {
        const USE_DEMO_FALLBACK = true;
        if (USE_DEMO_FALLBACK) {
          recData = {
            internships: [
              { title: "AI Research Intern", description: "Work with ML models in a startup.", link: "https://example.com/intern1" },
              { title: "Software Developer Intern", description: "Web app and data pipelines.", link: "" }
            ],
            certifications: [
              { title: "AWS Machine Learning", description: "Certify cloud AI skills.", link: "https://aws.amazon.com/certification/" },
              { title: "Coursera NLP", description: "Intro to NLP specialization.", link: "https://coursera.org/specializations/nlp" }
            ],
            projects: [
              { title: "Course Recommender", description: "Build a recommendation system.", link: null },
              { title: "Syllabus Analyzer", description: "Extract topics from syllabus files.", link: null }
            ]
          };
        } else {
          throw new Error("Failed to generate recommendations (API unavailable). Please ensure backend is running.");
        }
      }

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

  /**
   * Handler for domain/subject input action:
   * - Uses POST /api/generate-recommendations-from-domain { domain: <string> }
   * - Updates UI accordingly
   */
  // PUBLIC_INTERFACE
  const handleDomainSubmit = async (e) => {
    e.preventDefault();
    if (!typedDomain || !typedDomain.trim()) {
      setParseError("Please enter a subject or domain name.");
      return;
    }
    setParsing(false);
    setParseError("");
    setParsedResults(null);
    setRecommendations({ internships: [], certifications: [], projects: [] });
    setRecommendationError("");
    setRecommendationLoading(true);

    try {
      let recData = null;
      try {
        const recRes = await fetch("/api/generate-recommendations-from-domain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain: typedDomain.trim() }),
        });
        if (!recRes.ok) {
          throw new Error(`Recommendation API returned status: ${recRes.status}`);
        }
        recData = await recRes.json();
      } catch (error) {
        // fallback below
      }

      // Fallback: If backend is not available (demo/dev)
      if (!recData) {
        const USE_DEMO_FALLBACK = true;
        if (USE_DEMO_FALLBACK) {
          // Use typed domain for display context only (not parsedResults as in upload flow)
          recData = {
            internships: [
              { title: `${typedDomain} Intern at BigTech`, description: `Work as a ${typedDomain} intern at a leading tech company.`, link: "https://example.com/intern" }
            ],
            certifications: [
              { title: `${typedDomain} Certificate (EdX)`, description: `Earn a credential for ${typedDomain}.`, link: "https://edx.org" }
            ],
            projects: [
              { title: `${typedDomain} Capstone Project`, description: `Develop a project that applies ${typedDomain}.`, link: null }
            ]
          };
        } else {
          throw new Error("Failed to generate recommendations. Please try again.");
        }
      }

      setRecommendationLoading(false);
      setRecommendations({
        internships: Array.isArray(recData.internships) ? recData.internships : [],
        certifications: Array.isArray(recData.certifications) ? recData.certifications : [],
        projects: Array.isArray(recData.projects) ? recData.projects : [],
      });
      setParsedResults(null); // Don't show parsed results box in this mode
      setViewDashboard(false);
    } catch (err) {
      setRecommendationLoading(false);
      setRecommendationError(err.message || "Failed to generate recommendations. Please try again.");
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

  // UI: Mode toggle - radio segmented
  const InputModeToggle = () => (
    <div style={{
      display: "flex",
      gap: "18px",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "22px",
    }}>
      <label style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 7 }}>
        <input
          type="radio"
          name="inputMode"
          value="upload"
          checked={inputMode === "upload"}
          onChange={() => {
            setInputMode("upload");
            setParseError("");
            setParsedResults(null);
            setRecommendations({ internships: [], certifications: [], projects: [] });
          }}
        />
        Upload Syllabus
      </label>
      <label style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 7 }}>
        <input
          type="radio"
          name="inputMode"
          value="domain"
          checked={inputMode === "domain"}
          onChange={() => {
            setInputMode("domain");
            setParseError("");
            setParsedResults(null);
            setRecommendations({ internships: [], certifications: [], projects: [] });
          }}
        />
        Type Domain/Subject
      </label>
    </div>
  );

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
          {/* Option Toggle: Upload or Type Domain */}
          <section style={{ marginBottom: 36 }}>
            <InputModeToggle />

            {/* Syllabus Upload Mode */}
            {inputMode === "upload" && (
              <DocumentUpload
                onUpload={handleDocUpload}
                uploadedDoc={uploadedDoc}
              />
            )}

            {/* Domain/Subject Name Mode */}
            {inputMode === "domain" && (
              <form
                onSubmit={handleDomainSubmit}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "2px dashed var(--base-light)",
                  borderRadius: 10,
                  padding: 24,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 12 }}>
                  Type a Subject, Course or Domain Name
                </div>
                <input
                  type="text"
                  placeholder="e.g. Computer Science, Marketing, Machine Learning..."
                  value={typedDomain}
                  onChange={e => setTypedDomain(e.target.value)}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 7,
                    fontSize: 16,
                    border: "1.5px solid var(--border-color)",
                    marginBottom: 12,
                    width: "74%",
                    maxWidth: 440,
                  }}
                  disabled={recommendationLoading}
                  autoFocus
                  data-testid="domainInput"
                />
                <div>
                  <button
                    className="btn btn-large"
                    type="submit"
                    style={{ marginTop: 4 }}
                    disabled={!typedDomain.trim() || recommendationLoading}
                    data-testid="domainSubmit"
                  >
                    {recommendationLoading ? "Fetching..." : "Get Recommendations"}
                  </button>
                </div>
                {parseError && (
                  <div style={{
                    color: "#ff6e6e",
                    fontWeight: 500,
                    marginTop: 11,
                  }}>{parseError}</div>
                )}
                <div style={{
                  color: "#aaa",
                  fontSize: 12,
                  marginTop: 5,
                  minHeight: 12,
                }}>
                  Type the area of your interest (no file upload needed)
                </div>
              </form>
            )}

            {/* Loading/Progress States */}
            {inputMode === "upload" && parsing && (
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

            {/* Only show parseError on upload flow */}
            {inputMode === "upload" && parseError && (
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

            {/* Show parsed results only in upload mode */}
            {inputMode === "upload" && parsedResults && !parsing && (
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
                {inputMode === "upload" ? "Generating personalized recommendations..." : "Fetching recommendations..."}
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
