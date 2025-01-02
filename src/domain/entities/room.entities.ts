

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
    level: string;
    privacy: string;
    language: string;
    participants: string[];
    moderators: string[];
    createdAt: Date;
    creator?: IUser; 
  }

//   enum Privacy {
//     PUBLIC,
//     PRIVATE
// }

// enum Level {
//   ANYLEVEL,
//   BEGINNER,
//   INTERMEDIATE,
//   ADVANCED
// }
