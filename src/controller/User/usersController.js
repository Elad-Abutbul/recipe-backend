import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { recipeModel } from "../../models/Recipes.js";
import { userModel } from "../../models/users.js";

export const userController = {
  getUserRecipes: async (req, res) => {
    const { category, page, id } = req.params;
    try {
      const query = { "userOwner.id": id };
      const pageSize = 9;
      if (category !== "all-recipes") {
        query.kosherType = category;
      }
      const userRecipes = await recipeModel
        .find(query, "_id")
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      const totalRecipesCount = await recipeModel.countDocuments(query);
      res.json({ recipesId: userRecipes, totalRecipesCount });
    } catch (error) {
      console.error(error);
    }
  },

  editUser: async (req, res) => {
    const userData = {
      username: req.body.username,
      password: req.body.password,
    };
    const { id } = req.params;
    try {
      const existingUser = await userModel.findById(id);
      if (
        existingUser.password !== userData.password &&
        existingUser.username !== userData.username
      ) {
        if (userData.username !== existingUser.username) {
          const userNameExists = await userModel.exists({
            username: userData.username,
          });

          if (userNameExists) {
            return res.json({ message: "User Already Exists!" });
          }
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        userData.password = hashedPassword;
        const updatedUser = await userModel.findByIdAndUpdate(id, userData);
        return res.json({
          message: "Edit User Was Complete!",
          user: updatedUser,
        });
      }
      return res.json({ message: "Nothing Change" });
    } catch (error) {
      console.error(error);
    }
  },

  savedRecipes: async (req, res) => {
    try {
      const { id, category, page } = req.params;
      const pageSize = 9;
      const query = category === "all-recipes" ? {} : { kosherType: category };
      const user = await userModel.findById(id);

      const savedRecipesId = await recipeModel
        .find({ _id: { $in: user.savedRecipes }, ...query }, "_id")
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      const totalRecipesCount = await recipeModel.countDocuments({
        _id: { $in: user.savedRecipes },
        ...query,
      });

      res.json({ recipesId: savedRecipesId, totalRecipesCount });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
