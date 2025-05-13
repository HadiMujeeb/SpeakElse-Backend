import { IQuestions } from "../../domain/entities/tests.entites"

export interface ILanguageTestRepository {
    getAllQuestions(id: string): Promise<any>;
    addQuestion(data: IQuestions): Promise<any>;
    editQuestion(data: IQuestions): Promise<void>;
    removeQuestion(id: string): Promise<void>;
}
