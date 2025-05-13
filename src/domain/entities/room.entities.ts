

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


  export interface IReqestUserCreateRoom {
    creatorId:string;
    topic?:string;
    maxPeople:string;
    level:string;
    language:string;
    privacy:string;
  }

  export interface IUserCreatedRoom {
  id: string;
  language?: string;
  topic?: string;
  peopleCount: {
    joined: number;
    limit: number;
  };
  level: string;
  privacy: string;
  participants: string[];
  createdAt: Date;
  creator:{
    id: string;
    name:string;
    country?:string;
    profession?:string;
    avatar?:string;
  }
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
