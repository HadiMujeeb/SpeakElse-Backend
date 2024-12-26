import Express, { Router  } from "express";

import AdminMentorFormController from "../../adapters/controllers/admin.mentorform.controller";
import adminMentorFormUsecase from "../../usecase/admin.mentorform.usecase";
import AdminMentorFormRepository from "../../infrastructure/repository/admin.mentorform.repository";
import { PrismaClient } from "@prisma/client";
import { MailerServices } from "../../domain/services/email.service";
const prisma = new PrismaClient();

const adminMentorFormRepository = new AdminMentorFormRepository(prisma);
const AdminMentorFormUsecase = new adminMentorFormUsecase(adminMentorFormRepository, new MailerServices());
const adminMentorFormController = new AdminMentorFormController(AdminMentorFormUsecase);

const adminMentorFormRouter = Router();

adminMentorFormRouter.get("/getAllApplications", adminMentorFormController.getAllApplications.bind(adminMentorFormController));
adminMentorFormRouter.put("/updateApprovalStatus", adminMentorFormController.updateApprovalStatus.bind(adminMentorFormController));
adminMentorFormRouter.put("/updateMentorStatus", adminMentorFormController.updateMentorStatus.bind(adminMentorFormController));
adminMentorFormRouter.put("/sendedApplicationMail", adminMentorFormController.sendedApplicationMail.bind(adminMentorFormController));

export default adminMentorFormRouter;