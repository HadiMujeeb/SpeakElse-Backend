import { Request, Response, NextFunction } from "express";
import {IAdminUserMgmtController} from "../../interface/Icontrollers/IadminUser.Mgmt.controller";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";
import adminUserMgmtUseCase from "../../usecase/adminUser.Mgmt.usecase";
import { IUser } from "../../domain/entities/user.entities";

export default class adminUserMgmtController implements IAdminUserMgmtController {
  constructor(private adminUserMgmtUseCase: adminUserMgmtUseCase) {
    this.adminUserMgmtUseCase = adminUserMgmtUseCase;
  }

  async requestAddMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newMember = { ...req.body, avatar: req.file ? req.file.path : null };
      await this.adminUserMgmtUseCase.addMemberToSystem(newMember);
      res.status(HttpStatus.OK).json({ message: SuccessMessages.USER_CREATED });
    } catch (error) { next(error); }
  }

  async requestRetrieveAllMembersList(req: Request, res: Response, next: NextFunction): Promise<void | never> {
    try {
      const members= await this.adminUserMgmtUseCase.retrieveAllMembersList();
      res.status(HttpStatus.OK).json({
        message: SuccessMessages.USERS_RETRIEVED,
        members,
      });
    } catch (error) {
      next(error);
    }
  }
  

  async requestToggleMemberBlocking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.body;
      await this.adminUserMgmtUseCase.toggleMemberBlocking(memberId);
      res.status(HttpStatus.OK).json({ message: SuccessMessages.USER_BLOCKED });
    } catch (error) { next(error); }
  }

  async requestUpdateMemberDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updateMemberData = { ...req.body, avatar: req.file ? req.file.path : null };
      await this.adminUserMgmtUseCase.updateMemberDetails(updateMemberData);
      res.status(HttpStatus.OK).json({ message: SuccessMessages.USER_UPDATED });
    } catch (error) { next(error); }
  }
}
