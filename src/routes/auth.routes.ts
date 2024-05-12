import { Router } from "express";
import { AuthController } from "_app/controllers/auth.controller";
import authenticateToken from "_app/utils/authenticateToken";

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

router.use(authenticateToken);

router.get("/verify-token", (req, res) => authController.verifyToken(req, res));
router.post("/refresh-token", (req, res) =>
  authController.refreshAccessToken(req, res)
);
router.post("/logout", (req, res) => authController.logOut(req, res));

export default router;
