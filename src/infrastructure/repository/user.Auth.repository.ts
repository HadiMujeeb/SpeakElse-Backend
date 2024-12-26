import { PrismaClient } from "@prisma/client";
const cron = require("node-cron");
// Interface imports
import { IUser } from "../../domain/entities/user.entities";
import IUserAuthRepository from "../../interface/Irepositories/Iuser.auth.repository";
import { IRegistrationRequest } from "../../interface/Icontrollers/Iuser.auth.controller";
import IPasswordTokenCredentials, { IOTPCredentials } from "../../interface/Iusecase/Iuser.auth.usecase";


export class userAuthRepository implements IUserAuthRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;

    // Schedule the cron job to delete expired sessions
    cron.schedule("*/2 * * * *", async () => {
      console.log("Checking for expired sessions...");
      await this.deleteExpiredOtp();
    });
  }

  async createNewUser(newUserData: IRegistrationRequest): Promise<void> {
    try {
      await this.prisma.user.upsert({
        where: {
          email: newUserData.email,
        },
        update: {
          name: newUserData.name,
          password: newUserData.password,
        },
        create: {
          name: newUserData.name,
          email: newUserData.email,
          password: newUserData.password,
          userWallet:{
            create: {
              balance: 0,
            }
          }
        },
      });
    } catch (err: any) {
      throw err;
    }
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      const userData = await this.prisma.user.findUnique({
        where: {
          email,
        },
        include:{userWallet:true}
      });
      return userData;
    } catch (err) {
      throw err;
    }
  }

  async markUserAsVerified(email: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { email },
        data: { isVerified: true },
      });
    } catch (err) {
      throw err;
    }
  }

  async findUserById(id: string): Promise<IUser | null> {
    try {
      const userData = await this.prisma.user.findUnique({
        where: {
          id,
        },
        include:{userWallet:true}
      });
      return userData;
    } catch (err) {
      throw err;
    }
  }

  private async deleteExpiredOtp(): Promise<void> {
    const now = new Date();

    try {
      const result = await this.prisma.otp.deleteMany({
        where: {
          expiresAt: {
            lt: now,
          },
        },
      });

      console.log(`Deleted ${result.count} expired sessions.`);
    } catch (err) {
      console.error("Error deleting expired sessions:", err);
    }
  }

  async saveOTPForEmail(OtpData: IOTPCredentials): Promise<void | never> {
    try {
      await this.prisma.otp.create({
        data: { email: OtpData.email, otp: OtpData.otp, expiresAt: OtpData.expiresAt },
      });
    } catch (err) {
      throw err;
    }
  }

  async findOTPByEmail(email: string): Promise<IOTPCredentials | null> {
    try {
      return await this.prisma.otp.findUnique({ where: { email } });
    } catch (err) {
      throw err;
    }
  }

  async removeOTPByEmail(email: string): Promise<void> {
    try {
      await this.prisma.otp.delete({ where: { email } });
    } catch (err) {
      throw err;
    }
  }

  async saveResetToken(email: string, token: string, expiresAt: Date): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { email },
        data: { resetToken: token, resetTokenExpiry: expiresAt },
      });
    } catch (err) {
      throw err;
    }
  }

  async findResetToken(email: string): Promise<IPasswordTokenCredentials | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { resetToken: true, resetTokenExpiry: true },
      });
      return user ? { resetToken: user.resetToken, resetTokenExpiry: user.resetTokenExpiry } : null;
    } catch (err) {
      throw err;
    }
  }

  async removeResetToken(email: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { email },
        data: { resetToken: null, resetTokenExpiry: null },
      });
    } catch (err) {
      throw err;
    }
  }

  async resetPassword(id: string, password: string): Promise<void> {
    try {
      await this.prisma.user.update({ where: { id }, data: { password } });
    } catch (error) {
      throw error;
    }
  }
}
