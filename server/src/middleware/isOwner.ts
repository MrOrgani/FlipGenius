import asyncHandler from "express-async-handler";
import express from "express";

import { PrismaClient } from "@prisma/client";
const Prisma = new PrismaClient();

const isOwner = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { collectionId } = req.params;
    const { authorId } = req.body;

    if (!collectionId || !authorId) {
      res.status(400);
      throw new Error("Either collection id or user id is missing");
    }

    const collectionToUpdate = await Prisma.collection.findFirst({
      where: {
        AND: [
          {
            authorId: parseInt(authorId),
          },
          {
            id: parseInt(collectionId),
          },
        ],
      },
    });

    if (collectionToUpdate) {
      next();
    } else {
      res.status(400);
      throw new Error("You are not authorized to modify this collection");
    }
  }
);

export { isOwner };
