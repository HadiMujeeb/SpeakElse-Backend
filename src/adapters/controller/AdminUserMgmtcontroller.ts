import { Request, Response, NextFunction } from "express";
import IAdminUserMgmtController from "../../domain/interface/controllers/IAdminUserMgmt.controller";
import { HttpStatus } from "../../domain/StatusCodes/HttpStatus";
import { SuccessMessages } from "../../domain/StatusMessages/SuccessMessages";

import AdminUserMgmtUseCase from "../../usecase/AdminUserMgmtusecase";

export default class AdminUserMgmtController implements IAdminUserMgmtController {

    constructor(
        private AdminUserMgmtUseCase:AdminUserMgmtUseCase
    )
    {
    this.AdminUserMgmtUseCase = AdminUserMgmtUseCase;`  `
    }


    async requestAddMember(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
           const AddData = req.body;
           console.log(AddData,"wwnifewi")
       await  this.AdminUserMgmtUseCase.addMemberToSystem(AddData);
       res.status(HttpStatus.OK).json({message:SuccessMessages.USER_CREATED});
        } catch (error) {
            next(error)
        }
    }

    async requestRetrieveAllMembersList(req: Request, res: Response,next:NextFunction): Promise<void|never> {
        try {
         const AllMembers = await this.AdminUserMgmtUseCase.retrieveAllMembersList();

         res.status(HttpStatus.OK).json({message:SuccessMessages.USERS_RETRIEVED,
            members:AllMembers
         });
        } catch (error) {
            next(error)
        }
    }

    async requestToggleMemberBlocking(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const {memberId }= req.body
            await this.AdminUserMgmtUseCase.toggleMemberBlocking(memberId);
            res.status(HttpStatus.OK).json({message:SuccessMessages.USER_BLOCKED})
        } catch (error) {
            next(error)
        }
    }

    async requestUpdateMemberDetails(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const {menterId ,updatetingData} = req.body
            await this.AdminUserMgmtUseCase.updateMemberDetails(menterId,updatetingData);
            res.status(HttpStatus.OK).json({message:SuccessMessages.USER_UNBLOCKED});
        } catch (error) {
            next(error);
        }
    }
}