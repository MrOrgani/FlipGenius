import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken";
import { userPrismaClient as Prisma } from "../models/userModel";

import bcrypt from "bcryptjs";

// Register a user
const registerUser = asyncHandler(async (req, res) => {
  const userExists = await Prisma.user.count({
    where: { email: req.body.email },
  });

  if (userExists > 0) {
    res.status(500);
    throw new Error("User already exists");
  }

  const newUser = await Prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    },
  });

  if (newUser) {
    generateToken(res, newUser.id);

    res
      .status(201)
      .json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      })
      .end();
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const user = await Prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (user) {
    bcrypt.compare(req.body.password, user["password"]);
  }
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    generateToken(res, user.id);

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await Prisma.user.findUnique({
    where: { id: req.body.id },
  });

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await Prisma.user.update({
      where: { id: req.body.id },
      data: { ...user },
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await Prisma.user.findUnique({
    where: { id: req.body.user.id },
  });

  const collections = await Prisma.collection.findMany({
    where: { authorId: user?.id },
  });

  if (user) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      collections: collections,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

export {
  registerUser,
  authUser,
  updateUserProfile,
  getUserProfile,
  logoutUser,
};
