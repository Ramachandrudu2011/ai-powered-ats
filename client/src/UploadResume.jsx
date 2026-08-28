import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import * as pdfjsLib from "pdfjs-dist";

// PDF worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

// Common skills used for ATS checking
const commonSkills = [
  "javascript",
  "react",
  "react.js",
  "node",
  "node.js",
  "express",
  "mongodb",
  "mysql",
  "sql",
  "html",
  "css",
  "python",
  "java",
  "c",
  "c++",
  "git",
  "github",
  "communication",
  "teamwork",
  "leadership",
  "problem solving",
  "problem-solving",
  "typescript",
  "angular",
  "vue",
  "next.js",
  "bootstrap",
  "tailwind",
  "rest api",
  "api",
  "docker",
  "aws",
  "azure",
  "machine learning",
  "data analysis",
  "excel",
  "power bi",
  "figma"
];

function UploadResume({
  setScore,
  setMatchedSkills,
  setMissingSkills
}) {
  const navigate = useNavigate();

  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const [score, setLocalScore] = useState(0);
  const [matchedSkills, setLocalMatchedSkills] = useState([]);
  const [missingSkills, setLocalMissingSkills] = useState([]);

  // -----------------------------------------
  // Handle Resume Upload
  // -----------------------------------------
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF resume.");
      return;
    }

    setResumeFile(file);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer
      }).promise;

      let completeText = "";

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item) => item.str)
          .join(" ");

        completeText += pageText + "\n";
      }

      setResumeText(completeText);

      console.log("Resume text extracted:");
      console.log(completeText);
    } catch (error) {
      console.error("Error reading PDF:", error);
      alert("Unable to read the PDF resume.");
    }
  };

  // -----------------------------------------
  // Extract Skills
  // -----------------------------------------
  const extractSkills = (text) => {
    const lowerText = text.toLowerCase();

    const foundSkills = [];

    commonSkills.forEach((skill) => {
      const skillLower = skill.toLowerCase();

      if (lowerText.includes(skillLower)) {
        // Avoid duplicate React / React.js type matches
        if (!foundSkills.includes(skill)) {
          foundSkills.push(skill);
        }
      }
    });

    return foundSkills;
  };

  // -----------------------------------------
  // Analyze ATS
  // -----------------------------------------
  const analyzeResume = () => {
    if (!resumeFile) {
      alert("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter the job description.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const resumeSkills = extractSkills(resumeText);

      const jobSkills = extractSkills(jobDescription);

      // Skills required by the job that are present in resume
      const matched = jobSkills.filter((skill) =>
        resumeSkills.includes(skill)
      );

      // Skills required by job but missing from resume
      const missing = jobSkills.filter(
        (skill) => !resumeSkills.includes(skill)
      );

      let calculatedScore = 0;

      if (jobSkills.length > 0) {
        calculatedScore = Math.round(
          (matched.length / jobSkills.length) * 100
        );
      } else {
        // If no recognized skills are found,
        // give a basic score based on text similarity.
        const jobWords = jobDescription
          .toLowerCase()
          .split(/\s+/)
          .filter((word) => word.length > 3);

        const resumeLower = resumeText.toLowerCase();

        const matchingWords = jobWords.filter((word) =>
          resumeLower.includes(word)
        );

        if (jobWords.length > 0) {
          calculatedScore = Math.min(
            100,
            Math.round((matchingWords.length / jobWords.length) * 100)
          );
        }
      }

      setLocalScore(calculatedScore);
      setLocalMatchedSkills(matched);
      setLocalMissingSkills(missing);

      // Send results to App.jsx
      setScore(calculatedScore);
      setMatchedSkills(matched);
      setMissingSkills(missing);

      setAnalysisDone(true);
      setLoading(false);
    }, 1000);
  };

  // -----------------------------------------
  // Go to Dashboard
  // -----------------------------------------
  const viewDashboard = () => {
    navigate("/dashboard");
  };

  // -----------------------------------------
  // Download ATS Report
  // -----------------------------------------
  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("ATS Resume Analysis Report", 20, 20);

    doc.setFontSize(14);
    doc.text(`ATS Score: ${score}/100`, 20, 35);

    doc.setFontSize(12);

    let y = 50;

    doc.text("Matched Skills:", 20, y);
    y += 10;

    if (matchedSkills.length === 0) {
      doc.text("No matched skills found.", 25, y);
      y += 10;
    } else {
      matchedSkills.forEach((skill) => {
        doc.text(`✓ ${skill}`, 25, y);
        y += 8;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    }

    y += 5;

    doc.text("Missing Skills:", 20, y);
    y += 10;

    if (missingSkills.length === 0) {
      doc.text("No missing skills found.", 25, y);
    } else {
      missingSkills.forEach((skill) => {
        doc.text(`• ${skill}`, 25, y);
        y += 8;

        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
    }

    doc.save("ATS-Resume-Analysis-Report.pdf");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #06152f, #082b55, #031225)",
        color: "white",
        padding: "40px 20px"
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto"
        }}
      >
        {/* -------------------------------- */}
        {/* Header */}
        {/* -------------------------------- */}

        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px"
          }}
        >
          ATS Analyzer
        </h1>

        <p
          style={{
            fontSize: "18px",
            color: "#b8c7dc"
          }}
        >
          AI-Powered Resume Analysis
        </p>

        <h2
          style={{
            marginTop: "35px",
            fontSize: "30px"
          }}
        >
          Optimize Your Resume for Every Opportunity
        </h2>

        <p
          style={{
            color: "#c8d5e8",
            marginBottom: "35px"
          }}
        >
          Analyze your resume against a job description and discover exactly
          which skills can improve your ATS compatibility.
        </p>

        {/* -------------------------------- */}
        {/* Upload Resume */}
        {/* -------------------------------- */}

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "25px"
          }}
        >
          <h2>📄 Upload Resume</h2>

          <p>PDF files supported</p>

          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            style={{
              padding: "12px",
              background: "white",
              color: "black",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "500px"
            }}
          />

          {resumeFile && (
            <p
              style={{
                marginTop: "15px",
                color: "#6cff8d"
              }}
            >
              ✅ Resume selected: {resumeFile.name}
            </p>
          )}
        </div>

        {/* -------------------------------- */}
        {/* Job Description */}
        {/* -------------------------------- */}

        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            padding: "25px",
            borderRadius: "15px",
            marginBottom: "25px"
          }}
        >
          <h2>💼 Job Description</h2>

          <p>Paste the job requirements below</p>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job requirements here...

Example:
React
JavaScript
Git
Communication
Teamwork"
            rows={8}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #607da8",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              fontSize: "16px",
              resize: "vertical"
            }}
          />

          <p
            style={{
              color: "#b8c7dc"
            }}
          >
            {jobDescription.length} characters
          </p>
        </div>

        {/* -------------------------------- */}
        {/* Analyze Button */}
        {/* -------------------------------- */}

        <button
          onClick={analyzeResume}
          disabled={loading}
          style={{
            width: "100%",
            maxWidth: "300px",
            padding: "15px 25px",
            border: "none",
            borderRadius: "10px",
            background:
              "linear-gradient(90deg, #22b8ff, #00d4ff)",
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "⏳ Analyzing..." : "🔎 Analyze ATS Score"}
        </button>

        {/* -------------------------------- */}
        {/* Analysis Result */}
        {/* -------------------------------- */}

        {analysisDone && (
          <div
            style={{
              marginTop: "40px",
              padding: "30px",
              background: "rgba(255,255,255,0.08)",
              borderRadius: "15px"
            }}
          >
            <p
              style={{
                color: "#6cff8d",
                fontWeight: "bold"
              }}
            >
              ANALYSIS COMPLETE
            </p>

            <h2>Your ATS Analysis</h2>

            <p
              style={{
                fontSize: "20px"
              }}
            >
              ✓ Completed
            </p>

            {/* Score */}

            <div
              style={{
                fontSize: "42px",
                fontWeight: "bold",
                margin: "20px 0"
              }}
            >
              {score}/100
            </div>

            <h2>ATS Compatibility</h2>

            <p
              style={{
                fontSize: "18px",
                color:
                  score >= 70
                    ? "#6cff8d"
                    : score >= 40
                    ? "#ffd166"
                    : "#ff7777"
              }}
            >
              {score >= 70
                ? "Good Match"
                : score >= 40
                ? "Needs Improvement"
                : "Poor Match"}
            </p>

            {/* Matched Skills */}

            <div style={{ marginTop: "30px" }}>
              <h2>✓ Matched Skills</h2>

              {matchedSkills.length === 0 ? (
                <p>No matched skills found.</p>
              ) : (
                <div>
                  {matchedSkills.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        background: "#087f5b",
                        padding: "8px 12px",
                        borderRadius: "20px",
                        margin: "5px"
                      }}
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Skills */}

            <div style={{ marginTop: "30px" }}>
              <h2>⚠ Missing Skills</h2>

              {missingSkills.length === 0 ? (
                <p>No missing skills found.</p>
              ) : (
                <div>
                  {missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        display: "inline-block",
                        background: "#a61e4d",
                        padding: "8px 12px",
                        borderRadius: "20px",
                        margin: "5px"
                      }}
                    >
                      • {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}

            <div
              style={{
                display: "flex",
                gap: "15px",
                flexWrap: "wrap",
                marginTop: "35px",
              }}
            >
              <button
                onClick={downloadReport}
                style={{
                  padding: "13px 22px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#22b8ff",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                📥 Download Report
              </button>

              <button
                onClick={viewDashboard}
                style={{
                  padding: "13px 22px",
                  border: "none",
                  borderRadius: "8px",
                  background: "#087f5b",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                📊 View ATS Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadResume;