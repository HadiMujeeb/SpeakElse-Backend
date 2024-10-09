import bcrypt from 'bcryptjs';


export class PasswordService {
    private static saltRounds = 10;
    static async hashPassword(password: string): Promise<string> {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);
      return hashedPassword;
    }

    static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
      }
    }