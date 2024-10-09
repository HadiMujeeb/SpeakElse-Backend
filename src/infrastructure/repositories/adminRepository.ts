import { Role } from "@prisma/client";
import { User } from "../../domain/entities/user";
import prisma from "../config/PrismaCient";
import bcrypt from 'bcryptjs'

export default class adminRepository {

    private async findUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
        });
    }

    async isAdmin(email: string): Promise<boolean> {
        const user = await this.findUserByEmail(email)
        return user?.role === Role.ADMIN;
    }


    async adminExists(email: string): Promise<boolean> {
        const user = await this.findUserByEmail(email);
        return !!user;
    };

    async verifyAdminPassword(email: string, password: string): Promise<boolean> {
        const user = await this.findUserByEmail(email);
        if (!user) {
            return false; // User not found
        }
        return await bcrypt.compare(password,user.password);
    };





}