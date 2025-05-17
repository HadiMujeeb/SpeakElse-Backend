
export enum IReportStatus {
    PENDING,
    REVIEWED,
    CLOSED
  }

 export enum IApprovalStatus {
    PENDING,
    APPROVED,
    REJECTED
  }
  
   export interface IMember {
    name: string;
    email: string;
    role: string;
    password:string;
    profession: string;
    country: string;
    language: string;
    isBlocked: boolean;
    isVerified:boolean;
    
}
   export interface IResponseAdminAddMember {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar:string;
    profession: string;
    country: string;
    language: string;
    isVerified:boolean
    isBlocked: boolean;
    createdAt: string;
    
}

