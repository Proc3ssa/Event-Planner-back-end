const crypto = require("crypto");
const {
  createInvitation,
  getInvitationByToken,
  updateInvitationStatus,
  getInvitationsByEvent,
  updateAttendance,
  updateTableNumber,
  deleteInvitation,
} = require("../models/invitation.model");
const { createTicket } = require("../models/ticket.model");
const { sendInvitationEmail, sendTicketEmail } = require("../services/mailService");
const { sendInvitationSMS, sendTicketSMS } = require("../services/smsService");

const generateInvitation = async (req, res) => {
  const { event_id, recipient_name, recipient_contact, contact_type } = req.body;

  if (!event_id || !recipient_name || !recipient_contact || !contact_type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const token = crypto.randomBytes(32).toString("hex");
    await createInvitation({ event_id, token, recipient_name, recipient_contact, contact_type });
    const link = `${process.env.FRONTEND_URL}/invite/${token}`;
    res.status(201).json({ message: "Invitation created", link, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getInvitation = async (req, res) => {
  const { token } = req.params;
  try {
    const invitation = await getInvitationByToken(token);
    if (!invitation) return res.status(404).json({ message: "Invitation not found" });
    if (invitation.status === "used") return res.status(410).json({ message: "This invitation link has already been used" });
    res.json({ invitation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const respondToInvitation = async (req, res) => {
  const { token } = req.params;
  const { response } = req.body;

  if (!["accepted", "declined"].includes(response)) {
    return res.status(400).json({ message: "Invalid response" });
  }

  try {
    const invitation = await getInvitationByToken(token);
    if (!invitation) return res.status(404).json({ message: "Invitation not found" });
    if (invitation.status === "used") return res.status(410).json({ message: "This link has already been used" });

    await updateInvitationStatus(token, response);

    // Auto-generate and send ticket when accepted
    if (response === "accepted") {
      const ticketToken = crypto.randomBytes(32).toString("hex");

      await createTicket({
        event_id: invitation.event_id,
        token: ticketToken,
        recipient_name: invitation.recipient_name,
        recipient_contact: invitation.recipient_contact,
        contact_type: invitation.contact_type,
      });

      const ticketLink = `${process.env.FRONTEND_URL}/ticket/${ticketToken}`;
      const checkInUrl = `${process.env.BACKEND_URL}/api/tickets/verify/${ticketToken}`;

      const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

      const formatTime = (time) => {
        const [h, m] = time.split(":");
        const hour = +h % 12 || 12;
        const ampm = +h >= 12 ? "PM" : "AM";
        return `${hour}:${m} ${ampm}`;
      };

      const eventDate = formatDate(invitation.date);
      const eventTime = formatTime(invitation.time);

      if (invitation.contact_type === "email") {
        await sendTicketEmail({
          recipientName: invitation.recipient_name,
          recipientEmail: invitation.recipient_contact,
          eventName: invitation.event_name,
          eventDate,
          eventTime,
          eventVenue: invitation.venue,
          ticketLink,
          checkInUrl,
        });
      } else {
        await sendTicketSMS({
          recipientName: invitation.recipient_name,
          recipientPhone: invitation.recipient_contact,
          eventName: invitation.event_name,
          eventDate,
          eventTime,
          eventVenue: invitation.venue,
          ticketLink,
        });
      }
    }

    res.json({ message: `Invitation ${response}` });
  } catch (err) {
    console.error("respondToInvitation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const listInvitations = async (req, res) => {
  try {
    const invitations = await getInvitationsByEvent(req.params.event_id);
    res.json({ invitations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const setAttendance = async (req, res) => {
  const { attendance } = req.body;
  if (!["present", "absent"].includes(attendance)) {
    return res.status(400).json({ message: "Invalid attendance value" });
  }
  try {
    await updateAttendance(req.params.id, attendance);
    res.json({ message: "Attendance updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const setTableNumber = async (req, res) => {
  const { table_number } = req.body;
  try {
    await updateTableNumber(req.params.id, table_number);
    res.json({ message: "Table number updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const removeInvitation = async (req, res) => {
  try {
    await deleteInvitation(req.params.id);
    res.json({ message: "Attendee removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const sendInvitation = async (req, res) => {
  const { recipient_name, recipient_email, event_name, event_date, event_time, event_venue, invitation_link } = req.body;

  if (!recipient_email) {
    return res.status(400).json({ message: "Recipient email is required" });
  }

  try {
    await sendInvitationEmail({
      recipientName: recipient_name,
      recipientEmail: recipient_email,
      eventName: event_name,
      eventDate: event_date,
      eventTime: event_time,
      eventVenue: event_venue,
      invitationLink: invitation_link,
    });
    res.json({ message: "Invitation email sent" });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
};

const sendInvitationSMSController = async (req, res) => {
  const { recipient_name, recipient_phone, event_name, event_date, event_time, event_venue, invitation_link } = req.body;

  if (!recipient_phone) {
    return res.status(400).json({ message: "Recipient phone number is required" });
  }

  try {
    await sendInvitationSMS({
      recipientName: recipient_name,
      recipientPhone: recipient_phone,
      eventName: event_name,
      eventDate: event_date,
      eventTime: event_time,
      eventVenue: event_venue,
      invitationLink: invitation_link,
    });
    res.json({ message: "Invitation SMS sent" });
  } catch (err) {
    console.error("SMS error:", err);
    res.status(500).json({ message: err.message || "Failed to send SMS" });
  }
};

module.exports = {
  generateInvitation, getInvitation, respondToInvitation,
  listInvitations, setAttendance, setTableNumber, removeInvitation,
  sendInvitation, sendInvitationSMSController
};