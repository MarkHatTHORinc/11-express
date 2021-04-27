const path = require("path");
const router = require("express").Router();

// ==========
// ROUTES
// ==========

// Return the notes.html 
router.get("/notes", function (req, res) {
    res.sendFile(path.join(rootDir, "/notes.html"));
});

// Default to index.html
router.get("*", function (req, res) {
    res.sendFile(path.join(rootDir, "/index.html"));
});

module.exports = router;