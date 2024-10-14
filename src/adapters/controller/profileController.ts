import { Request, Response } from "express";
import ProfileUsecase from "../../usecase/profileUsecase";

class profileController {
  constructor(private profileUsecase: ProfileUsecase) {}

  async editprofile(req: Request, res: Response): Promise<void> {
    const { userId, name, country, profession } = req.body;
    console.log("dwodnwdoiwnd", userId, name, country, profession);
    try {
      const result = await this.profileUsecase.editProfile(
        userId,
        name,
        country,
        profession
      );
      res.status(result.status).json(result);
    } catch (error) {
      console.error("Error in editProfile controller:", error);
      res.status(500).json({
        status: 500,
        message: "Internal server error.",
      });
    }
  }
}

export default profileController;
