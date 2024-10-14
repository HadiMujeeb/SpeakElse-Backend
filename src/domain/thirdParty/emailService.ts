import nodemailer from "nodemailer";
import { otpTemplate } from "../../infrastructure/templates/otpTemplate";
import IOTPCredentials from "../interface/controllers/IOTP.controller";
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
}
