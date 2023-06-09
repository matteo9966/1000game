import { ErrorRequestHandler } from "express";
import { CustomServerError } from "../errors/CustomServerError";

export const errorMiddleware:ErrorRequestHandler = (err, req, res, next) => {
    console.log(err);
    if (err instanceof CustomServerError) {
      res.status(err.statusCode);
      res.json({ error: err.message });
    }else{
      res.status(500);
      res.json({error:'Server error'})
    }
  }