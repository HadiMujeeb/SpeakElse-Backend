import languageTestRepository from "../infrastructure/repository/adminTests.repository";
import { IQuestions } from "../domain/entities/tests.entites";
import { IAdminTestsUseCase } from "../interface/Iusecase/IadminTests.usecase";

export default class languageTestUseCase implements IAdminTestsUseCase {
  private languageTestRepository: languageTestRepository;

  constructor(languageTestRepository: languageTestRepository) {
    this.languageTestRepository = languageTestRepository;
  }

  // Get all questions for a specific language test
  async getAllQuestions(): Promise<IQuestions[] | []> {
    try {
      const questions = await this.languageTestRepository.getAllQuestions();

      if (questions) {
        questions.forEach((question:any) => {
          question.questions = JSON.parse(question.questions);
        })
      }


      return questions;
    } catch (error) {
      throw error;
    }
  }
  async addQuestion(data: IQuestions): Promise<IQuestions> {
    try {
     const question =await this.languageTestRepository.addQuestion(data);
     if(question){
      question.questions = JSON.parse(question.questions);
     }
      return question;
    } catch (error) {
        throw error;
    }
  }

  async editQuestion(data: IQuestions): Promise<void> {
    try {
      await this.languageTestRepository.editQuestion(data);
    } catch (error) {
        throw error;
    }
  }

  async removeQuestion(id: string): Promise<void> {
    try {
      await this.languageTestRepository.removeQuestion(id);
    } catch (error) {
        throw error;
    }
  }

}
