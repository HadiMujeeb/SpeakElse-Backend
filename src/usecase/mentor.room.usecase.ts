import IMentorRoomUseCase from "../interface/Iusecase/Imentor.room.usecase";
import MentorRoomRepository from "../infrastructure/repository/mentor.room.repository";
import { IMentorRoom } from "../domain/entities/mentor.entities";
export default class MentorRoomUseCase implements IMentorRoomUseCase {
 private mentorRoomRepository: MentorRoomRepository
 constructor(mentorRoomRepository: MentorRoomRepository) {
    this.mentorRoomRepository = mentorRoomRepository
 }

 async CreateMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void> {
    try {
        const createMentorRoom = await this.mentorRoomRepository.CreateMentorRoom(data);
        return createMentorRoom
    } catch (error) {
        throw error
    }
 }
 async updateMentorRoom(data: IMentorRoom): Promise<IMentorRoom | void> {
    try {
        const updateMentorRoom = await this.mentorRoomRepository.updateMentorRoom(data);
        return updateMentorRoom
    } catch (error) {
        throw error
    }
 }

  async requestGetAllRooms(): Promise<IMentorRoom[]> {
    try {
        const getAllRooms = await this.mentorRoomRepository.getAllRooms();
        return getAllRooms
    } catch (error) {
        throw error
    }
 }
}