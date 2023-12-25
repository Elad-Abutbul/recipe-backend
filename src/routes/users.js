import express from "express";
import { userController } from "../controller/usersController.js";
const router = express.Router();

router.get("/savedRecipes/:category/:page/:id", userController.savedRecipes);
