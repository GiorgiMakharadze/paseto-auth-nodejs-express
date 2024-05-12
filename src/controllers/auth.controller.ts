import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AuthService } from "_app/services/auth.service";
import checkPasswordStrength from "_app/utils/checkPasswordStrength";
import requiredField from "_app/utils/requiredField";
import { BadRequestError, UnauthenticatedError } from "_app/errors";
import { RegisterUserDto } from "_app/dtos/user.dto";
import setCookies from "_app/utils/setCookies";
import { generateToken } from "_app/utils/csrf";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async generateCSRFtOken(req: Request, res: Response) {
    const csrfToken = generateToken(req, res);
    res.status(StatusCodes.OK).json({ csrfToken });
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
    res.status(StatusCodes.CREATED).json({ user: userToReturn });
  }

  public async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    const requiredFields = ["email", "password"];
    requiredField(req, res, requiredFields);

    const { user, token, refreshToken } = await this.authService.login(
      email,
      password
    );

    setCookies(res, token, refreshToken);

    res.status(StatusCodes.OK).json({
      user,
      token,
      refreshToken,
    });
  }

  public async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    requiredField(req, res, ["email"]);

    const message = await this.authService.forgotPassword(email);
    res.status(StatusCodes.OK).json({ message });
  }

  public async forgotPasswordConfirm(req: Request, res: Response) {
    const { token, password } = req.body;
    requiredField(req, res, ["token", "password"]);

    const message = await this.authService.forgotPasswordConfirm(
      token,
      password
    );
    res.status(StatusCodes.OK).json({ message });
  }

  public async verifyToken(req: Request, res: Response) {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && !refreshToken) {
      throw new UnauthenticatedError("No token provided");
    }

    const loggedInUser = await this.authService.verifyToken(
      accessToken,
      refreshToken
    );

    res
      .status(StatusCodes.OK)
      .json({ message: "Token is valid", loggedInUser });
  }

  public async logOut(req: Request, res: Response) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new BadRequestError("No refresh token provided");
    }

    const message = await this.authService.logOut(refreshToken);

    res.clearCookie("accessToken", { secure: true, sameSite: "none" });
    res.clearCookie("refreshToken", { secure: true, sameSite: "none" });

    res.status(StatusCodes.OK).json({ msg: message });
  }

  public async refreshAccessToken(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthenticatedError("No refresh token provided");
    }

    const { newAccessToken, newRefreshToken } =
      await this.authService.refreshAccessToken(refreshToken);

    setCookies(res, newAccessToken, newRefreshToken);

    res.status(StatusCodes.OK).json({ message: "Access token refreshed" });
  }
}
