import IOTPCredentials from "../controllers/IOTP.controller";

export default interface IOTPRepository {
  saveOTPForEmail(OtpData: IOTPCredentials): Promise<void | never>;
  findOTPByEmail(email: string): Promise<IOTPCredentials | null>;
  removeOTPByEmail(email: string): Promise<void | never>;
}
