import { json, NextFunction, Request, Response } from "express";

import AdminUseCase from "../../usecase/admin.usecase";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";
import { IUser } from "../../domain/entities/user.entities";

class AdminController {
  constructor(private AdminUseCase: AdminUseCase) {
    this.AdminUseCase = AdminUseCase;
  }

  async AdminLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | never> {
    try {
      const { email, password } = req.body;
      const adminData = await this.AdminUseCase.handleAdminlogin(
        email,
        password
      );
      res.status(HttpStatus.OK).json({
        message: SuccessMessages.LOGIN_SUCCESS,
        admin: adminData,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;
