import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking database state...');

  try {
    // Check users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    console.log('👥 Users in database:', users.length);
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ID: ${user.id}`);
    });

    // Check posts
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        userId: true,
        createdAt: true,
      },
    });

    console.log('📝 Posts in database:', posts.length);
    posts.forEach(post => {
      console.log(`  - ${post.title} - ID: ${post.id} - User ID: ${post.userId}`);
    });

  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  }); 