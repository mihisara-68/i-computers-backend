import express from "express";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter.js";
import jwt from "jsonwebtoken";
import authenticateUser from "./middlewares/authentication.js";
import productRouter from "./routers/productRouter.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const mongodbURl = process.env.MONGODB_URL;

mongoose.connect(mongodbURl).then(() => {
  console.log("connected to mongodb");
});
app.use(cors());
app.use(express.json());

app.use(authenticateUser);

app.use("/users", userRouter);
app.use("/products", productRouter);

app.put("/", (req, res) => {
  console.log("Put request received");

  res.json({ message: "Good morning " + req.body.name });
});

app.delete("/", (req, res) => {
  console.log("Delete request received");
});

app.listen(3000, (req, res) => {
  console.log("server is running on port 3000");
});
