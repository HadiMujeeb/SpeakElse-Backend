import { PrismaClient } from "@prisma/client";
import {  IUser } from "../../domain/entities/user.entities";
import { IAdminUserMgmtRepo } from "../../interface/Irepositories/IadminUser.Mgmt.repo";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { ErrorMessages } from "../../domain/responseMessages/errorMessages";
import { IMember, IResponseAdminAddMember } from "../../domain/entities/admin.entities";

export default class adminUserMgmtRepository implements IAdminUserMgmtRepo {
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

  async createMember(newMember: IMember): Promise<void | IResponseAdminAddMember> {
    try {
     const data = await this.prisma.user.create({
        data: {
          email: newMember.email,
          password: newMember.password,
          name: newMember.name,
          profession: newMember.profession,
          country: newMember.country,
          language: newMember.language,
          isVerified: newMember.isVerified,
          role:newMember.role,
        },
      });
        const response: IResponseAdminAddMember = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      profession: data.profession??'',
      country: data.country??'',
      language: data.language??'',
      isBlocked: data.isBlocked,
      isVerified:data.isVerified,
      avatar:data.avatar??'',
      createdAt: data.createdAt.toISOString(),
    };

    return response;
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
          role: MemberData.role||"USER",
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
