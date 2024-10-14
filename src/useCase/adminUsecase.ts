import adminRepository from "../infrastructure/repositories/adminRepository";

export default class AdminUseCase {

    constructor(private adminRepository:adminRepository){
        this.adminRepository = adminRepository
    }
    async isAdmin(email: string): Promise<boolean> {
        return this.adminRepository.isAdmin(email);
    }
    async adminExists(email: string): Promise<boolean> {
        return this.adminRepository.adminExists(email);
    }

    async verifyPassword(email: string, password: string): Promise<boolean> {
        return this.adminRepository.verifyPassword(email, password);
    }

}