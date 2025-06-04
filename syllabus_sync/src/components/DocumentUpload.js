import React, { useRef, useState } from "react";

/**
 * Document upload section for user syllabus uploads.
 *
 * Props:
 * - onUpload: callback(file) for when a document has been validated & "uploaded".
 * - uploadedDoc: (optional) the previously uploaded doc object.
 */
// PUBLIC_INTERFACE
function DocumentUpload({ onUpload, uploadedDoc }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Allowed file types/extensions for syllabus upload.
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  const allowedExt = [".pdf", ".doc", ".docx"];

  // Validate the file type and extension.
  const validateFile = (file) => {
    const fileType = file.type;
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExt.includes(ext)) {
      return `Invalid file type: only PDF, DOC, DOCX accepted.`;
    }
    // Extra: Sometimes DOCX from MS Office may have empty mime,
    // so allow by ext fallback if browser doesn't set a type.
    if (!allowedTypes.includes(fileType) && fileType.length > 0) {
      return `Selected file format is not supported.`;
    }
    return null;
  };

  // Handle file selection.
  const handleFileChange = (e) => {
    setFeedback("");
    const file = e.target.files[0];
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      setSelectedFile(null);
      setFeedback(error);
      return;
    }
    setSelectedFile(file);
    setFeedback("");
  };

  // Mocked upload: instantly "uploads" and notifies parent.
  const handleUpload = async () => {
    if (!selectedFile) {
      setFeedback("Please select a file to upload.");
      return;
    }
    setUploading(true);
    setFeedback("Uploading...");
    // Simulate async/mock API call.
    setTimeout(() => {
      setUploading(false);
      setFeedback("Upload successful!");
      // Expose event for parent container.
      if (onUpload) onUpload(selectedFile);
    }, 1200);
  };

  // Modern styled upload box (matches light/modern theming).
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "2px dashed var(--base-light)",
        borderRadius: 10,
        padding: 24,
        textAlign: "center",
        marginBottom: 8,
      }}
    >
      <div style={{ fontWeight: 500, fontSize: 18, marginBottom: 10 }}>
        Upload Syllabus <span style={{ color: "var(--base-light)" }}>(PDF/DOC/DOCX)</span>
      </div>
      <input
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={uploading}
        data-testid="fileInput"
      />
      <button
        className="btn"
        type="button"
        style={{ marginBottom: 12 }}
        onClick={() => !uploading && fileInputRef.current && fileInputRef.current.click()}
        disabled={uploading}
      >
        Choose File
      </button>
      <div style={{ fontSize: 15, minHeight: 24, color: "var(--text-secondary)" }}>
        {selectedFile
          ? (
            <span>
              <b>Selected:</b> {selectedFile.name}
            </span>
          )
          : (
            <span>
              {uploadedDoc ? <span><b>Last Uploaded:</b> {uploadedDoc.name}</span>
              : "No file chosen"}
            </span>
          )}
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          className="btn btn-large"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          data-testid="uploadBtn"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <div style={{
        color: feedback === "Upload successful!" ? "var(--base-light)" : "#ff6e6e",
        fontWeight: 500,
        marginTop: 12,
        minHeight: 20
      }}>
        {feedback}
      </div>
      <div style={{
        color: "#aaa",
        fontSize: 12,
        marginTop: 4,
        minHeight: 12,
      }}>
        (Max 10MB per file. Academic use only.)
      </div>
    </div>
  );
}

export default DocumentUpload;
