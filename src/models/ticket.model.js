const db = require("../config/db");

const createTicket = ({ event_id, token, recipient_name, recipient_contact, contact_type }) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO tickets (event_id, token, recipient_name, recipient_contact, contact_type) VALUES (?, ?, ?, ?, ?)",
      [event_id, token, recipient_name, recipient_contact, contact_type],
      (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, token });
      }
    );
  });
};

const getTicketByToken = (token) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT t.*, e.name as event_name, e.date, e.time, e.venue, e.type, e.flyer
       FROM tickets t JOIN events e ON t.event_id = e.id
       WHERE t.token = ?`,
      [token],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

const markTicketUsed = (token) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE tickets SET status = 'used' WHERE token = ?",
      [token],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

const getTicketsByEvent = (event_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM tickets WHERE event_id = ? ORDER BY created_at DESC",
      [event_id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};
const checkExistingTicket = (event_id, recipient_contact) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id FROM tickets WHERE event_id = ? AND recipient_contact = ?",
      [event_id, recipient_contact],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

module.exports = { createTicket, getTicketByToken, markTicketUsed, getTicketsByEvent, checkExistingTicket };