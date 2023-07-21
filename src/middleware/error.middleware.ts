import { ErrorRequestHandler } from "express";
import { CustomServerError } from "../errors/CustomServerError";
import { logger2 } from "../logger/winston.logger";

/**
 * @description error middleware to handle all errors
 * @param err the error object that is thrown from some controller or middleware
 * @param req express request object
 * @param res express response object
 * @param next next function
 */
export const errorMiddleware:ErrorRequestHandler = (err, req, res, next) => {
    logger2(err,'errorMiddleware')
    if (err instanceof CustomServerError) {
      res.status(err.statusCode);
      res.json({ error: err.message });
    }else{
      res.status(500);
      res.json({error:'Server error'})
    }
  }