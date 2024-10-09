import { User } from "../domain/entities/user";
import UserRepository from "../infrastructure/repositories/AuthUserRepository"
import { MailerServices } from "../infrastructure/services/mailer.services";
export default class userUsecase {


    private userRepository: UserRepository
    private mailerServices:MailerServices
    constructor( userRepository: UserRepository,mailerServices:MailerServices) {
        this.userRepository = userRepository
        this.mailerServices=mailerServices
    }

    async checkExist(email: string) {
        const userExist = await this.userRepository.findByEmail(email);

        if (userExist) {
            return {
                status: 400,
                data: {
                    status: false,
                    message: 'Email already exists',
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

    async CreateUser(user:User){
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

    async sentOTP(email:string){
        try{
          // Store the OTP in the database
          const otpRecord = await this.userRepository.storeOTP(email);
          const subject = 'Your OTP Code';
          const text = `Your OTP code is: ${otpRecord.otp}. It is valid for 5 minutes.`;

          // Send the OTP email
          await this.mailerServices.sendEmail(email, subject, text);

          return {
             status:200,
             message:'OTP sent successfully'
          };
        } catch(error){
            console.error(`Error sent otp ${email}:`,error);
            return {
                status:500,
                message:'Failed to sent OTP'
            }
        }
    }
    


}

