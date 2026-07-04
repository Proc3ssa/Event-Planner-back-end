const express = require("express");
const router = express.Router();
const {
  generateInvitation,
  getInvitation,
  respondToInvitation,
  listInvitations,
  setAttendance,
  setTableNumber,
  removeInvitation,
  sendInvitation,
  sendInvitationSMSController
} = require("../controllers/invitation.controller");

const { verifyToken, requireRole } = require("../middleware/auth.middleware");

// Protected — only organizers can generate links
router.post("/", verifyToken, requireRole("organizer"), generateInvitation);

router.post("/send-sms", verifyToken, requireRole("organizer"), sendInvitationSMSController);

router.get(
  "/event/:event_id",
  verifyToken,
  requireRole("organizer"),
  listInvitations,
);
router.patch(
  "/:id/attendance",
  verifyToken,
  requireRole("organizer"),
  setAttendance,
);
router.patch(
  "/:id/table",
  verifyToken,
  requireRole("organizer"),
  setTableNumber,
);
router.delete("/:id", verifyToken, requireRole("organizer"), removeInvitation);



router.post("/send-email", verifyToken, requireRole("organizer"), sendInvitation);

// Public — attendees access these without login
router.get("/:token", getInvitation);
router.patch("/:token/respond", respondToInvitation);

module.exports = router;
