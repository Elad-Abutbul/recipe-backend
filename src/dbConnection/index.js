import mongoose from "mongoose";
import { PORT, mongoDBURL } from "../../confing.js";
import express from "express";
const app = express();
export const dbConnection = mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => console.error(error));
