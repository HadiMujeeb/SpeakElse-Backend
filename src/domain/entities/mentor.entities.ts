import { IUser } from "./user.entities"

export default interface IApplication {
    id        :   string
    name      :   string
    email     :   string   
    password  :   string
    avatar    :   string|null
    country   :   string
    language  :   string
    mentorRole :  string
    description :  string
    resume     :  string
    userId     :  string
    isVerified? :  boolean
    isBlocked?  :  boolean
    followers?  :  string[]
    following?  :  string[]
    ratings?    :  string[]
    approvalStatus? : string
    user?:IUser
}

// id          String   @id @default(auto()) @map("_id") @db.ObjectId
//   mentorId    String   @db.ObjectId
//   language    String
//   topic       String
//   limit       Int
//   participants String[] 
//   startTime   DateTime
//   endTime     DateTime
//   createdAt   DateTime @default(now())
//   bookingFee   Float
export interface IMentorRoom {
    id        :   string
    mentorId  :   string
    language  :   string
    topic     :   string
    limit     :   number
    participants : string[]
    startTime : Date
    endTime   : Date
    createdAt : Date
    bookingFee : number
    mentor?:IApplication
    
}

export interface ITransaction {
    id: string;
    userId: string;   
    fundReceiverId: string;   
    amount: number;         
    type: string;           
    status: string; 
    transactionId: string;
    paymentMethod: string;   
    sessionId: string;    
    description: string;
    createdAt: Date
    updatedAt: Date    
  }
  
  export enum IStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS"

  }