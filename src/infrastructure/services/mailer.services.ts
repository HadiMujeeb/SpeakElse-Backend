import nodemailer from 'nodemailer';

export class MailerServices {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',  // You can also use 'smtp.gmail.com'
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMaIL_PASS,
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        return await this.transporter.sendMail(mailOptions);
    }
}
