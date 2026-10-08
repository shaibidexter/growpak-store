import { Router } from 'express';
import { shippingController } from './shipping.controller';
import { asyncHandler } from '../../common/utils/async-handler';

const router = Router();

router.get('/rules', asyncHandler(shippingController.getRules));
router.post('/calculate', asyncHandler(shippingController.calculateShipping));

export default router;
