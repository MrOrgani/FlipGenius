import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken";

import express from "express";
import {
  createNewCollection,
  getCollectionByAuthorId,
  getCollectionByAuthorIdAndCollectionId,
  getCollectionByAuthorIdAndCollectionName,
  getCollectionById,
  updateCollectionByAuthorIdAndCollectionId,
  deleteCollectionById,
} from "../db/collection";

const getCollections = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { authorId } = req.body;

    if (!authorId) {
      res.status(400);
      throw new Error("No user id provided");
    }

    const collections = await getCollectionByAuthorId(authorId);

    if (collections) {
      res.status(201).send(collections).end();
    } else {
      res.status(400);
      throw new Error("This user has not created any collection");
    }
  }
);

// Get one particular collection of a user
const getCollection = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { collectionId } = req.params;

    if (!collectionId) {
      res.sendStatus(400);
      throw new Error("Missing collection id");
    }

    const collection = await getCollectionById(collectionId);

    if (collection) {
      res.status(201).json(collection);
    } else {
      res.status(400);
      throw new Error("This collection does not exist");
    }
  }
);

const createCollection = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { authorId, name } = req.body;

    if (!authorId || !name) {
      res.status(400);
      throw new Error("Missing collection name or user ID");
    }

    const collectionNameAlreadyUsed =
      await getCollectionByAuthorIdAndCollectionName({
        authorId: authorId,
        name,
      });

    if (collectionNameAlreadyUsed) {
      res.status(400);
      throw new Error("This name is already used");
    }

    const newCollection = await createNewCollection({
      name,
      authorId: authorId,
    });
    res.status(201).json(newCollection);
  }
);

const updateCollection = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { authorId, id } = req.body;

    if (!authorId || !id) {
      res.status(400);
      throw new Error("Missing user ID or collection ID");
    }

    const collectionToUpdate = await getCollectionByAuthorIdAndCollectionId({
      id,
      authorId,
    });

    const currentWordList = collectionToUpdate?.words
      ? await Object.fromEntries(JSON.parse(collectionToUpdate?.words))
      : {};
    const wordsToUpdate = await Object.fromEntries(
      JSON.parse(req.body?.wordList)
    );
    const words = await JSON.stringify(
      Object.entries({ ...currentWordList, ...wordsToUpdate })
    );

    const updatedSelection = await updateCollectionByAuthorIdAndCollectionId({
      data: { words },
      authorId,
      id,
    });
    res.status(201).json(updatedSelection);
  }
);

// Delete particular collection of a user
const deleteCollection = asyncHandler(
  async (req: express.Request, res: express.Response) => {
    const { collectionId } = req.params;

    if (!collectionId) {
      res.sendStatus(400);
      throw new Error("Missing collection id");
    }

    const collection = await deleteCollectionById(collectionId);

    if (collection) {
      res.status(201).json(collection);
    } else {
      res.status(400);
      throw new Error("This collection does not exist");
    }
  }
);

export {
  getCollection,
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
};
