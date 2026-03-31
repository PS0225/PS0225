# 🌐 Platinum Network - Namecheap Deployment Guide

## ⚠️ Important: Check Your Hosting Type

Namecheap offers different hosting types. Check which one you have:

### 1. **Shared Hosting (Stellar, Stellar Plus, Stellar Business)**
   - ❌ **NOT SUITABLE** for this application
   - Reason: Doesn't support Node.js & Python applications
   - Solution: Upgrade to VPS or use hybrid approach (below)

### 2. **VPS Hosting** 
   - ✅ **PERFECT** for this application
   - Supports Node.js, Python, MongoDB
   - Full server control

### 3. **Dedicated Server**
   - ✅ **EXCELLENT** for this application
   - Best performance

---

## 📋 Deployment Options for Namecheap

### **Option A: Namecheap VPS/Dedicated (Full Deployment)** ⭐ RECOMMENDED

If you have VPS or Dedicated server:

#### Step 1: Connect to Your Server

```bash
# From your computer, connect via SSH
ssh root@your-server-ip
# Or use Namecheap's web terminal in control panel
```

#### Step 2: Install Required Software

```bash
# Update system
apt-get update && apt-get upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install Python 3.11
apt-get install -y python3 python3-pip python3-venv

# Install Nginx
apt-get install -y nginx

# Install PM2 (Process Manager)
npm install -g pm2 yarn
```

#### Step 3: Setup MongoDB Atlas (Free Database)

1. Visit: https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create free cluster (M0)
4. Setup database user: `platinum_admin` / `strong_password`
5. Network Access: Allow 0.0.0.0/0
6. Get connection string:
   ```
   mongodb+srv://platinum_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/platinum_network
   ```

#### Step 4: Upload Your Code

**Option 1: Via Git (Recommended)**
```bash
cd /var/www
git clone YOUR_GITHUB_REPO_URL platinum-network
cd platinum-network
```

**Option 2: Via FTP/SFTP**
- Use FileZilla or any FTP client
- Connect to your Namecheap server
- Upload all files to `/var/www/platinum-network/`

**Option 3: Via cPanel File Manager**
- Login to Namecheap cPanel
- Use File Manager to upload zip file
- Extract in `/var/www/platinum-network/`

#### Step 5: Configure Backend

```bash
cd /var/www/platinum-network/backend

# Create .env file
cat > .env << 'EOF'
MONGO_URL="mongodb+srv://platinum_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/platinum_network?retryWrites=true&w=majority"
DB_NAME="platinum_network"
CORS_ORIGINS="https://yourdomain.com,http://yourdomain.com"
JWT_SECRET_KEY="CHANGE_THIS_TO_RANDOM_STRONG_KEY_12345"
EOF

# Install Python dependencies
pip3 install -r requirements.txt
```

#### Step 6: Configure Frontend

```bash
cd /var/www/platinum-network/frontend

# Create .env file
cat > .env << 'EOF'
REACT_APP_BACKEND_URL=https://yourdomain.com
EOF

# Install dependencies and build
yarn install
yarn build
```

#### Step 7: Start Backend with PM2

```bash
cd /var/www/platinum-network/backend

# Start backend
pm2 start "uvicorn server:app --host 0.0.0.0 --port 8001" --name platinum-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on server boot
pm2 startup
# Copy and run the command it shows
```

#### Step 8: Configure Nginx

```bash
# Create Nginx configuration
cat > /etc/nginx/sites-available/platinum-network << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend (React build)
    location / {
        root /var/www/platinum-network/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/platinum-network /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default  # Remove default site

# Test and reload Nginx
nginx -t
systemctl reload nginx
```

#### Step 9: Point Domain to Server

1. Login to Namecheap Dashboard
2. Go to "Domain List"
3. Click "Manage" on your domain
4. Go to "Advanced DNS" tab
5. Add these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | YOUR_SERVER_IP | Automatic |
| A Record | www | YOUR_SERVER_IP | Automatic |

**Note:** DNS changes take 5-30 minutes to propagate

#### Step 10: Install SSL Certificate (HTTPS)

```bash
# Install Certbot
apt-get install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow the prompts and enter your email

# Auto-renewal is setup automatically
```

---

### **Option B: Namecheap Shared Hosting + External Backend** 💡

If you only have Shared Hosting:

#### For Backend:
Use free hosting services:
1. **Railway.app** (FREE - Recommended)
2. **Render.com** (FREE tier)
3. **Fly.io** (FREE tier)
4. **Heroku** (Paid)

**Railway.app Deployment:**
1. Visit: https://railway.app
2. Sign up with GitHub
3. Create new project
4. Deploy from GitHub repo
5. Add MongoDB Atlas connection string in variables
6. Railway will give you a URL like: `https://platinum-network.up.railway.app`

#### For Frontend:
Deploy on Namecheap Shared Hosting:

1. Build frontend locally:
```bash
cd frontend
# Update .env with Railway backend URL
echo "REACT_APP_BACKEND_URL=https://platinum-network.up.railway.app" > .env
yarn build
```

2. Upload `frontend/build` folder contents to Namecheap:
   - Login to cPanel
   - Go to File Manager
   - Navigate to `public_html/`
   - Upload all files from `frontend/build/`
   - Delete any existing files in `public_html/` first

3. Create `.htaccess` file in `public_html/`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

4. Point domain:
   - In Namecheap, go to Domain > Manage
   - Advanced DNS > Add A Record
   - Point to your shared hosting IP

---

## 🗄️ MongoDB Atlas Setup (FREE Database)

**Detailed Steps:**

1. **Sign Up**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create Organization**
   - Organization Name: "Platinum Network"
   - Click "Next"

3. **Create Project**
   - Project Name: "Platinum Network Production"
   - Click "Next" > "Create Project"

4. **Create Database**
   - Click "Build a Database"
   - Select **"M0 FREE"** tier
   - Cloud Provider: AWS
   - Region: Choose closest to your server location (e.g., Mumbai for India)
   - Cluster Name: "PlatinumCluster"
   - Click "Create"

5. **Security Setup**
   
   **Database Access:**
   - Left sidebar > Database Access
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `platinum_admin`
   - Password: Click "Autogenerate Secure Password" (SAVE THIS!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

   **Network Access:**
   - Left sidebar > Network Access
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere"
   - (Or add your server's IP for better security)
   - Click "Confirm"

6. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" button
   - Select "Connect your application"
   - Driver: Python, Version: 3.12 or later
   - Copy the connection string:
   ```
   mongodb+srv://platinum_admin:<password>@platinumcluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `platinum_network`
   ```
   mongodb+srv://platinum_admin:YOUR_PASSWORD@platinumcluster.xxxxx.mongodb.net/platinum_network?retryWrites=true&w=majority
   ```

---

## 🔐 Security Checklist

Before going live:

- [ ] Change `JWT_SECRET_KEY` to a strong random string (30+ characters)
- [ ] Update `CORS_ORIGINS` to your actual domain
- [ ] Setup SSL certificate (HTTPS)
- [ ] Use strong MongoDB password
- [ ] Restrict MongoDB network access to server IP only (after testing)
- [ ] Setup firewall on VPS:
```bash
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```
- [ ] Regular backups setup
- [ ] Change default SSH port (optional)

---

## 🚀 Quick Start Commands

**Check if everything is running:**
```bash
# Check backend
pm2 status
pm2 logs platinum-backend

# Check Nginx
systemctl status nginx

# Check if site is accessible
curl http://localhost:8001/api/
curl http://yourdomain.com
```

**Restart services:**
```bash
# Restart backend
pm2 restart platinum-backend

# Restart Nginx
systemctl restart nginx
```

**View logs:**
```bash
# Backend logs
pm2 logs platinum-backend

# Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## 📊 Database Backup

**Backup MongoDB Atlas:**
```bash
# Install MongoDB tools
apt-get install -y mongodb-database-tools

# Backup
mongodump --uri="mongodb+srv://platinum_admin:PASSWORD@cluster.mongodb.net/platinum_network" --out=/backups/$(date +%Y%m%d)

# Setup daily backup cron
crontab -e
# Add this line:
0 2 * * * mongodump --uri="YOUR_URI" --out=/backups/$(date +\%Y\%m\%d)
```

---

## 🆘 Common Issues & Solutions

### 1. **Site not loading**
- Check DNS propagation: https://dnschecker.org
- Check Nginx: `systemctl status nginx`
- Check firewall: `ufw status`

### 2. **Backend not working**
- Check PM2: `pm2 logs platinum-backend`
- Check MongoDB connection string
- Check if port 8001 is open: `netstat -tulpn | grep 8001`

### 3. **"Cannot connect to backend" error**
- Verify REACT_APP_BACKEND_URL in frontend .env
- Check CORS settings in backend
- Check if backend is running: `curl http://localhost:8001/api/`

### 4. **Database connection failed**
- Verify MongoDB connection string
- Check network access in MongoDB Atlas
- Check database user credentials

---

## 📞 Support Resources

- **Namecheap Support:** https://www.namecheap.com/support/
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **PM2 Documentation:** https://pm2.keymetrics.io/docs/
- **Nginx Documentation:** https://nginx.org/en/docs/

---

## 🎉 Post-Deployment Testing

1. **Visit your domain**: https://yourdomain.com
2. **Test Registration**: Create new account
3. **Test Login**: Login with new account
4. **Test Mining**: Start mining session
5. **Test All Features**:
   - Daily check-in
   - Social tasks
   - Referrals
   - Wallet
   - Leaderboard
   - Profile

---

## 📈 Next Steps

After successful deployment:

1. **Create Admin Account**
   - Use credentials: admin@platinumnetwork.com / Admin@12345
   - Or create new admin from database

2. **Promote Your Platform**
   - Share your domain
   - Social media marketing
   - Add more social tasks

3. **Monitor Performance**
   - Check PM2 logs daily
   - Monitor MongoDB Atlas dashboard
   - Setup uptime monitoring (UptimeRobot - free)

4. **Regular Maintenance**
   - Daily backups
   - Weekly system updates
   - Monitor disk space

---

**🎊 Congratulations! Your Platinum Network is now LIVE! 🚀**

Need help? Let me know! 💪
