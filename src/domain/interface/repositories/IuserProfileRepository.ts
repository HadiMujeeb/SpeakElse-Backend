import { Request,response,NextFunction } from "express";
import { IUser } from "../../entities/user";


export default interface IUserProfileRepository {
    updateUserData(memberId:string,credential:IUser):Promise<void>|never;
}