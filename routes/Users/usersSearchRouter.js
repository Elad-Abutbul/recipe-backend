import express from "express";
import { userSearchController } from "../../controller/User/usersSearchController.js";
const router = express.Router();

router.post("/users", userSearchController.searchUser);

export { router as usersSearchRouter };
