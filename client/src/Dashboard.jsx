import React from "react";

function Dashboard({ score, matchedSkills = [], missingSkills = [] }) {
  const hasScore = score !== null && score !== undefined;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #06152f 0%, #082b4f 50%, #03101f 100%)",
        color: "white",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "auto",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <h1
            style={{
              fontSize: "38px",
              marginBottom: "10px",
              fontWeight: "700",
            }}
          >
            ATS Dashboard
          </h1>

          <p
            style={{
              fontSize: "18px",
              color: "#b8c7d9",
              margin: 0,
            }}
          >
            Your resume analysis results
          </p>
        </div>

        {/* ATS Score */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "18px",
            padding: "30px",
            textAlign: "center",
            marginBottom: "25px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>ATS Score</h2>

          <div
            style={{
              fontSize: "52px",
              fontWeight: "bold",
              margin: "15px 0",
            }}
          >
            {hasScore ? `${score}/100` : "0/100"}
          </div>

          <p style={{ color: "#c8d5e5" }}>
            {hasScore
              ? "Your resume has been analyzed."
              : "Upload and analyze your resume to get your ATS score."}
          </p>
        </div>

        {/* Application Status */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "18px",
            padding: "30px",
            marginBottom: "25px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Application Status</h2>

          <p style={{ color: "#c8d5e5" }}>
            Resume analysis is ready for your job application.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              marginTop: "20px",
            }}
          >
            <div
              style={{
                background: "rgba(255, 255, 255, 0.07)",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              <strong style={{ display: "block", marginBottom: "8px" }}>
                Resume
              </strong>

              <span style={{ color: "#55e878" }}>✓ Uploaded</span>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.07)",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              <strong style={{ display: "block", marginBottom: "8px" }}>
                ATS Analysis
              </strong>

              <span style={{ color: "#55e878" }}>
                {hasScore ? "✓ Completed" : "○ Pending"}
              </span>
            </div>

            <div
              style={{
                background: "rgba(255, 255, 255, 0.07)",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              <strong style={{ display: "block", marginBottom: "8px" }}>
                Job Matching
              </strong>

              <span style={{ color: "#55e878" }}>
                {hasScore ? "✓ Ready" : "○ Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Matched Skills */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "18px",
            padding: "30px",
            marginBottom: "25px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Matched Skills</h2>

          {matchedSkills.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {matchedSkills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    background: "rgba(40, 200, 120, 0.18)",
                    border: "1px solid rgba(40, 200, 120, 0.4)",
                    color: "#72f5a0",
                    padding: "8px 14px",
                    borderRadius: "20px",
                  }}
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ color: "#b8c7d9" }}>No matched skills found.</p>
          )}
        </div>

        {/* Missing Skills */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "18px",
            padding: "30px",
            marginBottom: "25px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Missing Skills</h2>

          {missingSkills.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              {missingSkills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    background: "rgba(255, 80, 80, 0.15)",
                    border: "1px solid rgba(255, 80, 80, 0.4)",
                    color: "#ff8d8d",
                    padding: "8px 14px",
                    borderRadius: "20px",
                  }}
                >
                  ✕ {skill}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ color: "#b8c7d9" }}>No missing skills found.</p>
          )}
        </div>

        {/* Summary */}
        <div
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "18px",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Analysis Summary</h2>

          <p style={{ color: "#c8d5e5", lineHeight: "1.6" }}>
            Your resume has been evaluated against the provided job
            requirements. Use the matched and missing skills above to improve
            your resume and increase your chances of passing ATS screening.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;