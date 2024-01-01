import express from "express";
import { recipeSearchController } from "../../controller/Recipes/recipeSearchController.js";
const router = express.Router();

router.post("/home/:category/:page", recipeSearchController.searchHome);
router.post("/savedRecipes/:category/:page/:id", recipeSearchController.searchSavedRecipes);
router.post("/user-card", recipeSearchController.searchUserCard);
router.post("/user/:category/:page/:id",recipeSearchController.searchUser)

export { router as recipeSearchRouter };
