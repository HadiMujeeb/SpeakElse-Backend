export default interface IOTPCredentials {
    name?:string;
    otp: string;
    email:string;
    expiresAt :Date;
}