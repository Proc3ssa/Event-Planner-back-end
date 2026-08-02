const crypto = require("crypto");
const { createTicket, getTicketByToken, markTicketUsed } = require("../models/ticket.model");
const { sendInvitationEmail, sendTicketEmail } = require("../services/mailService");
const { sendInvitationSM, sendTicketSMS } = require("../services/smsService");

const generateTicket = async (req, res) => {
  const { event_id, recipient_name, recipient_contact, contact_type, event_name, event_date, event_time, event_venue } = req.body;

  if (!event_id || !recipient_name || !recipient_contact || !contact_type) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const token = crypto.randomBytes(32).toString("hex");
    await createTicket({ event_id, token, recipient_name, recipient_contact, contact_type });

    const ticketLink = `${process.env.FRONTEND_URL}/ticket/${token}`;
    const checkInUrl = `${process.env.BACKEND_URL}/api/tickets/verify/${token}`;

    if (contact_type === "email") {
      await sendTicketEmail({
        recipientName: recipient_name,
        recipientEmail: recipient_contact,
        eventName: event_name,
        eventDate: event_date,
        eventTime: event_time,
        eventVenue: event_venue,
        ticketLink,
        checkInUrl,
      });
    } else {
  await sendTicketSMS({
    recipientName: recipient_name,
    recipientPhone: recipient_contact,
    eventName: event_name,
    eventDate: event_date,
    eventTime: event_time,
    eventVenue: event_venue,
    ticketLink,
  });
}

    res.status(201).json({ message: "Ticket generated and sent", token, ticketLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const getTicket = async (req, res) => {
  try {
    const ticket = await getTicketByToken(req.params.token);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyTicket = async (req, res) => {
  try {
    const ticket = await getTicketByToken(req.params.token);
    if (!ticket) return res.status(404).json({ message: "Ticket not found", valid: false });
    if (ticket.status === "used") return res.status(200).json({ message: "Ticket already used", valid: false, ticket });

    await markTicketUsed(req.params.token);

    // Also mark attendance as present in invitations if exists
    res.json({ message: "Ticket verified", valid: true, ticket });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", valid: false });
  }
};

module.exports = { generateTicket, getTicket, verifyTicket };