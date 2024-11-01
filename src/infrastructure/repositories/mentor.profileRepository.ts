import { PrismaClient } from "@prisma/client";
import IUserProfileRepository from "../../interface/Irepositories/IuserProfile.repository";
import { IUser } from "../../domain/entities/user.entities";
import IMentorProfileRepository from "../../interface/Irepositories/Imentor.profile.repository";

export default class mentorProfileRepository
  implements IMentorProfileRepository
{
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async doesUserExist(memberId: string): Promise<boolean> {
    try {
      return !!this.prisma.user.findUnique({
        where: { id: memberId },
        select: { id: true },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateMentorData(MemberData: IUser): Promise<void | never> {
    try {
      await this.prisma.user.update({
        where: { id: MemberData.id },
        data: {
          name: MemberData.name,
          email: MemberData.email,
          country: MemberData.country,
          profession: MemberData.profession,
          avatar: MemberData.avatar,
          language: MemberData.language,
          description: MemberData.description,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
