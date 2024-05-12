import {
  AlreadyExistsError,
  BadRequestError,
  NotFoundError,
} from "_app/errors";
import userModel from "_app/models/user.model";

export class AdminService {
  public async getAllUsers() {
    const users = await userModel
      .find({})
      .select(
        "-password -refreshToken -forgotPasswordToken -forgotPasswordExpire"
      );
    if (!users) {
      throw new BadRequestError("Users not found");
    }
    return users;
  }

  public async getConcreteUser(id: string) {
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { email: id };
    const user = await userModel.findOne(query);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  public async makeUserAdmin(userId: string) {
    if (!userId) {
      throw new BadRequestError("User ID is not provided");
    }

    const user = await userModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.role === "admin") {
      throw new AlreadyExistsError("User is already an admin");
    }

    user.role = "admin";
    await user.save();

    return { msg: "User has been made admin" };
  }
}
