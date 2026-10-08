import { prisma } from '../../config/db';

export class CmsService {
  public async getPublicSettings() {
    const settings = await prisma.siteSetting.findMany({
      where: { isPublic: true },
    });
    const result: Record<string, any> = {};
    for (const s of settings) {
      result[s.settingKey] = s.settingValueJson;
    }
    return result;
  }

  public async getMenuByLocation(location: string) {
    return prisma.cmsMenu.findFirst({
      where: { location, isActive: true },
      include: {
        items: {
          where: { parentId: null },
          orderBy: { displayOrder: 'asc' },
          include: {
            children: {
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    });
  }

  public async getCrops() {
    return prisma.crop.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  public async getCategories() {
    return prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { displayOrder: 'asc' },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }
}

export const cmsService = new CmsService();
