import { PrismaClient } from "@prisma/client";
import express from "express";

const router = express.Router();
const prisma = new PrismaClient();
const { collection } = prisma;

router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const collections = await collection.findMany();
    res.status(200).json(collections);
  } catch (err) {
    res.status(500).send({
      message: err || "Some error occurred while searching for tables",
    });
  }
});

router.get("/:collectionId", async (req, res) => {
  try {
  } catch (err) {
    res.status(500).send({
      message: err || "Some error occurred while searching for tables",
    });
  }
});
router.put("/:id", async (req, res) => {
  let collectionToUpdate;
  try {
    collectionToUpdate = await collection.findFirst({
      where: {
        AND: [
          {
            authorId: parseInt(req.body.authorId),
          },
          {
            id: parseInt(req.params.id),
          },
        ],
      },
    });
  } catch (err) {
    res.status(403).send({
      message: `You do not own this collection, you can not modify it`,
    });
  }

  const currentWordList = collectionToUpdate?.words
    ? await Object.fromEntries(JSON.parse(collectionToUpdate?.words))
    : {};
  const wordsToUpdate = await Object.fromEntries(
    JSON.parse(req.body?.wordList)
  );
  const updatedWordList = await JSON.stringify(
    Object.entries({ ...currentWordList, ...wordsToUpdate })
  );

  const updatedSelection = await collection.updateMany({
    data: {
      words: updatedWordList,
    },
    where: {
      AND: [
        {
          authorId: parseInt(req.body.authorId),
        },
        {
          id: parseInt(req.params.id),
        },
      ],
    },
  });
  res.status(200).json(updatedSelection);
});
router.post("/", async (req, res) => {
  const collectionNameAlreadyUsed = await collection.count({
    where: {
      AND: [
        {
          authorId: parseInt(req.body.authorId),
        },
        {
          name: req.body.name,
        },
      ],
    },
  });

  if (collectionNameAlreadyUsed > 0) {
    return res.status(500).send({
      message: "This name is already used",
    });
  }

  const newTable = await collection.create({
    data: {
      name: req.body.name,
      authorId: parseInt(req.body.authorId),
    },
  });
  res.status(201).json(newTable);
});
router.delete("/:authorId/:collectionId", async (req, res) => {
  try {
    await collection.deleteMany({
      where: {
        AND: [
          {
            authorId: parseInt(req.params.authorId),
          },
          {
            id: parseInt(req.params.collectionId),
          },
        ],
      },
    });
    res.status(201).json({});
  } catch (err) {
    res.status(500).send({
      message: err || "Some error occurred while creating the table",
    });
  }
});

export { router };
