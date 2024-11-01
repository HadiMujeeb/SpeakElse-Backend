import { Request, response, NextFunction } from "express";
import { IUser } from "../../domain/entities/user.entities";

export default interface IUserProfileRepository {
  updateUserData(MemberData: IUser): Promise<void> | never;
}
