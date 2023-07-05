import { Response } from "express-serve-static-core";
import jwt from "jsonwebtoken";

require("dotenv").config();

const generateToken = (
  res: Response<any, Record<string, any>, number>,
  userId: number
) => {
  const token = jwt.sign({ userId }, `${process.env.JWT_SECRET}`, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days,
  });
};

export default generateToken;
