import express from "express";
import { recipesController } from "../../controller/Recipes/recipesController.js";
import { verifyToken } from "../../verifyToken/index.js";
const router = express.Router();
router.get(
  "/getAllOwnerRecipes/:category/:page/:id",
  recipesController.getAllOwnerRecipes
);
router.get("/getRecipes/:category/:page", recipesController.getRecipes);
router.post("/createRecipe", verifyToken, recipesController.createRecipe);
router.put("/saveRecipe", recipesController.saveRecipe);
router.put("/editRecipe", recipesController.editRecipe);
router.delete("/delete/owner-recipe", recipesController.deleteOwnerRecipe);
router.get("/my-recipes/:id", recipesController.myRecipes);
router.delete("/delete/saved-recipe", recipesController.deleteSavedRecipe);
router.post("/rating", recipesController.rating);
router.get("/userStars/:recipeId/:userId", recipesController.userStars);
router.get("/savedRecipes/:category/:page/:id", recipesController.savedRecipes);
router.get("/comments/:recipeId", recipesController.comments);
router.post("/comments/addComment", recipesController.addComment);
router.get("/getRecipe/:id", recipesController.getRecipe);
router.get("/content/:recipeId", recipesController.getRecipeContent);
export { router as recipesRouter };
