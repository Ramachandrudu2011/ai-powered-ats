import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [suggestion, setSuggestion] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a resume!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/upload",
        formData
      );

      const resumeText = res.data.resumeText.toLowerCase();
      const jdText = jobDescription.toLowerCase();

      const keywords = [
        "java",
        "python",
        "react",
        "sql",
        "html",
        "css",
        "javascript",
        "node",
        "express",
        "mongodb",
        "project",
        "communication",
        "leadership",
      ];

      let atsScore = 0;
      let matched = [];
      let missing = [];

      keywords.forEach((word) => {
        if (resumeText.includes(word) && jdText.includes(word)) {
          atsScore += Math.floor(100 / keywords.length);
          matched.push(word);
        } else if (jdText.includes(word)) {
          missing.push(word);
        }
      });

      if (atsScore > 100) atsScore = 100;

      setScore(atsScore);
      setMatchedSkills(matched);
      setMissingSkills(missing);

      if (missing.length > 0) {
        setSuggestion(
          "Add these skills to improve your ATS score: " +
            missing.join(", ")
        );
      } else {
        setSuggestion("Excellent! Your resume matches the job description.");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("AI ATS Resume Report", 20, 20);

    doc.setFontSize(14);
    doc.text(`ATS Score: ${score}/100`, 20, 40);

    doc.text("Matched Skills:", 20, 60);
    doc.text(matchedSkills.join(", "), 20, 70);

    doc.text("Missing Skills:", 20, 90);
    doc.text(missingSkills.join(", "), 20, 100);

    doc.text("Suggestion:", 20, 120);
    doc.text(suggestion, 20, 130);

    doc.save("ATS_Report.pdf");
  };

  return (
  <div className="container mt-5">
    <div className="card shadow p-4">

      <h2 className="text-center mb-4">
        AI ATS Resume Checker
      </h2>

      <input
        type="file"
        className="form-control mb-3"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <textarea
        className="form-control mb-3"
        rows="6"
        placeholder="Paste Job Description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      ></textarea>

      <button
        className="btn btn-primary w-100"
        onClick={handleUpload}
      >
        Check ATS Score
      </button>

      {score !== null && (
        <>
          <h3 className="text-center mt-4">
            ATS Score: {score}/100
          </h3>

          <div className="progress mt-3">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${score}%` }}
            >
              {score}%
            </div>
          </div>

          <h4 className="mt-4 text-success">
            ✅ Matched Skills
          </h4>

          <ul>
            {matchedSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <h4 className="text-danger">
            ❌ Missing Skills
          </h4>

          <ul>
            {missingSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>

          <div className="alert alert-warning">
            💡 {suggestion}
          </div>

          <button
            className="btn btn-success"
            onClick={downloadPDF}
          >
            Download PDF Report
          </button>
        </>
      )}
    </div>
  </div>
);

}

export default UploadResume;