import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

async function main() {
  const email = process.env.USER_EMAIL;
  const password = process.env.USER_PASSWORD;
  const accountIdStr = process.env.ACCOUNT_ID;
  if (!email || !password || !accountIdStr) {
    console.error('USER_EMAIL, USER_PASSWORD and ACCOUNT_ID env vars are required');
    process.exit(1);
  }

  const accountId = Number(accountIdStr);
  const prisma = new PrismaClient();
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username: email, password: hashed, role: 'BASIC', accountId }
    });
    console.log('Created user with id', user.id);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
