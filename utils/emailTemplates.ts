import { Order } from '../App';

// Generate confirmation code (6 digits)
export function generateConfirmationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateConfirmationCodeEmail(userName: string, code: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation Code</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 400px;
      margin: 40px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .code-box {
      background: #f3e8ff;
      border: 3px solid #9333ea;
      border-radius: 12px;
      padding: 30px 20px;
      margin: 30px 0;
    }
    .code {
      font-size: 48px;
      font-weight: 800;
      color: #9333ea;
      letter-spacing: 10px;
      font-family: 'Courier New', monospace;
    }
    .info {
      color: #6b7280;
      font-size: 14px;
      margin: 20px 0;
    }
    .warning {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px;
      margin: 20px 0;
      text-align: left;
      border-radius: 4px;
      font-size: 13px;
      color: #92400e;
    }
    .footer {
      background: #111827;
      padding: 20px;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verification Code</h1>
    </div>
    
    <div class="content">
      <p>Hi ${userName},</p>
      <p style="color: #6b7280; margin-bottom: 30px;">
        Your order confirmation code is ready. Use this code to complete your purchase.
      </p>
      
      <div class="code-box">
        <div class="code">${code}</div>
      </div>
      
      <p class="info">This code is valid for 24 hours</p>
      
      <div class="warning">
        ⚠️ Never share this code with anyone. We will never ask for it.
      </div>
    </div>
    
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} GamerGear. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateOrderConfirmationEmail(order: Order, storeName: string = 'GamerGear'): string {
  const orderDate = new Date(order.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #9333ea 0%, #ec4899 100%);
      padding: 40px 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .order-summary {
      background: #f9fafb;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    .order-summary h2 {
      margin: 0 0 16px 0;
      font-size: 20px;
      color: #9333ea;
    }
    .order-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .order-info:last-child {
      border-bottom: none;
    }
    .order-info label {
      color: #6b7280;
      font-size: 14px;
    }
    .order-info value {
      font-weight: 500;
      color: #111827;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .items-table th {
      background: #9333ea;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .items-table tr:last-child td {
      border-bottom: none;
    }
    .total-row {
      background: #f3e8ff;
      font-weight: 600;
      font-size: 18px;
    }
    .total-row td {
      padding: 16px 12px !important;
      color: #9333ea;
    }
    .footer-message {
      background: linear-gradient(135deg, #ede9fe 0%, #fce7f3 100%);
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
    }
    .footer-message p {
      margin: 8px 0;
      color: #6b7280;
    }
    .footer {
      background: #111827;
      padding: 30px;
      text-align: center;
      color: #9ca3af;
      font-size: 14px;
    }
    .footer a {
      color: #ec4899;
      text-decoration: none;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      background: #fef3c7;
      color: #92400e;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>✨ ${storeName}</h1>
      <p style="margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">Order Confirmation</p>
    </div>

    <!-- Content -->
    <div class="content">
      <h2 style="color: #111827; margin: 0 0 16px 0;">Thank you for your order, ${order.userName}!</h2>
      <p style="color: #6b7280; margin: 0 0 24px 0;">
        We've received your order and will process it shortly. You'll receive another email once your order has been shipped.
      </p>

      <!-- Order Summary -->}
      <div class="order-summary">
        <h2>Order Summary</h2>
        <div class="order-info">
          <label>Order Number:</label>
          <value>${order.id}</value>
        </div>
        <div class="order-info">
          <label>Order Date:</label>
          <value>${orderDate}</value>
        </div>
        <div class="order-info">
          <label>Status:</label>
          <value><span class="status-badge">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></value>
        </div>
        <div class="order-info">
          <label>Payment Method:</label>
          <value>${order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Pickup at Store'}</value>
        </div>
        ${order.deliveryAddress ? `
        <div class="order-info">
          <label>Delivery Address:</label>
          <value>${order.deliveryAddress}</value>
        </div>
        ` : ''}
      </div>

      <!-- Order Items -->
      <h3 style="color: #111827; margin: 24px 0 16px 0;">Order Items</h3>
      <table class="items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align: center;">Quantity</th>
            <th style="text-align: right;">Price</th>
            <th style="text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.name}</td>
              <td style="text-align: center;">${item.quantity}</td>
              <td style="text-align: right;">${item.price.toFixed(2)} TND</td>
              <td style="text-align: right;">${(item.price * item.quantity).toFixed(2)} TND</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="3" style="text-align: right;">Order Total:</td>
            <td style="text-align: right;">${order.total.toFixed(2)} TND</td>
          </tr>
        </tbody>
      </table>

      <!-- Contact Information -->}
      <div class="order-summary">
        <h2>Contact Information</h2>
        <div class="order-info">
          <label>Email:</label>
          <value>${order.userId}</value>
        </div>
        <div class="order-info">
          <label>Phone:</label>
          <value>${order.userPhone}</value>
        </div>
      </div>

      <!-- Thank You Message -->}
      <div class="footer-message">
        <h3 style="color: #9333ea; margin: 0 0 12px 0; font-size: 20px;">Thank You for Shopping With Us!</h3>
        <p>We appreciate your business and hope you enjoy your new gaming gear.</p>
        <p>If you have any questions about your order, please don't hesitate to contact us.</p>
        <p style="margin-top: 16px;">
          <strong>Happy Gaming! 🎮</strong>
        </p>
      </div>
    </div>

    <!-- Footer -->}
    <div class="footer">
      <p style="margin: 0 0 8px 0;">&copy; ${new Date().getFullYear()} ${storeName}. All rights reserved.</p>
      <p style="margin: 0;">Premium Gaming Peripherals | Quality & Performance</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

// Server-side implementation example (for reference)
export const sendOrderConfirmationEmailExample = `
// Example server-side API endpoint to send order confirmation emails
// Add this to your Node.js/Express backend

const nodemailer = require('nodemailer');

app.post('/api/send-order-confirmation', async (req, res) => {
  const { order, emailConfig } = req.body;
  
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.email,
        pass: emailConfig.appPassword
      }
    });

    // Generate HTML email
    const emailHtml = generateOrderConfirmationEmail(order, 'GamerGear');

    // Send email
    await transporter.sendMail({
      from: emailConfig.email,
      to: order.userId,
      subject: \`Order Confirmation - \${order.id}\`,
      html: emailHtml
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
`;
