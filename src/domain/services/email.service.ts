import nodemailer from "nodemailer";
import { otpTemplate } from "../../infrastructure/templates/otp.template";
import { getResetPasswordEmailTemplate } from "../../infrastructure/templates/resetPassword.template";
import { IOTPCredentials } from "../../interface/Iusecase/Iuser.auth.usecase";
export class MailerServices {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(Data: IOTPCredentials) {
    const templates = otpTemplate(
      Data.name as string,
      Data.otp,
      Data.expiresAt
    );
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: Data.email,
      subject: templates.subject,
      html: templates.html,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendRestPasswordLink(name: string, email: string, token: string) {
    const link = `${process.env.FRONTEND_URL}?token=${token}`;

    const templates = getResetPasswordEmailTemplate(name, link);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: templates,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}
