import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import axios from "axios";

const router = express.Router();

// Route to initiate Google login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Route to handle Google login callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    const user = req.user; // User is already created in passport.js

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    try {
      // Send login notification email
      await axios.post(`http://localhost:5002/send-login-notification`, {
        email: user.email,
        name: user.name,
      });

      // Redirect to frontend with the token
      res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}`);
    } catch (error) {
      // Redirect with error message if email notification fails
      res.redirect(
        `${process.env.FRONTEND_URL}/login-failure?token=${token}&error=Email%20notification%20failed`
      );
    }
  }
);

// Route to handle logout
router.post("/logout", async (req, res) => {
  const { email, name } = req.body;

  try {
    // Send logout notification email
    await axios.post(`http://localhost:5002/send-logout-notification`, {
      email,
      name,
    });

    res.json({
      message: "Logout successful and email notification sent",
    });
  } catch (error) {
    res.status(500).json({
      message: "Logout successful, but failed to send email notification",
    });
  }
});

export default router;
