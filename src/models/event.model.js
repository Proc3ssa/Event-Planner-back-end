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

module.exports = { createEvent };