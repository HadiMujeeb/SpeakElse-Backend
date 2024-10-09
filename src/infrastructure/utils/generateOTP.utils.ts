export class generateOTP {

    static generate(): string {
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        return otp.padStart(4,'0')
    }
}