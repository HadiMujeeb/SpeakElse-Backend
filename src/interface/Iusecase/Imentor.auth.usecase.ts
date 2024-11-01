import IApplication from "../../domain/entities/mentor.entities";

export default interface IMentorAuthUseCase {
  registerMentorApplication(credentials: IApplication): Promise<void>;
}
