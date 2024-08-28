import express from "express"
import controllers from "../controllers"
import { redisController } from "../controllers/ratelimiter"
import rateLimiterMiddleware from "../middleware"

const router=express.Router()

router.post("/api/v1/task",rateLimiterMiddleware,controllers.redisController.ratelimeter)

export default router