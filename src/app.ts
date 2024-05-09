import * as express from "express";
import * as dotenv from "dotenv";
import "express-async-errors";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import { filterXSS } from "xss";
import errorHandlerMiddleware from "_app/middlewares/error-handler";
import notFoundMiddleware from "_app/middlewares/not-found";
import { AppModule } from "_app/app.module";
import { connectDB } from "_app/db";

const app = express();
const port = process.env.PORT || 5500;
dotenv.config();

app.set("trust proxy", 1);

app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
app.use((req, res, next) => {
  if (req.body) {
    req.body = JSON.parse(filterXSS(JSON.stringify(req.body)));
  }
  next();
});

AppModule(app);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

(async () => {
  try {
    await connectDB(process.env.MONGO_PATH!);
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("Database connection failed", error);
  }
})();

export default app;
