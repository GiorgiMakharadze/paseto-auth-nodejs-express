import { Router } from "express";
import { AuthController } from "_app/controllers/auth.controller";

const router = Router();
const authController = new AuthController();

router
  .route("/register")
  .post((req, res) => authController.registerUser(req, res));
router.post("/login", (req, res) => authController.loginUser(req, res));

export default router;
