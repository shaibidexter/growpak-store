import { Request, Response } from 'express';
import { cmsService } from './cms.service';
import { sendSuccess } from '../../common/utils/response';

export class CmsController {
  public async getSettings(_req: Request, res: Response) {
    const settings = await cmsService.getPublicSettings();
    return sendSuccess(res, settings, 'Site settings retrieved');
  }

  public async getMenu(req: Request, res: Response) {
    const location = String(req.params.location);
    const menu = await cmsService.getMenuByLocation(location);
    return sendSuccess(res, menu, 'Menu retrieved');
  }

  public async getCrops(_req: Request, res: Response) {
    const crops = await cmsService.getCrops();
    return sendSuccess(res, crops, 'Crops retrieved');
  }

  public async getCategories(_req: Request, res: Response) {
    const categories = await cmsService.getCategories();
    return sendSuccess(res, categories, 'Categories retrieved');
  }
}

export const cmsController = new CmsController();
