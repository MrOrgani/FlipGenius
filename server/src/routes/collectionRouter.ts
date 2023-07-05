import express from "express";

import { protect } from "../middleware/authMiddleware";
import {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../controllers/collectionController";
import { isOwner } from "../middleware/isOwner";

const router = express.Router();

router.route("/").get(protect, getCollections).post(protect, createCollection);
router
  .route("/:collectionId")
  .get(protect, getCollection)
  .put(protect, isOwner, updateCollection)
  .delete(protect, isOwner, deleteCollection);

export { router };
