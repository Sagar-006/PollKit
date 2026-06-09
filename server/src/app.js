import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./modules/auth/auth.routes.js";
import poolingRoute from "./modules/pooling/pooling.routes.js"
import path from "path";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json({limit:"50kb"}));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use("/api/auth",authRoute);
app.use("/api/pooling",poolingRoute);
export default app;