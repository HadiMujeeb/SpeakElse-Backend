export class generateOTP {

    static generate(): string {
        return Math.floor(1000 + Math.random() * 9000).toString()
    }

    static ExpireDate():Date {
        return  new Date(Date.now() + 2 * 60 * 1000);
    }
}