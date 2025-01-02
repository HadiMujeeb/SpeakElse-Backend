
import { IUser } from "../../domain/entities/user.entities";
import prisma from "../config/prismaCient.config";
import bcrypt from "bcryptjs";

export default class adminRepository {
  private async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findUserById(id: string): Promise<IUser | null> {
    try {
      const userData = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      return userData;
    } catch (err) {
      throw err;
    }
  }

  async isAdmin(email: string): Promise<IUser | null> {
    try {
      const user = await this.findUserByEmail(email);
      return user ?? null;
    } catch (error) {
      throw error;
    }
  }

  async adminExists(email: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    return !!user;
  }

  async verifyPassword(email: string, password: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return false; // User not found
    }
    return await bcrypt.compare(password, user.password || "");
  }
}
