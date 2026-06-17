const { createEvent } = require("../models/event.model");

const newEvent = async (req, res) => {
  const { name, type, date, time, venue } = req.body;
  const flyer = req.file ? req.file.filename : null;
  const organizer_id = req.user.id;

  if (!name || !type || !date || !time || !venue || !flyer) {
    return res.status(400).json({ message: "All fields including flyer are required" });
  }

  try {
    const event = await createEvent({ name, type, date, time, venue, flyer, organizer_id });
    res.status(201).json({ message: "Event created", event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { newEvent };