import { PrismaClient } from "@prisma/client";
import ILanguageTestRepository from "../../interface/Irepositories/IadminTests.repository";
import { IQuestions} from "../../domain/entities/tests.entites"; 
import { json } from "express";

export default class LanguageTestRepository implements ILanguageTestRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async getAllQuestions(): Promise<any> {
        try {
            const data = await this.prisma.questions.findMany({
                select: {
                    id: true,
                    testType: true,
                    title: true,
                    story: true,
                    questions: true,
                },
            });
        
       return data
        } catch (error) {
            throw error;
        }
    }

    // // Add a question to a specific language test
    async addQuestion(data: IQuestions): Promise<any> {
        try {
           return await this.prisma.questions.create({
                data: {
                    testType: data.testType,
                    title: data.title,
                    story: data.story,
                    questions:JSON.stringify(data.questions),
                },
            });
  
                       
        } catch (error) {
            throw error;
        }
    }

    // // Edit an existing question in a language test
    async editQuestion(data: IQuestions): Promise<void> {
        try {
            await this.prisma.questions.update({
                where: {
                    id: data.id,
                },
                data: {
                    testType: data.testType,
                    title: data.title,
                    story: data.story,
                    questions:JSON.stringify(data.questions),
                },
            });

        } catch (error) {
            throw error;
        }
    }

    async removeQuestion(id: string): Promise<void> {
        try {
            await this.prisma.questions.delete({
                where: {
                    id,
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
// async findAllApplications(): Promise<IApplication[]|[]> {
//     try {
//       const applications = await this.prisma.mentor.findMany();
//       return applications??[];
      
//     } catch (error) {
//       throw error;
//     }
//   }