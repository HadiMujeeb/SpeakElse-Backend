import { Request, Response } from 'express';
import UserUsecase from '../../useCase/userUsecase';

export default class UserController {

    private userUsecase: UserUsecase;

    constructor(userUsecase: UserUsecase) {
        this.userUsecase = userUsecase;
    }

    // Express route handler for user registration
    async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, role, profession, country, avatar } = req.body;
                   console.log("working")
            // Input validation
            if (!name || !email || !password) {
                res.status(400).json({ message: 'Name, email, and password are required' });
                return; // End the function execution after sending the response
            }

            // Check if the user exists
            const userExists = await this.userUsecase.checkExist(email);
            if (!userExists.data.status) {
                res.status(400).json({ message: userExists.data.message });
                return; // End the function execution after sending the response
            }

            // Create the user
            const user = { name, email, password, role, profession, country, avatar };
            const result = await this.userUsecase.CreateUser(user);

            // Send the response after successfully creating the user
            res.status(201).json(result);
        } catch (error: any) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Failed to register user.' });
        }
    }
}
