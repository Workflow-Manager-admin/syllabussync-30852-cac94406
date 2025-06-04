import React, { useState } from "react";
import DocumentUpload from "./DocumentUpload";
import ResultsTabs from "./ResultsTabs";
import Dashboard from "./Dashboard";

/**
 * Mocks an AI/NLP parser for uploaded syllabus documents.
 * Returns a promise simulating an asynchronous API call.
 * @param {File} file - The uploaded syllabus file
 * @returns {Promise<{subjects: string[], modules: string[], keywords: string[]}>}
 */
// PUBLIC_INTERFACE
function mockContentParserAPI(file) {
  // Simulated parsing using filename, for demo/mock purposes (normally contents would be analyzed)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        subjects: [
          "Artificial Intelligence",
          "Data Structures",
          "Web Development"
        ],
        modules: ["Module 1", "Module 2"],
        keywords: ["AI", "React", "Node.js"],
      });
    }, 1000);
  });
}

/**
 * Main app container for SyllabusSync UI.
 * Orchestrates document upload, content parsing, recommendations, and dashboard.
 */
// PUBLIC_INTERFACE
function MainContainer() {
  // State management for uploaded document, parsed content, recommendations, and saved items
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [parsedResults, setParsedResults] = useState(null);
  const [recommendations, setRecommendations] = useState({
    internships: [],
    certifications: [],
    projects: [],
  });
  const [savedItems, setSavedItems] = useState([]);
  const [viewDashboard, setViewDashboard] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState("");

  // Handler for document upload: call the content parser and set results
  // PUBLIC_INTERFACE
  const handleDocUpload = async (doc) => {
    setUploadedDoc(doc);
    setParsing(true);
    setParseError("");
    setParsedResults(null);

    try {
      // Pretend to send to AI parser API and get parsed results.
      const parsed = await mockContentParserAPI(doc);

      setParsedResults(parsed);

      // Simulate recommendations using the parsed data as reference
      setRecommendations({
        internships: [
          {
            title: "AI Research Intern",
            description: "Work with a university lab on NLP tasks.",
          },
          {
            title: "Web Development Intern",
            description: "Contribute to React-based web apps.",
          },
        ],
        certifications: [
          {
            title: "AWS Certified Cloud Practitioner",
            description: "Verify your cloud fundamentals knowledge.",
          },
          {
            title: "Google Data Analytics",
            description: "Gain hands-on data analysis skills.",
          },
        ],
        projects: [
          {
            title: "Personal Portfolio Website",
            description: "Showcase your skills with a modern web portfolio.",
          },
          {
            title: "Chatbot for Student Queries",
            description: "Build an AI bot for campus FAQs.",
          },
        ],
      });
      setViewDashboard(false);
    } catch (err) {
      setParseError("Failed to parse the syllabus. Please try again.");
    } finally {
      setParsing(false);
    }
  };

  // Handler to save recommendations
  // PUBLIC_INTERFACE
  const handleSaveItem = (item) => {
    setSavedItems((prev) => [...prev, item]);
  };

  // Toggle between recommendations view and dashboard
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
