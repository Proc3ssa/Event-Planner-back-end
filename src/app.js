const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const eventRoutes = require("./routes/event.routes");
const userRoutes = require("./routes/user.routes");
const invitationRoutes = require("./routes/invitation.routes");
const ticketRoutes = require("./routes/ticket.routes");


const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/events", eventRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/users", userRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/tickets", ticketRoutes);


app.get("/", (req, res) => {
  res.send("Eventify API running");
});

module.exports = app;