import { Level, Privacy } from "@prisma/client";
import { IUser } from "./user.entities";


interface userData {
    name:string
    country:string;
    rating:number;
    avatar:string;
    profession:string;
}


export interface IRoom {
    id: string;
    creatorId: string;
    topic?: string|null;
    maxPeople: string;
    level: Level;
    privacy: Privacy;
    language: string;
    participants: string[];
    moderators: string[];
    createdAt: Date;
    creator?: IUser; 
  }