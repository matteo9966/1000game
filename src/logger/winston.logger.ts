import {createLogger, format, transports} from 'winston';
import * as path from 'path';
import {environment} from '../config/environment';



const winstonTransports = [
  new transports.File({
    filename: `./logs/error.${environment.env}.log`,
  }),
];

const winstonTransportLogMessages = [
  new transports.File({
    filename:`./logs/requests.log`,
  })
]

export const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp({
      format: 'DD-MM-YY HH:mm:ss',
    }),
    format.align(),
    format.printf(info => `[${info.timestamp}] ${info.message}`)
  ),
  transports: winstonTransports,
});

export const loggerRequests = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'DD-MM-YY HH:mm:ss',
    }),
    format.align(),
    format.printf(info => `[${info.timestamp}] ${info.message}`)
  ),
  transports: winstonTransportLogMessages,
});



export const requestLogger = (label:string,message:string)=>{
    loggerRequests.info(label+ " ===> "+message);
}

export const logger2 = (error: any, basename: string) => {
  logger.error(`${basename} ==> ${error}`);
};
