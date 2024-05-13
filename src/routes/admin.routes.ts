import { AdminController } from '_app/controllers/admin.controller';
import { ADMIN_ROLES } from '_app/enums';
import userRoleValidation from '_app/middlewares/userRoleValidation';
import { Router } from 'express';

const router = Router();
const adminController = new AdminController();

router.get('/users', adminController.getAllUsers.bind(adminController));
router.get('/user/:id', adminController.getConcreteUser.bind(adminController));
router.patch(
  '/make-user-admin/:id',
  userRoleValidation([ADMIN_ROLES.MAIN_ADMIN]),
  adminController.makeUserAdmin.bind(adminController)
);

export default router;
