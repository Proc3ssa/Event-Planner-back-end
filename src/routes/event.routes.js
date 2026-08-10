const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { newEvent, listEvents, getEvent, removeEvent, editEvent } = require("../controllers/event.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.get("/all", verifyToken, listEvents);
router.get("/", verifyToken, requireRole("organizer"), listEvents);
router.post("/", verifyToken, requireRole("organizer"), upload.single("flyer"), newEvent);
router.get("/:id", verifyToken, getEvent);
router.delete("/:id", verifyToken, requireRole("organizer"), removeEvent);
router.put("/:id", verifyToken, requireRole("organizer"), editEvent);

module.exports = router;