import { Router } from "express";
import SessionController from "../controller/session-controller";
const sessionRouter = Router()

const sessionController = new SessionController()

sessionRouter.post('/session', sessionController.store)

export default sessionRouter