const bcrypt = require("bcryptjs");
const {
  createUser, findUserByEmail, getUsersByRole,
  countActiveByRole, updateUserStatus, getUserById
} = require("../models/user.model");

const addUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["organizer", "receptionist"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await createUser({ name, email, password_hash, role });

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const listUsers = async (req, res) => {
  const { role } = req.params;

  if (!["organizer", "receptionist"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const users = await getUsersByRole(role);
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const toggleUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "active" or "inactive"

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Protect last active organizer
    if (user.role === "organizer" && status === "inactive") {
      const activeCount = await countActiveByRole("organizer");
      if (activeCount <= 1) {
        return res.status(400).json({
          message: "Cannot dismiss the last active organizer"
        });
      }
    }

    await updateUserStatus(id, status);
    res.json({ message: `User ${status === "active" ? "reactivated" : "dismissed"} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addUser, listUsers, toggleUserStatus };