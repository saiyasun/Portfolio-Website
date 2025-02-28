require("dotenv").config(); // Load environment variables
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json()); // Parse JSON requests
app.use(cors()); // This will allow requests from any origin

// Create a Nodemailer transporter with your email settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // Use true for port 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Define a POST endpoint to handle email submissions
app.post("/send-email", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Send the email to your email address (asiah@asiahcrutchfield.com)
    await transporter.sendMail({
      from: `"${name}" <${email}>`, // User's email address as sender
      to: "asiah@asiahcrutchfield.com", // Your email address (always the recipient)
      subject: `Message from ${name}: ${subject}`, // Subject of the email
      text: `You received a message from ${name} (${email}):\n\n${message}`, // Email body
    });

    // Send a success response to the client
    res.send({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to send email." });
  }
});

// Start the server on port 3000
const port = process.env.PORT || 3000; // Use Heroku's port or 3000 for local development
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
