import { doubleCsrf } from 'csrf-csrf';
import { Request } from 'express';

export const { doubleCsrfProtection, generateToken, invalidCsrfTokenError } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET!,
  cookieName: '__Host-csrf-token',
  cookieOptions: {
    sameSite: 'none',
    path: '/',
    secure: false,
  },
  getTokenFromRequest: (req: Request) => req.headers['x-csrf-token'],
});
