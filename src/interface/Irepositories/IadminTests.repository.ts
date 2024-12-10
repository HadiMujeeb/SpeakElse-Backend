import { IRoom } from "../../domain/entities/room.entities";
import { IQuestions } from "../../domain/entities/tests.entites"

export default interface ILanguageTestRepository {
    getAllQuestions(id: string): Promise<any>;
    addQuestion(data: IQuestions): Promise<any>;
    editQuestion(data: IQuestions): Promise<void>;
    removeQuestion(id: string): Promise<void>;
}
