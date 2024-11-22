import { PrismaClient } from "@prisma/client";
const cron = require("node-cron");
// Interface imports
import { IUser } from "../../domain/entities/user.entities";
import IUserAuthRepository from "../../interface/Irepositories/Iuser.auth.repository";
import { IRegistrationRequest } from "../../interface/Icontrollers/Iuser.auth.controller";


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
}
