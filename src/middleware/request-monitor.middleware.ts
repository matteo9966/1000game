import {RequestHandler} from 'express';
import {requestLogger} from '../logger/winston.logger';

/**
 * @description this middleware is only used to add data to a log file to have info about all the requests
 * @param req express request object
 * @param res express response object
 * @param next  next function
 */
export const requestMonitorMiddleware: RequestHandler = async (
  req,
  res,
  next
) => {
  requestLogger('******---REQUEST---*****', '');

  let body = '';
  let headers = '';
  try {
    body = JSON.stringify(req.body);
    headers = JSON.stringify(req.headers);
  } catch (error) {}



  requestLogger('headers', headers);
  requestLogger('url', req.url);
  requestLogger('body', body);
  requestLogger('method', req.method);
  requestLogger('******------------******', '');
  next();
};
