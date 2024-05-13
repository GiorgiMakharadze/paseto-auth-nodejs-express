import { RegisterUserDto } from '_app/dtos/user.dto';
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from '_app/errors';
import userModel from '_app/models/user.model';
import checkPasswordStrength from '_app/utils/checkPasswordStrength';
import { privateKeyPEM } from '_app/utils/keyManager';
import generateRefreshToken from '_app/utils/refreshToken';
import sendEmail from '_app/utils/sendEmail';
import setCookies from '_app/utils/setCookies';
import { verifyAccessToken, verifyRefreshToken } from '_app/utils/verifyTokens';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { V4 as paseto } from 'paseto';
import validator from 'validator';

export class AuthService {
  public async register(userData: RegisterUserDto) {
    const { username, email, password, confirmPassword } = userData;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = (await userModel.countDocuments()) === 0 ? 'mainAdmin' : 'user';

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
      throw new BadRequestError('Valid email is required');
    }

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new NotFoundError('User does not exist');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthenticatedError('Invalid email or password');
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

  public async forgotPassword(email: string) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new BadRequestError('User not found');
    }

    const forgotToken = crypto.randomBytes(20).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(forgotToken).digest('hex');
    const forgotTokenExpire = Date.now() + 3600000;

    user.forgotPasswordToken = hashedResetToken;
    user.forgotPasswordExpire = forgotTokenExpire;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${forgotToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: `To reset your password, please click on the following link: ${resetUrl}`,
      });
    } catch (error) {
      throw new InternalServerError('Failed to send email. Please try again later.');
    }
    return 'Email sent. Please check your inbox.';
  }

  public async forgotPasswordConfirm(token: string, password: string) {
    if (!checkPasswordStrength(password)) {
      const feedback = [];

      if (password.length < 10) {
        feedback.push('Password must be at least 10 characters long.');
      }
      if (!/\d/.test(password)) {
        feedback.push('Password must include at least one number.');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        feedback.push('Password must include at least one special character (e.g., !, @, #).');
      }
      const feedbackMessage = feedback.join(' ');

      throw new BadRequestError(feedbackMessage || 'Password does not meet the required criteria.');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await userModel.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordExpire: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      throw new BadRequestError('Invalid or expired password reset token.');
    }

    user.password = await bcrypt.hash(password, 10);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpire = undefined;
    await user.save();

    return 'Password has been reset successfully.';
  }

  public async verifyToken(accessToken: string, refreshToken: string) {
    let payload = await verifyAccessToken(accessToken);

    if (!payload && refreshToken) {
      payload = await verifyRefreshToken(refreshToken);
      if (!payload) {
        throw new UnauthenticatedError('Invalid refresh token');
      }
    }

    if (!payload) {
      throw new UnauthenticatedError('No valid token provided');
    }

    const user = await userModel.findById(payload.id);
    if (!user) {
      throw new UnauthorizedError('Invalid token: user not found');
    }

    return user.omitPrivate();
  }

  public async logOut(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestError('No refresh token provided');
    }

    const user = await userModel.findOne({ refreshToken });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    return 'Successfully logged out';
  }

  public async refreshAccessToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthenticatedError('No refresh token provided');
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const user = await userModel.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthenticatedError('Invalid refresh token');
    }

    const newAccessToken = await paseto.sign({ id: user._id, role: user.role }, privateKeyPEM);
    const newRefreshToken = await generateRefreshToken(user);

    return { newAccessToken, newRefreshToken };
  }
}
