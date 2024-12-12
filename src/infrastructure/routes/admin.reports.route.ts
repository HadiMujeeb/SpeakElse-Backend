import express,{ Router } from "express";

import AdminReportsController from "../../adapters/controllers/admin.reports.controllers";
import AdminReportsUseCase from "../../usecase/admin.reports.usecase";
import AdminReportsRepository from "../repository/admin.reports.repository";
import prisma from "../config/prismaCient.config";
const adminReportsRepository = new AdminReportsRepository(prisma);
const adminReportsUseCase = new AdminReportsUseCase(adminReportsRepository);
const adminReportsController = new AdminReportsController(adminReportsUseCase);

const adminReportsRoute: Router = express.Router();

adminReportsRoute.get("/requestGetAllReports", adminReportsController.requestRetrieveAllReports.bind(adminReportsController));
adminReportsRoute.put("/requestUpdateReportStatus", adminReportsController.requestStatusUpdate.bind(adminReportsController));
adminReportsRoute.put("/requestBlockUnblockUser", adminReportsController.requestBlockUnblockUser.bind(adminReportsController));
adminReportsRoute.get("/requestGellAllTransactions", adminReportsController.requestGellAllTransactions.bind(adminReportsController));
export default adminReportsRoute;