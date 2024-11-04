import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import Request from "./models/request.js"; // Importing the Request model
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests only from this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow specific HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create a new request
app.post("/requests", async (req, res) => {
  const { title, description, type, urgency, requesterEmail, superiorEmail } =
    req.body;

  const newRequest = new Request({
    title,
    description,
    type,
    urgency,
    requesterEmail,
    superiorEmail,
  });

  try {
    await newRequest.save();

    await axios.post("http://localhost:5002/send-request-notification", {
      email: requesterEmail,
      subject: "Request Created",
      message: `Your request titled "${title}" has been created.`,
    });

    await axios.post("http://localhost:5002/send-request-notification", {
      email: superiorEmail,
      subject: "New Request for Approval",
      message: `A new request titled "${title}" is awaiting your approval.`,
    });

    return res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error creating request:", error);
    return res.status(500).json({ message: "Error creating request", error });
  }
});
// Get all requests
app.get("/requests", async (req, res) => {
  try {
    const requests = await Request.find(); // Fetch all requests from the database
    return res.status(200).json(requests); // Send the list of requests as JSON
  } catch (error) {
    console.error("Error fetching requests:", error);
    return res.status(500).json({ message: "Error fetching requests", error });
  }
});

// Approve a request
app.post("/requests/:id/approve", async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await Request.findByIdAndUpdate(
      requestId,
      { status: "approved" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    //Notify requester of approval
    await axios.post("http://localhost:5002/send-request-notification", {
      email: request.requesterEmail,
      subject: "Request Approved",
      message: `Your request titled "${request.title}" has been approved.`,
    });
    await axios.post("http://localhost:5002/send-request-notification", {
      email: request.superiorEmail,
      subject: "Request Approved",
      message: `You approved "${request.title}" request.`,
    });

    return res.status(200).json(request);
  } catch (error) {
    console.error("Error approving request:", error);
    return res.status(500).json({ message: "Error approving request", error });
  }
});

// Reject a request
app.post("/requests/:id/reject", async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await Request.findByIdAndUpdate(
      requestId,
      { status: "rejected" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Notify requester of rejection
    await axios.post("http://localhost:5002/send-request-notification", {
      email: request.requesterEmail,
      subject: "Request Rejected",
      message: `Your request titled "${request.title}" has been rejected.`,
    });
    await axios.post("http://localhost:5002/send-request-notification", {
      email: request.superiorEmail,
      subject: "Request Rejected",
      message: `You reject "${request.title}" request.`,
    });

    return res.status(200).json(request);
  } catch (error) {
    console.error("Error rejecting request:", error);
    return res.status(500).json({ message: "Error rejecting request", error });
  }
});

app.listen(PORT, () => {
  console.log(`Request Service running on port ${PORT}`);
});
