import { User } from "../domain/entities/user";
import UserRepository from "../infrastructure/repositories/UserRepository"

export default class userUsecase {


    private userRepository: UserRepository

    constructor( userRepository: UserRepository) {

        this.userRepository = userRepository
    }

    async checkExist(email: string) {
        const userExist = await this.userRepository.findByEmail(email);

        if (userExist) {
            return {
                status: 400,
                data: {
                    status: false,
                    message: 'User already exists',
                },
            };
        } else {
            return {
                status: 200,
                data: {
                    status: true,
                    message: "User does not exist",
                },
            };
        }
    };

    async CreateUser(user:any){
     try{
        const createdUser = await this.userRepository.createUser(user);
        return {
            message:'User created successfully!',
            user:createdUser
        }
     }catch(error:any){
        if (error.code === 'P2002') {
            throw new Error('Email already exists.');
        }
     }
     
    }


}

