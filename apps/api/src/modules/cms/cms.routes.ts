import { Router } from 'express';
import { cmsController } from './cms.controller';
import { asyncHandler } from '../../common/utils/async-handler';

const router = Router();

router.get('/settings', asyncHandler(cmsController.getSettings));
router.get('/menus/:location', asyncHandler(cmsController.getMenu));
router.get('/crops', asyncHandler(cmsController.getCrops));
router.get('/categories', asyncHandler(cmsController.getCategories));

export default router;
