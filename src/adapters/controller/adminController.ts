import { Request, Response } from "express";



import AdminUseCase from "../../usecase/adminUsecase";



class AdminController {
  constructor(private AdminUseCase: AdminUseCase) {
    this.AdminUseCase = AdminUseCase;
  }

  async AdminLogin(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      const exist = await this.AdminUseCase.adminExists(email);
      if (!exist) {
        res.status(404).json({ message: "Admin not found" });
        return;
      }
      const isValidPassword = await this.AdminUseCase.verifyPassword(
        email,
        password
      );
      if (!isValidPassword) {
        res.status(401).json({ message: "Invalid password" });
        return;
      }

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default AdminController;
