import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export const getCollections = () => Prisma.collection.findMany({});
export const getCollectionByAuthorId = (authorId: string) =>
  Prisma.collection.findMany({
    where: {
      authorId: parseInt(authorId),
    },
  });
export const getCollectionByAuthorIdAndCollectionName = ({
  name,
  authorId,
}: Record<"name" | "authorId", string>) =>
  Prisma.collection.findFirst({
    where: {
      AND: [
        {
          authorId: parseInt(authorId),
        },
        {
          name,
        },
      ],
    },
  });
export const getCollectionByAuthorIdAndCollectionId = ({
  id,
  authorId,
}: Record<"id" | "authorId", string>) =>
  Prisma.collection.findFirst({
    where: {
      AND: [
        {
          authorId: parseInt(authorId),
        },
        {
          id: parseInt(id),
        },
      ],
    },
  });

export const getCollectionById = (collectionId: string) =>
  Prisma.collection.findUnique({
    where: { id: parseInt(collectionId) },
  });

export const createNewCollection = (
  values: Record<"name" | "authorId", string>
) =>
  Prisma.collection.create({
    data: {
      name: values.name,
      authorId: parseInt(values.authorId),
    },
  });
export const deleteCollectionById = (collectionId: string) =>
  Prisma.collection.delete({
    where: {
      id: parseInt(collectionId),
    },
  });

export const updateCollectionByAuthorIdAndCollectionId = ({
  id,
  authorId,
  data,
}: Record<"id" | "authorId", string> & {
  data: {
    words: string;
  };
}) =>
  Prisma.collection.updateMany({
    data,
    where: {
      AND: [
        {
          authorId: parseInt(authorId),
        },
        {
          id: parseInt(id),
        },
      ],
    },
  });
