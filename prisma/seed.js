import 'dotenv/config'
import bcrypt from 'bcryptjs'
import pkg from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const { PrismaClient } = pkg

// Use pooled Neon URL for runtime (DATABASE_URL)
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })

const prisma = new PrismaClient({ adapter })

async function main() {
  const pw = await bcrypt.hash('Password@123', 10)

  await prisma.user.createMany({
    data: [
      { name: 'Nick Fury', email: 'nick@fury.com', passwordHash: pw, role: 'ADMIN', country: 'INDIA' },
      { name: 'Captain Marvel', email: 'marvel@fury.com', passwordHash: pw, role: 'MANAGER', country: 'INDIA' },
      { name: 'Captain America', email: 'america@fury.com', passwordHash: pw, role: 'MANAGER', country: 'AMERICA' },
      { name: 'Thanos', email: 'thanos@fury.com', passwordHash: pw, role: 'MEMBER', country: 'INDIA' },
      { name: 'Thor', email: 'thor@fury.com', passwordHash: pw, role: 'MEMBER', country: 'INDIA' },
      { name: 'Travis', email: 'travis@fury.com', passwordHash: pw, role: 'MEMBER', country: 'AMERICA' },
    ],
    skipDuplicates: true,
  })

  const r1 = await prisma.restaurant.upsert({
    where: { id: 'rest_ind_1' },
    update: {},
    create: { id: 'rest_ind_1', name: 'Bengaluru Bites', country: 'INDIA' },
  })

  const r2 = await prisma.restaurant.upsert({
    where: { id: 'rest_us_1' },
    update: {},
    create: { id: 'rest_us_1', name: 'NYC Grill', country: 'AMERICA' },
  })

  await prisma.menuItem.createMany({
    data: [
      { restaurantId: r1.id, name: 'Masala Dosa', priceCents: 8000 },
      { restaurantId: r1.id, name: 'Idli Vada', priceCents: 6000 },
      { restaurantId: r2.id, name: 'Cheeseburger', priceCents: 12000 },
      { restaurantId: r2.id, name: 'Fries', priceCents: 4000 },
    ],
    skipDuplicates: true,
  })
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
