export interface IUser {
  _id: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role?: string[];
  omitPrivate(): any;
}
