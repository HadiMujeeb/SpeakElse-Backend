export default interface IOTPServices {
    // generateOTP():string;
    sendOTP(email:string,otp:string):Promise<void>;
}