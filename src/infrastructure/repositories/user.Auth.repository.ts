import { PrismaClient } from "@prisma/client";

// interface
import { IUser } from "../../domain/entities/user";
import IUserAuthRepository from "../../domain/interface/repositories/user.IAuth.repository";
import { IUserRegisterCredentials } from "../../domain/interface/controllers/user.IAuth.controller";

export class userAuthRepository implements IUserAuthRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createNewUser(
    newUserData: IUserRegisterCredentials): Promise<void | never> {
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
      throw err
    }
  }

  async getUserByGoogleId(googleId: string): Promise<IUser | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { googleId },
      });
    } catch (err) {
      throw err
    }
  }
 
}
