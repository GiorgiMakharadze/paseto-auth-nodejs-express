import { doubleCsrf } from 'csrf-csrf';
import { Request, Response } from 'express';

export const { doubleCsrfProtection, generateToken, invalidCsrfTokenError } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET!,
  cookieName: '__Host-csrf-token',
  cookieOptions: {
    sameSite: 'none', // Adjust based on your needs
    path: '/',
    secure: process.env.NODE_ENV === 'prod', // true in production
  },
  getTokenFromRequest: (req: Request) => {
    const csrfToken = req.headers['x-csrf-token'];
    return csrfToken as string;
  },
});
