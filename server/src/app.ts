import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import cors from "./config/cors";
import rateLimit from "./config/rateLimit";
import errorHandler from "./middlewares/error.middleware";
import router from "./routes";

const app = express();

// Essential Middlewares
app.use(helmet());
app.use(cors);
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(morgan("dev"));

// Rate Limit
app.use(rateLimit);

// Global Routes Prefix
app.use("/api", router);

// Global Error Handler
app.use(errorHandler);

export default app;
