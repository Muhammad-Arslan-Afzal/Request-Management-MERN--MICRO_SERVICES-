import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();

const app = express();
app.use(express.json());

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to validate email format
const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

// Function to check if the domain of the email exists
const isDomainValid = (email) => {
  return new Promise((resolve) => {
    const domain = email.split("@")[1];
    dns.resolve(domain, "MX", (err) => {
      if (err) {
        resolve(false); // Domain does not exist or error occurred
      } else {
        resolve(true); // Domain exists
      }
    });
  });
};

// Endpoint for login notifications
app.post("/send-login-notification", async (req, res) => {
  const { email, name } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).send("Invalid email address format");
  }

  const domainValid = await isDomainValid(email);
  if (!domainValid) {
    return res.status(400).send("Email domain does not exist");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Login Successful",
    text: `Hello ${name}, you have successfully logged into the application.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email");
    }
    console.log("Email sent: " + info.response);
    res.status(200).send("Email sent successfully");
  });
});

// Endpoint for request notifications
app.post("/send-request-notification", async (req, res) => {
  const { email, subject, message } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).send("Invalid email address format");
  }

  const domainValid = await isDomainValid(email);
  if (!domainValid) {
    return res.status(400).send("Email domain does not exist");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email");
    }
    console.log("Email sent: " + info.response);
    res.status(200).send("Email sent successfully");
  });
});

// Endpoint for logout notifications
app.post("/send-logout-notification", async (req, res) => {
  const { email, name } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).send("Invalid email address format");
  }

  const domainValid = await isDomainValid(email);
  if (!domainValid) {
    return res.status(400).send("Email domain does not exist");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Logout Successful",
    text: `Hello ${name}, you have successfully logged out from the application.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email");
    }
    console.log("Email sent: " + info.response);
    res.status(200).send("Logout email sent successfully");
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
