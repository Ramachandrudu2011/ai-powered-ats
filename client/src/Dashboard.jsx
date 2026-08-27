import React, { useEffect, useState } from "react";

function Dashboard() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedResult = localStorage.getItem("atsResult");

    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

  if (!result) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#071a3d",
          color: "white",
          textAlign: "center",
          paddingTop: "80px",
        }}
      >
        <h1>ATS Dashboard</h1>

        <h3>⚠️ No Resume Analysis Found</h3>

        <p>
          Please upload and analyze your resume first.
        </p>

        <button
          onClick={() => {
            window.location.href = "/";
          }}
          style={{
            padding: "12px 25px",
            border: "none",
            borderRadius: "8px",
            background: "#00bfff",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Upload Resume
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#071a3d",
        color: "white",
        padding: "50px",
        textAlign: "center",
      }}
    >
      <h1>ATS Dashboard</h1>

      <h2>
        Resume Uploaded Successfully ✅
      </h2>

      <p>
        Resume: <strong>{result.resumeName}</strong>
      </p>

      {/* ATS SCORE */}

      <div
        style={{
          margin: "30px auto",
          padding: "30px",
          maxWidth: "500px",
          background: "#102a5c",
          borderRadius: "15px",
        }}
      >
        <h2>ATS Score</h2>

        <div
          style={{
            fontSize: "60px",
            fontWeight: "bold",
            color:
              result.score >= 80
                ? "#00ff88"
                : result.score >= 50
                ? "#ffd700"
                : "#ff5555",
          }}
        >
          {result.score}/100
        </div>

        <p>
          {result.score >= 80
            ? "Excellent Match 🎉"
            : result.score >= 50
            ? "Good Match 👍"
            : "Needs Improvement ⚠️"}
        </p>
      </div>

      {/* MATCHED SKILLS */}

      <div
        style={{
          margin: "30px auto",
          padding: "25px",
          maxWidth: "700px",
          background: "#102a5c",
          borderRadius: "15px",
        }}
      >
        <h2>✅ Matched Skills</h2>

        {result.matchedSkills.length > 0 ? (
          <div>
            {result.matchedSkills.map((skill, index) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  margin: "6px",
                  padding: "8px 15px",
                  background: "#126b45",
                  borderRadius: "20px",
                }}
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        ) : (
          <p>No matching skills found.</p>
        )}
      </div>

      {/* MISSING SKILLS */}

      <div
        style={{
          margin: "30px auto",
          padding: "25px",
          maxWidth: "700px",
          background: "#102a5c",
          borderRadius: "15px",
        }}
      >
        <h2>⚠️ Missing Skills</h2>

        {result.missingSkills.length > 0 ? (
          <div>
            {result.missingSkills.map((skill, index) => (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  margin: "6px",
                  padding: "8px 15px",
                  background: "#8b3030",
                  borderRadius: "20px",
                }}
              >
                + {skill}
              </span>
            ))}
          </div>
        ) : (
          <p>No missing skills found 🎉</p>
        )}
      </div>

      {/* BUTTON */}

      <button
        onClick={() => {
          window.location.href = "/";
        }}
        style={{
          marginTop: "20px",
          padding: "14px 30px",
          border: "none",
          borderRadius: "8px",
          background: "#00bfff",
          color: "white",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Analyze Another Resume
      </button>
    </div>
  );
}

export default Dashboard;