import { Request, Response } from "express";
import { AuthService } from "_app/services/auth.service";
import checkPasswordStrength from "_app/utils/checkPasswordStrength";
import requiredField from "_app/utils/requiredField";
import { BadRequestError } from "_app/errors";
import { RegisterUserDto } from "_app/dtos/user.dto";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async registerUser(req: Request, res: Response) {
    const { username, email, password, confirmPassword } =
      req.body as RegisterUserDto;
    const requiredFields = ["username", "email", "password", "confirmPassword"];
    requiredField(req, res, requiredFields);

    if (password !== confirmPassword) {
      throw new BadRequestError("Passwords do not match");
    }
    if (!checkPasswordStrength(password)) {
      const feedback = [];

      if (password.length < 8) {
        feedback.push("Password must be at least 8 characters long.");
      }
      if (!/\d/.test(password)) {
        feedback.push("Password must include at least one number.");
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        feedback.push(
          "Password must include at least one special character (e.g., !, @, #)."
        );
      }
      const feedbackMessage = feedback.join(" ");

      throw new BadRequestError(
        feedbackMessage || "Password does not meet the required criteria."
      );
    }

    const newUser = await this.authService.register({
      username,
      email,
      password,
      confirmPassword,
    });
    const userToReturn = newUser.omitPrivate();
    res.status(201).json({ user: userToReturn });
  }
}
