
export class DateUtils {

    static addMinutes(date: Date, minutes: number): Date {
        return new Date(date.getTime() + minutes * 60000)
    }
}

