import { V4 as paseto } from 'paseto';
import { publicKeyPEM } from './keyManager';
import { UnauthenticatedError } from '_app/errors';
import userModel from '_app/models/user.model';

const verifyAccessToken = async (accessToken: string) => {
  const payload = await paseto.verify(accessToken, publicKeyPEM);
  if (!payload) {
    throw new UnauthenticatedError('Invalid or expired access token');
  }
  return payload;
};

const verifyRefreshToken = async (refreshToken: string) => {
  const payload = await paseto.verify(refreshToken, publicKeyPEM);
  const user = await userModel.findById(payload.id).where({ refreshToken });
  if (!user) {
    throw new UnauthenticatedError('Invalid or expired refresh token');
  }
  return payload;
};

export { verifyAccessToken, verifyRefreshToken };
