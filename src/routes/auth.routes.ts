import { Router } from "express";
import { AuthController } from "_app/controllers/auth.controller";
import authenticateToken from "_app/utils/authenticateToken";

const router = Router();
const authController = new AuthController();

router.post("/register", authController.registerUser.bind(authController));
router.post("/login", authController.loginUser.bind(authController));
router.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController)
);
router.post(
  "/forgot-password-confirm",
  authController.forgotPasswordConfirm.bind(authController)
);

router.use(authenticateToken);

router.get("/verify-token", authController.verifyToken.bind(authController));
router.post(
  "/refresh-token",
  authController.refreshAccessToken.bind(authController)
);
router.post("/logout", authController.logOut.bind(authController));

router.get(
  "/csrf-token",
  authController.generateCSRFtOken.bind(authController)
);

export default router;
