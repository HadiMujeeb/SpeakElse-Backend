import { PrismaClient } from "@prisma/client";

// interface
import IOTPRepository from "../../interface/Irepositories/Iotp.repository";
import IOTPCredentials from "../../interface/Icontrollers/IOTP.controller";
import IPasswordTokenCredentials from "../../interface/Iusecase/Iuser.auth.usecase";

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

  async saveResetToken(
    email: string,
    token: string,
    expiresAt: Date
  ): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { email },
        data: {
          resetToken: token,
          resetTokenExpiry: expiresAt,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async findResetToken(
    email: string
  ): Promise<IPasswordTokenCredentials | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          resetToken: true,
          resetTokenExpiry: true,
        },
      });
      return user
        ? {
            resetToken: user.resetToken,
            resetTokenExpiry: user.resetTokenExpiry,
          }
        : null;
    } catch (err) {
      throw err;
    }
  }

  async removeResetToken(email: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { email },
        data: {
          resetToken: null,
          resetTokenExpiry: null,
        },
      });
    } catch (err) {
      throw err;
    }
  }

  async resetPassword(id: string, password: string): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id },
        data: {
          password,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
