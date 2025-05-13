 import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import path  from "path";


const transport = new winstonDaily({
    filename:path.join(__dirname,'../../logs/%DATE%-error.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '7d',
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.errors({ stack: true }),
    ),
    
});


const logger = winston.createLogger({
    transports:[transport]
})


function logError(error:any):void {
     logger.error(error)
}

export default logError;