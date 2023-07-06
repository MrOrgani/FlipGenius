import express from "express";

import { isAuth } from "../middleware/authMiddleware";
import {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController";
import { isOwner } from "../middleware/isOwner";

const router = express.Router();

router.route("/").get(isAuth, getCollections).post(isAuth, createCollection);
router
  .route("/:collectionId")
  .get(isAuth, getCollection)
  .put(isAuth, isOwner, updateCollection)
  .delete(isAuth, isOwner, deleteCollection);

export { router };
