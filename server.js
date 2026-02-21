const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const ORDERS_FILE = path.join(__dirname, 'orders.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Middleware
app.use(cors());
// Increase JSON body limit to allow base64 image data from admin uploads
app.use(express.json({ limit: '50mb' }));

// Health check endpoint for Railway
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize orders file if it doesn't exist
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

// GET all orders
app.get('/api/orders', (req, res) => {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(data);
    res.json(orders);
  } catch (error) {
    console.error('Error reading orders:', error);
    res.status(500).json({ error: 'Failed to read orders' });
  }
});

// POST a new order
app.post('/api/orders', (req, res) => {
  try {
    console.log('\n[orders] POST received from', req.ip || req.connection.remoteAddress);
    console.log('Body:', JSON.stringify(req.body).slice(0, 1000));

    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(data);
    
    const newOrder = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...req.body,
    };
    
    orders.push(newOrder);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// DELETE an order by id
app.delete('/api/orders/:id', (req, res) => {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(data);
    
    const filteredOrders = orders.filter(order => order.id != req.params.id);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(filteredOrders, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// UPDATE an order by id (partial update, e.g., status)
app.put('/api/orders/:id', async (req, res) => {
  try {
    const data = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(data);

    const idx = orders.findIndex(o => String(o.id) === String(req.params.id));
    if (idx === -1) return res.status(404).json({ error: 'Order not found' });

    const originalStatus = orders[idx].status;
    const updated = { ...orders[idx], ...req.body };
    orders[idx] = updated;
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));

    // Send status update email if status changed
    if (updated.status && updated.status !== originalStatus) {
      try {
        const configData = fs.readFileSync(CONFIG_FILE, 'utf8');
        const config = JSON.parse(configData);
        const emailConfig = config.emailConfig || {};
        
        if (emailConfig.email && emailConfig.appPassword) {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: emailConfig.email,
              pass: emailConfig.appPassword
            }
          });

          // Use specialized shipping email template for 'shipped' status
          let emailHtml;
          let emailSubject;
          
          if (updated.status === 'shipped') {
            const { generateShippingNotificationEmail } = require('./emailTemplates.js');
            emailHtml = generateShippingNotificationEmail(updated, 'GamerGear');
            emailSubject = `Your Order #${updated.id} is Shipping! 🚚`;
          } else {
            const { generateOrderStatusUpdateEmail } = require('./emailTemplates.js');
            emailHtml = generateOrderStatusUpdateEmail(updated, updated.status, 'GamerGear');
            emailSubject = `Order #${updated.id} Status Update - ${updated.status.charAt(0).toUpperCase() + updated.status.slice(1)}`;
          }

          await transporter.sendMail({
            from: emailConfig.email,
            to: updated.userId,
            subject: emailSubject,
            html: emailHtml
          });

          console.log(`[email] Order status update sent to ${updated.userId} - Status: ${updated.status}`);
        }
      } catch (emailError) {
        console.error('[email] Failed to send status update email:', emailError.message);
        // Don't fail the API request if email fails
      }
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// --- User Management Endpoints ---

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  const initialAdminHash = bcrypt.hashSync('admin@gamergear.com', 10);
  const initialUsers = [
    {
      id: 'admin-1',
      email: 'admin@gamergear.com',
      passwordHash: initialAdminHash,
      name: 'Admin User',
      phone: '+216 12 345 678',
      dateOfBirth: '1990-01-01',
      isAdmin: true,
      createdAt: new Date().toISOString()
    }
  ];
  fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2));
}

// Get all users (admin only)
app.get('/api/users', (req, res) => {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);
    // Don't send password hashes
    const safeUsers = users.map(u => ({ ...u, passwordHash: undefined }));
    res.json(safeUsers);
  } catch (error) {
    console.error('Error reading users:', error);
    res.status(500).json({ error: 'Failed to read users' });
  }
});

// Register new user
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name, phone, dateOfBirth } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      passwordHash,
      name,
      phone: phone || '',
      dateOfBirth: dateOfBirth || '',
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    console.log(`[auth] New user registered: ${email}`);
    res.status(201).json({
      success: true,
      user: { ...newUser, passwordHash: undefined }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log(`[auth] User logged in: ${email}`);
    res.json({
      success: true,
      user: { ...user, passwordHash: undefined }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Validate user credentials
app.post('/api/auth/validate', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ valid: false, error: 'Missing email or password' });
    }

    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.json({ valid: false, error: 'User not found' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
    res.json({
      valid: passwordMatch,
      user: passwordMatch ? { ...user, passwordHash: undefined } : null
    });
  } catch (error) {
    console.error('Error validating user:', error);
    res.status(500).json({ valid: false, error: 'Validation failed' });
  }
});

// --- Simple persistence endpoints for products, categories and config ---
const PRODUCTS_FILE = path.join(__dirname, 'products.json');
const CATEGORIES_FILE = path.join(__dirname, 'categories.json');
const CONFIG_FILE = path.join(__dirname, 'config.json');

const ensureFile = (filePath, initial = '[]') => {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, initial);
};

// Create files if missing; do NOT overwrite existing files (even if empty)
ensureFile(PRODUCTS_FILE, '[]');
ensureFile(CATEGORIES_FILE, '[]');
ensureFile(CONFIG_FILE, JSON.stringify({ emailConfig: {}, storeConfig: {} }, null, 2));

app.get('/api/products', (req, res) => {
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});

app.put('/api/products', (req, res) => {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(req.body || [], null, 2));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to write products' });
  }
});

app.get('/api/categories', (req, res) => {
  try {
    const data = fs.readFileSync(CATEGORIES_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json({ error: 'Failed to read categories' });
  }
});

app.put('/api/categories', (req, res) => {
  try {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(req.body || [], null, 2));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to write categories' });
  }
});

app.get('/api/config', (req, res) => {
  try {
    const data = fs.readFileSync(CONFIG_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (e) {
    res.status(500).json({ error: 'Failed to read config' });
  }
});

app.put('/api/config', (req, res) => {
  try {
    console.log('\n[config] PUT received from', req.ip || req.connection.remoteAddress);
    try {
      const bodySummary = JSON.stringify(req.body).slice(0, 1000);
      console.log('[config] body (truncated):', bodySummary);
      if (req.body && req.body.storeConfig && Array.isArray(req.body.storeConfig.ads)) {
        console.log('[config] ads count:', req.body.storeConfig.ads.length);
      }
    } catch (e) {
      console.log('[config] failed to stringify body for logging');
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(req.body || {}, null, 2));
    console.log('[config] written to', CONFIG_FILE);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to write config' });
  }
});

// Update user profile
app.post('/api/auth/update-profile', (req, res) => {
  try {
    const { email, phone, newPassword, currentPassword } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);

    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[userIndex];

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password required' });
      }

      const passwordMatch = bcrypt.compareSync(currentPassword, user.passwordHash);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      user.passwordHash = bcrypt.hashSync(newPassword, 10);
    }

    // Update phone if provided
    if (phone !== undefined) {
      user.phone = phone;
    }

    users[userIndex] = user;
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    console.log(`[auth] User profile updated: ${email}`);
    res.json({
      success: true,
      user: { ...user, passwordHash: undefined }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// --- Password Reset Endpoints ---

// Request password reset - generates code and sends email
app.post('/api/auth/request-password-reset', async (req, res) => {
  try {
    const { email, appPassword, senderEmail } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }

    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);
    const user = users.find(u => u.email === email);

    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({ success: true, message: 'If email exists, reset code sent' });
    }

    // Generate 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeHash = bcrypt.hashSync(resetCode, 10);
    const resetCodeExpiry = Date.now() + (15 * 60 * 1000); // Valid for 15 minutes

    // Store reset code in user object
    user.resetCodeHash = resetCodeHash;
    user.resetCodeExpiry = resetCodeExpiry;
    
    const userIndex = users.findIndex(u => u.email === email);
    users[userIndex] = user;
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    // Send reset code via email
    if (appPassword && senderEmail) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: senderEmail,
            pass: appPassword
          }
        });

        const emailHtml = `
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name || 'User'},</p>
          <p>Your password reset code is:</p>
          <h1 style="color: #007bff; font-family: monospace; font-size: 32px; letter-spacing: 5px;">${resetCode}</h1>
          <p>This code is valid for 15 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            Do not share this code with anyone.
          </p>
        `;

        await transporter.sendMail({
          from: senderEmail,
          to: email,
          subject: 'Password Reset Code - GamerGear',
          html: emailHtml
        });

        console.log(`[email] Password reset code sent to ${email}`);
      } catch (emailError) {
        console.error('[email] Failed to send reset code:', emailError.message);
        // Still return success since user is stored
      }
    }

    res.json({ success: true, message: 'Reset code sent to email if account exists' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Reset password with code
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ error: 'Email, reset code, and new password required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const data = fs.readFileSync(USERS_FILE, 'utf8');
    const users = JSON.parse(data);
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[userIndex];

    // Check if reset code exists and is valid
    if (!user.resetCodeHash || !user.resetCodeExpiry) {
      return res.status(400).json({ error: 'No password reset request found. Please request a reset first.' });
    }

    // Check if code has expired
    if (Date.now() > user.resetCodeExpiry) {
      // Clear the invalid reset code
      user.resetCodeHash = undefined;
      user.resetCodeExpiry = undefined;
      users[userIndex] = user;
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      return res.status(400).json({ error: 'Reset code has expired. Please request a new one.' });
    }

    // Verify the reset code
    const codeMatch = bcrypt.compareSync(resetCode, user.resetCodeHash);
    if (!codeMatch) {
      return res.status(401).json({ error: 'Invalid reset code' });
    }

    // Update password and clear reset code
    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    user.resetCodeHash = undefined;
    user.resetCodeExpiry = undefined;
    
    users[userIndex] = user;
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    console.log(`[auth] Password reset for user: ${email}`);
    res.json({ success: true, message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Email Sending Endpoints
app.post('/api/send-confirmation-code', async (req, res) => {
  try {
    const { email, userName, code, appPassword, senderEmail } = req.body;

    if (!email || !code || !appPassword || !senderEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: appPassword
      }
    });

    const { generateConfirmationCodeEmail } = require('./emailTemplates.js');
    const emailHtml = generateConfirmationCodeEmail(userName || 'Customer', code);

    await transporter.sendMail({
      from: senderEmail,
      to: email,
      subject: `Your Order Confirmation Code: ${code}`,
      html: emailHtml
    });

    console.log(`[email] Confirmation code sent to ${email}`);
    res.json({ success: true, message: 'Confirmation code email sent' });
  } catch (error) {
    console.error('Error sending confirmation code email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/send-order-confirmation', async (req, res) => {
  try {
    const { order, appPassword, senderEmail } = req.body;

    if (!order || !appPassword || !senderEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: appPassword
      }
    });

    const { generateOrderConfirmationEmail } = require('./emailTemplates.js');
    const emailHtml = generateOrderConfirmationEmail(order, 'GamerGear');

    await transporter.sendMail({
      from: senderEmail,
      to: order.userId,
      subject: `Order Confirmation - Order #${order.id}`,
      html: emailHtml
    });

    console.log(`[email] Order confirmation sent to ${order.userId}`);
    res.json({ success: true, message: 'Order confirmation email sent' });
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Root endpoint - info about the API
app.get('/', (req, res) => {
  res.json({
    status: 'Backend API Server Running',
    message: 'This is an API server. Access the website through the frontend server (port 3000), not here.',
    endpoints: {
      orders: '/api/orders',
      products: '/api/products',
      categories: '/api/categories',
      config: '/api/config',
      auth_register: 'POST /api/auth/register',
      auth_login: 'POST /api/auth/login',
      auth_validate: 'POST /api/auth/validate',
      users: '/api/users',
      health: '/api/health'
    },
    notes: 'Start the frontend with: npm run dev'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✓ Backend API Server running at http://localhost:${PORT}`);
  console.log(`✓ API available on network: http://192.168.137.1:${PORT}/api/orders`);
  console.log(`\n📍 To access the website:`);
  console.log(`   - Local: http://localhost:3000`);
  console.log(`   - Network: http://192.168.137.1:3000`);
  console.log(`\n💡 This is an API-only server. Use 'npm run dev' to start the frontend.`);
});
