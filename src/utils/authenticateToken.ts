import { Request, Response, NextFunction } from "express";
import { V4 as paseto } from "paseto";
import "dotenv/config";
import userModel from "_app/models/user.model";
import { UnauthorizedError } from "_app/errors";
import { publicKeyPEM } from "./keyManager";
import { IRequest } from "_app/interfaces/request.interface";

const authenticateToken = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw new UnauthorizedError("No token provided");
  }

  const payload = await paseto.verify(token, publicKeyPEM);

  const user = await userModel.findById(payload.id);
  if (!user) {
    throw new UnauthorizedError("Invalid token: user not found");
  }

  req.user = user;
  next();
};

export default authenticateToken;
