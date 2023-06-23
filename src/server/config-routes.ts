import { Router } from "express";
import { ROUTES } from "../config/routes.config";
const router = Router();


router.get('',(req,res,next)=>{
    res.status(200)
    res.end();
})

export default router