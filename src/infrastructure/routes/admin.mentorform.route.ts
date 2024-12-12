import Express, { Router  } from "express";

import AdminMentorFormController from "../../adapters/controllers/admin.mentorform.controller";
import adminMentorFormUsecase from "../../usecase/admin.mentorform.usecase";
import AdminMentorFormRepository from "../../infrastructure/repository/admin.mentorform.repository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const adminMentorFormRepository = new AdminMentorFormRepository(prisma);
const AdminMentorFormUsecase = new adminMentorFormUsecase(adminMentorFormRepository);
const adminMentorFormController = new AdminMentorFormController(AdminMentorFormUsecase);

const adminMentorFormRouter = Router();

adminMentorFormRouter.get("/getAllApplications", adminMentorFormController.getAllApplications.bind(adminMentorFormController));
adminMentorFormRouter.put("/updateApprovalStatus", adminMentorFormController.updateApprovalStatus.bind(adminMentorFormController));
adminMentorFormRouter.put("/updateMentorStatus", adminMentorFormController.updateMentorStatus.bind(adminMentorFormController));

export default adminMentorFormRouter;