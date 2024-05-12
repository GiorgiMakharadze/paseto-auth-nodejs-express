import { AdminController } from "_app/controllers/admin.controller";
import { ADMIN_ROLES } from "_app/enums";
import userRoleValidation from "_app/middlewares/userRoleValidation";
import { Router } from "express";

const router = Router();
const adminController = new AdminController();

router.get("/users", (req, res) => adminController.getAllUsers(req, res));
router.get("/user/:id", (req, res) =>
  adminController.getConcreteUser(req, res)
);
router.patch(
  "/make-user-admin/:id",
  userRoleValidation([ADMIN_ROLES.MAIN_ADMIN]),
  (req, res) => adminController.makeUserAdmin(req, res)
);
export default router;
