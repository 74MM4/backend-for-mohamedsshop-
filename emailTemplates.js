// Email template functions

function generateConfirmationCodeEmail(userName, code) {
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

function generateOrderConfirmationEmail(order, storeName = 'GamerGear') {
  const itemsHtml = order.items
    .map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong><br>
          <span style="color: #6b7280; font-size: 14px;">Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ${(item.price * item.quantity).toFixed(2)} TND
        </td>
      </tr>
    `)
    .join('');

  const subtotal = order.total;
  const deliveryFee = order.paymentMethod === 'cash' ? 9 : 0;
  const totalWithFee = subtotal + deliveryFee;
  const orderDate = new Date(order.date || order.timestamp).toLocaleDateString();

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
    .order-info {
      background-color: #f3e8ff;
      border-left: 4px solid #9333ea;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .order-info p {
      margin: 8px 0;
      font-size: 14px;
    }
    .order-info strong {
      color: #9333ea;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
    }
    .items-table th {
      background-color: #f3e8ff;
      padding: 12px;
      text-align: left;
      color: #9333ea;
      font-weight: 600;
    }
    .summary {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    .summary-row:last-child {
      border-bottom: none;
      font-size: 18px;
      font-weight: 600;
      color: #9333ea;
      padding-top: 15px;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Order Confirmed!</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your purchase</p>
    </div>
    <div class="content">
      <div class="order-info">
        <p><strong>Order ID:</strong> ${order.id}</p>
        <p><strong>Date:</strong> ${orderDate}</p>
        <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
        <p><strong>Customer Name:</strong> ${order.userName}</p>
        <p><strong>Phone:</strong> ${order.userPhone}</p>
        ${order.deliveryAddress ? `<p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>` : ''}
      </div>

      <h2 style="color: #1f2937; margin-bottom: 15px;">Order Items</h2>
      <table class="items-table">
        <thead>
          <tr>
            <th>Product</th>
            <th style="text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)} TND</span>
        </div>
        ${deliveryFee > 0 ? `
          <div class="summary-row">
            <span>Delivery Fee (frais):</span>
            <span>${deliveryFee.toFixed(2)} TND</span>
          </div>
        ` : ''}
        <div class="summary-row">
          <span>Total:</span>
          <span>${totalWithFee.toFixed(2)} TND</span>
        </div>
      </div>

      <div style="text-align: center; color: #6b7280; margin-top: 20px;">
        <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Pickup'}</p>
      </div>
    </div>
    <div class="footer">
      <p>© 2026 ${storeName}. All rights reserved.</p>
      <p>If you have any questions, please contact us.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateOrderStatusUpdateEmail(order, newStatus, storeName = 'GamerGear') {
  const statusMessages = {
    pending: '⏳ Your order is being prepared',
    processing: '📦 Your order is being packed',
    shipped: '🚚 Your order is on the way',
    delivered: '✓ Your order has been delivered',
    cancelled: '❌ Your order has been cancelled'
  };

  const statusColors = {
    pending: '#f59e0b',
    processing: '#3b82f6',
    shipped: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444'
  };

  const statusMessage = statusMessages[newStatus] || newStatus;
  const statusColor = statusColors[newStatus] || '#9333ea';
  const totalWithFee = order.total + (order.paymentMethod === 'cash' ? 9 : 0);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Status Update</title>
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
      background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%);
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
    .status-box {
      background-color: #f3f4f6;
      border-left: 6px solid ${statusColor};
      padding: 25px;
      border-radius: 8px;
      margin: 30px 0;
      text-align: center;
    }
    .status-text {
      font-size: 20px;
      font-weight: 600;
      color: ${statusColor};
      margin: 15px 0 10px 0;
    }
    .order-info {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #6b7280;
      font-weight: 500;
    }
    .info-value {
      color: #1f2937;
      font-weight: 600;
    }
    .alert-box {
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
    }
    .alert-shipped {
      background-color: #dbeafe;
      border-left: 4px solid #3b82f6;
      color: #1e40af;
    }
    .alert-delivered {
      background-color: #dcfce7;
      border-left: 4px solid #10b981;
      color: #15803d;
    }
    .alert-cancelled {
      background-color: #fee2e2;
      border-left: 4px solid #ef4444;
      color: #991b1b;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Status Update</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${order.id}</p>
    </div>
    <div class="content">
      <div class="status-box">
        <div style="font-size: 32px; margin-bottom: 10px;">
          ${newStatus === 'pending' ? '⏳' : newStatus === 'processing' ? '📦' : newStatus === 'shipped' ? '🚚' : newStatus === 'delivered' ? '✓' : '❌'}
        </div>
        <div class="status-text">${statusMessage}</div>
        <p style="color: #6b7280; margin: 5px 0; font-size: 13px;">Updated on ${new Date().toLocaleString()}</p>
      </div>

      <div class="order-info">
        <h3 style="margin-top: 0; color: #1f2937;">Order Details</h3>
        <div class="info-row">
          <span class="info-label">Customer:</span>
          <span class="info-value">${order.userName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Order ID:</span>
          <span class="info-value">#${order.id}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Total Amount:</span>
          <span class="info-value">${totalWithFee.toFixed(2)} TND</span>
        </div>
        ${order.deliveryAddress ? `
          <div class="info-row">
            <span class="info-label">Delivery Address:</span>
            <span class="info-value">${order.deliveryAddress}</span>
          </div>
        ` : ''}
      </div>

      ${newStatus === 'shipped' ? `
        <div class="alert-box alert-shipped">
          📍 <strong>Your package is on the way!</strong> Please have your phone ready for the delivery.
        </div>
      ` : newStatus === 'delivered' ? `
        <div class="alert-box alert-delivered">
          <strong>Delivery Complete!</strong> We hope you enjoy your purchase. Please don't hesitate to contact us if you have any questions.
        </div>
      ` : newStatus === 'cancelled' ? `
        <div class="alert-box alert-cancelled">
          <strong>Order Cancelled.</strong> If you have any questions about the cancellation, please contact our support team.
        </div>
      ` : ''}

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; margin: 0;">If you have any questions, feel free to reach out to us.</p>
      </div>
    </div>
    <div class="footer">
      <p>© 2026 ${storeName}. All rights reserved.</p>
      <p>This is an automated email. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

module.exports = {
  generateConfirmationCodeEmail,
  generateOrderConfirmationEmail,
  generateOrderStatusUpdateEmail,
  generateShippingNotificationEmail
};


function generateShippingNotificationEmail(order, storeName = 'GamerGear') {
  const totalWithFee = order.total + (order.paymentMethod === 'cash' ? 9 : 0);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order is Being Shipped</title>
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
      background: linear-gradient(135deg, #8b5cf6 0%, #8b5cf6dd 100%);
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
    .status-box {
      background-color: #f3f4f6;
      border-left: 6px solid #8b5cf6;
      padding: 25px;
      border-radius: 8px;
      margin: 30px 0;
      text-align: center;
    }
    .status-text {
      font-size: 20px;
      font-weight: 600;
      color: #8b5cf6;
      margin: 15px 0 10px 0;
    }
    .order-info {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .order-info h3 {
      margin-top: 0;
      color: #1f2937;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      color: #6b7280;
      font-weight: 500;
    }
    .info-value {
      color: #1f2937;
      font-weight: 600;
    }
    .alert-box {
      border-radius: 6px;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
      background-color: #dbeafe;
      border-left: 4px solid #3b82f6;
      color: #1e40af;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .items-table th {
      background: #8b5cf6;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      font-size: 14px;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    .items-table tr:last-child td {
      border-bottom: none;
    }
    .total-row {
      background: #f3e8ff;
      font-weight: 600;
      font-size: 16px;
    }
    .total-row td {
      padding: 16px 12px !important;
      color: #8b5cf6;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Order is Shipping! 🚚</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Order #${order.id}</p>
    </div>
    <div class="content">
      <p>Hi ${order.userName},</p>
      <p style="color: #6b7280; margin-bottom: 20px;">
        Great news! Your order is on its way to you. We're excited for you to receive your gaming gear!
      </p>

      <div class="status-box">
        <div style="font-size: 32px; margin-bottom: 10px;">🚚</div>
        <div class="status-text">Your Order is Being Shipped</div>
        <p style="color: #6b7280; margin: 5px 0; font-size: 13px;">Shipped on ${new Date().toLocaleString()}</p>
      </div>

      <div class="order-info">
        <h3>Order Details</h3>
        <div class="info-row">
          <span class="info-label">Customer:</span>
          <span class="info-value">${order.userName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Order ID:</span>
          <span class="info-value">#${order.id}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Order Date:</span>
          <span class="info-value">${new Date(order.date).toLocaleDateString()}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Total Amount:</span>
          <span class="info-value">${totalWithFee.toFixed(2)} TND</span>
        </div>
        ${order.deliveryAddress ? `
          <div class="info-row">
            <span class="info-label">Delivery Address:</span>
            <span class="info-value">${order.deliveryAddress}</span>
          </div>
        ` : ''}
      </div>

      <h3 style="color: #1f2937; margin: 24px 0 16px 0;">Order Items</h3>
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
            <td style="text-align: right;">${totalWithFee.toFixed(2)} TND</td>
          </tr>
        </tbody>
      </table>

      <div class="alert-box">
        📍 <strong>Please have your phone ready!</strong> Our delivery partner will contact you with the exact delivery time. Track your shipment and stay updated on delivery status.
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #6b7280; margin: 0;">Questions about your order? Our support team is here to help!</p>
        <p style="color: #9333ea; font-weight: 600; margin: 10px 0 0 0;">Contact us anytime - we're always happy to assist</p>
      </div>
    </div>
    <div class="footer">
      <p>© 2026 ${storeName}. All rights reserved.</p>
      <p>This is an automated email. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

