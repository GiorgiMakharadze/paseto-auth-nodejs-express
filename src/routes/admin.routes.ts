import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { AdminController } from '_app/controllers/admin.controller';
import { ADMIN_ROLES } from '_app/enums';
import userRoleValidation from '_app/middlewares/userRoleValidation';
import rateLimiterKeyGenerator from '_app/utils/rateLimiterKeyGenerator';

const router = Router();
const adminController = new AdminController();

const adminActionRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: rateLimiterKeyGenerator,
  message: 'Too many requests from this IP, please try again after an hour',
});

router.get('/users', adminActionRateLimiter, adminController.getAllUsers.bind(adminController));
router.get(
  '/user/:id',
  adminActionRateLimiter,
  adminController.getConcreteUser.bind(adminController)
);
router.delete(
  '/user/:id',
  userRoleValidation([ADMIN_ROLES.MAIN_ADMIN]),
  adminActionRateLimiter,
  adminController.deleteUser.bind(adminController)
);
router.patch(
  '/make-user-admin/:id',
  userRoleValidation([ADMIN_ROLES.MAIN_ADMIN]),
  adminActionRateLimiter,
  adminController.makeUserAdmin.bind(adminController)
);

export default router;
