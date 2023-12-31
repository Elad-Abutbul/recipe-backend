import { recipeModel } from "../../models/Recipes.js";
import { userModel } from "../../models/Users.js";
export const recipeSearchController = {
  searchHome: async (req, res) => {
    const { input } = req.body;
    const { category, page } = req.params;
    const pageSize = 9;
    try {
      const query = {
        $or: [
          { name: { $regex: new RegExp(input, "i") } },
          { ingredients: { $regex: new RegExp(input, "i") } },
          { kosherType: { $regex: new RegExp(input, "i") } },
          { instruction: { $regex: new RegExp(input, "i") } },
        ],
      };
      const recipesId = await recipeModel
        .find(query, "_id")
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      const totalRecipesCount = await recipeModel.countDocuments(query);

      res.json({ recipesId, totalRecipesCount });
    } catch (error) {
      console.error(error);
    }
  },

  searchSavedRecipes: async (req, res) => {
    try {
      const { input } = req.body;
      const { category, page, id } = req.params;
      const pageSize = 9;
      const skip = (page - 1) * pageSize;

      const user = await userModel.findById(id);
      const query = {
        _id: { $in: user.savedRecipes },
        $or: [
          { name: { $regex: new RegExp(input, "i") } },
          { ingredients: { $regex: new RegExp(input, "i") } },
          { kosherType: { $regex: new RegExp(input, "i") } },
          { instruction: { $regex: new RegExp(input, "i") } },
        ],
      };

      if (category !== "all-recipes") {
        query.kosherType = category;
      }

      const recipesId = await recipeModel.find(query,"_id").skip(skip).limit(pageSize);

      const totalRecipesCount = await recipeModel.countDocuments(query);

      res.json({ recipesId, totalRecipesCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  searchUserCard: async (req, res) => {
    const { input, userId } = req.body;
    try {
      const user = await userModel.findById(userId);
      const search = await recipeModel.find({
        _id: { $in: user.savedRecipes },
        name: { $regex: new RegExp(input, "i") },
      });
      res.json({ search });
    } catch (error) {
      console.error(error);
    }
  },
  searchUser: async (req, res) => {
    const { input } = req.body;
    const { category, page, id } = req.params;
    const pageSize = 9;
    try {
      let query = {
        "userOwner.id": id,
        name: { $regex: new RegExp(input, "i") },
      };
      if (category !== "all-recipes") {
        query.kosherType = category;
      }
      const recipesId = await recipeModel
        .find(query,"_id")
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      const totalRecipesCount = await recipeModel.countDocuments(query);
      res.json({ recipesId, totalRecipesCount });
    } catch (error) {
      console.error(error);
    }
  },
};
