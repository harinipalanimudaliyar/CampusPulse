import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

import User from "./models/User.js";
import Post from "./models/Post.js";
import Message from "./models/Message.js";
import { requireAuth } from "./middleware/auth.js";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing MONGO_URI or JWT_SECRET in environment.");
  process.exit(1);
}

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN.split(",").map((origin) => origin.trim()),
    credentials: false
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Please try again later." }
});

const messageLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many messages. Please slow down." }
});

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    institution: user.institution,
    createdAt: user.createdAt
  };
}

function signToken(user) {
  return jwt.sign(
    {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      institution: user.institution
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "CampusPulse API" });
});

app.post("/api/signup", authLimiter, async (req, res, next) => {
  try {
    const fullName = cleanString(req.body.fullName);
    const email = cleanString(req.body.email).toLowerCase();
    const password = typeof req.body.password === "string" ? req.body.password : "";
    const institution = cleanString(req.body.institution);

    if (!fullName || !email || !password || !institution) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (fullName.length < 2 || password.length < 8) {
      return res.status(400).json({ message: "Name must have 2+ characters and password must have 8+ characters." });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashedPassword, institution });

    return res.status(201).json({
      message: "Account created successfully.",
      user: publicUser(user),
      token: signToken(user)
    });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "An account with that email already exists." });
    }
    next(error);
  }
});

app.post("/api/login", authLimiter, async (req, res, next) => {
  try {
    const email = cleanString(req.body.email).toLowerCase();
    const password = typeof req.body.password === "string" ? req.body.password : "";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({
      message: "Welcome back.",
      user: publicUser(user),
      token: signToken(user)
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/posts", async (req, res, next) => {
  try {
    const topic = cleanString(req.query.topic);
    const institution = cleanString(req.query.institution);

    const filter = {};
    if (topic && topic !== "All") filter.topic = topic;
    if (institution && institution !== "All institutions") filter.institution = institution;

    const posts = await Post.find(filter).sort({ pinned: -1, createdAt: -1 }).limit(100).lean();
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

app.post("/api/posts", requireAuth, async (req, res, next) => {
  try {
    const title = cleanString(req.body.title);
    const content = cleanString(req.body.content);
    const topic = cleanString(req.body.topic) || "General";
    const pinned = Boolean(req.body.pinned);

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const allowedTopics = ["Announcement", "Academics", "Events", "Opportunities", "General"];
    if (!allowedTopics.includes(topic)) {
      return res.status(400).json({ message: "Invalid post topic." });
    }

    const post = await Post.create({
      title,
      content,
      topic,
      pinned,
      author: req.user.id,
      authorName: req.user.fullName,
      institution: req.user.institution
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/posts/:id", requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid post id." });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.author !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own posts." });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully.", id: req.params.id });
  } catch (error) {
    next(error);
  }
});

app.get("/api/messages", async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 80, 1), 100);
    const messages = await Message.find().sort({ createdAt: -1 }).limit(limit).lean();
    res.json(messages.reverse());
  } catch (error) {
    next(error);
  }
});

app.post("/api/messages", requireAuth, messageLimiter, async (req, res, next) => {
  try {
    const text = cleanString(req.body.text);

    if (!text) {
      return res.status(400).json({ message: "Message cannot be empty." });
    }

    const message = await Message.create({
      sender: req.user.fullName,
      senderId: req.user.id,
      institution: req.user.institution,
      text
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: "Please check the submitted data." });
  }
  res.status(500).json({ message: "Something went wrong on the server." });
});

async function start() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected.");
  const server = app.listen(PORT, () => {
    console.log(`CampusPulse API running on http://localhost:${PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((error) => {
  console.error("Startup failed:", error);
  process.exit(1);
});
