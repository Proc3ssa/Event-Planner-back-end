const db = require("../config/db");

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

const createUser = ({ name, email, password_hash, role }) => {
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, email, password_hash, role],
      (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, name, email, role });
      }
    );
  });
};

const getUsersByRole = (role) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT id, name, email, role, status, created_at FROM users WHERE role = ? ORDER BY created_at DESC",
      [role],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

const countActiveByRole = (role) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT COUNT(*) AS count FROM users WHERE role = ? AND status = 'active'",
      [role],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0].count);
      }
    );
  });
};

const updateUserStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE users SET status = ? WHERE id = ?",
      [status, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

module.exports = {
  findUserByEmail, createUser, getUsersByRole,
  countActiveByRole, updateUserStatus, getUserById
};