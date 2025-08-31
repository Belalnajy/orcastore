const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteAllOrders() {
  try {
    console.log('🗑️ بدء حذف جميع الطلبات...\n');

    // حذف PaymentInfo أولاً (لأنها مرتبطة بالطلبات)
    console.log('1️⃣ حذف معلومات الدفع...');
    const deletedPayments = await prisma.paymentInfo.deleteMany({});
    console.log(`✅ تم حذف ${deletedPayments.count} معلومة دفع`);

    // حذف OrderItems ثانياً (لأنها مرتبطة بالطلبات)
    console.log('2️⃣ حذف عناصر الطلبات...');
    const deletedOrderItems = await prisma.orderItem.deleteMany({});
    console.log(`✅ تم حذف ${deletedOrderItems.count} عنصر طلب`);

    // حذف Orders أخيراً
    console.log('3️⃣ حذف الطلبات...');
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`✅ تم حذف ${deletedOrders.count} طلب`);

    console.log('\n🎉 تم حذف جميع الطلبات بنجاح!');
    console.log('📊 ملخص العملية:');
    console.log(`   - الطلبات المحذوفة: ${deletedOrders.count}`);
    console.log(`   - عناصر الطلبات المحذوفة: ${deletedOrderItems.count}`);
    console.log(`   - معلومات الدفع المحذوفة: ${deletedPayments.count}`);

  } catch (error) {
    console.error('❌ خطأ في حذف الطلبات:', error);
    
    if (error.code === 'P2003') {
      console.log('\n💡 نصيحة: هناك قيود مرجعية تمنع الحذف');
      console.log('تأكد من حذف البيانات المرتبطة أولاً');
    }
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 تم قطع الاتصال بقاعدة البيانات');
  }
}

// تشغيل السكريبت
console.log('⚠️  تحذير: هذا السكريبت سيحذف جميع الطلبات نهائياً!');
console.log('⏳ بدء العملية خلال 3 ثوانٍ...\n');

setTimeout(() => {
  deleteAllOrders();
}, 3000);
