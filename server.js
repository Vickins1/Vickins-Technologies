const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB
const dbURI = process.env.MONGODB_URI || "mongodb://localhost:27017/vickins-tech";
mongoose
  .connect(dbURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


app.post("/api/contact", upload.none(), async (req, res) => {
  try {
    const { name, email, phone_number, plan, message } = req.body;

    const selectedPlans = Array.isArray(plan) ? plan : plan ? [plan] : [];

    // Validate all required fields
    if (!name || !email || !phone_number || selectedPlans.length === 0 || !message) {
      return res.redirect("/contact?error=All fields are required, including at least one service");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.redirect("/contact?error=Invalid email format");
    }

    // Validate plan values
    const validPlans = [
      "e-commerce",
      "pos-systems",
      "static-website",
      "api-automation",
      "blockchain-crypto",
      "dynamic-website",
      "custom-software",
      "mobile-app",
      "graphic-design",
      "consultancy",
    ];
    const invalidPlans = selectedPlans.filter((p) => !validPlans.includes(p));
    if (invalidPlans.length > 0) {
      return res.redirect("/contact?error=Invalid service selected");
    }

    // Format plans for email
    const plansString = selectedPlans.join(", ");

    // Email configuration
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `New Contact Form Submission - ${selectedPlans[0] || "Multiple Services"}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phone_number}</p>
        <p><strong>Selected Service:</strong> ${plansString}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    return res.redirect("/contact?success=Message sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    return res.redirect("/contact?error=Failed to send message");
  }
});

// Pages
app.get("/", (req, res) => res.render("index", { title: "Vickins Tech - Home" }));

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Vickins Tech - Contact",
    success: req.query.success || null,
    error: req.query.error || null,
    formData: {},
  });
});

app.get("/about", (req, res) => res.render("about", { title: "Vickins Tech - About" }));
app.get("/pricing", (req, res) => res.render("pricing", { title: "Vickins Tech - Pricing" }));
app.get("/strategies", (req, res) => res.render("strategies", { title: "Vickins Tech - Strategies" }));
app.get("/terms", (req, res) => res.render("terms", { title: "Vickins Tech - Terms" }));
app.get("/policy", (req, res) => res.render("privacy", { title: "Vickins Tech - Privacy Policy" }));
app.get("/techtrends", (req, res) => res.render("techtrends", { title: "Vickins Tech - Tech Trends" }));

// 404 + 500
app.use((req, res) => res.status(404).render("404", { title: "404 - Page Not Found" }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500", { title: "500 - Server Error" });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
