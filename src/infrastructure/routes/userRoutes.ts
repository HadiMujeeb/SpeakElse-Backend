import express, {Router} from 'express';
import UserRepository from '../repositories/UserRepository';
import userController from '../../adapters/controller/userController';
import userUsecase from '../../useCase/userUsecase';
import prisma from "../prisma/config/PrismaCient";
import { User } from '../../domain/entities/user';


const router: Router = express.Router()

const userRepository = new UserRepository(prisma);
const usecase = new userUsecase( userRepository);
const AuthuserController = new userController(usecase);

router.post('/register',AuthuserController.register.bind(AuthuserController))


export default router