import React, { useState } from "react";
import jsPDF from "jspdf";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import "./UploadResume.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Skills that the ATS can recognize
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
  const [resumeText, setResumeText] = useState("");
  const [score, setScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resumeWordCount, setResumeWordCount] = useState(0);
  const [jobWordCount, setJobWordCount] = useState(0);
  const [totalJobSkills, setTotalJobSkills] = useState(0);

  // SELECT RESUME
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF resume.");
      return;
    }

    setFile(selectedFile);
    setScore(null);
    setMatchedSkills([]);
    setMissingSkills([]);
    setResumeText("");
  };

  // EXTRACT TEXT FROM PDF
  const extractPdfText = async (selectedFile) => {
    const arrayBuffer = await selectedFile.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;

    let extractedText = "";

    for (
      let pageNumber = 1;
      pageNumber <= pdf.numPages;
      pageNumber++
    ) {
      const page = await pdf.getPage(pageNumber);

      const textContent = await page.getTextContent();

      const pageText = textContent.items
        .map((item) => item.str)
        .join(" ");

      extractedText += pageText + "\n";
    }

    return extractedText;
  };

  // ANALYZE RESUME
  const analyzeResume = async () => {
    if (!file) {
      alert("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter the job description.");
      return;
    }

    setLoading(true);

    try {
      const extractedText = await extractPdfText(file);

      setResumeText(extractedText);

      const resume = extractedText.toLowerCase();
      const description = jobDescription.toLowerCase();

      // Skills required in job description
      const jobSkills = commonSkills.filter((skill) =>
        description.includes(skill.toLowerCase())
      );
      const resumeWords = extractedText
  .trim()
  .split(/\s+/)
  .filter(Boolean).length;

const jobWords = jobDescription
  .trim()
  .split(/\s+/)
  .filter(Boolean).length;

setResumeWordCount(resumeWords);
setJobWordCount(jobWords);
setTotalJobSkills(jobSkills.length);

      // Skills matched in resume
      const matched = jobSkills.filter((skill) =>
        resume.includes(skill.toLowerCase())
      );

      // Skills missing from resume
      const missing = jobSkills.filter(
        (skill) => !resume.includes(skill.toLowerCase())
      );

      // Calculate ATS score
      let calculatedScore = 0;

      if (jobSkills.length > 0) {
        calculatedScore = Math.round(
          (matched.length / jobSkills.length) * 100
        );
      }

      setMatchedSkills(matched);
      setMissingSkills(missing);
      setScore(calculatedScore);

      alert("Resume analyzed successfully!");
    } catch (error) {
      console.error("Resume analysis error:", error);

      alert(
        "Unable to read this PDF. Please make sure it is a valid text-based PDF."
      );
    } finally {
      setLoading(false);
    }
  };

  // DOWNLOAD ATS REPORT
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

    // MATCHED SKILLS
    pdf.text("Matched Skills", 20, y);
    y += 8;

    if (matchedSkills.length === 0) {
      pdf.text("No matching skills found.", 25, y);
      y += 7;
    } else {
      matchedSkills.forEach((skill) => {
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }

        pdf.text(`- ${skill}`, 25, y);
        y += 7;
      });
    }

    y += 8;

    // MISSING SKILLS
    pdf.text("Missing Skills", 20, y);
    y += 8;

    if (missingSkills.length === 0) {
      pdf.text("No missing skills found.", 25, y);
      y += 7;
    } else {
      missingSkills.forEach((skill) => {
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }

        pdf.text(`- ${skill}`, 25, y);
        y += 7;
      });
    }

    y += 10;

    // DYNAMIC SUGGESTIONS
    if (y > 230) {
      pdf.addPage();
      y = 20;
    }

    pdf.text("ATS Improvement Suggestions", 20, y);
    y += 8;

    const suggestions =
      missingSkills.length > 0
        ? [
            ...missingSkills
              .slice(0, 4)
              .map(
                (skill) =>
                  `Consider adding or improving your experience with ${skill}.`
              ),
            "Use important keywords from the job description.",
            "Mention relevant projects and achievements.",
          ]
        : [
            "Excellent! Your resume covers all detected job skills.",
            "Add measurable achievements to make your resume stronger.",
            "Keep your resume simple and ATS-friendly.",
          ];

    suggestions.forEach((suggestion) => {
      const lines = pdf.splitTextToSize(
        `- ${suggestion}`,
        165
      );

      if (y > 260) {
        pdf.addPage();
        y = 20;
      }

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
          {/* RESUME UPLOAD */}
          <div className="input-section">
            <div className="section-title">
              <div className="section-icon purple">📄</div>

              <div>
                <h3>Upload Resume</h3>
                <p>PDF files supported</p>
              </div>
            </div>

            <label className="upload-area">
              <div className="upload-icon">⬆️</div>

              <strong>
                {file
                  ? "Resume Selected"
                  : "Choose your resume"}
              </strong>

              <span>Click here to browse your files</span>

              <input
                type="file"
                accept=".pdf,application/pdf"
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

          {/* JOB DESCRIPTION */}
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
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
              placeholder={`Paste the job description here...

Example:
• React
• JavaScript
• Node.js
• SQL
• MongoDB
• Communication
• Leadership`}
            />

            <div className="character-count">
              {jobDescription.length} characters
            </div>
          </div>

          {/* ANALYZE BUTTON */}
          <button
            className="analyze-button"
            onClick={analyzeResume}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Reading Resume...
              </>
            ) : (
              <>🚀 Analyze ATS Score</>
            )}
          </button>
        </section>

        {/* RESULTS */}
        {score !== null && (
          <section className="results-section">
            {/* RESULT HEADER */}
            <div className="result-heading">
              <div>
                <span>ANALYSIS COMPLETE</span>
                <h2>Your ATS Analysis</h2>
              </div>

              <div className="completed">
                ✓ Completed
              </div>
            </div>

            {/* SCORE DASHBOARD */}
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
                  {score >= 90
                    ? "Outstanding Match 🚀"
                    : score >= 75
                    ? "Excellent Match 🌟"
                    : score >= 60
                    ? "Good Match 👍"
                    : score >= 40
                    ? "Average Match 📈"
                    : "Needs Improvement 💡"}
                </p>
              </div>

              {/* DETAILS */}
              <div className="score-details">
                <div className="detail-card">
                  <span className="detail-icon green">✓</span>

                  <div>
                    <strong>{matchedSkills.length}</strong>
                    <span>Matched Skills</span>
                  </div>
                </div>

                <div className="detail-card">
                  <span className="detail-icon red">!</span>

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

            {/* ANALYSIS SUMMARY */}
            <div className="analysis-summary">
              <div className="summary-card">
                <span className="summary-icon">🎯</span>

                <div>
                  <h3>Overall Analysis</h3>

                  <p>
                    Your resume matches {matchedSkills.length} out of{" "}
                    {matchedSkills.length + missingSkills.length} detected job
                    skills.
                  </p>
                </div>
              </div>

              <div className="summary-status">
                {score >= 90
                  ? "Outstanding! Your resume strongly matches the requirements for this role."
                  : score >= 75
                  ? "Excellent! Your resume has a strong match with the job requirements."
                  : score >= 60
                  ? "Good match! Adding a few more relevant skills can improve your score."
                  : score >= 40
                  ? "Average match. Focus on adding important missing skills and relevant experience."
                  : "Needs improvement. Review the job requirements and update your resume with relevant skills."}
              </div>
            </div>

            {/* MATCHED SKILLS */}
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
                    <div
                      className="skill-item matched"
                      key={index}
                    >
                      <span>✓</span>
                      {skill}
                    </div>
                  ))
                ) : (
                  <p>No matching skills found.</p>
                )}
              </div>
            </div>

            {/* MISSING SKILLS */}
            <div className="result-card missing-card">
              <div className="result-card-header">
                <div>
                  <span className="result-icon red-icon">!</span>

                  <div>
                    <h3>Missing Skills</h3>
                    <p>
                      {missingSkills.length} skills to improve
                    </p>
                  </div>
                </div>
              </div>

              <div className="skills-grid">
                {missingSkills.length > 0 ? (
                  missingSkills.map((skill, index) => (
                    <div
                      className="skill-item missing"
                      key={index}
                    >
                      <span>+</span>
                      {skill}
                    </div>
                  ))
                ) : (
                  <p>No major missing skills found.</p>
                )}
              </div>
            </div>

            {/* DYNAMIC SUGGESTIONS */}
            <div className="suggestions-card">
              <div className="suggestion-header">
                <div className="bulb">💡</div>

                <div>
                  <h3>ATS Improvement Suggestions</h3>

                  <p>
                    Personalized suggestions based on your resume analysis.
                  </p>
                </div>
              </div>

              <div className="suggestions-list">
                {missingSkills.length > 0 ? (
                  <>
                    {missingSkills
                      .slice(0, 4)
                      .map((skill, index) => (
                        <div key={index}>
                          ✓ Consider adding or improving your experience with{" "}
                          <strong>{skill}</strong>.
                        </div>
                      ))}

                    <div>
                      ✓ Use important keywords from the job description.
                    </div>

                    <div>
                      ✓ Mention relevant projects and achievements.
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      ✓ Excellent! Your resume covers all detected job skills.
                    </div>

                    <div>
                      ✓ Add measurable achievements to make your resume stronger.
                    </div>

                    <div>
                      ✓ Keep your resume simple and ATS-friendly.
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* DOWNLOAD */}
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