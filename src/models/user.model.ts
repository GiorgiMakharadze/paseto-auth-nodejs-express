import mongoose from 'mongoose';
import validator from 'validator';

import checkPasswordStrength from '_app/utils/checkPasswordStrength';
import { USER_ROLES } from '_app/enums';
import { IUser } from '_app/interfaces';

export const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide username'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Valid email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 10,
      validate: {
        validator: function (v: string) {
          return checkPasswordStrength(v);
        },
        message: 'Password is not strong enough',
      },
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 10,
      validate: {
        validator: function (v: string) {
          return checkPasswordStrength(v);
        },
        message: 'Password is not strong enough',
      },
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'user',
    },
    refreshToken: {
      type: String,
      default: null,
    },
    forgotPasswordToken: {
      type: String,
      default: null,
    },
    forgotPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.methods.omitPrivate = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.refreshToken;
  delete userObject.forgotPasswordToken;
  delete userObject.forgotPasswordExpire;

  return userObject;
};

const userModel = mongoose.model<IUser & mongoose.Document>('User', userSchema);

export default userModel;
