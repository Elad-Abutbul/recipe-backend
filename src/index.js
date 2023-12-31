import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PORT, mongoDBURL } from "../confing.js";
import { verifyToken } from "./verifyToken/index.js";
import { recipesRouter } from "./routes/Recipes/recipesRouter.js";
import { recipeSearchRouter } from "./routes/Recipes/recipesSearchRouter.js";
import { usersRouter } from "./routes/Users/usersRouter.js";
import { usersSearchRouter } from "./routes/Users/usersSearchRouter.js";
import { userModel } from "./models/users.js";
dotenv.config();

const app = express();

app.use(cors({
origin:["https://recipe-frontend-ten.vercel.app/"]
}));
app.use(express.json());

app.use("/auth", usersRouter);
app.use('/auth/search',usersSearchRouter)
app.use("/recipes", recipesRouter);
app.use('/recipes/search',recipeSearchRouter)

app.get('/', (req, res) => {
  res.json({message:"welcome to recipe app backend"})
})

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await userModel.findOne({ username });

  if (existingUser) {
    res.json({ message: "User Already Exists!" });
  } else {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({ username, password: hashPassword });

    try {
      await newUser.save();
      res.json({ message: "User Registered Successfully!" });
    } catch (error) {
      console.error(error);
    }
  }
});

app.post("/login", async (req, res) => {
  const { password, username } = req.body;
  const user = await userModel.findOne({ username });
  if (!user) {
    return res.json({ message: `User Dosn't Exixt!` });
  }
  const isPassworkValid = await bcrypt.compare(password, user.password);
  if (!isPassworkValid) {
    return res.json({ message: `Username Or Password Is Incorrect` });
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN);

  res.json({ token, user: { id: user._id, username: user.username } });
});


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
