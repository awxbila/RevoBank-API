import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  console.log('🌱 Seeding database...');
  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@revobank.com' },
    update: {},
    create: {
      email: 'admin@revobank.com',
      password: hashedPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });
  console.log('✅Admin created:', admin.email);
  // Create customer users
  const customer1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: hashedPassword,
      name: 'John Doe',
      role: Role.CUSTOMER,
    },
  });
  const customer2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: hashedPassword,
      name: 'Jane Smith',
      role: Role.CUSTOMER,
    },
  });
  console.log('✅ Customers created');
  // Create accounts
  const account1 = await prisma.account.create({
    data: {
      accountNumber: 'ACC1001',
      accountName: 'John Savings',
      balance: 5000000,
      userId: customer1.id,
    },
  });
  const account2 = await prisma.account.create({
    data: {
      accountNumber: 'ACC1002',
      accountName: 'Jane Savings',
      balance: 3000000,
      userId: customer2.id,
    },
  });
  console.log('✅ Accounts created');
  // Create sample transactions
  await prisma.transaction.create({
    data: {
      type: 'DEPOSIT',
      amount: 1000000,
      description: 'Initial deposit',
      toAccountId: account1.id,
    },
  });
  await prisma.transaction.create({
    data: {
      type: 'TRANSFER',
      amount: 500000,
      description: 'Transfer to Jane',
      fromAccountId: account1.id,
      toAccountId: account2.id,
    },
  });
  console.log('✅Transactions created');
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
