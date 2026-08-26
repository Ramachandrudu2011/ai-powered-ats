const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
});

app.post("/api/resume/parse", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No resume uploaded",
      });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF resumes are supported",
      });
    }

    const pdfData = await pdfParse(req.file.buffer);

    res.json({
      message: "Resume parsed successfully",
      fileName: req.file.originalname,
      text: pdfData.text,
    });
  } catch (error) {
    console.error("Resume parsing error:", error);

    res.status(500).json({
      message: "Failed to parse resume",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});