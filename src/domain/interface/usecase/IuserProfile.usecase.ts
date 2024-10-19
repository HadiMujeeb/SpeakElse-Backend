import { IUser } from "../../entities/user";


export default interface IUserProfileUseCase {
    handleEditmemberData(memberId: string, credential: IUser, fileBuffer: Buffer | null): Promise<void | never>;
}
