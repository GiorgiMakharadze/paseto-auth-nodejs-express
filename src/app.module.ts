import { Application } from "express";
import { AuthController } from "_app/controllers";

const authController = new AuthController();

export const AppModule = (app: Application) => {
  app.use("/api/v1/register", authController.registerUser);
};
