import IOTPCredentials from "../controllers/IOTP.controller";
import IPasswordTokenCredentials from "../usecase/user.IAuth.usecase";


export default interface IOTPRepository {
  saveOTPForEmail(OtpData: IOTPCredentials): Promise<void | never>;
  findOTPByEmail(email: string): Promise<IOTPCredentials | null>;
  removeOTPByEmail(email: string): Promise<void | never>;
  saveResetToken(email: string, token: string, expiresAt: Date): Promise<void>;
  findResetToken(email: string): Promise<IPasswordTokenCredentials | null>;
  removeResetToken(email: string): Promise<void>;
}

