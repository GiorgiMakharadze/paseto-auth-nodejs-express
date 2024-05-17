import express, { Application } from 'express';
import AuthRoutes from '_app/routes/auth.routes';
import AdminRoutes from '_app/routes/admin.routes';
import DocsRoutes from '_app/routes/docs.routes';
import userRoleValidation from './middlewares/userRoleValidation';
import { ADMIN_ROLES } from './enums';
import getEnumValues from './utils/getEnumValues';
import authenticateToken from './utils/authenticateToken';

export const AppModule = (app: Application) => {
  app.use('/api/v1/docs', DocsRoutes);
  app.use('/api/v1/auth', AuthRoutes);
  app.use(authenticateToken);
  app.use('/api/v1/admin', userRoleValidation(getEnumValues(ADMIN_ROLES)), AdminRoutes);
};
