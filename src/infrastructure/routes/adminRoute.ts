import express, { Router } from "express";
import prisma from "../config/PrismaCient"; // Ensure this path is correct
import AdminController from "../../adapters/controller/admincontroller";
import AdminUseCase from "../../usecase/adminUsecase";
import adminRepository from "../repositories/adminRepository";
import AdminUserMgmtRepository from "../repositories/AdminUserMgmtRepo";
import AdminUserMgmtUseCase from "../../usecase/AdminUserMgmtusecase";
import AdminUserMgmtController from "../../adapters/controller/AdminUserMgmtcontroller";
import { PasswordService } from "../../domain/thirdParty/passwordServices";

// Create a new Router instance
const adminRouter: Router = express.Router();

const passwordService = new PasswordService();
const adminRepositoryInstance = new adminRepository();
const adminUseCase = new AdminUseCase(adminRepositoryInstance);
const adminController = new AdminController(adminUseCase);

const AdminUserMgmtRepos = new AdminUserMgmtRepository(prisma);
const AdminUserMgmtUse  = new AdminUserMgmtUseCase(AdminUserMgmtRepos,passwordService);
const AdminUserMgmtContro = new AdminUserMgmtController(AdminUserMgmtUse);


adminRouter.post(
  "/adminLogin",
  adminController.AdminLogin.bind(adminController)
);

adminRouter.post('/addMember',AdminUserMgmtContro.requestAddMember.bind(AdminUserMgmtContro));
adminRouter.get('/RetrieveAllMembers',AdminUserMgmtContro.requestRetrieveAllMembersList.bind(AdminUserMgmtContro));
adminRouter.put('/updateUserStatus',AdminUserMgmtContro.requestToggleMemberBlocking.bind(AdminUserMgmtContro));
adminRouter.put('/editMemberData',AdminUserMgmtContro.requestToggleMemberBlocking.bind(AdminUserMgmtContro));





export default adminRouter;
