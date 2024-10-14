import { PrismaClient } from "@prisma/client";

// interface
import IOTPRepository from "../../domain/interface/repositories/IOtp.repository";
import IOTPCredentials from "../../domain/interface/controllers/IOTP.controller";


export default class OTPRepository implements IOTPRepository {
  private prisma: PrismaClient;

  constructor(prismaclient: PrismaClient) {
    this.prisma = prismaclient;
  }

  async saveOTPForEmail(OtpData: IOTPCredentials): Promise<void | never> {
    try {
        await this.prisma.otp.create({
        data: {
          email: OtpData.email,
          otp: OtpData.otp,
          expiresAt: OtpData.expiresAt,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async findOTPByEmail(email: string): Promise<IOTPCredentials | null> {
    try {
      const OtpData = await this.prisma.otp.findUnique({
        where: { email },
      });
      return OtpData;
    } catch (err) {
      throw err;
    }
  }

  async removeOTPByEmail(email: string): Promise<void> {
    try {
      await this.prisma.otp.delete({
        where: {
          email,
        },
      });
    } catch (err) {
      throw err;
    }
  }
}
