# 🌐 Platinum Network - Shared Hosting Deployment (Step-by-Step)

## ✅ Perfect Solution for Namecheap Shared Hosting

**Strategy:**
- 🎨 **Frontend** → Namecheap Shared Hosting (your domain)
- ⚙️ **Backend** → Railway.app (FREE)
- 🗄️ **Database** → MongoDB Atlas (FREE)

**Total Cost: ₹0 (except domain & hosting you already have!)** 💰

---

## 📋 Step-by-Step Deployment Guide

### **STEP 1: Setup Database (5 minutes)** 🗄️

#### 1.1 Create MongoDB Atlas Account

1. Visit: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up kijiye (Email ya Google se)
3. Organization name: `Platinum Network`
4. Project name: `Production`

#### 1.2 Create FREE Database Cluster

1. Click **"Build a Database"**
2. Select **"M0 FREE"** plan (हमेशा के लिए मुफ्त!)
3. Provider: **AWS**
4. Region: **Mumbai (ap-south-1)** (India ke liye best)
5. Cluster Name: `PlatinumCluster`
6. Click **"Create"** (2-3 minutes lagenge)

#### 1.3 Create Database User

1. Left sidebar → **"Database Access"**
2. Click **"Add New Database User"**
3. Username: `platinum_admin`
4. Password: Click **"Autogenerate Secure Password"**
5. **⚠️ IMPORTANT: Copy and save this password!**
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

#### 1.4 Allow Network Access

1. Left sidebar → **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**

#### 1.5 Get Connection String

1. Left sidebar → **"Database"**
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Copy the connection string:
```
mongodb+srv://platinum_admin:<password>@platinumcluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Replace `<password>` with your actual password (jo copy kiya tha)
6. Add database name at the end:
```
mongodb+srv://platinum_admin:YOUR_PASSWORD@platinumcluster.xxxxx.mongodb.net/platinum_network?retryWrites=true&w=majority
```

**✅ Save this connection string! Baad mein use hogi.**

---

### **STEP 2: Deploy Backend on Railway.app (10 minutes)** ⚙️

Railway.app = FREE backend hosting (500 hours/month free)

#### 2.1 Prepare Backend Code

1. Download backend folder se ye files:
   - `/app/backend/server.py`
   - `/app/backend/requirements.txt`

2. Create new folder `platinum-backend` on your computer

3. Copy files:
```
platinum-backend/
├── server.py
├── requirements.txt
└── .env (create this - see below)
```

4. Create `.env` file:
```env
MONGO_URL=mongodb+srv://platinum_admin:YOUR_PASSWORD@platinumcluster.xxxxx.mongodb.net/platinum_network?retryWrites=true&w=majority
DB_NAME=platinum_network
CORS_ORIGINS=*
JWT_SECRET_KEY=YOUR_RANDOM_SECRET_KEY_CHANGE_THIS_12345678
```

5. Create `railway.json` file:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn server:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

6. Create `Procfile` (no extension):
```
web: uvicorn server:app --host 0.0.0.0 --port $PORT
```

#### 2.2 Upload to GitHub (Private Repository)

1. Create account: **https://github.com/signup**
2. Create new repository: **"platinum-backend"** (Private)
3. Upload all files to GitHub

**या आसान तरीका - Direct Railway deployment:**

#### 2.3 Deploy on Railway.app

1. Visit: **https://railway.app/**
2. Click **"Start a New Project"**
3. Sign up with GitHub
4. Click **"Deploy from GitHub repo"**
5. Select your **"platinum-backend"** repository
6. Railway automatically detect करेगा Python app

#### 2.4 Add Environment Variables

1. Railway dashboard में click on your project
2. Go to **"Variables"** tab
3. Add these variables:

| Variable | Value |
|----------|-------|
| MONGO_URL | (Your MongoDB connection string) |
| DB_NAME | platinum_network |
| CORS_ORIGINS | * |
| JWT_SECRET_KEY | (Random strong string) |
| PORT | 8001 |

4. Click **"Deploy"**

#### 2.5 Get Backend URL

1. Go to **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. You'll get URL like: `https://platinum-backend-production-xxxx.up.railway.app`

**✅ Copy this URL! Frontend में use hogi.**

---

### **STEP 3: Build Frontend (15 minutes)** 🎨

#### 3.1 Update Frontend Configuration

1. Open `/app/frontend/.env` file
2. Update backend URL:
```env
REACT_APP_BACKEND_URL=https://platinum-backend-production-xxxx.up.railway.app
```

#### 3.2 Build Frontend

**Option A: On This Server (Recommended)**
```bash
cd /app/frontend
yarn install
yarn build
```

**Option B: On Your Computer**
- Install Node.js: https://nodejs.org/
- Download frontend folder
- Open terminal in frontend folder:
```bash
npm install -g yarn
yarn install
yarn build
```

3. Build folder ready: `/app/frontend/build/`

#### 3.3 Download Build Files

Create a zip file:
```bash
cd /app/frontend/build
zip -r platinum-frontend-build.zip .
```

Download this zip file.

---

### **STEP 4: Upload to Namecheap Shared Hosting (10 minutes)** 🚀

#### 4.1 Login to cPanel

1. Login to Namecheap dashboard
2. Go to **"Hosting List"**
3. Click **"cPanel"** button
4. cPanel खुलेगा

#### 4.2 Clean public_html Folder

1. cPanel में **"File Manager"** open करें
2. Navigate to **`public_html/`** folder
3. Select all files (except `.htaccess` if exists)
4. Click **"Delete"**

#### 4.3 Upload Frontend Files

1. Click **"Upload"** button
2. Upload **`platinum-frontend-build.zip`**
3. Wait for upload to complete
4. Right-click on zip file → **"Extract"**
5. Select **`/public_html/`** as destination
6. Click **"Extract Files"**
7. Delete the zip file after extraction

#### 4.4 Create .htaccess File

1. In `public_html/` folder, click **"+ File"**
2. Filename: `.htaccess`
3. Edit the file and paste:

```apache
# Enable Rewrite Engine
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Force HTTPS (optional but recommended)
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # React Router - Redirect all requests to index.html
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Security Headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Compress Files
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>
```

4. Save file

---

### **STEP 5: Point Domain (Already Done!)** 🌐

If your domain is already pointing to Namecheap hosting, skip this!

Otherwise:
1. Namecheap Dashboard → **"Domain List"**
2. Click **"Manage"** on your domain
3. **"Advanced DNS"** tab
4. Ensure these records exist:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | (Your hosting IP) | Automatic |
| CNAME | www | yourdomain.com | Automatic |

---

### **STEP 6: Setup SSL Certificate (5 minutes)** 🔒

#### In cPanel:

1. Search for **"SSL/TLS Status"**
2. Click on it
3. Check the box next to your domain
4. Click **"Run AutoSSL"**
5. Wait 2-3 minutes

**या**

Use Namecheap's free SSL:
1. Namecheap Dashboard → Domain → Manage
2. Find **"PositiveSSL"** or **"SSL Certificate"**
3. Activate free SSL

---

## 🎉 Deployment Complete! Test Your Website

### Testing Checklist:

1. ✅ **Visit your domain**: `https://yourdomain.com`
2. ✅ **Test Registration**:
   - Click "Get Started"
   - Fill registration form
   - Should create account successfully

3. ✅ **Test Login**:
   - Login with created account
   - Should redirect to dashboard

4. ✅ **Test Mining**:
   - Click "Start Mining"
   - Should show timer

5. ✅ **Test All Features**:
   - Daily Check-in
   - Social Tasks
   - Referrals
   - Wallet
   - Leaderboard
   - Profile

---

## 🆘 Troubleshooting

### Issue 1: "Cannot connect to backend"

**Check:**
1. Railway backend is running?
   - Login to Railway.app
   - Check deployment status
   - View logs for errors

2. Frontend .env correct?
   - Backend URL is correct in build?
   - Rebuild frontend with correct URL

3. CORS issue?
   - Add your domain in Railway variables:
   ```
   CORS_ORIGINS=https://yourdomain.com,http://yourdomain.com
   ```

### Issue 2: "404 Page Not Found" on refresh

**Fix:** Check `.htaccess` file is present in `public_html/`

### Issue 3: "Database connection failed"

**Check:**
1. MongoDB Atlas cluster is running?
2. Network access allows 0.0.0.0/0?
3. Database user credentials correct?
4. Connection string has correct password?

### Issue 4: Pages not loading properly

**Fix:**
1. Clear browser cache
2. Check if all files uploaded correctly
3. Check browser console for errors (F12)

---

## 📊 Monitor Your Application

### Railway Backend:
- Login to Railway.app
- View deployment logs
- Monitor usage (500 hours free/month)

### MongoDB Atlas:
- Login to MongoDB Atlas
- Check **"Metrics"** tab
- Monitor storage and connections

### Namecheap:
- cPanel → **"Resource Usage"**
- Monitor bandwidth and disk space

---

## 🔐 Security Best Practices

1. ✅ **Change JWT Secret**:
   - Railway Variables → Update `JWT_SECRET_KEY`
   - Use random 32+ character string

2. ✅ **Restrict MongoDB Access**:
   - After testing, get Railway app IP
   - MongoDB Atlas → Network Access → Add specific IP

3. ✅ **Enable HTTPS**:
   - Already done via SSL certificate

4. ✅ **Regular Backups**:
   - MongoDB Atlas has automatic backups in FREE tier!
   - Download backups weekly

---

## 💰 Cost Breakdown

| Service | Cost | Features |
|---------|------|----------|
| Domain | ₹500-1000/year | Already purchased |
| Namecheap Hosting | ₹2000-4000/year | Already purchased |
| Railway Backend | **FREE** | 500 hours/month |
| MongoDB Atlas | **FREE** | 512MB storage |
| SSL Certificate | **FREE** | Via Namecheap/Let's Encrypt |
| **Total Extra Cost** | **₹0** | 🎉 |

---

## 📈 Scale Your Application

**When your app grows:**

1. **Railway Usage Limit Hit?**
   - Upgrade to Railway Pro: $5/month
   - Or migrate to VPS

2. **MongoDB Storage Full?**
   - Upgrade Atlas: $9/month for more storage
   - Or clean old data

3. **Need Better Performance?**
   - Upgrade to Namecheap VPS
   - Full control + better resources

---

## 🎊 Success! Your Platform is LIVE! 🚀

**Next Steps:**

1. **Create Admin Account**:
   ```
   Email: admin@platinumnetwork.com
   Password: Admin@12345
   ```

2. **Test Everything**:
   - Create test user
   - Test all features
   - Check mobile view

3. **Promote Your Platform**:
   - Share on social media
   - WhatsApp groups
   - Start getting users!

4. **Monitor Daily**:
   - Check Railway logs
   - Monitor MongoDB
   - Track user growth

---

## 📞 Need Help?

**Common Resources:**
- Railway Docs: https://docs.railway.app/
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Namecheap Support: https://www.namecheap.com/support/

**For Code Issues:**
- Check browser console (F12)
- Check Railway logs
- Check MongoDB Atlas metrics

---

**🎉 Congratulations! Aapka Platinum Network ab LIVE hai! 🌐**

Share your domain and start earning! 💰

---

**Summary:**
- ✅ Frontend: Namecheap Shared Hosting
- ✅ Backend: Railway.app (FREE)
- ✅ Database: MongoDB Atlas (FREE)
- ✅ SSL: Namecheap/Let's Encrypt (FREE)
- ✅ Total Cost: Only domain + hosting (already paid!)

**Your domain is now serving the complete Platinum Network mining platform! 🚀**
