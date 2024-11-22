import bcrypt from "bcryptjs";
import { IPasswordUtils } from "../../interface/utils/Ipassword.util";

export class PasswordService implements IPasswordUtils {
  private saltRounds = 10;
  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    return hashedPassword;
  }

  async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  }
}
