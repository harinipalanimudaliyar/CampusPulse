import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    senderId: {
      type: String,
      required: true,
      index: true
    },
    institution: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 1000
    }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
