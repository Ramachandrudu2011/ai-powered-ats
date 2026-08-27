import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import UploadResume from "./UploadResume";
import Dashboard from "./Dashboard";

function App() {
  // ATS result data
  const [score, setScore] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [missingSkills, setMissingSkills] = useState([]);

  return (
    <BrowserRouter>

      <Routes>

        {/* Resume Upload Page */}
        <Route
          path="/"
          element={
            <UploadResume
              setScore={setScore}
              setMatchedSkills={setMatchedSkills}
              setMissingSkills={setMissingSkills}
            />
          }
        />

        {/* ATS Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Dashboard
              score={score}
              matchedSkills={matchedSkills}
              missingSkills={missingSkills}
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;