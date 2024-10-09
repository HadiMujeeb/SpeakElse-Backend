import express, {Router} from 'express';
import UserRepository from '../repositories/AuthUserRepository';
import userController from '../../adapters/controller/AuthuserController';
import userUsecase from '../../useCase/userUsecase';
import prisma from "../config/PrismaCient";
import { User } from '../../domain/entities/user';
import { passwordHasher } from '../../domain/interfaces/passwordHasher';
import { PasswordService } from '../utils/passwordHasher';
import MailUseCase from '../../useCase/MailUsecase';
import { MailerServices } from '../services/mailer.services';


const router: Router = express.Router()
const mailusecase = new MailUseCase()
const mailerServices = new MailerServices();
const userRepository = new UserRepository(prisma,PasswordService);
const usecase = new userUsecase(userRepository,mailerServices);
const AuthuserController = new userController(usecase,mailusecase)

router.post('/register',AuthuserController.register.bind(AuthuserController))
router.post('/verifyOtp',AuthuserController.verifyOTP.bind(AuthuserController))


export default router