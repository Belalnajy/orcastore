require('dotenv').config();
const axios = require('axios');

// Test creating a guest order to verify email functionality
async function testGuestOrder() {
  console.log('🛒 اختبار إنشاء طلب ضيف...\n');

  const orderData = {
    fullName: 'عميل تجريبي',
    email: 'test@example.com',
    phone: '01234567890',
    address: 'عنوان تجريبي',
    city: 'القاهرة',
    notes: 'طلب تجريبي لاختبار النظام',
    items: [
      {
        productId: '6751e4b3b9d1b1c1e8b9a123', // استخدم ID منتج موجود
        quantity: 1,
        size: 'L',
        color: 'أسود'
      }
    ]
  };

  try {
    console.log('📤 إرسال طلب إلى API...');
    const response = await axios.post('http://localhost:8000/api/orders/guest', orderData);
    
    console.log('✅ تم إنشاء الطلب بنجاح!');
    console.log('📋 تفاصيل الطلب:');
    console.log(`- رقم الطلب: ${response.data.orderId}`);
    console.log(`- إجمالي المبلغ: $${response.data.totalAmount}`);
    console.log(`- الحالة: ${response.data.status}`);
    console.log('\n📧 يجب أن يصلك إيميل الآن على:', process.env.ADMIN_EMAIL);
    
  } catch (error) {
    console.log('❌ فشل في إنشاء الطلب:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Message:', error.response.data.message);
      console.log('Details:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Test with a registered user order (if you have authentication)
async function testUserOrder() {
  console.log('\n👤 لاختبار طلب مستخدم مسجل، تحتاج إلى:');
  console.log('1. تسجيل الدخول والحصول على token');
  console.log('2. إضافة منتجات للسلة');
  console.log('3. إنشاء الطلب من السلة');
  console.log('\nيمكنك اختبار ذلك من خلال الموقع مباشرة.');
}

console.log('🧪 اختبار نظام الطلبات والإيميل\n');
testGuestOrder().then(() => {
  testUserOrder();
});
