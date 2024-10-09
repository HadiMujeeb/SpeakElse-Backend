import { User } from "../../domain/entities/user";
import { PrismaClient } from "@prisma/client";
import { passwordHasher } from "../../domain/interfaces/passwordHasher";
import { DateUtils } from "../utils/dateUtils";
import { generateOTP } from "../utils/generateOTP.utils";
import { MailerServices } from "../services/mailer.services";
import { text } from "express";
class UserRepository {
  private prisma: PrismaClient;
  private passwordHasher: passwordHasher;
  // private generateOTP:generateOTP;
  constructor(prisma: PrismaClient, passwordHasher: passwordHasher) {
    this.prisma = prisma;
    this.passwordHasher = passwordHasher;
   
  }

  async createUser(user: User): Promise<User> {
    const hashPassword = await this.passwordHasher.hashPassword(user.password);
    const result = await this.prisma.user.create({
      data: {

        name: user.name,
        email: user.email,
        password: hashPassword,
        profession: user.profession ?? '',
        country: user.country ?? '',
        avatar: user.avatar ?? ''
      },
    });
    return result;
  };

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    })
    return userData || null;
  };

  async storeOTP(email: string): Promise<any> {
    const otp = generateOTP.generate();
    const expiryTime = new Date(Date.now() + 5 * 60000); // OTP valid for 5 minutes

    // Store OTP in the database
    const userOTP =await this.prisma.otp.create({
      data: {
        email,
        otp,
        expiresAt: expiryTime,
      },
    });
 return userOTP

  }


  async verifyOTP(email:string):Promise<any>{
    const otp = await this.prisma.otp.findUnique({
      where:{email}
    })
    return otp
  }

  async deleteOTP(email:string):Promise<any>{
    await this.prisma.otp.delete({where:{email}})
    return true
  }



}

export default UserRepository