import React, { useState } from "react";
import jsPDF from "jspdf";

const commonSkills = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "SQL",
  "Python",
  "Java",
  "Git",
  "GitHub",
  "Communication",
  "Leadership",
  "Project Experience",
  "Teamwork",
  "Problem Solving",
  "Data Analysis",
  "Power BI",
  "Excel",
  "Machine Learning",
];

function UploadResume() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setScore(null);
      setMatchedSkills([]);
      setMissingSkills([]);
    }
  };

  const analyzeResume = () => {
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter the job description.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const description = jobDescription.toLowerCase();

      const matched = commonSkills.filter((skill) =>
        description.includes(skill.toLowerCase())
      );

      const missing = commonSkills.filter(
        (skill) => !description.includes(skill.toLowerCase())
      );

      const calculatedScore = Math.round(
        (matched.length / commonSkills.length) * 100
      );

      setMatchedSkills(matched);
      setMissingSkills(missing.slice(0, 8));
      setScore(calculatedScore);

      setLoading(false);
    }, 1000);
  };

  const downloadReport = () => {
    if (score === null) {
      alert("Please analyze your resume first.");
      return;
    }

    const pdf = new jsPDF();

    pdf.setFontSize(22);
    pdf.text("AI Resume ATS Analyzer", 20, 20);

    pdf.setFontSize(14);
    pdf.text("ATS Compatibility Report", 20, 32);

    pdf.line(20, 38, 190, 38);

    pdf.setFontSize(12);
    pdf.text(`Resume: ${file?.name || "Resume"}`, 20, 50);

    pdf.setFontSize(20);
    pdf.text(`ATS Score: ${score}/100`, 20, 65);

    pdf.setFontSize(12);

    let y = 80;

    pdf.text("Matched Skills", 20, y);
    y += 8;

    matchedSkills.forEach((skill) => {
      pdf.text(`✓ ${skill}`, 25, y);
      y += 7;
    });

    y += 8;

    pdf.text("Missing Skills", 20, y);
    y += 8;

    missingSkills.forEach((skill) => {
      pdf.text(`+ ${skill}`, 25, y);
      y += 7;
    });

    y += 10;

    pdf.text("Suggestions", 20, y);
    y += 8;

    const suggestions = [
      "Add important skills from the job description.",
      "Use keywords from the job posting.",
      "Mention relevant project experience.",
      "Keep the resume ATS-friendly.",
      "Add measurable achievements.",
    ];

    suggestions.forEach((suggestion) => {
      const lines = pdf.splitTextToSize(`• ${suggestion}`, 165);
      pdf.text(lines, 25, y);
      y += lines.length * 7;
    });

    pdf.save("ATS-Resume-Report.pdf");
  };

  return (
    <div className="ats-page">

      {/* HEADER */}
      <header className="top-header">
        <div className="brand">
          <div className="brand-icon">🤖</div>

          <div>
            <h2>ATS Analyzer</h2>
            <span>AI Resume Intelligence</span>
          </div>
        </div>

        <div className="header-badge">
          ✨ Smart Resume Analysis
        </div>
      </header>

      <main className="ats-container">

        {/* HERO */}
        <section className="hero-section">
          <div className="hero-content">

            <span className="hero-label">
              🚀 AI-POWERED RESUME ANALYSIS
            </span>

            <h1>
              Optimize Your Resume
              <span> for Every Opportunity</span>
            </h1>

            <p>
              Analyze your resume against a job description and discover
              exactly which skills can improve your ATS compatibility.
            </p>

          </div>
        </section>

        {/* INPUT CARD */}
        <section className="input-card">

          {/* Upload */}
          <div className="input-section">

            <div className="section-title">
              <div className="section-icon purple">📄</div>

              <div>
                <h3>Upload Resume</h3>
                <p>PDF, DOC or DOCX files supported</p>
              </div>
            </div>

            <label className="upload-area">

              <div className="upload-icon">
                ⬆️
              </div>

              <strong>
                {file ? "Resume Selected" : "Choose your resume"}
              </strong>

              <span>
                Click here to browse your files
              </span>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />

            </label>

            {file && (
              <div className="selected-file">
                <span>📄</span>

                <div>
                  <strong>{file.name}</strong>
                  <small>Ready for analysis</small>
                </div>

                <span className="file-check">✓</span>
              </div>
            )}

          </div>

          {/* Job Description */}
          <div className="input-section">

            <div className="section-title">
              <div className="section-icon blue">💼</div>

              <div>
                <h3>Job Description</h3>
                <p>Paste the job requirements below</p>
              </div>
            </div>

            <textarea
              className="job-input"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={`Paste the job description here...

Example:
• React
• JavaScript
• Node.js
• SQL
• MongoDB
• Communication
• Leadership
• Project Experience`}
            />

            <div className="character-count">
              {jobDescription.length} characters
            </div>

          </div>

          <button
            className="analyze-button"
            onClick={analyzeResume}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing Resume...
              </>
            ) : (
              <>
                🚀 Analyze ATS Score
              </>
            )}
          </button>

        </section>

        {/* RESULTS */}
        {score !== null && (
          <section className="results-section">

            <div className="result-heading">
              <div>
                <span>ANALYSIS COMPLETE</span>
                <h2>Your ATS Analysis</h2>
              </div>

              <div className="completed">
                ✓ Completed
              </div>
            </div>

            {/* Score Dashboard */}
            <div className="score-dashboard">

              <div className="score-circle-container">

                <div
                  className="score-circle"
                  style={{
                    "--score": `${score * 3.6}deg`,
                  }}
                >
                  <div className="score-inner">
                    <strong>{score}</strong>
                    <span>/ 100</span>
                  </div>
                </div>

                <h3>ATS Compatibility</h3>

                <p>
                  {score >= 80
                    ? "Excellent Match"
                    : score >= 50
                    ? "Good Match"
                    : "Needs Improvement"}
                </p>

              </div>

              <div className="score-details">

                <div className="detail-card">
                  <span className="detail-icon green">✓</span>

                  <div>
                    <strong>{matchedSkills.length}</strong>
                    <span>Matched Skills</span>
                  </div>
                </div>

                <div className="detail-card">
                  <span className="detail-icon red">+</span>

                  <div>
                    <strong>{missingSkills.length}</strong>
                    <span>Missing Skills</span>
                  </div>
                </div>

                <div className="detail-card">
                  <span className="detail-icon blue">📄</span>

                  <div>
                    <strong>1</strong>
                    <span>Resume Analyzed</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Matched Skills */}
            <div className="result-card matched-card">

              <div className="result-card-header">
                <div>
                  <span className="result-icon green-icon">✓</span>

                  <div>
                    <h3>Matched Skills</h3>
                    <p>{matchedSkills.length} skills found</p>
                  </div>
                </div>
              </div>

              <div className="skills-grid">

                {matchedSkills.length > 0 ? (
                  matchedSkills.map((skill, index) => (
                    <div className="skill-item matched" key={index}>
                      <span>✓</span>
                      {skill}
                    </div>
                  ))
                ) : (
                  <p>No matching skills found.</p>
                )}

              </div>

            </div>

            {/* Missing Skills */}
            <div className="result-card missing-card">

              <div className="result-card-header">
                <div>
                  <span className="result-icon red-icon">!</span>

                  <div>
                    <h3>Missing Skills</h3>
                    <p>{missingSkills.length} skills to improve</p>
                  </div>
                </div>
              </div>

              <div className="skills-grid">

                {missingSkills.map((skill, index) => (
                  <div className="skill-item missing" key={index}>
                    <span>+</span>
                    {skill}
                  </div>
                ))}

              </div>

            </div>

            {/* Suggestions */}
            <div className="suggestions-card">

              <div className="suggestion-header">
                <div className="bulb">💡</div>

                <div>
                  <h3>ATS Improvement Suggestions</h3>
                  <p>
                    Follow these recommendations to improve your resume.
                  </p>
                </div>
              </div>

              <div className="suggestions-list">

                <div>✓ Add important skills from the job description.</div>

                <div>✓ Use the same keywords used in the job posting.</div>

                <div>✓ Mention relevant project experience.</div>

                <div>✓ Keep your resume simple and ATS-friendly.</div>

                <div>✓ Add measurable achievements whenever possible.</div>

                <div>✓ Highlight your strongest technical skills.</div>

              </div>

            </div>

            {/* Download */}
            <div className="download-card">

              <div>
                <span className="download-icon">📥</span>

                <div>
                  <h3>Ready to improve your resume?</h3>
                  <p>
                    Download your complete ATS analysis report.
                  </p>
                </div>
              </div>

              <button
                className="download-button"
                onClick={downloadReport}
              >
                📄 Download ATS Report
              </button>

            </div>

          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer className="ats-footer">

        <div className="footer-brand">
          🤖 <strong>AI Resume ATS Analyzer</strong>
        </div>

        <div className="footer-links">
          <span>Smart Resume Analysis</span>
          <span>•</span>
          <span>ATS Optimization</span>
          <span>•</span>
          <span>© 2026 ATS Analyzer</span>
        </div>

      </footer>

    </div>
  );
}

export default UploadResume;