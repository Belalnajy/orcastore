require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProducts() {
  try {
    console.log('🔍 البحث عن المنتجات المتاحة...\n');
    
    const products = await prisma.product.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        price: true,
        sizeStock: true,
        isActive: true
      }
    });

    if (products.length === 0) {
      console.log('❌ لا توجد منتجات في قاعدة البيانات');
      console.log('💡 تحتاج إلى إضافة منتجات من لوحة الإدارة أولاً');
      return;
    }

    console.log(`✅ تم العثور على ${products.length} منتجات:`);
    console.log('');

    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   - ID: ${product.id}`);
      console.log(`   - السعر: $${product.price}`);
      console.log(`   - نشط: ${product.isActive ? 'نعم' : 'لا'}`);
      
      if (product.sizeStock) {
        const sizeStock = typeof product.sizeStock === 'string' 
          ? JSON.parse(product.sizeStock) 
          : product.sizeStock;
        console.log(`   - المخزون: ${JSON.stringify(sizeStock)}`);
      }
      console.log('');
    });

    // اختر أول منتج نشط للاختبار
    const activeProduct = products.find(p => p.isActive);
    if (activeProduct) {
      console.log(`🎯 يمكنك استخدام هذا المنتج للاختبار:`);
      console.log(`Product ID: ${activeProduct.id}`);
      
      // تحديث سكريبت الاختبار
      const testScript = `
// استخدم هذا في test-order.js:
const orderData = {
  fullName: 'عميل تجريبي',
  email: 'test@example.com',
  phone: '01234567890',
  address: 'عنوان تجريبي',
  city: 'القاهرة',
  notes: 'طلب تجريبي لاختبار النظام',
  items: [
    {
      productId: '${activeProduct.id}',
      quantity: 1,
      size: 'L',
      color: 'أسود'
    }
  ]
};`;
      console.log(testScript);
    }

  } catch (error) {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
