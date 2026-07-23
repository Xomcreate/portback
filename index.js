const express = require("express");
const cors    = require("cors");
const dotenv  = require("dotenv");

dotenv.config();

const connectDB      = require("./dbconnect/dbconfig");
const contactRoutes  = require("./routes/contactRoutes");

const app  = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

// Middleware
app.use(cors({
  origin: [
    "https://priscaojimba-portfolio.vercel.app",
    "https://prisbyte-innovations.vercel.app/",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  credentials: true,
}));

app.use(express.json());

// Routes
app.use("/api", contactRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});