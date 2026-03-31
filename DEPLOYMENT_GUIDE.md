# Platinum Network - Deployment Guide

## 📋 Prerequisites
- Domain name
- Web hosting (with Node.js & Python support)
- MongoDB database

---

## 🗄️ Database Setup

### Option 1: MongoDB Atlas (Recommended - FREE)

1. **Create Account**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Select "FREE" tier (M0 Sandbox)
   - Choose region closest to your hosting location
   - Click "Create Cluster"

3. **Setup Database Access**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `platinum_admin`
   - Password: Generate a strong password (save this!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string, it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<username>` with `platinum_admin`
   - Replace `<password>` with your actual password

6. **Update .env File**
   ```env
   MONGO_URL="mongodb+srv://platinum_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/platinum_network?retryWrites=true&w=majority"
   DB_NAME="platinum_network"
   ```

---

### Option 2: Self-Hosted MongoDB (Advanced)

If your hosting supports MongoDB installation:

1. **Install MongoDB on Server**
   ```bash
   # For Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

2. **Create Database User**
   ```bash
   mongosh
   use platinum_network
   db.createUser({
     user: "platinum_admin",
     pwd: "YOUR_STRONG_PASSWORD",
     roles: [{ role: "readWrite", db: "platinum_network" }]
   })
   ```

3. **Update .env File**
   ```env
   MONGO_URL="mongodb://platinum_admin:YOUR_PASSWORD@localhost:27017/platinum_network"
   DB_NAME="platinum_network"
   ```

---

## 🚀 Deployment Steps

### 1. Export Current Code

```bash
# On your local machine
cd /app
zip -r platinum-network.zip backend frontend package.json README.md
```

### 2. Upload to Hosting

- Upload the zip file to your hosting
- Extract it in your web root directory

### 3. Update Environment Variables

**Backend (.env)**
```env
MONGO_URL="YOUR_MONGODB_CONNECTION_STRING"
DB_NAME="platinum_network"
CORS_ORIGINS="https://yourdomain.com,http://yourdomain.com"
JWT_SECRET_KEY="YOUR_RANDOM_SECRET_KEY_HERE_CHANGE_THIS"
```

**Frontend (.env)**
```env
REACT_APP_BACKEND_URL=https://yourdomain.com
```

### 4. Install Dependencies

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
yarn install
yarn build
```

### 5. Start Backend Server

```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 &
```

Or use PM2 (recommended):
```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start "uvicorn server:app --host 0.0.0.0 --port 8001" --name platinum-backend

# Start on system boot
pm2 startup
pm2 save
```

### 6. Setup Frontend

Two options:

**Option A: Serve Built Files (Recommended)**
```bash
cd frontend
yarn build

# Serve build folder through your web server (Nginx/Apache)
# Point your domain to frontend/build directory
```

**Option B: Run Development Server**
```bash
cd frontend
pm2 start "yarn start" --name platinum-frontend
```

### 7. Configure Web Server (Nginx Example)

```nginx
# /etc/nginx/sites-available/platinum-network

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /path/to/frontend/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/platinum-network /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Security Checklist

- [ ] Change JWT_SECRET_KEY to a strong random string
- [ ] Update CORS_ORIGINS to your actual domain
- [ ] Use HTTPS (SSL certificate - Let's Encrypt free)
- [ ] Restrict MongoDB network access to your server IP only
- [ ] Use strong database passwords
- [ ] Enable firewall on your server
- [ ] Regular backups of MongoDB database

---

## 📊 Database Backup

### Backup MongoDB Atlas
```bash
mongodump --uri="YOUR_MONGODB_CONNECTION_STRING" --out=/path/to/backup
```

### Restore MongoDB
```bash
mongorestore --uri="YOUR_MONGODB_CONNECTION_STRING" /path/to/backup
```

---

## 🆘 Troubleshooting

### Backend not connecting to database
- Check MongoDB connection string
- Verify database user credentials
- Check network access (IP whitelist)

### Frontend not loading
- Check if build was successful
- Verify REACT_APP_BACKEND_URL is correct
- Check browser console for errors

### API calls failing
- Verify CORS settings in backend
- Check if backend is running
- Verify API endpoints are accessible

---

## 📞 Support

For issues, check:
1. Backend logs: `pm2 logs platinum-backend`
2. Frontend logs: `pm2 logs platinum-frontend`
3. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
4. MongoDB logs: Check MongoDB Atlas dashboard or server logs

---

## 🎉 Post-Deployment

After successful deployment:
1. Test all features:
   - Registration
   - Login
   - Mining
   - Daily check-in
   - Social tasks
   - Referrals
   - Wallet
   - Leaderboard

2. Create admin account
3. Share your domain with users!

---

**Good Luck! 🚀**
