import { PrismaClient, Role } from "@prisma/client";

import { IUser } from "../../domain/entities/user.entities";
import { IAdminControllerActions } from "../../interface/Icontrollers/Iadmin.controller";
import { IAdminUserMgmtRepo } from "../../interface/Irepositories/IadminUser.Mgmt.repo";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { ErrorMessages } from "../../domain/responseMessages/errorMessages";

export default class AdminUserMgmtRepository implements IAdminUserMgmtRepo {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
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

  async createMember(newMember: IUser): Promise<void | never> {
    try {
      await this.prisma.user.create({
        data: {
          email: newMember.email,
          password: newMember.password,
          name: newMember.name,
          avatar: newMember.avatar,
          profession: newMember.profession,
          country: newMember.country,
          language: newMember.language,
          role: newMember.role ?? Role.USER,
          isVerified: newMember.isVerified,
          description: newMember.description,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async editMember(MemberData: Partial<IUser>): Promise<IUser> {
    try {
      const updateMember = await this.prisma.user.update({
        where: { id: MemberData.id },
        data: {
          name: MemberData.name,
          email: MemberData.email,
          role: MemberData.role,
          avatar: MemberData.avatar,
          profession: MemberData.profession,
          country: MemberData.country,
          description: MemberData.description,
          language: MemberData.language,
        },
      });
      return updateMember;
    } catch (error) {
      throw error;
    }
  }

  async blockOrUnblockMember(memberId: string): Promise<void | never> {
    try {
      const member = await this.prisma.user.findUnique({
        where: { id: memberId },
        select: { isBlocked: true },
      });
      if (!member) {
        throw {
          status: HttpStatus.NOT_FOUND,
          message: ErrorMessages.USER_NOT_FOUND,
        };
      }

      await this.prisma.user.update({
        where: { id: memberId },
        data: {
          isBlocked: !member.isBlocked,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async listAllMembers(): Promise<IUser[]> {
    try {
      const members = await this.prisma.user.findMany({
        
      });
      return members??[];
    } catch (error) {
      throw error;
    }
  }
}  
