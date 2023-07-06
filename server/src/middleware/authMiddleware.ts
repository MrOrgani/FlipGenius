import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { userPrismaClient as Prisma } from "../models/userModel";

const isAuth = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        `${process.env.JWT_SECRET}`
      ) as jwt.JwtPayload;

      const user = await Prisma.user.findUnique({
        where: { id: parseInt(`${decoded.userId}`) },
      });

      req.body.user = user;

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, wrong token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { isAuth };
