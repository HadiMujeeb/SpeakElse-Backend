import { PrismaClient } from '@prisma/client';
import IUserProfileRepository from '../../domain/interface/repositories/IuserProfileRepository';
import { IUser } from '../../domain/entities/user';


export default class userProfileRepository implements IUserProfileRepository {
    private prisma: PrismaClient;

    constructor() {
      this.prisma = new PrismaClient();
    }


  async updateUserData(memberId:string,credential: IUser): Promise<void> | never {
    try {
      await this.prisma.user.update({
      where:{id:memberId},
      data:{
        name:credential.name,
        email:credential.email,
        country:credential.country,
        profession:credential.profession,
        avatar:credential.avatar
      }
      })
    } catch (error) {
      
    }
  }
}
