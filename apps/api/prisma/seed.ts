import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { PERMISSIONS, UserRoleType } from '@growpak/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding GrowPak Store initial database records...');

  // 1. Roles
  const rolesData = [
    { name: 'Super Admin', slug: UserRoleType.SUPER_ADMIN, description: 'Full system control', isSystem: true },
    { name: 'Admin', slug: UserRoleType.ADMIN, description: 'Store operations administrator', isSystem: true },
    { name: 'Vendor', slug: UserRoleType.VENDOR, description: 'Store owner selling products', isSystem: true },
    { name: 'Store Manager', slug: UserRoleType.STORE_MANAGER, description: 'Shop operations manager', isSystem: true },
    { name: 'Field Agent', slug: UserRoleType.FIELD_AGENT, description: 'Field agent ordering for farmers', isSystem: true },
    { name: 'Customer', slug: UserRoleType.CUSTOMER, description: 'Registered farmer/shopper', isSystem: true },
  ];

  const roleMap = new Map<string, number>();
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { slug: r.slug },
      update: { name: r.name, description: r.description },
      create: r,
    });
    roleMap.set(r.slug, role.id);
  }

  // 2. Permissions
  const permissionEntries = Object.entries(PERMISSIONS);
  const permissionIds: number[] = [];

  for (const [key, permValue] of permissionEntries) {
    const module = permValue.split('.')[0] || 'general';
    const permission = await prisma.permission.upsert({
      where: { key: permValue },
      update: {},
      create: {
        key: permValue,
        name: key.replace(/_/g, ' ').toLowerCase(),
        description: `Permission to perform ${permValue}`,
        module,
      },
    });
    permissionIds.push(permission.id);
  }

  // Assign all permissions to Super Admin
  const superAdminRoleId = roleMap.get(UserRoleType.SUPER_ADMIN)!;
  for (const permId of permissionIds) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: superAdminRoleId,
          permissionId: permId,
        },
      },
      update: {},
      create: {
        roleId: superAdminRoleId,
        permissionId: permId,
      },
    });
  }

  // Assign admin permissions
  const adminRoleId = roleMap.get(UserRoleType.ADMIN)!;
  for (const permId of permissionIds) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRoleId,
          permissionId: permId,
        },
      },
      update: {},
      create: {
        roleId: adminRoleId,
        permissionId: permId,
      },
    });
  }

  // 3. Default Super Admin User
  const adminPasswordHash = await argon2.hash('AdminGrowPak2026!');
  const superAdminUser = await prisma.user.upsert({
    where: { phone: '+923260409887' },
    update: { passwordHash: adminPasswordHash },
    create: {
      email: 'admin@growpak.store',
      phone: '+923260409887',
      passwordHash: adminPasswordHash,
      firstName: 'Super',
      lastName: 'Admin',
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdminUser.id,
        roleId: superAdminRoleId,
      },
    },
    update: {},
    create: {
      userId: superAdminUser.id,
      roleId: superAdminRoleId,
    },
  });

  // 4. Sample Vendor & Store
  const vendorPasswordHash = await argon2.hash('VendorGrowPak2026!');
  const vendorUser = await prisma.user.upsert({
    where: { phone: '+923001234567' },
    update: {},
    create: {
      email: 'vendor@growpak.store',
      phone: '+923001234567',
      passwordHash: vendorPasswordHash,
      firstName: 'Tariq',
      lastName: 'Mehmood',
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: vendorUser.id,
        roleId: roleMap.get(UserRoleType.VENDOR)!,
      },
    },
    update: {},
    create: {
      userId: vendorUser.id,
      roleId: roleMap.get(UserRoleType.VENDOR)!,
    },
  });

  const vendorStore = await prisma.vendor.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      storeName: 'Green Agri Supplies',
      slug: 'green-agri-supplies',
      phone: '+923001234567',
      email: 'vendor@growpak.store',
      whatsappNumber: '+923001234567',
      commissionRate: 5.0,
      status: 'APPROVED',
      balancePkr: 0.0,
    },
  });

  // 5. Sample Store Manager & Field Agent Hierarchy
  const managerPasswordHash = await argon2.hash('ManagerGrowPak2026!');
  const managerUser = await prisma.user.upsert({
    where: { phone: '+923007654321' },
    update: {},
    create: {
      email: 'manager@growpak.store',
      phone: '+923007654321',
      passwordHash: managerPasswordHash,
      firstName: 'Ahmed',
      lastName: 'Khan',
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: managerUser.id,
        roleId: roleMap.get(UserRoleType.STORE_MANAGER)!,
      },
    },
    update: {},
    create: {
      userId: managerUser.id,
      roleId: roleMap.get(UserRoleType.STORE_MANAGER)!,
    },
  });

  await prisma.vendorStaff.upsert({
    where: {
      vendorId_userId_roleType: {
        vendorId: vendorStore.id,
        userId: managerUser.id,
        roleType: UserRoleType.STORE_MANAGER,
      },
    },
    update: {},
    create: {
      vendorId: vendorStore.id,
      userId: managerUser.id,
      roleType: UserRoleType.STORE_MANAGER,
      isActive: true,
    },
  });

  const agentPasswordHash = await argon2.hash('AgentGrowPak2026!');
  const agentUser = await prisma.user.upsert({
    where: { phone: '+923009876543' },
    update: {},
    create: {
      email: 'agent@growpak.store',
      phone: '+923009876543',
      passwordHash: agentPasswordHash,
      firstName: 'Bilal',
      lastName: 'Hassan',
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: agentUser.id,
        roleId: roleMap.get(UserRoleType.FIELD_AGENT)!,
      },
    },
    update: {},
    create: {
      userId: agentUser.id,
      roleId: roleMap.get(UserRoleType.FIELD_AGENT)!,
    },
  });

  await prisma.vendorStaff.upsert({
    where: {
      vendorId_userId_roleType: {
        vendorId: vendorStore.id,
        userId: agentUser.id,
        roleType: UserRoleType.FIELD_AGENT,
      },
    },
    update: {},
    create: {
      vendorId: vendorStore.id,
      userId: agentUser.id,
      roleType: UserRoleType.FIELD_AGENT,
      managerId: managerUser.id, // Agent reports to Manager!
      isActive: true,
    },
  });

  // 6. Weight-Based Shipping Slabs (Section 8)
  const shippingSlabs = [
    { name: 'Up to 3 kg', minWeightKg: 0.0, maxWeightKg: 3.0, flatChargePkr: 250.0, perKgRatePkr: 0.0, displayOrder: 1 },
    { name: 'Over 3 kg up to 10 kg', minWeightKg: 3.001, maxWeightKg: 10.0, flatChargePkr: 500.0, perKgRatePkr: 0.0, displayOrder: 2 },
    { name: 'Over 10 kg up to 30 kg', minWeightKg: 10.001, maxWeightKg: 30.0, flatChargePkr: 1000.0, perKgRatePkr: 0.0, displayOrder: 3 },
    { name: 'Above 30 kg (per actual weight)', minWeightKg: 30.001, maxWeightKg: null, flatChargePkr: 1000.0, perKgRatePkr: 40.0, displayOrder: 4 },
  ];

  for (const slab of shippingSlabs) {
    const existing = await prisma.shippingRule.findFirst({ where: { name: slab.name } });
    if (!existing) {
      await prisma.shippingRule.create({ data: slab });
    }
  }

  // 7. Agri Crops
  const cropsData = [
    { nameEn: 'Rice', nameUr: 'چاول', slug: 'rice', season: 'KHARIF', isPopular: true, displayOrder: 1 },
    { nameEn: 'Wheat', nameUr: 'گندم', slug: 'wheat', season: 'RABI', isPopular: true, displayOrder: 2 },
    { nameEn: 'Cotton', nameUr: 'کپاس', slug: 'cotton', season: 'KHARIF', isPopular: true, displayOrder: 3 },
    { nameEn: 'Sugarcane', nameUr: 'کماد / گنا', slug: 'sugarcane', season: 'ALL_SEASON', isPopular: true, displayOrder: 4 },
    { nameEn: 'Maize', nameUr: 'مکئی', slug: 'maize', season: 'ALL_SEASON', isPopular: true, displayOrder: 5 },
    { nameEn: 'Citrus', nameUr: 'کینو اور سٹرس', slug: 'citrus', season: 'RABI', isPopular: false, displayOrder: 6 },
  ];

  for (const c of cropsData) {
    await prisma.crop.upsert({
      where: { slug: c.slug },
      update: { nameEn: c.nameEn, nameUr: c.nameUr, season: c.season, isPopular: c.isPopular },
      create: c,
    });
  }

  // 8. Categories
  const categoriesData = [
    { nameEn: 'Seeds', nameUr: 'بیج', slug: 'seeds', displayOrder: 1 },
    { nameEn: 'Fertilizers', nameUr: 'کھادیں', slug: 'fertilizers', displayOrder: 2 },
    { nameEn: 'Pesticides & Insecticides', nameUr: 'کیڑے مار ادویات', slug: 'pesticides-insecticides', displayOrder: 3 },
    { nameEn: 'Herbicides', nameUr: 'جڑی بوٹی مار ادویات', slug: 'herbicides', displayOrder: 4 },
    { nameEn: 'Fungicides', nameUr: 'پھپھوندی کش ادویات', slug: 'fungicides', displayOrder: 5 },
    { nameEn: 'Tools & Equipment', nameUr: 'زرعی آلات', slug: 'tools-equipment', displayOrder: 6 },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { nameEn: cat.nameEn, nameUr: cat.nameUr },
      create: cat,
    });
  }

  // 9. Site Settings
  const defaultSettings = [
    {
      settingKey: 'general',
      description: 'General platform settings',
      isPublic: true,
      settingValueJson: {
        siteName: 'GrowPak Store',
        address: 'Plot 60-D, Street 7, I-10/3, Islamabad, Pakistan',
        phone: '+92-326-0409887',
        email: 'info@growtechsol.com',
        whatsappNumber: '+923260409887',
        currency: 'PKR',
        currencySymbol: 'Rs.',
      },
    },
    {
      settingKey: 'appearance',
      description: 'Brand theme and appearance tokens',
      isPublic: true,
      settingValueJson: {
        primaryColor: '#15803d',
        accentColor: '#f59e0b',
        logoUrl: '/assets/images/logo.png',
        faviconUrl: '/favicon.ico',
      },
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { settingKey: setting.settingKey },
      update: { settingValueJson: setting.settingValueJson },
      create: setting,
    });
  }

  // 10. CMS Menus
  const primaryMenu = await prisma.cmsMenu.upsert({
    where: { location: 'HEADER_PRIMARY' },
    update: {},
    create: { title: 'Header Primary Navigation', location: 'HEADER_PRIMARY', isActive: true },
  });

  const menuItems = [
    { menuId: primaryMenu.id, titleEn: 'Home', titleUr: 'ہوم', url: '/', linkType: 'CUSTOM', displayOrder: 1 },
    { menuId: primaryMenu.id, titleEn: 'Shop by Crop', titleUr: 'فصل کے مطابق خریداری', url: '/shop/crops', linkType: 'CROP', displayOrder: 2 },
    { menuId: primaryMenu.id, titleEn: 'All Products', titleUr: 'تمام پروڈکٹس', url: '/shop', linkType: 'CUSTOM', displayOrder: 3 },
    { menuId: primaryMenu.id, titleEn: 'Contact Us', titleUr: 'رابطہ کریں', url: '/contact', linkType: 'PAGE', displayOrder: 4 },
  ];

  for (const item of menuItems) {
    const existing = await prisma.cmsMenuItem.findFirst({
      where: { menuId: item.menuId, url: item.url },
    });
    if (!existing) {
      await prisma.cmsMenuItem.create({ data: item });
    }
  }

  console.log('GrowPak Store database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
