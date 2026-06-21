const express = require("express");
const router = express.Router();
const { addUser, listUsers, toggleUserStatus } = require("../controllers/user.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

router.post("/", verifyToken, requireRole("organizer"), addUser);
router.get("/:role", verifyToken, requireRole("organizer"), listUsers);
router.patch("/:id/status", verifyToken, requireRole("organizer"), toggleUserStatus);

module.exports = router;