const db = require("../config/db");

const createInvitation = ({ event_id, token, recipient_name, recipient_contact, contact_type }) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO invitations (event_id, token, recipient_name, recipient_contact, contact_type) VALUES (?, ?, ?, ?, ?)",
      [event_id, token, recipient_name, recipient_contact, contact_type],
      (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, token });
      }
    );
  });
};

const getInvitationByToken = (token) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT i.*, e.name as event_name, e.date, e.time, e.venue, e.type, e.flyer
       FROM invitations i JOIN events e ON i.event_id = e.id
       WHERE i.token = ?`,
      [token],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

const updateInvitationStatus = (token, status) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE invitations SET status = ? WHERE token = ?",
      [status, token],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};
const getInvitationsByEvent = (event_id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT id, recipient_name, recipient_contact, contact_type, 
              status, table_number, attendance, created_at 
       FROM invitations 
       WHERE event_id = ? AND status != 'declined'
       ORDER BY created_at DESC`,
      [event_id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

const updateAttendance = (id, attendance) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE invitations SET attendance = ? WHERE id = ?",
      [attendance, id],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

const updateTableNumber = (id, table_number) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE invitations SET table_number = ? WHERE id = ?",
      [table_number, id],
      (err) => {
        if (err) return reject(err);
        resolve();
      }
    );
  });
};

const deleteInvitation = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM invitations WHERE id = ?", [id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const checkExistingInvitation = (event_id, recipient_contact) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id FROM invitations WHERE event_id = ? AND recipient_contact = ?",
      [event_id, recipient_contact],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      }
    );
  });
};

module.exports = {
  createInvitation, getInvitationByToken, updateInvitationStatus,
  getInvitationsByEvent, updateAttendance, updateTableNumber,
  deleteInvitation, checkExistingInvitation
};