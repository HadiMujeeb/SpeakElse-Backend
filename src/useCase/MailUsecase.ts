import Mailinterface from '../domain/interfaces/Mailinterface';
import { MailerServices } from '../infrastructure/services/mailer.services';

export default class MailUseCase implements Mailinterface  {
    private mailer:MailerServices;
    constructor(){
        this.mailer = new MailerServices();
    }

    async sendOTP(email:string,otp:string):Promise<void>{
        const subject = 'Your OTP Code';
        const text = `Your OTP code is ${otp}. It will expire in 5 minutes.`;
        try {
            await this.mailer.sendEmail(email, subject, text);
            console.log(`OTP sent to ${email}`);
        } catch (error) {
            console.error('Failed to send OTP:', error);
            throw new Error('Failed to send OTP');
        }


    }   
}