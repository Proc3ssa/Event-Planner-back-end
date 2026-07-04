const db = require("../config/db");

const createEvent = ({ name, type, date, time, venue, flyer, organizer_id }) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO events (name, type, date, time, venue, flyer, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, type, date, time, venue, flyer, organizer_id],
      (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, name, type, date, time, venue, flyer });
      }
    );
  });
};

const getEventsByOrganizer = (organizer_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM events WHERE organizer_id = ? ORDER BY date DESC",
      [organizer_id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};
const getEventById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM events WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

const deleteEventById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM events WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
const updateEvent = ({ id, name, type, date, time, venue }) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE events SET name = ?, type = ?, date = ?, time = ?, venue = ? WHERE id = ?",
      [name, type, date, time, venue, id],
      (err) => {
        if (err) return reject(err);
        resolve({ id, name, type, date, time, venue });
      }
    );
  });
};

module.exports = { createEvent, getEventsByOrganizer, getEventById, deleteEventById, updateEvent };

