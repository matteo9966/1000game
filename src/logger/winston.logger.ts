import {createLogger, format, transports} from 'winston';
import * as path from 'path';
import {environment} from '../config/environment';

const filename = path.join(
  __dirname,
  `../../logs/error.${environment.env}.log`
);


const winstonTransports = [
    new transports.Console(),
        new transports.File({
            filename:filename
        })
]


export const logger = createLogger({
    level:"info",
    format: format.combine(
        format.timestamp({
            format:'DD-MM-YY HH:mm:ss'
        }),
        format.align(),
        format.printf((info)=>`[${info.timestamp}] ${info.message}`)
    ),
    transports:winstonTransports
})

export const logger2 = (error:any,basename:string)=>{
    logger.error(`${basename} ==> ${error}`)
}