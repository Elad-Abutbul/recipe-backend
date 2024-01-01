import { userModel } from "../../models/Users.js";

export const userSearchController = {
  searchUser: async (req, res) => {
    try {
      const { input } = req.body;

      const usersWithRecipeCount = await userModel.aggregate([
        {
          $match: {
            username: {
              $regex: input,
              $options: "i",
            },
          },
        },
        {
          $lookup: {
            from: "recipes", // Collection name for recipes
            localField: "_id", // Field from the users collection
            foreignField: "userOwner.id", // Field from the recipes collection
            as: "createdRecipes",
          },
        },
        {
          $addFields: {
            recipeCount: { $size: "$createdRecipes" },
          },
        },
      ]);

      res.json(usersWithRecipeCount);
    } catch (error) {
      console.error(error);
    }
  },
};
