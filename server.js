// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// MongoDB Connection
const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/vickins-tech";

mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Vickins Tech - Home" });
});

app.get("/contact", (req, res) => {
       res.render("contact", { title: "Vickins Tech - Contact" });
     });

// 404 Route
app.use((req, res) => {
       res.status(404).render("404", { title: "404 - Page Not Found" });
     });
     
     // 500 Route
     app.use((err, req, res, next) => {
       console.error(err.stack);
       res.status(500).render("500", { title: "500 - Server Error" });
     });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
