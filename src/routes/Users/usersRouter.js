import express from "express";
import { userController } from "../../controller/User/usersController.js";
import { userSearchController } from "../../controller/User/usersSearchController.js";
const router = express.Router();

router.get("/getUserRecipes/:category/:page/:id", userController.getUserRecipes);
router.get('/savedRecipes/:category/:page/:id', userController.savedRecipes);
router.put('/editUser/:id', userController.editUser);

export { router as usersRouter };
