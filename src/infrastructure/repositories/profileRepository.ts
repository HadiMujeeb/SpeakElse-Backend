import { PrismaClient } from '@prisma/client';

class profileRepository {
    private prisma: PrismaClient;

    constructor() {
      this.prisma = new PrismaClient();
    }


      // Get user by ID
  async getUserById(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId }
    });
  }
  async editProfile(userId: string, name: string, country: string, profession: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        name,
        country,
        profession
      }
    });
  }
}

export default profileRepository