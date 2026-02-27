import dotenv from "dotenv";

dotenv.config();

export const PORT = Number(process.env.PORT) || 5555;
export const mongoDBURL = process.env.MONGODB_URI;

if (!mongoDBURL) {
  throw new Error("MONGODB_URI is not set in environment variables");
}
