import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const userPrismaClient = new PrismaClient();

userPrismaClient.$use(async (params, next) => {
  if (params.action == "create" && params.model == "user") {
    const user = params.args.data;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    params.args.data = user;
  }
  return next(params);
});

export { userPrismaClient };
