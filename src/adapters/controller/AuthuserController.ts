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

    async register(req: Request, res: Response): Promise<void> {
        try {
            const user: User = req.body;
            // Check if the user exists
            const userExists = await this.userUsecase.checkExist(user.email);
            if (!userExists.data.status) {
                res.status(400).json({ userExists: userExists.data.message });
                return;
            }
            const result = await this.userUsecase.CreateUser(user);
            await this.userUsecase.sentOTP(user.email)
            res.status(200).json({ 
                message: 'OTP sent successfully',
             });
        } catch (error: any) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Failed to register user.' });
        }
    }


    async verifyOTP(req: Request, res: Response): Promise<void> {
        const { email, enterotp } = req.body;

        try {
            const result = await this.userUsecase.verifyOTP(email, enterotp);
            res.status(result.status).json({ message: result.message });
        } catch (error) {
            console.error("Error verifying OTP:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

}
