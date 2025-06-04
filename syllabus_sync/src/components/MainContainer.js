import React, { useState } from "react";
import DocumentUpload from "./DocumentUpload";
import ResultsTabs from "./ResultsTabs";
import Dashboard from "./Dashboard";

/**
 * Main app container for SyllabusSync UI.
 * Orchestrates document upload, parsing (mocked), recommendations, and dashboard.
 */
// PUBLIC_INTERFACE
function MainContainer() {
  // Mocked state management for uploaded document, parsed content, recommendations, and saved items
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [parsedResults, setParsedResults] = useState(null);
  const [recommendations, setRecommendations] = useState({
    internships: [],
    certifications: [],
    projects: [],
  });
  const [savedItems, setSavedItems] = useState([]);
  const [viewDashboard, setViewDashboard] = useState(false);

  // Handler for document upload (mocked parsing)
  const handleDocUpload = (doc) => {
    setUploadedDoc(doc);
    // Simulate parsing result
    const parsed = {
      subjects: ["Artificial Intelligence", "Data Structures", "Web Development"],
      modules: ["Module 1", "Module 2"],
      keywords: ["AI", "React", "Node.js"],
    };
    setParsedResults(parsed);

    // Simulate recommendations
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
  };

  // Handler to save recommendations
  const handleSaveItem = (item) => {
    setSavedItems((prev) => [...prev, item]);
  };

  // Toggle between recommendations view and dashboard
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
            {parsedResults && (
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
