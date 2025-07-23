import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoute.js";
import connectToDB from "./db/db.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();
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

app.use('/users', userRoutes);

// Use the error handling middleware
app.use(errorHandler);

export default app;
