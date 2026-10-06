import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 160
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 5000
    },
    // Stored as the authenticated user's id so deletion can be authorized safely.
    author: {
      type: String,
      required: true,
      index: true
    },
    authorName: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      trim: true,
      maxlength: 120
    },
    topic: {
      type: String,
      enum: ["Announcement", "Academics", "Events", "Opportunities", "General"],
      default: "General",
      index: true
    },
    pinned: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
