import express, { Router } from "express";
import adminLanguageTestController from "../../adapters/controllers/adminTests.controller";
import adminLanguageTestUseCase from "../../usecase/adminTests.usecase";
import adminLanguageTestRepository from "../repository/adminTests.repository";
import prisma from "../config/prismaCient.config";

const AdminLanguageTestRepository = new adminLanguageTestRepository(prisma);
const AdminLanguageTestUseCase = new adminLanguageTestUseCase(AdminLanguageTestRepository);
const AdminLanguageTestController = new adminLanguageTestController(AdminLanguageTestUseCase);

const adminLanguageTestRoute: Router = express.Router();

adminLanguageTestRoute.post('/addQuestion', AdminLanguageTestController.requestaddQuestion.bind(AdminLanguageTestController));
adminLanguageTestRoute.get('/getAllQuestions', AdminLanguageTestController.requestgetAllQuestions.bind(AdminLanguageTestController));
adminLanguageTestRoute.put('/editQuestion', AdminLanguageTestController.requesteditQuestion.bind(AdminLanguageTestController));
adminLanguageTestRoute.delete('/removeQuestion/:id', AdminLanguageTestController.requestremoveQuestion.bind(AdminLanguageTestController));

export default adminLanguageTestRoute