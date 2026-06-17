import express from 'express'
import { checkout } from '../controllers/checkout.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { validateZod } from '../validations/product.validation.js'
import { checkoutSchema } from '../validations/checkout.validation.js'

const router = express.Router()

// All checkout routes require JWT authentication
router.use(protect)

router.post('/', validateZod(checkoutSchema), checkout)

export default router
