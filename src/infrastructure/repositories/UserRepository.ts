import { User } from "../../domain/entities/user";
import { PrismaClient } from "@prisma/client";

class UserRepository {

  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async createUser(user: User): Promise<User> {
    const result = await this.prisma.user.create({
      data: {

        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        profession: user.profession ?? '',
        country: user.country ?? '',
        avatar: user.avatar
      },
    });
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({
      where: {
        email: email
      }
    })
    return userData || null;
  }


}

export default UserRepository