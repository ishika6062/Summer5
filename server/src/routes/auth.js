import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const router = express.Router();

const signToken = (userId) => {
  const secret = process.env.JWT_SECRET || "dev-secret";
  return jwt.sign({ sub: userId }, secret, { expiresIn: "7d" });
};

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Missing auth token" });
  }

  try {
    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret);
    req.userId = payload.sub;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid auth token" });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("isAdmin");
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ message: "Failed to verify admin" });
  }
};

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackUrl =
  process.env.GOOGLE_CALLBACK_URL ||
  "http://localhost:4000/api/auth/google/callback";
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const googleEnabled = Boolean(googleClientId && googleClientSecret);

if (googleEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: googleCallbackUrl,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          if (!email) {
            return done(new Error("Google account has no email"));
          }

          const googleId = profile.id;
          const avatarUrl = profile.photos?.[0]?.value;
          const name = profile.displayName || "Google User";

          let user = await User.findOne({ googleId });
          if (!user) {
            user = await User.findOne({ email });
          }

          if (!user) {
            user = await User.create({
              name,
              email,
              provider: "google",
              googleId,
              avatarUrl,
            });
          } else if (!user.googleId) {
            user.googleId = googleId;
            user.provider = "google";
            if (!user.avatarUrl && avatarUrl) {
              user.avatarUrl = avatarUrl;
            }
            if (!user.name && name) {
              user.name = name;
            }
            await user.save();
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      provider: "local",
    });
    const token = signToken(user.id);

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.provider === "google" && !user.passwordHash) {
      return res.status(400).json({ message: "Use Google to sign in" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user.id);
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to login" });
  }
});

router.get("/google", (req, res, next) => {
  if (!googleEnabled) {
    return res.status(500).json({ message: "Google OAuth not configured" });
  }
  return passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
});

router.get(
  "/google/callback",
  (req, res, next) => {
    if (!googleEnabled) {
      return res.status(500).json({ message: "Google OAuth not configured" });
    }
    return passport.authenticate("google", {
      session: false,
      failureRedirect: `${clientOrigin}/login?error=oauth`,
    })(req, res, next);
  },
  (req, res) => {
    const token = signToken(req.user.id);
    const redirectUrl = new URL("/login", clientOrigin);
    redirectUrl.searchParams.set("token", token);
    res.redirect(redirectUrl.toString());
  }
);

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "name email provider avatarUrl isAdmin"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        provider: user.provider,
        avatarUrl: user.avatarUrl,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load user" });
  }
});

export { requireAuth, requireAdmin };
export default router;
