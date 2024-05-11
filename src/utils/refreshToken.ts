import { V4 as paseto } from "paseto";
import { privateKeyPEM } from "./keyManager";
import { IUser } from "_app/interfaces";

const generateRefreshToken = async (user: IUser) => {
  const refreshTokenPayload = { id: user._id, role: user.role };
  const refreshToken = await paseto.sign(refreshTokenPayload, privateKeyPEM);
  user.refreshToken = refreshToken;
  await user.save();
  return refreshToken;
};

export default generateRefreshToken;
