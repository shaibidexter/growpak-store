import { Router } from 'express';
import authRouter from './modules/auth/auth.routes';
import rbacRouter from './modules/rbac/rbac.routes';
import shippingRouter from './modules/shipping/shipping.routes';
import cmsRouter from './modules/cms/cms.routes';

const router = Router();

// Health Check
router.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'GrowPak Store Modular API',
  });
});

// Mount modular sub-routers
router.use('/auth', authRouter);
router.use('/rbac', rbacRouter);
router.use('/shipping', shippingRouter);
router.use('/cms', cmsRouter);

export default router;
