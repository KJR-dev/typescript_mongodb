import { Router } from 'express'
import apiController from '../controller/apiController'
import rateLimit from '../middleware/rateLimit'

const router = Router()

router.route('/self').get(rateLimit(1), apiController.self)
router.route('/health').get(rateLimit(2), apiController.health)
export default router

