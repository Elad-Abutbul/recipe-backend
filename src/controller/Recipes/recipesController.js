import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { recipeModel } from "../../models/Recipes.js";
import { userModel } from "../../models/users.js";

export const recipesController = {
  getRecipes: async (req, res) => {
    const { category, page } = req.params;
    const pageSize = 9;
    try {
      let query = {};
      if (category !== "all-recipes") {
        query = { kosherType: category };
      }

      const recipesId = await recipeModel
        .find(query, "_id")
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      const totalRecipesCount = await recipeModel.countDocuments(query);
      return res.json({ recipesId, totalRecipesCount });
    } catch (error) {
      res.json(error);
    }
  },
  getRecipeContent: async (req, res) => {
    const { recipeId } = req.params;
    try {
      const recipeContent = await recipeModel
        .findById(recipeId)
        .select("name ingredients instruction cookingTime kosherType");
      res.json({ recipeContent });
    } catch (error) {
      console.error(error);
    }
  },

  getRecipe: async (req, res) => {
    const { id } = req.params;
    try {
      const recipe = await recipeModel
        .findById(id)
        .select("name kosherType userOwner ratings imageUrl");
      const sumOfRatings = recipe.ratings.reduce(
        (sum, rating) => sum + (rating.stars || 0),
        0
      );
      res.json({ recipe, sumOfRatings });
    } catch (error) {
      console.error(error);
    }
  },
  getAllOwnerRecipes: async (req, res) => {
    const { id, page, category } = req.params;
    const pageSize = 9;
    try {
      const parsedPage = parseInt(page, 10);
      let query = {};
      if (category !== "all-recipes") {
        query = { kosherType: category };
      }
      const recipes = await recipeModel
        .find({ "userOwner.id": id, ...query })
        .skip((parsedPage - 1) * pageSize)
        .limit(pageSize);

      const totalRecipesCount = await recipeModel
        .find({ "userOwner.id": id, ...query })
        .countDocuments();

      return res.json({ recipes, totalRecipesCount });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createRecipe: async (req, res) => {
    const recipe = new recipeModel(req.body);
    try {
      await recipe.save();
      res.json({ message: "Recipe Created Successfully!" });
    } catch (error) {
      res.json(error);
    }
  },

  saveRecipe: async (req, res) => {
    const { recipeId, userId } = req.body;
    try {
      const user = await userModel.findById(userId);
      const recipe = await recipeModel.findById(recipeId);
      if (user.savedRecipes.includes(recipeId)) {
        return res.json({ message: "Recipe Saved Already." });
      }
      user.savedRecipes.unshift(recipe);
      await user.save();
      res.json({ message: "Recipe Saved Successfully" });
    } catch (error) {
      res.json(error);
    }
  },
  editRecipe: async (req, res) => {
    const { recipe, recipeId } = req.body;
    try {
      await recipeModel.findByIdAndUpdate(recipeId, recipe);
      res.json({ message: "Edit Recipe Was Complete." });
    } catch (error) {
      console.error(error);
    }
  },
  deleteOwnerRecipe: async (req, res) => {
    const { recipeId } = req.body;
    if (recipeId) {
      await recipeModel.findByIdAndDelete(recipeId);
      res.json({ message: "Recipe Deleted Successfully." });
    } else {
      res.json({ message: "Recipe Not Found." });
    }
  },
  myRecipes: async (req, res) => {
    const { id } = req.params;
    try {
      const allUserRecipes = await recipeModel.find({ "userOwner.id": id });
      res.json({ allUserRecipes });
    } catch (error) {
      res.json(error);
    }
  },
  deleteSavedRecipe: async (req, res) => {
    const { recipeId, userId } = req.body;

    try {
      const user = await userModel.findById(userId);

      if (!user) return;

      const findRecipeIndex = user.savedRecipes.findIndex((recipe) =>
        recipe.equals(recipeId)
      );

      if (findRecipeIndex === -1) return;
      user.savedRecipes.splice(findRecipeIndex, 1);

      await user.save();
      return res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
      res.json(error);
    }
  },
  savedRecipes: async (req, res) => {
    try {
      const { id, category, page } = req.params;
      const pageSize = 9;
      const query = category === "all-recipes" ? {} : { kosherType: category };
      const user = await userModel.findById(id);

      // Find saved recipes for the current page
      const savedRecipes = await recipeModel
        .find({ _id: { $in: user.savedRecipes }, ...query })
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      // Count all saved recipes that match the criteria
      const totalRecipesCount = await recipeModel.countDocuments({
        _id: { $in: user.savedRecipes },
        ...query,
      });

      res.json({ recipes: savedRecipes, totalRecipesCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  rating: async (req, res) => {
    const { userId, recipeId, rating } = req.body;

    try {
      const existingRecipe = await recipeModel.findById(recipeId);
      const existingRatingIndex = existingRecipe.ratings.findIndex(
        (rating) => rating.userId.toString() === userId
      );
      let x;
      if (existingRatingIndex !== -1) {
        x = existingRecipe.ratings[existingRatingIndex].stars = rating;
      } else {
        existingRecipe.ratings.push({ userId, stars: rating });
      }

      await existingRecipe.save();
      res.json({
        message: "Rating updated successfully",
      });
    } catch (error) {
      console.error(error);
    }
  },

  userStars: async (req, res) => {
    const { userId, recipeId } = req.params;
    try {
      const exixtRecipe = await recipeModel.findOne({
        _id: recipeId,
      });

      const userStars = exixtRecipe.ratings.find(
        (rating) => rating.userId.toString() === userId
      );

      if (userStars) {
        return res.json({ userRating: userStars.stars });
      }
      return res.json({ userRating: 0 });
    } catch (error) {
      console.error(error);
    }
  },

  comments: async (req, res) => {
    const { recipeId } = req.params;
    try {
      const recipe = await recipeModel.findById(recipeId);
      const comments = recipe.comments; // Check if 'recipe.comments' contains the expected data
      return res.json({ comments: comments }); // Return the actual comments
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addComment: async (req, res) => {
    const { userId, recipeId, comment } = req.body;
    try {
      const user = await userModel.findById(userId);
      const recipe = await recipeModel.findById(recipeId);

      const userRating = recipe.ratings.find((rating) =>
        rating.userId.equals(user._id)
      );

      const commentWithRating = {
        user: { username: user.username, id: user._id },
        text: comment,
        rating: userRating ? userRating.stars : null,
      };

      recipe.comments.push(commentWithRating);

      recipe.save();

      res.json({ message: "Comment Added Successfully" });
    } catch (error) {
      console.error(error);
    }
  },
};
