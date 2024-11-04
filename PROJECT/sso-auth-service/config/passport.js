import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const SUPERIOR_EMAIL = ""; // superior email for role assignment

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails } = profile;
      try {
        // Log the email to verify it's what you expect
        console.log("Email from Google profile:", emails[0].value);

        // Convert emails to lowercase for a case-insensitive comparison
        const email = emails[0].value.toLowerCase();
        const superiorEmail = SUPERIOR_EMAIL.toLowerCase();

        // Find user by Google ID
        let user = await User.findOne({ googleId: id });

        // If user does not exist, create with role based on email
        if (!user) {
          const role = email === superiorEmail ? "superior" : "employee";
          user = await User.create({
            googleId: id,
            name: displayName,
            email,
            role,
          });
        }

        // Pass the user to the next middleware
        done(null, user);
      } catch (error) {
        console.error("Error during authentication:", error);
        done(error, false);
      }
    }
  )
);

export default passport;
