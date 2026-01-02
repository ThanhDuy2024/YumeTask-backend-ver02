import mongoose from "mongoose";
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

const schema = new mongoose.Schema({
  userId: String,
  taskContent: String,
  taskNote: String,
  startTime: String,
  endTime: String,
  dateTime: String,
  status: {
    type: String,
    default: "init"
  },
  slug: {
    type: String,
    slug: "taskContent",
  }
}, {
  timestamps: true
});

export const Task = mongoose.model("Task", schema, "task");