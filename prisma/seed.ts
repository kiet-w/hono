import 'dotenv/config';
import { PrismaClient, UserRole, ProductStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Users
  console.log('Seeding users...');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: passwordHash,
      role: UserRole.ADMIN,
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
        },
      },
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: passwordHash,
      role: UserRole.CUSTOMER,
      profile: {
        create: {
          firstName: 'Customer',
          lastName: 'One',
        },
      },
    },
  });

  // 2. Seed Categories
  console.log('Seeding categories...');
  const categoriesData = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home & Kitchen', slug: 'home-kitchen' },
    { name: 'Beauty', slug: 'beauty' },
    { name: 'Sports', slug: 'sports' },
  ];

  const categories: any[] = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push(category);
  }

  // 3. Seed Products
  console.log('Seeding products...');
  for (let i = 1; i <= 20; i++) {
    const category = categories[i % categories.length];
    const slug = `product-${i}`;
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: `Product ${i}`,
        slug,
        description: `This is the description for Product ${i}. It belongs to ${category.name}.`,
        price: 10.99 * i,
        status: ProductStatus.ACTIVE,
        categoryId: category.id,
        inventory: {
          create: {
            quantity: 10 + i,
            reserved: 0,
          },
        },
        images: {
          create: [
            { url: `https://picsum.photos/seed/${slug}/600/400`, sortOrder: 0 },
          ],
        },
      },
    });
  }

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
