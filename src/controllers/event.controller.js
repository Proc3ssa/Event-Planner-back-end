const { createEvent, getEventsByOrganizer, getEventById, deleteEventById, updateEvent } = require("../models/event.model");


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

const listEvents = async (req, res) => {
  try {
    const events = await getEventsByOrganizer(req.user.id);
    res.json({ events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const getEvent = async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Ensure the organizer can only view their own events
    if (event.organizer_id !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ event });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const removeEvent = async (req, res) => {
  try {
    const event = await getEventById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizer_id !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await deleteEventById(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const editEvent = async (req, res) => {
  const { name, type, date, time, venue } = req.body;
  const { id } = req.params;

  try {
    const event = await getEventById(id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.organizer_id !== req.user.id) return res.status(403).json({ message: "Access denied" });

    const updated = await updateEvent({ id, name, type, date, time, venue });
    res.json({ message: "Event updated", event: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { newEvent, listEvents, getEvent, removeEvent, editEvent };

