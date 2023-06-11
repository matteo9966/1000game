import { ErrorRequestHandler } from "express";
import { CustomServerError } from "../errors/CustomServerError";
import { logger2 } from "../logger/winston.logger";

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