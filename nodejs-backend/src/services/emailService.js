const nodemailer = require('nodemailer');

// إعداد transporter للإيميل
const createTransporter = () => {
  // يمكنك استخدام Gmail أو أي خدمة إيميل أخرى
  return nodemailer.createTransport({
    service: 'gmail', // أو يمكنك استخدام SMTP مخصص
    auth: {
      user: process.env.EMAIL_USER, // إيميلك
      pass: process.env.EMAIL_PASS  // كلمة مرور التطبيق (App Password)
    }
  });
};

// إرسال إشعار طلب جديد للإدارة
const sendNewOrderNotification = async (order, orderItems) => {
  try {
    const transporter = createTransporter();
    
    // تنسيق تفاصيل المنتجات
    const itemsHtml = orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.product.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.size || 'N/A'}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.color || 'N/A'}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${item.product.price}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${(item.product.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // إيميل الإدارة
      subject: `🛒 طلب جديد #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🛒 طلب جديد!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">تم استلام طلب جديد في متجرك</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">تفاصيل الطلب</h2>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div>
                  <strong style="color: #667eea;">رقم الطلب:</strong><br>
                  <span style="font-size: 18px; color: #333;">#${order.id}</span>
                </div>
                <div>
                  <strong style="color: #667eea;">إجمالي المبلغ:</strong><br>
                  <span style="font-size: 18px; color: #28a745; font-weight: bold;">$${order.totalAmount}</span>
                </div>
                <div>
                  <strong style="color: #667eea;">حالة الطلب:</strong><br>
                  <span style="background: #ffc107; color: #000; padding: 4px 8px; border-radius: 4px; font-size: 12px;">${order.status}</span>
                </div>
                <div>
                  <strong style="color: #667eea;">تاريخ الطلب:</strong><br>
                  <span style="color: #333;">${new Date(order.createdAt).toLocaleString('ar-EG')}</span>
                </div>
              </div>

              ${order.userId ? `
                <div style="margin-bottom: 20px;">
                  <strong style="color: #667eea;">معلومات العميل:</strong><br>
                  <span style="color: #333;">مستخدم مسجل - ID: ${order.userId}</span>
                </div>
              ` : `
                <div style="margin-bottom: 20px;">
                  <strong style="color: #667eea;">معلومات العميل:</strong><br>
                  <span style="color: #333;">عميل زائر</span>
                </div>
              `}
            </div>

            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px;">المنتجات المطلوبة</h3>
              
              <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                  <tr style="background: #f8f9fa;">
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">المنتج</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">المقاس</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">اللون</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">الكمية</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">السعر</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #dee2e6;">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #666; margin-bottom: 15px;">يمكنك إدارة هذا الطلب من لوحة التحكم</p>
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/orders" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block; font-weight: bold;">
                عرض الطلب في لوحة التحكم
              </a>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ تم إرسال إشعار الطلب الجديد:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ خطأ في إرسال إشعار الطلب:', error);
    throw error;
  }
};

// إرسال تأكيد الطلب للعميل
const sendOrderConfirmation = async (customerEmail, order, orderItems) => {
  try {
    const transporter = createTransporter();
    
    const itemsHtml = orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          ${item.product.name}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.size || 'N/A'}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.color || 'N/A'}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
          $${(item.product.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: `تأكيد طلبك #${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">✅ تم تأكيد طلبك!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">شكراً لك على ثقتك في متجرنا</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-top: 0;">تفاصيل طلبك</h2>
              <p><strong>رقم الطلب:</strong> #${order.id}</p>
              <p><strong>إجمالي المبلغ:</strong> $${order.totalAmount}</p>
              <p><strong>حالة الطلب:</strong> ${order.status}</p>
              <p><strong>تاريخ الطلب:</strong> ${new Date(order.createdAt).toLocaleString('ar-EG')}</p>
            </div>

            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="color: #333; margin-top: 0;">المنتجات المطلوبة</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f8f9fa;">
                    <th style="padding: 10px; text-align: right;">المنتج</th>
                    <th style="padding: 10px; text-align: center;">المقاس</th>
                    <th style="padding: 10px; text-align: center;">اللون</th>
                    <th style="padding: 10px; text-align: center;">الكمية</th>
                    <th style="padding: 10px; text-align: right;">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </div>

            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #e3f2fd; border-radius: 8px;">
              <p style="color: #1976d2; margin: 0; font-size: 16px;">
                سيتم التواصل معك قريباً لتأكيد التفاصيل وترتيب التوصيل
              </p>
            </div>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ تم إرسال تأكيد الطلب للعميل:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ خطأ في إرسال تأكيد الطلب:', error);
    throw error;
  }
};

module.exports = {
  sendNewOrderNotification,
  sendOrderConfirmation
};
