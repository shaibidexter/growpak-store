import assert from 'assert';
import { createApp } from '../src/app';
import { shippingService } from '../src/modules/shipping/shipping.service';
import { authService } from '../src/modules/auth/auth.service';
import { rbacService } from '../src/modules/rbac/rbac.service';
import { UserRoleType } from '@growpak/shared';
import { prisma } from '../src/config/db';

async function runTests() {
  console.log('--- Starting GrowPak Store Phase 1 Verification Tests ---');

  // Test 1: Shipping Engine - Slabs & Overrides
  console.log('Test 1: Testing Shipping Rules Engine...');
  
  // Standard 2kg order -> flat 250 PKR
  const res1 = await shippingService.calculateShipping({
    items: [{ productId: 1n, vendorId: 1n, weightKg: 2, quantity: 1 }],
  });
  assert.strictEqual(res1.shippingCostPkr, 250, '2kg should cost flat 250 PKR');
  assert.strictEqual(res1.freeShippingApplied, false);
  console.log('  Passed: Standard 2kg slab = 250 PKR');

  // Standard 8kg order -> flat 500 PKR
  const res2 = await shippingService.calculateShipping({
    items: [{ productId: 1n, vendorId: 1n, weightKg: 8, quantity: 1 }],
  });
  assert.strictEqual(res2.shippingCostPkr, 500, '8kg should cost flat 500 PKR');
  console.log('  Passed: Standard 8kg slab = 500 PKR');

  // Field Agent Order override -> shipping MUST be 0 PKR
  const res3 = await shippingService.calculateShipping({
    items: [{ productId: 1n, vendorId: 1n, weightKg: 25, quantity: 2 }],
    isFieldAgentOrder: true,
  });
  assert.strictEqual(res3.shippingCostPkr, 0, 'Field Agent order MUST have 0 shipping');
  assert.strictEqual(res3.freeShippingApplied, true);
  assert.strictEqual(res3.freeShippingReason, 'FIELD_AGENT_ORDER');
  console.log('  Passed: Field Agent order shipping = 0 PKR');

  // Free shipping product flag -> chargeable weight = 0, shipping = 0 PKR
  const res4 = await shippingService.calculateShipping({
    items: [{ productId: 1n, vendorId: 1n, weightKg: 5, quantity: 1, freeShipping: true }],
  });
  assert.strictEqual(res4.shippingCostPkr, 0, 'Free shipping product MUST have 0 shipping');
  assert.strictEqual(res4.freeShippingApplied, true);
  console.log('  Passed: Free shipping product override = 0 PKR');

  // Test 2: Auth Login with Super Admin credentials
  console.log('Test 2: Testing Super Admin Login...');
  const adminLogin = await authService.login('+923260409887', 'AdminGrowPak2026!');
  assert.ok(adminLogin.tokens.accessToken, 'Access token generated');
  assert.ok(adminLogin.tokens.refreshToken, 'Refresh token generated');
  assert.ok(adminLogin.user.roles.includes(UserRoleType.SUPER_ADMIN), 'Has SUPER_ADMIN role');
  console.log('  Passed: Super Admin successfully authenticated with JWT');

  // Test 3: Customer Registration
  console.log('Test 3: Testing Customer Registration...');
  const testPhone = `+92311${Math.floor(1000000 + Math.random() * 9000000)}`;
  const regResult = await authService.register({
    firstName: 'Test',
    lastName: 'Farmer',
    phone: testPhone,
    password: 'Password123!',
  });
  assert.ok(regResult.user.id);
  assert.ok(regResult.user.roles.includes(UserRoleType.CUSTOMER), 'Has CUSTOMER role');
  console.log('  Passed: Customer registered with default role');

  // Test 4: Role Conversion to Field Agent
  console.log('Test 4: Converting User to Field Agent under Store Manager...');
  const vendor = await prisma.vendor.findFirst();
  assert.ok(vendor, 'Vendor store must exist');
  const manager = await prisma.user.findUnique({ where: { phone: '+923007654321' } });
  assert.ok(manager, 'Store manager must exist');

  const converted = await rbacService.convertUserRole({
    userId: BigInt(regResult.user.id),
    targetRoleType: UserRoleType.FIELD_AGENT,
    vendorId: vendor.id,
    managerId: manager.id,
  });
  assert.strictEqual(converted.assignedRole, UserRoleType.FIELD_AGENT);
  console.log('  Passed: User converted to Field Agent under Store Manager');

  console.log('--- ALL PHASE 1 INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
  await prisma.$disconnect();
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
