// File Controller
// Importing necessary libraries and modules
const multer = require("multer");
const path = require("path");
global.__basedir = path.resolve();
const fs = require("fs");

// Configuring storage for uploaded profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 2, // Limit file size to 2MB (2,048 KB)
  },
  fileFilter: (req, file, cb) => {
    // Allow only specific image file types
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      cb(new Error("Supported File Types: .jpeg, .jpg, .png"));
    }
  },
}).single("profileimg");

// Upload profile pictures
const uploadProfileimg = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(400).json({ error: err.message });
    }
    res.json({
      success: true,
      message: "Profile picture uploaded successfully",
      fileName: req.file.filename,
    });
  });
};

// Download profile pictures
const downloadFile = (req, res) => {
  try {
    const fileName = req.params.fileName;
    const filePath = __basedir + "/uploads/" + fileName;

    res.download(filePath, (error) => {
      if (error) {
        console.error("Error downloading file:", error);
        res.status(500).send({ message: "File cannot be downloaded" });
      }
    });
  } catch (error) {
    console.error("Error during file download:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// Exporting the router
module.exports = { uploadProfileimg, downloadFile };