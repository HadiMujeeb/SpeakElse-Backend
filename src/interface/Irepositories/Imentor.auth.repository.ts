import IApplication from "../../domain/entities/mentor.entities";

export interface IMentorAuthRepository {
  createMentorshipApplication(data: IApplication): Promise<void>;
  findMentorByEmail(email: string): Promise<IApplication | null>;
  findMentorById(id: string): Promise<IApplication | null>;

}
