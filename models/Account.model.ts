import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
}, {
  timestamps: true
});

export const Account = mongoose.model("Account", schema, "account");