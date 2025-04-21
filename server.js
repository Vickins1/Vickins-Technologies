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

app.get("/about", (req, res) => {
      res.render("about", { title: "Vickins Tech - About" });
    });

app.get("/consultant", (req, res) => {
      res.render("consultant", { title: "Vickins Tech" });
    });

app.get("/pricing", (req, res) => {
      res.render("pricing", { title: "Vickins Tech - Pricing" });
    });

app.get("/cloud", (req, res) => {
      res.render("cloud", { title: "Vickins Tech " });
    });

app.get("/strategies", (req, res) => {
      res.render("strategies", { title: "Vickins Tech " });
    });

app.get("/data", (req, res) => {
      res.render("data", { title: "Vickins Tech " });
    });

    app.get("/terms", (req, res) => {
      res.render("terms", { title: "Vickins Tech " });
    });

    app.get("/policy", (req, res) => {
      res.render("privacy", { title: "Vickins Tech " });
    });

    app.get("/case", (req, res) => {
      res.render("case", { title: "Vickins Tech " });
    });

    app.get("/web", (req, res) => {
      res.render("web", { title: "Vickins Tech " });
    });

    app.get("/services", (req, res) => {
      res.render("service", { title: "Vickins Tech " });
    });

    app.get("/techtrends", (req, res) => {
      res.render("techtrends", { title: "Vickins Tech " });
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
