import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(String(process.env.DATABASE_URL));
    console.log("Database has been connected!")
  } catch (error) {
    console.log(error);
    console.log("Database has been disconnected!");
  }
}