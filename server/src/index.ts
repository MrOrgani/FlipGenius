import express from "express";
import cors from "cors";

import { router as collectionRouter } from "./routes/collectionRouter";
import { router as userRouter } from "./routes/userRouter";
import bodyParser from "body-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import cookieParser from "cookie-parser";
require("dotenv").config();

const port = 8800;

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/api/collections", collectionRouter);
app.use("/api/users", userRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
