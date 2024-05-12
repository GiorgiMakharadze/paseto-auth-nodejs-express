import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { SES, SendRawEmailCommand } from "@aws-sdk/client-ses";

dotenv.config();

interface Env {
  AWS_ACCESS_KEY_ID: string | undefined;
  AWS_SECRET_ACCESS_KEY: string | undefined;
}

const env: Env = {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
};

const ses = new SES({
  apiVersion: "2010-12-01",
  region: "us-east-1",
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
  },
});

const emailReceiver =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_EMAIL_RECEIVER
    : process.env.DEVELOPMENT_EMAIL_RECEIVER;

const transporter = nodemailer.createTransport({
  SES: {
    ses: ses,
    aws: { SendRawEmailCommand },
  },
});

interface MailOptions {
  to: string | undefined;
  subject: string;
  text: string;
  html?: string;
}

const sendEmail = async ({
  to = emailReceiver,
  subject,
  text,
  html,
}: MailOptions): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: emailReceiver,
      to: to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
