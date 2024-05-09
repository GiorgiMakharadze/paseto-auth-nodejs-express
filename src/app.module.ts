import { Application } from "express";
import AuthRoutes from "_app/routes/auth.routes";

export const AppModule = (app: Application) => {
  app.use("/api/v1/auth", AuthRoutes);
};
