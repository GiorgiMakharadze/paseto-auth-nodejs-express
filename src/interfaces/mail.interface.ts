export interface IMailOptions {
  to: string | undefined;
  subject: string;
  text: string;
  html?: string;
}
