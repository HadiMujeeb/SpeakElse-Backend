import { Request, Response, NextFunction } from "express";
import IAdminUserMgmtController from "../../interface/Icontrollers/IadminUser.Mgmt.controller";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";

import AdminUserMgmtUseCase from "../../usecase/adminUser.Mgmt.usecase";
import { IUser } from "../../domain/entities/user.entities";

export default class AdminUserMgmtController
  implements IAdminUserMgmtController
{
  constructor(private AdminUserMgmtUseCase: AdminUserMgmtUseCase) {
    this.AdminUserMgmtUseCase = AdminUserMgmtUseCase;
    `  `;
  }

  async requestAddMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const newMember = {
        ...req.body,
        avatar: req.file ? req.file.path : null,
      };
      console.log(req.file?.path, "workingg");
      await this.AdminUserMgmtUseCase.addMemberToSystem(newMember);
      res.status(HttpStatus.OK).json({ message: SuccessMessages.USER_CREATED });
    } catch (error) {
      next(error);
    }
  }

  async requestRetrieveAllMembersList(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | never> {
    try {
      const AllMembers =
        await this.AdminUserMgmtUseCase.retrieveAllMembersList();

      res.status(HttpStatus.OK).json({
        message: SuccessMessages.USERS_RETRIEVED,
        members: AllMembers,
      });
    } catch (error) {
      next(error);
    }
  }

  async requestToggleMemberBlocking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { memberId } = req.body;
      await this.AdminUserMgmtUseCase.toggleMemberBlocking(memberId);
      res.status(HttpStatus.OK).json({ message: SuccessMessages.USER_BLOCKED });
    } catch (error) {
      next(error);
    }
  }

  async requestUpdateMemberDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const updateMemberData = {
        ...req.body,
        avatar: req.file ? req.file.path : null,
      };

      await this.AdminUserMgmtUseCase.updateMemberDetails(updateMemberData);
      res.status(HttpStatus.OK).json({ message: SuccessMessages.USER_UPDATED });
    } catch (error) {
      next(error);
    }
  }
}
