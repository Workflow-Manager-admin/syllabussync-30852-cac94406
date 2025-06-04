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
          // Dynamically generate recommendations based on extracted keywords
          // Basic mapping: For demo, pair some keyword strings to recs; multiple can match, concat all
          const keywordRecMap = {
            "Python": {
              internships: [
                { title: "Python Developer Intern", description: "Develop backend APIs and automation using Python.", link: "https://example.com/python-intern" },
              ],
              certifications: [
                { title: "Python for Everybody (Coursera)", description: "Learn Python fundamentals in depth.", link: "https://www.coursera.org/specializations/python" },
              ],
              projects: [
                { title: "Data Scraper", description: "Build a data scraper using Python libraries like BeautifulSoup.", link: null },
              ]
            },
            "Machine Learning": {
              internships: [
                { title: "AI/ML Research Intern", description: "Work on ML models with a university lab.", link: "https://example.com/ml-intern" }
              ],
              certifications: [
                { title: "Google ML Crash Course", description: "Foundational ML skills from Google.", link: "https://developers.google.com/machine-learning/crash-course" }
              ],
              projects: [
                { title: "ML Model Comparator", description: "Evaluate different machine learning models on real datasets.", link: null }
              ]
            },
            "NLP": {
              internships: [
                { title: "NLP Intern", description: "Apply NLP to build chatbots or sentiment analysis tools.", link: "" }
              ],
              certifications: [
                { title: "Coursera NLP", description: "NLP specialization with real projects.", link: "https://coursera.org/specializations/nlp" }
              ],
              projects: [
                { title: "Resume Analyzer", description: "Analyze and score resumes using natural language techniques.", link: null }
              ]
            },
            "Data Structures": {
              internships: [
                { title: "Software Developer Intern", description: "Use data structures in web or systems programming.", link: "" }
              ],
              certifications: [
                { title: "Algorithms & Data Structures", description: "Master classic structures and algorithms.", link: "https://www.edx.org/course/data-structures-fundamentals" }
              ],
              projects: [
                { title: "Graph Path Finder", description: "Visual tool for exploring shortest paths in graphs.", link: null }
              ]
            },
            "Agile": {
              internships: [
                { title: "Agile Team Intern", description: "Join an Agile/Scrum team for software delivery.", link: "" }
              ],
              certifications: [
                { title: "Scrum Master Cert (Scrum.org)", description: "Demonstrate agile methodology skills.", link: "https://www.scrum.org/courses/professional-scrum-master-i-certification" }
              ],
              projects: [
                { title: "Project Tracker", description: "Build a simple Agile project tracking app.", link: null }
              ]
            },
            "Big Data": {
              internships: [
                { title: "Big Data Intern", description: "Contribute to distributed data processing.", link: "https://www.example.com/big-data-intern" }
              ],
              certifications: [
                { title: "Cloudera Certified Data Analyst", description: "Big data platform skills certification.", link: "https://www.cloudera.com/about/training/certification.html" }
              ],
              projects: [
                { title: "Data Pipeline Demo", description: "Set up sample ETL pipeline using Spark.", link: null }
              ]
            },
            "Software Engineering": {
              internships: [
                { title: "Full-stack Web Dev Intern", description: "Experience in real product teams.", link: "" }
              ],
              certifications: [
                { title: "Professional Software Engineer Cert", description: "Formal credential for software devs.", link: "https://certification.comptia.org/software-engineer-certification" }
              ],
              projects: [
                { title: "Bug Tracker", description: "Develop a bug tracking system for small teams.", link: null }
              ]
            },
            "Artificial Intelligence": {
              internships: [
                { title: "Artificial Intelligence Intern", description: "Apply AI techniques to solve real-world problems.", link: "" }
              ],
              certifications: [
                { title: "AI for Everyone by DeepLearning.AI", description: "Broad overview of AI for beginners.", link: "https://www.coursera.org/learn/ai-for-everyone" }
              ],
              projects: [
                { title: "AI Chatbot", description: "Develop a simple AI-powered chatbot.", link: null }
              ]
            },
            // Add more mappings as needed for demo
          };

          // Helper function to combine recommendations, avoiding duplicates by title + category
          function mergeRecs(acc, next, cat) {
            if (!next) return acc;
            if (!Array.isArray(next)) return acc;
            next.forEach(item => {
              if (!acc.some(s => s.title === item.title && s.description === item.description)) {
                acc.push(item);
              }
            });
            return acc;
          }

          // Collect all keywords from subjects, modules, keywords arrays (lowercase for matching)
          const allTokens = [
            ...(parseData.subjects || []),
            ...(parseData.modules || []),
            ...(parseData.keywords || [])
          ];

          // Map tokens—case-insensitively—to recs, merging all found
          let recsMerged = { internships: [], certifications: [], projects: [] };
          allTokens.forEach(token => {
            Object.entries(keywordRecMap).forEach(([matchKey, recsObj]) => {
              // Very simple case-insensitve contains-match
              if (
                token &&
                typeof token === "string" &&
                token.toLowerCase().includes(matchKey.toLowerCase())
              ) {
                recsMerged.internships = mergeRecs(recsMerged.internships, recsObj.internships, "internships");
                recsMerged.certifications = mergeRecs(recsMerged.certifications, recsObj.certifications, "certifications");
                recsMerged.projects = mergeRecs(recsMerged.projects, recsObj.projects, "projects");
              }
            });
          });

          // If nothing matches, fallback to most generic demo option
          if (
            recsMerged.internships.length === 0 &&
            recsMerged.certifications.length === 0 &&
            recsMerged.projects.length === 0
          ) {
            recsMerged = {
              internships: [
                { title: "General Development Internship", description: "Explore tech internship options in various domains.", link: "https://example.com/intern1" }
              ],
              certifications: [
                { title: "General Technology Certification", description: "Online certifications in technology.", link: "https://coursera.org" }
              ],
              projects: [
                { title: "Personal Organizer App", description: "Build a simple personal task manager app.", link: null }
              ]
            };
          }
          recData = recsMerged;
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
