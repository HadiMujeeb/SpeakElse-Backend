import express, { Router } from "express";
import prisma from "../config/prismaCient.config"; // Ensure this path is correct
import AdminController from "../../adapters/controllers/admin.controller";
import AdminUseCase from "../../usecase/admin.usecase";
import adminRepository from "../repository/admin.repository";
import AdminUserMgmtRepository from "../repository/adminUser.Mgmt.repo";
import AdminUserMgmtUseCase from "../../usecase/adminUser.Mgmt.usecase";
import AdminUserMgmtController from "../../adapters/controllers/adminUser.Mgmt.controller";
import { PasswordService } from "../../domain/services/password.services";
import { upload } from "../config/multer.config";

const adminRouter: Router = express.Router();

const passwordService = new PasswordService();
const adminRepositoryInstance = new adminRepository();
const adminUseCase = new AdminUseCase(adminRepositoryInstance, passwordService);
const adminController = new AdminController(adminUseCase);

const AdminUserMgmtRepos = new AdminUserMgmtRepository(prisma);
const AdminUserMgmtUse = new AdminUserMgmtUseCase(AdminUserMgmtRepos, passwordService);
const AdminUserMgmtContro = new AdminUserMgmtController(AdminUserMgmtUse);

adminRouter.post("/adminLogin", adminController.adminLogin.bind(adminController));
adminRouter.get("/adminAuthToken", adminController.adminAuthTokenRequest.bind(adminController));
adminRouter.get("/adminLogout", adminController.adminLogoutRequest.bind(adminController));
adminRouter.post("/addMember", upload.single("image"), AdminUserMgmtContro.requestAddMember.bind(AdminUserMgmtContro));
adminRouter.get("/RetrieveAllMembers", AdminUserMgmtContro.requestRetrieveAllMembersList.bind(AdminUserMgmtContro));
adminRouter.put("/updateUserStatus", AdminUserMgmtContro.requestToggleMemberBlocking.bind(AdminUserMgmtContro));
adminRouter.put("/editMemberData", upload.single("image"), AdminUserMgmtContro.requestUpdateMemberDetails.bind(AdminUserMgmtContro));

export default adminRouter;
