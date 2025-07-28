import "./db/env.js";

import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoute.js";
import activityRoutes from "./routes/activityRoute.js";
import connectToDB from "./db/db.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
connectToDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/activity", activityRoutes);


// Use the error handling middleware
app.use(errorHandler);

export default app;
