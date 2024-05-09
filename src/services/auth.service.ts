import { RegisterUserDto } from "_app/dtos/user.dto";
import userModel from "_app/models/user.model";
import * as bcrypt from "bcrypt";

export class AuthService {
  public async register(userData: RegisterUserDto) {
    const { username, email, password, confirmPassword } = userData;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role =
      (await userModel.countDocuments()) === 0 ? "mainAdmin" : "user";

    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
      confirmPassword,
      role,
    });

    await newUser.save();

    return newUser;
  }
}
