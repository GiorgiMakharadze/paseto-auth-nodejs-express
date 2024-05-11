import { RegisterUserDto } from "_app/dtos/user.dto";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "_app/errors";
import userModel from "_app/models/user.model";
import { privateKeyPEM } from "_app/utils/keyManager";
import generateRefreshToken from "_app/utils/refreshToken";
import * as bcrypt from "bcrypt";
import { V4 as paseto } from "paseto";
import validator from "validator";

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

  public async login(email: string, password: string) {
    if (!email || !validator.isEmail(email)) {
      throw new BadRequestError("Valid email is required");
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthenticatedError("Invalid email or password");
    }

    const tokenPayload = { id: user._id, role: user.role };
    const token = await paseto.sign(tokenPayload, privateKeyPEM);
    const refreshToken = await generateRefreshToken(user);

    return {
      user: user.omitPrivate(),
      token,
      refreshToken,
    };
  }
}
