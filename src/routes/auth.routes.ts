import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthController } from '_app/controllers/auth.controller';
import authenticateToken from '_app/utils/authenticateToken';
import rateLimiterKeyGenerator from '_app/utils/rateLimiterKeyGenerator';

const router = Router();
const authController = new AuthController();

const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimiterKeyGenerator,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimiterKeyGenerator,
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
});

router.get(
  '/csrf-token',
  generalRateLimiter,
  authController.generateCSRFtoken.bind(authController)
);
router.post('/register', generalRateLimiter, authController.registerUser.bind(authController));
router.post('/login', loginRateLimiter, authController.loginUser.bind(authController));
router.post(
  '/forgot-password',
  generalRateLimiter,
  authController.forgotPassword.bind(authController)
);
router.post(
  '/forgot-password-confirm',
  generalRateLimiter,
  authController.forgotPasswordConfirm.bind(authController)
);

router.use(authenticateToken);

router.get('/verify-token', generalRateLimiter, authController.verifyToken.bind(authController));
router.post(
  '/refresh-token',
  generalRateLimiter,
  authController.refreshAccessToken.bind(authController)
);
router.post('/logout', generalRateLimiter, authController.logOut.bind(authController));

export default router;
