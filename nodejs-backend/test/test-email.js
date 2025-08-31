require('dotenv').config();
const { sendNewOrderNotification } = require('./src/services/emailService');

// Test email functionality
async function testEmail() {
  console.log('🧪 اختبار نظام الإيميل...\n');
  
  // Check environment variables
  console.log('📋 فحص متغيرات البيئة:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER || '❌ غير موجود');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ موجود' : '❌ غير موجود');
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || '❌ غير موجود');
  console.log('FRONTEND_URL:', process.env.FRONTEND_URL || '❌ غير موجود');
  console.log('');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
    console.log('❌ متغيرات البيئة غير مكتملة. يرجى إعداد ملف .env بشكل صحيح.');
    console.log('');
    console.log('المتغيرات المطلوبة:');
    console.log('EMAIL_USER="your-email@gmail.com"');
    console.log('EMAIL_PASS="your-app-password"');
    console.log('ADMIN_EMAIL="admin@yourstore.com"');
    console.log('FRONTEND_URL="http://localhost:3000"');
    return;
  }

  // Create test order data
  const testOrder = {
    id: 'TEST-123',
    orderId: 'test-uuid-123',
    totalAmount: 99.99,
    status: 'pending',
    createdAt: new Date(),
    customerName: 'عميل تجريبي',
    email: 'test@example.com',
    phone: '01234567890',
    address: 'عنوان تجريبي',
    city: 'القاهرة',
    userId: null
  };

  const testOrderItems = [
    {
      id: 1,
      quantity: 2,
      size: 'L',
      color: 'أسود',
      product: {
        id: 1,
        name: 'تيشيرت تجريبي',
        price: 49.99
      }
    }
  ];

  try {
    console.log('📧 محاولة إرسال إيميل تجريبي...');
    await sendNewOrderNotification(testOrder, testOrderItems);
    console.log('✅ تم إرسال الإيميل بنجاح!');
    console.log('🔍 تحقق من صندوق الوارد في:', process.env.ADMIN_EMAIL);
  } catch (error) {
    console.log('❌ فشل في إرسال الإيميل:');
    console.error(error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 نصائح لحل مشكلة المصادقة:');
      console.log('1. تأكد من تفعيل 2-Step Verification في Gmail');
      console.log('2. استخدم App Password وليس كلمة مرور الحساب العادية');
      console.log('3. تأكد من صحة EMAIL_USER و EMAIL_PASS في ملف .env');
    }
  }
}

testEmail();
