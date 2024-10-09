import { Request, Response } from 'express';
import UserUsecase from '../../useCase/userUsecase';
import MailUseCase from '../../useCase/MailUsecase';
import { User } from '../../domain/entities/user';

export default class UserController {

    private userUsecase: UserUsecase;
    private mailUseCase: MailUseCase;
    constructor(userUsecase: UserUsecase, MailUseCase: MailUseCase) {
        this.userUsecase = userUsecase;
        this.mailUseCase = MailUseCase;
    }

    // Express route handler for user registration
    async register(req: Request, res: Response): Promise<void> {
        try {
            const user: User = req.body;
            // Check if the user exists
            const userExists = await this.userUsecase.checkExist(user.email);
            if (!userExists.data.status) {
                res.status(400).json({ userExists: userExists.data.message });
                return;
            }
            // Create the user
            const result = await this.userUsecase.CreateUser(user);
            res.status(201).json(result);
        } catch (error: any) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Failed to register user.' });
        }
    }


    async sentOtp(req: Request, res: Response): Promise<void> {
        const email  = 'hadimujeeb300@gmail.com'
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        try {
            await this.userUsecase.sentOTP(email)
            res.status(200).json({ message: 'OTP sent successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to send OTP' });
        }
    }

}
