import { Router } from "express";
import { AuthController } from "_app/controllers/auth.controller";

const router = Router();
const authController = new AuthController();

router
  .route("/register")
  .post((req, res) => authController.registerUser(req, res));
router.post("/login", (req, res) => authController.loginUser(req, res));
router.post("/forgot-password", (req, res) =>
  authController.forgotPassword(req, res)
);
router.post("/forgot-password-confirm", (req, res) =>
  authController.forgotPasswordConfirm(req, res)
);

export default router;
