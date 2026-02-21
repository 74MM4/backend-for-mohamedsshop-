# 🔧 Admin Email Setup - Quick Fix

## Problem
When trying to login to admin page, you get: **"Error sending verification code"**

---

## Root Cause
Email credentials are **not configured** in Admin Settings.

---

## Solution (3 Easy Steps)

### Step 1: Login to Admin Panel
1. On homepage, click **"Admin"** button
2. Choose **"Admin Login"** option
3. You'll see email input field

**Note:** For the first time, password verification is bypassed, so just enter any email to proceed.

### Step 2: Go to Email Settings
1. Once in Admin, click **"Settings"** tab
2. Scroll to **"Email Configuration"** section
3. You'll see two fields:
   - ✉️ **Sender Email Address**
   - 🔐 **Gmail App Password**

### Step 3: Add Your Gmail Credentials

#### What You Need:
- Your Gmail address (e.g., `yourname@gmail.com`)
- A special **App Password** from Google (NOT your regular password)

#### How to Get App Password:

1. **Enable 2-Step Verification First:**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Find "2-Step Verification" and turn it ON
   - Complete the verification steps

2. **Get App Password:**
   - Go back to [Google Account Security](https://myaccount.google.com/security)
   - Find "App passwords" (appears after 2-Step is ON)
   - Select: **Mail** and **Windows Computer**
   - Google shows you a 16-character password
   - **Copy the exact password** (including spaces)

3. **Enter in Admin Settings:**
   - Paste your email in "Sender Email Address"
   - Paste the app password in "Gmail App Password"
   - Click **"Save Email Configuration"**
   - You'll see: ✓ **Credentials configured**

---

## Test It Works

1. Logout from admin
2. Try "Admin Login" again
3. You should now **receive a code in your email**
4. Enter the code to login

✅ **Success!** Email system is now active.

---

## Important Notes

🔒 **Security:**
- App passwords are safe (Google designed for this)
- They only work with Gmail
- You can disable anytime in Google Account

⚠️ **Common Issues:**
- Removed spaces from password → Will fail
- 2-Step Verification turned off → Won't work
- Wrong email → Won't receive codes

🆘 **Still not working?**
- Open browser console (F12)
- Check for error details
- Make sure backend is running (`npm run backend`)

---

## You're Done! 🎉
Email verification codes now work. Users can login and receive confirmation emails for orders.
