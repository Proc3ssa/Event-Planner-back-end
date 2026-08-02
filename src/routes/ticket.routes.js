const express = require("express");
const router = express.Router();
const { generateTicket, getTicket, verifyTicket } = require("../controllers/ticket.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

router.post("/", verifyToken, requireRole("organizer"), generateTicket);
router.get("/:token", getTicket);
router.post("/verify/:token", verifyToken, requireRole("receptionist"), verifyTicket);

module.exports = router;