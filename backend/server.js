require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");

// DB
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const friendRoutes = require("./routes/friendRoutes");
const messageRoutes = require("./routes/messageRoutes");
const storyRoutes = require("./routes/storyRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Socket
const initSocket = require("./sockets/socket");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors());

// Static folder for images
app.use("/uploads", express.static("uploads"));

// Connect Database
connectDB();

// API Routes
app.use("/api", authRoutes);
app.use("/api", postRoutes);
app.use("/api", friendRoutes);
app.use("/api/message", messageRoutes);
app.use("/api", storyRoutes);
app.use("/api", profileRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// Initialize Socket
initSocket(server);

// Start Server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));