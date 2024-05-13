import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const camelCaseToWords = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
    .trim();
};

const requiredField = (req: Request, res: Response, requiredFields: string[]) => {
  for (const field of requiredFields) {
    if (!req.body[field]) {
      const readableField = camelCaseToWords(field);
      return res.status(StatusCodes.BAD_REQUEST).send({
        msg: `Missing required field: ${readableField}`,
      });
    }
  }
};

export default requiredField;
