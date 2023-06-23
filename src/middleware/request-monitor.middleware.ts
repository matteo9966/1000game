import {RequestHandler} from 'express';
import {requestLogger} from '../logger/winston.logger';
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
