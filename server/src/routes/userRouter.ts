import express from "express";
import {
  authUser,
  getUserProfile,
  logoutUser,
  registerUser,
  updateUserProfile,
  deleteUserProfile,
} from "../controllers/userController";
import { isAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", registerUser);
router.post("/signin", authUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(isAuth, getUserProfile)
  .put(isAuth, updateUserProfile)
  .delete(isAuth, deleteUserProfile);

export { router };
