import { AdminController } from "_app/controllers/admin.controller";
import { Router } from "express";

const router = Router();
const adminController = new AdminController();

router.get("/users", (req, res) => adminController.getAllUsers(req, res));
router.get("/user/:id", (req, res) =>
  adminController.getConcreteUser(req, res)
);

export default router;
