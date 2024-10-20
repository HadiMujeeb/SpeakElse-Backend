import { PrismaClient, Role } from "@prisma/client";

import { IUser } from "../../domain/entities/user";
import { IAdminControllerActions } from "../../domain/interface/controllers/IAdmin.controller";
import { IAdminUserMgmtRepo } from "../../domain/interface/repositories/IAdminUserMgmtRepo";
import { HttpStatus } from "../../domain/StatusCodes/HttpStatus";
import { ErrorMessages } from "../../domain/StatusMessages/ErrorMessages";


export default class AdminUserMgmtRepository implements IAdminUserMgmtRepo {
    private prisma:PrismaClient;

    constructor(prisma:PrismaClient){
        this.prisma = prisma;
    }


    async doesUserExist(memberId: string): Promise<boolean> {
        try {
            return !!this.prisma.user.findUnique({
                where:{id:memberId},
                select:{id:true},
            })
            
        } catch (error) {
           throw error 
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
                role: newMember.role ?? Role.USER,
                isVerified: newMember.isVerified,  
                description: newMember.description 
            }
        });
    } catch (error) {
        throw error;
    }
}


    async editMember(memberId: string, userDetails: Partial<IUser>): Promise<IUser> {
        try {
            const updateMember = await this.prisma.user.update({
                where:{id:memberId},
                data:{
                    ...userDetails
                }
            })
            return updateMember
        } catch (error) {
            throw error
        }
    }

    async blockOrUnblockMember(memberId: string): Promise<void | never> {
        try {
            const member = await this.prisma.user.findUnique({
                where: { id: memberId },
                select: { isBlocked: true },
            });
            if (!member) {
                throw {status:HttpStatus.NOT_FOUND,message:ErrorMessages.USER_NOT_FOUND}
            }

            await this.prisma.user.update({
                where: { id: memberId },
                data: {
                    isBlocked: !member.isBlocked, 
                },
            });
        } catch (error) {
          throw error
        }
    }
    

    async listAllMembers(): Promise<any> {
        try {
        const members = await this.prisma.user.findMany({
            select:{
                id:true,
                email:true,
                name:true,
                role:true,
                profession:true,
                isBlocked:true,
                
            }
        })
        return members
        } catch (error) {
           throw error
        }
    }

}