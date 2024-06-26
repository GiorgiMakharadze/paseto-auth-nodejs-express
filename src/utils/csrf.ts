import { doubleCsrf } from 'csrf-csrf';
import { Request, Response } from 'express';

export const { doubleCsrfProtection, generateToken, invalidCsrfTokenError } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET!,
  cookieName: '__Host-csrf-token',
  cookieOptions: {
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'prod',
  },
  getTokenFromRequest: (req: Request) => {
    const csrfToken = req.headers['x-csrf-token'];
    return csrfToken as string;
  },
});
