import * as express from "express";
import * as dotenv from "dotenv";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as mongoSanitize from "express-mongo-sanitize";
import * as compression from "compression";
import * as morgan from "morgan";
import "express-async-errors";
import helmet from "helmet";
import { filterXSS } from "xss";
import errorHandlerMiddleware from "_app/middlewares/error-handler";
import notFoundMiddleware from "_app/middlewares/not-found";
import { AppModule } from "_app/app.module";
import { connectDB } from "_app/db";

const server = express();
const port = process.env.PORT || 5000;
dotenv.config();

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
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
server.use((req, res, next) => {
  if (req.body) {
    req.body = JSON.parse(filterXSS(JSON.stringify(req.body)));
  }
  next();
});

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
