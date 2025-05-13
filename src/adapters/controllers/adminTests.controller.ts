import { Request, Response,NextFunction } from "express";
import languageTestUseCase from "../../usecase/adminTests.usecase";
import { IQuestions } from "../../domain/entities/tests.entites";
import { HttpStatus } from "../../domain/responseStatus/httpcode";
import { SuccessMessages } from "../../domain/responseMessages/successMessages";
import { IAdminTestsController } from "../../interface/Icontrollers/IadminTests.controller";

export default class languageTestController implements IAdminTestsController {
  private languageTestUseCase: languageTestUseCase;

  constructor(languageTestUseCase: languageTestUseCase) {
    this.languageTestUseCase = languageTestUseCase;
  }

  async requestgetAllQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const questions: IQuestions[] | [] = await this.languageTestUseCase.getAllQuestions();
      res.status(HttpStatus.OK).json({ message: SuccessMessages.QUESTIONS_RETRIEVED, data: questions });
    } catch (error) {
      next(error);
    }
  }

  // Add a new test
  async requestaddQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: IQuestions = req.body;   
      const question: IQuestions = await this.languageTestUseCase.addQuestion(data);

      res.status(HttpStatus.OK).json({ message:SuccessMessages.QUESTION_ADDED,data: question });
    } catch (error) {
      next(error);
    }
  }

  async requesteditQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: IQuestions = req.body;
      await this.languageTestUseCase.editQuestion(data);
      res.status(200).json({ message:SuccessMessages.QUESTION_UPDATED });
    } catch (error) {
      next(error);
    }
  }

  async requestremoveQuestion(req: Request, res: Response,next: NextFunction): Promise<void> {
    try {
      const  {id}  = req.params;
      console.log("working",id);
      await this.languageTestUseCase.removeQuestion(id);
      res.status(200).json({ message:SuccessMessages.QUESTION_DELETED });
    } catch (error) {
      next(error);
    }
  }
}
