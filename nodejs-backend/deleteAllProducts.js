const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.orderItem.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.product.deleteMany({});
    console.log('All order items, cart items, and products deleted successfully.');
  } catch (err) {
    console.error('Error deleting products:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
