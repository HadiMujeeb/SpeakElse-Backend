import IApplication from "../../domain/entities/mentor.entities";

export default interface IMentorAuthRepository {
  createMentorshipApplication(data: IApplication): Promise<void>;
}
