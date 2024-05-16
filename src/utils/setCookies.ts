import { Response } from 'express';
import ms from 'ms';

const setCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = process.env.NODE_ENV === 'prod';

  const accessTokenExpiry = ms('15m');
  const refreshTokenExpiry = ms('7d');

  res.cookie('accessToken', accessToken, {
    expires: new Date(Date.now() + accessTokenExpiry),
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    httpOnly: true,
  });

  res.cookie('refreshToken', refreshToken, {
    expires: new Date(Date.now() + refreshTokenExpiry),
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    httpOnly: true,
  });
};

export default setCookies;
