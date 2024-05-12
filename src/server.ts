import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import morgan from "morgan";
import "express-async-errors";
import helmet from "helmet";
import { filterXSS } from "xss";
import errorHandlerMiddleware from "_app/middlewares/error-handler";
import notFoundMiddleware from "_app/middlewares/not-found";
import { AppModule } from "_app/app.module";
import { connectDB } from "_app/db";
import { doubleCsrfProtection, generateToken } from "_app/utils/csrf";

dotenv.config();

const server = express();
const port = process.env.PORT || 5000;

server.set("trust proxy", 1);

server.use(express.json({ limit: "100kb" }));
server.use(helmet());
server.use(mongoSanitize());
server.use(cookieParser());
server.use(compression());
server.use(morgan("dev"));

server.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

server.use((req, res, next) => {
  if (req.body) {
    req.body = JSON.parse(filterXSS(JSON.stringify(req.body)));
  }
  next();
});

// CSRF Token Generation Route
server.get("/csrf-token", (req, res) => {
  const csrfToken = generateToken(req, res);
  res.status(200).json({ csrfToken });
});

server.use(doubleCsrfProtection);

AppModule(server);

server.use(notFoundMiddleware);
server.use(errorHandlerMiddleware);

(async () => {
  try {
    await connectDB(process.env.MONGO_PATH!);
    server.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Database connection failed", error);
  }
})();

export default server;
