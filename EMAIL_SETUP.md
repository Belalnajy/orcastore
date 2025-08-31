# إعداد نظام الإشعارات بالإيميل 📧

تم إضافة نظام إشعارات بالإيميل يرسل لك إشعار فوري عند استلام أي طلب جديد في المتجر.

## الميزات المضافة:

✅ **إشعار فوري للإدارة**: يصلك إيميل فور إنشاء أي طلب جديد  
✅ **تأكيد للعميل**: يتم إرسال تأكيد الطلب للعميل إذا أدخل إيميله  
✅ **تصميم احترافي**: إيميلات بتصميم جميل ومعلومات مفصلة  
✅ **تفاصيل كاملة**: المنتجات، المقاسات، الألوان، الكميات، والأسعار

## خطوات الإعداد:

### 1. إعداد Gmail App Password:

1. اذهب إلى [Google Account Settings](https://myaccount.google.com/)
2. اختر "Security" من القائمة الجانبية
3. فعّل "2-Step Verification" إذا لم تكن مفعلة
4. ابحث عن "App passwords" واختر "Generate app password"
5. اختر "Mail" كنوع التطبيق
6. انسخ كلمة المرور المُنشأة (16 رقم)

### 2. تحديث ملف .env:

أضف هذه المتغيرات لملف `.env` في مجلد `nodejs-backend`:

```env
# Email Configuration
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-16-digit-app-password"
ADMIN_EMAIL="admin@yourstore.com"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
```

**مثال:**

```env
EMAIL_USER="belal@gmail.com"
EMAIL_PASS="abcd efgh ijkl mnop"
ADMIN_EMAIL="belal@gmail.com"
FRONTEND_URL="http://localhost:3000"
```

### 3. إعادة تشغيل الخادم:

```bash
cd nodejs-backend
npm run dev
```

## كيف يعمل النظام:

### عند إنشاء طلب جديد:

1. **يتم إنشاء الطلب** في قاعدة البيانات
2. **يتم تقليل المخزون** للمنتجات المطلوبة
3. **يتم إرسال إيميل للإدارة** فوراً مع:

   - رقم الطلب
   - تفاصيل العميل
   - قائمة المنتجات المطلوبة
   - المقاسات والألوان
   - إجمالي المبلغ
   - رابط لإدارة الطلب

4. **يتم إرسال تأكيد للعميل** (إذا أدخل إيميله) مع:
   - تأكيد الطلب
   - تفاصيل المنتجات
   - رقم الطلب للمتابعة

### الأمان:

- ✅ **لا يؤثر على الطلب**: إذا فشل إرسال الإيميل، الطلب يتم بنجاح
- ✅ **معالجة الأخطاء**: أي خطأ في الإيميل يتم تسجيله فقط
- ✅ **كلمات مرور آمنة**: استخدام App Passwords بدلاً من كلمة المرور الأساسية

## استخدام خدمات إيميل أخرى:

إذا كنت تريد استخدام خدمة غير Gmail، يمكنك تعديل إعدادات SMTP في ملف `emailService.js`:

```javascript
// للـ Outlook/Hotmail
service: 'hotmail'

// أو استخدام SMTP مخصص
host: 'smtp.your-provider.com',
port: 587,
secure: false,
auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
}
```

## اختبار النظام:

1. تأكد من إعداد متغيرات البيئة
2. أعد تشغيل الخادم
3. اعمل طلب تجريبي من الموقع
4. تحقق من وصول الإيميل

## الملفات المضافة/المحدثة:

- ✅ `src/services/emailService.js` - خدمة الإيميل
- ✅ `src/controllers/orderController.js` - إضافة إرسال الإيميل
- ✅ `.env.example` - مثال على متغيرات البيئة
- ✅ `package.json` - إضافة nodemailer

---

🎉 **الآن ستحصل على إشعار فوري بكل طلب جديد في متجرك!**
