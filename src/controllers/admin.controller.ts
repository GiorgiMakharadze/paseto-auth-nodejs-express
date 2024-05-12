import { IRequest } from "_app/interfaces/request.interface";
import { AdminService } from "_app/services/admin.service";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  public async getAllUsers(req: IRequest, res: Response) {
    const users = await this.adminService.getAllUsers();
    res.status(StatusCodes.OK).json(users);
  }

  public async getConcreteUser(req: IRequest, res: Response) {
    const { id } = req.params;
    const user = await this.adminService.getConcreteUser(id);
    res.status(StatusCodes.OK).json(user);
  }

  public async makeUserAdmin(req: IRequest, res: Response) {
    const { id } = req.params;

    const result = await this.adminService.makeUserAdmin(id);
    res.status(StatusCodes.OK).json(result);
  }
}
