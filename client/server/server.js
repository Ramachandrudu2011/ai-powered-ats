const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    res.json({
      success: true,
      file: req.file.filename,
      resumeText: "Java Python React SQL Project Communication Leadership",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});