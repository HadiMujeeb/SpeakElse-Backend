import { User } from "../domain/entities/user";
import UserRepository from "../infrastructure/repositories/AuthUserRepository"
import { MailerServices } from "../infrastructure/services/mailer.services";
import { JWT } from "../infrastructure/utils/jwt.utils";
export default class userUsecase {


    private userRepository: UserRepository
    private mailerServices: MailerServices
    constructor(userRepository: UserRepository, mailerServices: MailerServices) {
        this.userRepository = userRepository
        this.mailerServices = mailerServices
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

    async CreateUser(user: User) {
        try {
            const createdUser = await this.userRepository.createUser(user);

            return {
                message: 'User created successfully!',
                user: createdUser,

            }
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new Error('Email already exists.');
            }
        }

    }

    async sentOTP(email: string) {
        try {
            // Store the OTP in the database
            const otpRecord = await this.userRepository.storeOTP(email);
            const subject = 'Your OTP Code';
            const text = `Your OTP code is: ${otpRecord.otp}. It is valid for 5 minutes.`;

            // Send the OTP email
            await this.mailerServices.sendEmail(email, subject, text);

            return {
                status: 200,
                message: 'OTP sent successfully'
            };
        } catch (error) {
            console.error(`Error sent otp ${email}:`, error);
            return {
                status: 500,
                message: 'Failed to sent OTP'
            }
        }
    }

    async verifyOTP(email: string, enteredOtp: string) {
        try {
            // Attempt to fetch the OTP record for the given email
            const recordOtp = await this.userRepository.verifyOTP(email);
            const user = await this.userRepository.findByEmail(email);
    
            // Check if the OTP record exists
            if (!recordOtp) {
                return {
                    status: 404,
                    message: "OTP not found"
                };
            }
    
            const { otp, expiresAt } = recordOtp;
    
            // Check if the OTP is valid (not expired and matches the entered OTP)
            if (new Date() < expiresAt && otp === enteredOtp) {
                // Generate a JWT token for the user
                const userToken = await JWT.generateToken(user!.id);
    
                // Delete the OTP record after successful verification
                await this.userRepository.deleteOTP(email);
    
                return {
                    status: 200,
                    message: "OTP verified successfully",
                    token: userToken,  // Return the token to the user
                    user
                };
            } else {
                // Delete the OTP if it is incorrect or expired
                await this.userRepository.deleteOTP(email);
    
                return {
                    status: 400,  // 400 indicates a bad request (invalid OTP)
                    message: "Entered OTP is incorrect or has expired"
                };
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
    
            return {
                status: 500,
                message: "Internal server error"
            };
        }
    }
}    