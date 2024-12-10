import { IQuestions } from "../../domain/entities/tests.entites"


export interface IAdminTestsUseCase {
    getAllQuestions(id: string): Promise<IQuestions[] | null>
    addQuestion(data: IQuestions): Promise<IQuestions>
    editQuestion(data: IQuestions): Promise<void>
    removeQuestion(id: string): Promise<void>
}