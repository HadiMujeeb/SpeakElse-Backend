import express, { Router } from "express";
import prisma from "../config/PrismaCient"; // Ensure this path is correct
import AdminController from "../../adapters/controller/adminController";
import AdminUseCase from "../../usecase/adminUsecase";
import adminRepository from "../repositories/adminRepository";

// Create a new Router instance
const adminRouter: Router = express.Router();

// Initialize the repository, use case, and controller
const adminRepositoryInstance = new adminRepository();
const adminUseCase = new AdminUseCase(adminRepositoryInstance);
const adminController = new AdminController(adminUseCase);

// Define the admin login route
adminRouter.post(
  "/adminLogin",
  adminController.AdminLogin.bind(adminController)
);

// Export the router
export default adminRouter;
